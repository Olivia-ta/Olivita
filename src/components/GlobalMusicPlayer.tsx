import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Disc3,
  ExternalLink,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { getCopy } from '../i18n/translations';

interface GlobalMusicPlayerProps {
  onOpenRecords: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function GlobalMusicPlayer({ onOpenRecords }: GlobalMusicPlayerProps) {
  const { language } = useAuth();
  const {
    availablePlaylists,
    selectedPlaylist,
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
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    cycleRepeatMode,
    registerPlayerContainer,
  } = useMusic();

  const t = getCopy(language);
  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const thumbnailUrl = currentTrack
    ? `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
    : null;
  const miniThumbUrl = currentTrack
    ? `https://i.ytimg.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`
    : null;

  const repeatLabel =
    repeatMode === 'one'
      ? t.music.repeatOne
      : repeatMode === 'all'
        ? t.music.repeatAll
        : t.music.repeatOff;

  const statusText = embedError
    ? t.music.embedBlocked
    : playerStatus === 'playing'
      ? t.music.nowPlaying
      : playerStatus === 'buffering' || playerStatus === 'loading'
        ? t.music.bufferingLabel
        : playerStatus === 'paused'
          ? t.music.pausedLabel
          : t.music.readyLabel;

  const activeArtist = currentTrack?.artist?.trim() || t.music.defaultArtist;

  return (
    <>
      {/* Single persistent YouTube IFrame Player API host (never unmounted across tabs or collapse/expand) */}
      <div
        ref={registerPlayerContainer}
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-[200px] h-[112px] opacity-0 pointer-events-none -z-10 overflow-hidden"
      />

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#C9A86A]/25 bg-[#090A0F]/95 backdrop-blur-md">
        {/* Thin global playback progress hairline at top edge of mini-player */}
        <div className="h-[2px] w-full bg-[#181C2A]">
          <div
            className="h-full bg-[#D4AF37] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Expanded Vinyl & Queue View (shares the single YT.Player instance) */}
        {expanded && (
          <div className="mx-auto max-w-7xl border-b border-[#C9A86A]/15 px-4 py-6 sm:px-6 lg:px-8 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
              {/* Left: Rotating Vinyl Artwork + Main Transport */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5 rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6">
                {/* Rotating Vinyl Record Disc */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-full border-2 border-[#C9A86A]/45 bg-[#090A0F] p-4 shadow-lg flex items-center justify-center animate-[spin_12s_linear_infinite]"
                    style={{
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      backgroundImage:
                        'repeating-radial-gradient(circle at center, #090A0F 0px, #090A0F 5px, #151927 6px, #090A0F 7px)',
                    }}
                  >
                    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-[#D4AF37]/75 bg-[#181C2A] flex items-center justify-center">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={currentTrack?.title || 'Album Artwork'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Disc3 className="h-12 w-12 text-[#D4AF37]/70" />
                      )}
                    </div>
                    <div className="absolute h-4 w-4 rounded-full border border-[#D4AF37] bg-[#090A0F]" />
                  </div>
                </div>

                {/* Track Title, Artist, Playlist Info */}
                <div className="w-full space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#C9A86A]">
                    {selectedPlaylist === 'all' ? t.music.allPlaylists : selectedPlaylist}
                    {activeQueue.length > 0 && currentTrackIndex >= 0
                      ? ` · ${t.music.trackOf} ${currentTrackIndex + 1}/${activeQueue.length}`
                      : ''}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#F4ECD8] leading-snug line-clamp-2">
                    {currentTrack ? currentTrack.title : t.music.playerTitle}
                  </h3>
                  <p className="text-xs text-[#B8B0A0]">
                    {currentTrack ? activeArtist : t.music.noTracks}
                  </p>
                </div>

                {/* Embed Error State */}
                {embedError && (
                  <div className="w-full rounded-lg border border-[#C25450]/45 bg-[#C25450]/10 p-3 text-left space-y-2">
                    <div className="flex items-start gap-2 text-xs text-[#F3B7B5]">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{t.music.embedBlocked}</span>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${embedError.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#C9A86A]/40 bg-[#181C2A] px-3 py-1.5 text-xs font-medium text-[#D4AF37] hover:border-[#D4AF37]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{t.music.openOnYoutube}</span>
                    </a>
                  </div>
                )}

                {/* Playback Progress & Seek Bar */}
                <div className="w-full space-y-1.5">
                  <input
                    type="range"
                    min={0}
                    max={duration > 0 ? Math.floor(duration) : 100}
                    value={duration > 0 ? Math.min(Math.floor(currentTime), Math.floor(duration)) : 0}
                    disabled={duration <= 0}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    aria-label="Seek playback"
                    className="w-full accent-[#D4AF37] cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#9E9689]">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#C9A86A]">{statusText}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Transport & Repeat Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={cycleRepeatMode}
                    title={repeatLabel}
                    aria-label={repeatLabel}
                    className={`rounded-lg border px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                      repeatMode !== 'off'
                        ? 'border-[#D4AF37] bg-[#181C2A] text-[#D4AF37]'
                        : 'border-[#C9A86A]/25 bg-[#0D1018] text-[#8E8778] hover:text-[#ECE6D8]'
                    }`}
                  >
                    {repeatMode === 'one' ? (
                      <Repeat1 className="h-4 w-4" />
                    ) : (
                      <Repeat className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={playPrevious}
                    disabled={activeQueue.length === 0}
                    className="rounded-lg border border-[#C9A86A]/25 bg-[#0D1018] p-2.5 text-[#ECE6D8] hover:border-[#D4AF37] disabled:opacity-40 cursor-pointer"
                    aria-label="Previous Track"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayPause}
                    disabled={!currentTrack}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-[#090A0F] hover:bg-[#E2C25B] disabled:opacity-40 cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={playNext}
                    disabled={activeQueue.length === 0}
                    className="rounded-lg border border-[#C9A86A]/25 bg-[#0D1018] p-2.5 text-[#ECE6D8] hover:border-[#D4AF37] disabled:opacity-40 cursor-pointer"
                    aria-label="Next Track"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  {currentTrack && (
                    <a
                      href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t.music.openOnYoutube}
                      aria-label={t.music.openOnYoutube}
                      className="rounded-lg border border-[#C9A86A]/25 bg-[#0D1018] p-2.5 text-[#C8C0B0] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Volume Slider & Mute */}
                <div className="flex w-full max-w-xs items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? t.music.unmuteLabel : t.music.muteLabel}
                    className="text-[#C9A86A] hover:text-[#D4AF37] cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    aria-label={t.music.volumeLabel}
                    className="flex-1 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="w-8 text-right font-mono tabular-nums text-[11px] text-[#9E9689]">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>
              </div>

              {/* Right: Playlist Filter & Track Queue */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A86A]">
                    <ListMusic className="h-4 w-4" />
                    <span>
                      {t.music.savedTracks} ({activeQueue.length})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(false);
                      onOpenRecords();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A86A]/35 bg-[#131622] px-3 py-1.5 text-xs font-medium text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer whitespace-nowrap"
                  >
                    <Disc3 className="h-3.5 w-3.5" />
                    <span>{t.music.openRecords}</span>
                  </button>
                </div>

                {/* Playlist Selector */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#C9A86A]/15 bg-[#131622] p-1.5">
                  <button
                    type="button"
                    onClick={() => selectPlaylist('all')}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      selectedPlaylist === 'all'
                        ? 'bg-[#181C2A] text-[#D4AF37]'
                        : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
                    }`}
                  >
                    {t.music.allPlaylists}
                  </button>
                  {availablePlaylists.map((pl) => (
                    <button
                      key={pl}
                      type="button"
                      onClick={() => selectPlaylist(pl)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        selectedPlaylist === pl
                          ? 'bg-[#181C2A] text-[#D4AF37]'
                          : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
                      }`}
                    >
                      {pl}
                    </button>
                  ))}
                </div>

                {/* Track List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-[#C9A86A]/10 rounded-xl border border-[#C9A86A]/15 bg-[#131622]">
                  {activeQueue.length === 0 ? (
                    <p className="p-4 text-xs text-[#8E8778]">{t.music.noTracks}</p>
                  ) : (
                    activeQueue.map((track) => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => playTrack(track)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                            isCurrent ? 'bg-[#181C2A]' : 'hover:bg-[#181C2A]/50'
                          }`}
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${track.youtubeId}/mqdefault.jpg`}
                            alt={track.title}
                            className="h-10 w-16 rounded object-cover border border-[#C9A86A]/20 shrink-0 bg-[#090A0F]"
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-xs font-medium ${
                                isCurrent ? 'text-[#D4AF37]' : 'text-[#F4ECD8]'
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="truncate text-[11px] text-[#8E8778]">
                              {track.artist || t.music.defaultArtist} · {track.category}
                            </p>
                          </div>
                          {isCurrent && isPlaying ? (
                            <Pause className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                          ) : (
                            <Play className="h-3.5 w-3.5 text-[#8E8778] shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Persistent Mini-Player Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:px-8">
          {/* Left: Artwork + Title + Artist */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? t.music.collapsePlayer : t.music.expandPlayer}
              className="relative h-10 w-10 sm:h-11 sm:w-14 rounded-md overflow-hidden border border-[#C9A86A]/35 bg-[#131622] shrink-0 cursor-pointer flex items-center justify-center"
            >
              {miniThumbUrl ? (
                <img
                  src={miniThumbUrl}
                  alt={currentTrack?.title || 'Track'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Disc3 className="h-5 w-5 text-[#D4AF37]" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <p className="truncate text-xs font-semibold text-[#F4ECD8]">
                  {currentTrack ? currentTrack.title : t.music.playerTitle}
                </p>
                {embedError && (
                  <a
                    href={`https://www.youtube.com/watch?v=${embedError.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded border border-[#C25450]/50 bg-[#C25450]/15 px-1.5 py-0.5 text-[10px] text-[#F3B7B5] hover:text-white shrink-0"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />
                    <span>{t.music.openOnYoutube}</span>
                  </a>
                )}
              </div>
              <p className="truncate text-[11px] text-[#9E9689]">
                {currentTrack
                  ? `${activeArtist} · ${
                      duration > 0
                        ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                        : statusText
                    }`
                  : t.music.noTracks}
              </p>
            </div>
          </div>

          {/* Center/Right: Transport + Volume + Records + Expand */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={playPrevious}
              disabled={activeQueue.length === 0}
              className="rounded-md p-1.5 text-[#C8C0B0] hover:text-[#F4ECD8] disabled:opacity-40 cursor-pointer"
              aria-label="Previous Track"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={!currentTrack}
              onClick={togglePlayPause}
              className="inline-flex items-center justify-center rounded-lg border border-[#C9A86A]/45 bg-[#131622] px-2.5 py-1.5 text-xs font-medium text-[#D4AF37] hover:border-[#D4AF37] disabled:opacity-40 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={playNext}
              disabled={activeQueue.length === 0}
              className="rounded-md p-1.5 text-[#C8C0B0] hover:text-[#F4ECD8] disabled:opacity-40 cursor-pointer"
              aria-label="Next Track"
            >
              <SkipForward className="h-4 w-4" />
            </button>

            {/* Desktop Compact Volume */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-[#C9A86A]/20">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? t.music.unmuteLabel : t.music.muteLabel}
                className="p-1 text-[#C8C0B0] hover:text-[#D4AF37] cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label={t.music.volumeLabel}
                className="w-16 accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={onOpenRecords}
              aria-label={t.music.openRecords}
              title={t.music.openRecords}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#C9A86A]/25 bg-[#131622] px-2.5 py-1.5 text-xs text-[#C8C0B0] hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer whitespace-nowrap"
            >
              <Disc3 className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{t.nav.records}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? t.music.collapsePlayer : t.music.expandPlayer}
              className="inline-flex items-center gap-1 rounded-lg border border-[#C9A86A]/30 bg-[#131622] px-2.5 py-1.5 text-xs text-[#ECE6D8] hover:border-[#D4AF37] cursor-pointer"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
