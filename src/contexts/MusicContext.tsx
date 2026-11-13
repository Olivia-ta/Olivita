import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { saveMusicPreferences } from '../services/firestoreService';
import type { MusicPreferences, PlaylistTrack, RepeatMode } from '../types/tarot';
import { useAuth } from './AuthContext';

export type PlayerStatus =
  | 'idle'
  | 'ready'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'ended'
  | 'error';

export interface MusicEmbedError {
  code: number;
  videoId: string;
}

interface YTPlayerInstance {
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
        onError?: (event: { data: number; target: YTPlayerInstance }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser window.'));
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') {
        try {
          prevReady();
        } catch {
          // Ignore prior handler errors
        }
      }
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
        reject(new Error('YouTube IFrame API loaded without YT.Player.'));
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => {
        ytApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame Player API.'));
      };
      document.head.appendChild(tag);
    }
  });

  return ytApiPromise;
}

interface MusicContextValue {
  availablePlaylists: string[];
  selectedPlaylist: string;
  activeQueue: PlaylistTrack[];
  currentTrack: PlaylistTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  playerStatus: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  expanded: boolean;
  embedError: MusicEmbedError | null;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  selectPlaylist: (playlistName: string) => void;
  playTrack: (track: PlaylistTrack, playlistName?: string) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  cycleRepeatMode: () => void;
  registerPlayerContainer: (el: HTMLDivElement | null) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const { user, isVerified, playlists } = useAuth();

  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('all');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [expanded, setExpanded] = useState(false);
  const [embedError, setEmbedError] = useState<MusicEmbedError | null>(null);
  const [prefsLoadedForUid, setPrefsLoadedForUid] = useState<string | null>(null);

  const hostContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const initializingPlayerRef = useRef(false);
  const playerReadyRef = useRef(false);
  const loadedVideoIdRef = useRef<string | null>(null);
  const userInteractedRef = useRef(false);
  const pendingPlayVideoIdRef = useRef<string | null>(null);
  const volumeSaveTimerRef = useRef<number | null>(null);

  const availablePlaylists = useMemo(() => {
    const names = Array.from(
      new Set(playlists.map((t) => t.category.trim()).filter(Boolean)),
    );
    return names;
  }, [playlists]);

  const effectivePlaylist = useMemo(() => {
    if (selectedPlaylist === 'all') return 'all';
    if (availablePlaylists.includes(selectedPlaylist)) return selectedPlaylist;
    return 'all';
  }, [selectedPlaylist, availablePlaylists]);

  const activeQueue = useMemo(() => {
    if (effectivePlaylist === 'all') return playlists;
    const filtered = playlists.filter((t) => t.category === effectivePlaylist);
    return filtered.length > 0 ? filtered : playlists;
  }, [playlists, effectivePlaylist]);

  const currentTrackIndex = useMemo(() => {
    if (activeQueue.length === 0) return -1;
    if (!selectedTrackId) return 0;
    const idx = activeQueue.findIndex((t) => t.id === selectedTrackId);
    return idx >= 0 ? idx : 0;
  }, [activeQueue, selectedTrackId]);

  const currentTrack =
    currentTrackIndex >= 0 ? activeQueue[currentTrackIndex] ?? null : null;

  const persistPrefs = useCallback(
    (overrides?: {
      lastTrackId?: string;
      lastPlaylist?: string;
      volume?: number;
      muted?: boolean;
      repeatMode?: RepeatMode;
    }) => {
      if (!user || !isVerified) return;
      const trackIdToSave =
        overrides?.lastTrackId ?? currentTrack?.id ?? selectedTrackId ?? '';
      const playlistToSave = overrides?.lastPlaylist ?? effectivePlaylist;
      const volumeToSave = overrides?.volume ?? volume;
      const mutedToSave = overrides?.muted ?? isMuted;
      const repeatToSave = overrides?.repeatMode ?? repeatMode;

      void saveMusicPreferences(user.uid, {
        lastTrackId: trackIdToSave,
        lastPlaylist: playlistToSave,
        volume: volumeToSave,
        muted: mutedToSave,
        repeatMode: repeatToSave,
      }).catch((err) => {
        console.error('Failed to persist music preferences:', err);
      });
    },
    [
      user,
      isVerified,
      currentTrack?.id,
      selectedTrackId,
      effectivePlaylist,
      volume,
      isMuted,
      repeatMode,
    ],
  );

  // Keep latest mutable refs for YT.Player event callbacks
  const latestRef = useRef({
    activeQueue,
    currentTrackIndex,
    currentTrack,
    repeatMode,
    volume,
    isMuted,
    persistPrefs,
  });
  latestRef.current = {
    activeQueue,
    currentTrackIndex,
    currentTrack,
    repeatMode,
    volume,
    isMuted,
    persistPrefs,
  };

  // Reset all private music state and stop player on logout or user switch
  useEffect(() => {
    if (!user || !isVerified) {
      if (volumeSaveTimerRef.current !== null) {
        window.clearTimeout(volumeSaveTimerRef.current);
        volumeSaveTimerRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo();
          playerRef.current.destroy();
        } catch {
          // Ignore teardown errors
        }
        playerRef.current = null;
      }
      if (hostContainerRef.current) {
        hostContainerRef.current.innerHTML = '';
      }
      initializingPlayerRef.current = false;
      playerReadyRef.current = false;
      loadedVideoIdRef.current = null;
      userInteractedRef.current = false;
      pendingPlayVideoIdRef.current = null;

      setSelectedPlaylist('all');
      setSelectedTrackId(null);
      setIsPlaying(false);
      setPlayerStatus('idle');
      setCurrentTime(0);
      setDuration(0);
      setVolumeState(70);
      setIsMuted(false);
      setRepeatMode('all');
      setExpanded(false);
      setEmbedError(null);
      setPrefsLoadedForUid(null);
      return;
    }

    const prefPath = `users/${user.uid}/preferences/music`;
    const prefRef = doc(db, 'users', user.uid, 'preferences', 'music');
    let isInitialLoad = true;

    const unsub = onSnapshot(
      prefRef,
      (snap) => {
        if (snap.exists()) {
          const prefs = snap.data() as MusicPreferences;
          if (isInitialLoad) {
            if (prefs.lastPlaylist) setSelectedPlaylist(prefs.lastPlaylist);
            if (prefs.lastTrackId) setSelectedTrackId(prefs.lastTrackId);
          }
          if (typeof prefs.volume === 'number') {
            setVolumeState(prefs.volume);
            if (playerReadyRef.current && playerRef.current) {
              try {
                playerRef.current.setVolume(prefs.volume);
              } catch {
                // Ignore if player busy
              }
            }
          }
          if (typeof prefs.muted === 'boolean') {
            setIsMuted(prefs.muted);
            if (playerReadyRef.current && playerRef.current) {
              try {
                if (prefs.muted) playerRef.current.mute();
                else playerRef.current.unMute();
              } catch {
                // Ignore
              }
            }
          }
          if (
            prefs.repeatMode === 'off' ||
            prefs.repeatMode === 'all' ||
            prefs.repeatMode === 'one'
          ) {
            setRepeatMode(prefs.repeatMode);
          }
        }
        isInitialLoad = false;
        setPrefsLoadedForUid(user.uid);
      },
      (err) => {
        // Handle missing/permission errors cleanly
        handleFirestoreError(err, OperationType.GET, prefPath);
      },
    );

    return () => {
      unsub();
    };
  }, [user?.uid, isVerified]);

  const playTrackByObj = useCallback(
    (track: PlaylistTrack, playlistOverride?: string) => {
      userInteractedRef.current = true;
      setEmbedError(null);
      setCurrentTime(0);
      setDuration(0);
      setSelectedTrackId(track.id);
      if (playlistOverride) {
        setSelectedPlaylist(playlistOverride);
      }
      setPlayerStatus('loading');
      setIsPlaying(true);

      const player = playerRef.current;
      if (player && playerReadyRef.current) {
        loadedVideoIdRef.current = track.youtubeId;
        pendingPlayVideoIdRef.current = null;
        try {
          player.loadVideoById(track.youtubeId);
        } catch {
          setIsPlaying(false);
          setPlayerStatus('error');
          setEmbedError({ code: 5, videoId: track.youtubeId });
        }
      } else {
        pendingPlayVideoIdRef.current = track.youtubeId;
      }

      persistPrefs({
        lastTrackId: track.id,
        lastPlaylist: playlistOverride ?? effectivePlaylist,
      });
    },
    [persistPrefs, effectivePlaylist],
  );

  // Initialize ONE persistent YT.Player inside hostContainerRef when authenticated & a valid videoId exists
  const ensurePlayerMounted = useCallback(() => {
    if (!user || !isVerified) return;
    const container = hostContainerRef.current;
    if (!container || playerRef.current || initializingPlayerRef.current) return;

    const initialVideoId =
      pendingPlayVideoIdRef.current || latestRef.current.currentTrack?.youtubeId || '';
    if (!/^[a-zA-Z0-9_-]{11}$/.test(initialVideoId)) {
      return;
    }

    initializingPlayerRef.current = true;

    void loadYouTubeIframeApi()
      .then((YT) => {
        const host = hostContainerRef.current;
        if (!host || playerRef.current) {
          initializingPlayerRef.current = false;
          return;
        }

        const videoIdToMount =
          pendingPlayVideoIdRef.current ||
          latestRef.current.currentTrack?.youtubeId ||
          initialVideoId;

        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoIdToMount)) {
          initializingPlayerRef.current = false;
          return;
        }

        const mountNode = document.createElement('div');
        host.innerHTML = '';
        host.appendChild(mountNode);

        const player = new YT.Player(mountNode, {
          width: '200',
          height: '112',
          videoId: videoIdToMount,
          playerVars: {
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              playerReadyRef.current = true;
              const target = event.target;
              const { volume: v, isMuted: m, currentTrack: trk } = latestRef.current;
              try {
                target.setVolume(v);
                if (m) target.mute();
                else target.unMute();
              } catch {
                // Ignore
              }

              if (pendingPlayVideoIdRef.current) {
                const vid = pendingPlayVideoIdRef.current;
                pendingPlayVideoIdRef.current = null;
                loadedVideoIdRef.current = vid;
                target.loadVideoById(vid);
              } else if (trk) {
                loadedVideoIdRef.current = trk.youtubeId;
                if (trk.youtubeId !== videoIdToMount) {
                  target.cueVideoById(trk.youtubeId);
                }
                setPlayerStatus('ready');
              }
            },
            onStateChange: (event) => {
              const state = event.data;
              const PS = YT.PlayerState;
              const target = event.target;

              if (state === PS.PLAYING) {
                setEmbedError(null);
                setIsPlaying(true);
                setPlayerStatus('playing');
                try {
                  const d = target.getDuration();
                  if (Number.isFinite(d) && d > 0) setDuration(d);
                } catch {
                  // Ignore
                }
              } else if (state === PS.PAUSED) {
                setIsPlaying(false);
                setPlayerStatus('paused');
              } else if (state === PS.BUFFERING) {
                setPlayerStatus('buffering');
              } else if (state === PS.CUED) {
                setIsPlaying(false);
                setPlayerStatus('ready');
                try {
                  const d = target.getDuration();
                  if (Number.isFinite(d) && d > 0) setDuration(d);
                } catch {
                  // Ignore
                }
              } else if (state === PS.ENDED) {
                const {
                  activeQueue: queue,
                  currentTrackIndex: idx,
                  repeatMode: rep,
                  currentTrack: trk,
                } = latestRef.current;

                if (rep === 'one' && trk) {
                  try {
                    target.seekTo(0, true);
                    target.playVideo();
                  } catch {
                    setIsPlaying(false);
                    setPlayerStatus('ended');
                  }
                  return;
                }

                if (queue.length > 0 && idx + 1 < queue.length) {
                  playTrackByObj(queue[idx + 1]);
                  return;
                }

                if (rep === 'all' && queue.length > 0) {
                  playTrackByObj(queue[0]);
                  return;
                }

                setIsPlaying(false);
                setPlayerStatus('ended');
              }
            },
            onError: (event) => {
              const vid =
                pendingPlayVideoIdRef.current ||
                loadedVideoIdRef.current ||
                latestRef.current.currentTrack?.youtubeId ||
                '';
              pendingPlayVideoIdRef.current = null;
              setIsPlaying(false);
              setPlayerStatus('error');
              setEmbedError({ code: event.data, videoId: vid });
            },
          },
        });

        playerRef.current = player;
        initializingPlayerRef.current = false;
      })
      .catch((err) => {
        initializingPlayerRef.current = false;
        console.error('YouTube player API initialization failed:', err);
      });
  }, [user, isVerified, playTrackByObj]);

  const registerPlayerContainer = useCallback(
    (el: HTMLDivElement | null) => {
      hostContainerRef.current = el;
      if (el) {
        ensurePlayerMounted();
      }
    },
    [ensurePlayerMounted],
  );

  // Cue restored track once preferences and playlists are ready (without forced autoplay)
  useEffect(() => {
    if (!user || !isVerified || prefsLoadedForUid !== user.uid) return;
    if (!currentTrack) return;

    ensurePlayerMounted();

    if (
      playerRef.current &&
      playerReadyRef.current &&
      !userInteractedRef.current &&
      loadedVideoIdRef.current !== currentTrack.youtubeId
    ) {
      loadedVideoIdRef.current = currentTrack.youtubeId;
      try {
        playerRef.current.cueVideoById(currentTrack.youtubeId);
        setPlayerStatus('ready');
      } catch {
        // Ignore
      }
    }
  }, [user?.uid, isVerified, prefsLoadedForUid, currentTrack?.id, currentTrack?.youtubeId, ensurePlayerMounted]);

  // Stop playback if active track is deleted and queue becomes empty
  useEffect(() => {
    if (!user || !isVerified || prefsLoadedForUid !== user.uid) return;
    if (!currentTrack && isPlaying) {
      try {
        playerRef.current?.stopVideo();
      } catch {
        // Ignore
      }
      loadedVideoIdRef.current = null;
      setIsPlaying(false);
      setPlayerStatus('idle');
      setCurrentTime(0);
      setDuration(0);
    }
  }, [user?.uid, isVerified, prefsLoadedForUid, currentTrack, isPlaying]);

  // Poll current playback time & duration during active session
  useEffect(() => {
    if (!isPlaying && playerStatus !== 'buffering') return;

    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || !playerReadyRef.current) return;
      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        if (Number.isFinite(cur) && cur >= 0) setCurrentTime(cur);
        if (Number.isFinite(dur) && dur > 0) setDuration(dur);
      } catch {
        // Ignore transient reads
      }
    }, 500);

    return () => window.clearInterval(id);
  }, [isPlaying, playerStatus]);

  const selectPlaylist = useCallback(
    (playlistName: string) => {
      setSelectedPlaylist(playlistName);
      persistPrefs({ lastPlaylist: playlistName });
    },
    [persistPrefs],
  );

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;
    userInteractedRef.current = true;
    const player = playerRef.current;

    if (!player || !playerReadyRef.current) {
      pendingPlayVideoIdRef.current = currentTrack.youtubeId;
      setPlayerStatus('loading');
      setIsPlaying(true);
      ensurePlayerMounted();
      return;
    }

    if (isPlaying) {
      try {
        player.pauseVideo();
      } catch {
        // Ignore
      }
      setIsPlaying(false);
      setPlayerStatus('paused');
      return;
    }

    setEmbedError(null);
    if (loadedVideoIdRef.current !== currentTrack.youtubeId) {
      loadedVideoIdRef.current = currentTrack.youtubeId;
      setPlayerStatus('loading');
      setIsPlaying(true);
      player.loadVideoById(currentTrack.youtubeId);
    } else {
      setPlayerStatus('loading');
      setIsPlaying(true);
      player.playVideo();
    }
  }, [currentTrack, isPlaying, ensurePlayerMounted]);

  const playNext = useCallback(() => {
    if (activeQueue.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % activeQueue.length;
    playTrackByObj(activeQueue[nextIdx]);
  }, [activeQueue, currentTrackIndex, playTrackByObj]);

  const playPrevious = useCallback(() => {
    if (activeQueue.length === 0) return;
    if (currentTime > 3 && playerRef.current && playerReadyRef.current) {
      try {
        playerRef.current.seekTo(0, true);
        setCurrentTime(0);
        return;
      } catch {
        // Fallback to previous track
      }
    }
    const prevIdx = (currentTrackIndex - 1 + activeQueue.length) % activeQueue.length;
    playTrackByObj(activeQueue[prevIdx]);
  }, [activeQueue, currentTrackIndex, currentTime, playTrackByObj]);

  const seekTo = useCallback((seconds: number) => {
    const clamped = Math.max(0, seconds);
    setCurrentTime(clamped);
    if (playerRef.current && playerReadyRef.current) {
      try {
        playerRef.current.seekTo(clamped, true);
      } catch {
        // Ignore
      }
    }
  }, []);

  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(nextVolume)));
      setVolumeState(clamped);
      const nextMuted = clamped === 0;
      setIsMuted(nextMuted);

      if (playerRef.current && playerReadyRef.current) {
        try {
          playerRef.current.setVolume(clamped);
          if (nextMuted) playerRef.current.mute();
          else playerRef.current.unMute();
        } catch {
          // Ignore
        }
      }

      if (volumeSaveTimerRef.current !== null) {
        window.clearTimeout(volumeSaveTimerRef.current);
      }
      volumeSaveTimerRef.current = window.setTimeout(() => {
        persistPrefs({ volume: clamped, muted: nextMuted });
      }, 450);
    },
    [persistPrefs],
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (playerRef.current && playerReadyRef.current) {
      try {
        if (nextMuted) playerRef.current.mute();
        else {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume > 0 ? volume : 70);
        }
      } catch {
        // Ignore
      }
    }
    persistPrefs({ muted: nextMuted });
  }, [isMuted, volume, persistPrefs]);

  const cycleRepeatMode = useCallback(() => {
    const next: RepeatMode =
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    setRepeatMode(next);
    persistPrefs({ repeatMode: next });
  }, [repeatMode, persistPrefs]);

  const value = useMemo<MusicContextValue>(
    () => ({
      availablePlaylists,
      selectedPlaylist: effectivePlaylist,
      activeQueue,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      playerStatus,
      currentTime,
      duration,
      volume,
      isMuted,
      repeatMode,
      expanded,
      embedError,
      setExpanded,
      selectPlaylist,
      playTrack: playTrackByObj,
      togglePlayPause,
      playNext,
      playPrevious,
      seekTo,
      setVolume,
      toggleMute,
      cycleRepeatMode,
      registerPlayerContainer,
    }),
    [
      availablePlaylists,
      effectivePlaylist,
      activeQueue,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      playerStatus,
      currentTime,
      duration,
      volume,
      isMuted,
      repeatMode,
      expanded,
      embedError,
      selectPlaylist,
      playTrackByObj,
      togglePlayPause,
      playNext,
      playPrevious,
      seekTo,
      setVolume,
      toggleMute,
      cycleRepeatMode,
      registerPlayerContainer,
    ],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used inside MusicProvider');
  }
  return ctx;
}
