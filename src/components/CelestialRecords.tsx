import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Disc3,
  ExternalLink,
  ListMusic,
  Pause,
  Play,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { getCopy } from '../i18n/translations';
import { addPlaylistTrack, removePlaylistTrack } from '../services/firestoreService';
import { extractYouTubeId } from '../utils/youtube';

export function CelestialRecords() {
  const { user, playlists, language } = useAuth();
  const {
    availablePlaylists,
    selectedPlaylist,
    currentTrack,
    isPlaying,
    embedError,
    selectPlaylist,
    playTrack,
    togglePlayPause,
  } = useMusic();

  const t = getCopy(language);

  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Space Ambient');
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const visibleTracks = useMemo(() => {
    if (selectedPlaylist === 'all') return playlists;
    return playlists.filter((trk) => trk.category === selectedPlaylist);
  }, [playlists, selectedPlaylist]);

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);

    const youtubeId = extractYouTubeId(urlInput);
    if (!youtubeId) {
      setErrorMsg(t.music.invalidYoutube);
      return;
    }

    const chosenCategory = categoryInput.trim() || 'Space Ambient';

    setAdding(true);
    try {
      const newId = await addPlaylistTrack(user.uid, {
        title: titleInput.trim() || `YouTube Track (${youtubeId})`,
        artist: artistInput.trim() || t.music.defaultArtist,
        youtubeId,
        category: chosenCategory,
      });

      const createdTrack = {
        id: newId,
        userId: user.uid,
        title: titleInput.trim() || `YouTube Track (${youtubeId})`,
        artist: artistInput.trim() || t.music.defaultArtist,
        youtubeId,
        category: chosenCategory,
        createdAt: null,
      };

      setUrlInput('');
      setTitleInput('');
      setArtistInput('');
      playTrack(createdTrack, selectedPlaylist === 'all' ? 'all' : chosenCategory);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save track.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!user) return;
    await removePlaylistTrack(user.uid, trackId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#C9A86A]">
            <Disc3 className="h-4 w-4 shrink-0" />
            <span>{t.brand} · {t.brandSubtitle}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#F4ECD8]">
            {t.music.playerTitle}
          </h1>
          <p className="mt-2 text-sm text-[#B8B0A0]">{t.music.recordsSubtitle}</p>
        </div>

        {currentTrack && (
          <div className="flex items-center gap-3 rounded-xl border border-[#C9A86A]/30 bg-[#0D1018] px-4 py-3 max-w-sm">
            <img
              src={`https://i.ytimg.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`}
              alt={currentTrack.title}
              className="h-12 w-20 rounded object-cover border border-[#C9A86A]/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {isPlaying ? t.music.nowPlaying : t.music.pausedLabel}
              </p>
              <p className="truncate text-xs font-semibold text-[#F4ECD8]">
                {currentTrack.title}
              </p>
              <p className="truncate text-[11px] text-[#8E8778]">
                {currentTrack.artist || t.music.defaultArtist}
              </p>
            </div>
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[#090A0F] hover:bg-[#E2C25B] shrink-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
          </div>
        )}
      </section>

      {/* Add YouTube Track Form */}
      <section className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
          {t.music.addTrack}
        </h2>

        <form onSubmit={handleAddTrack} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <input
              type="text"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t.music.urlPlaceholder}
              className="sm:col-span-4 rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
            />
            <input
              type="text"
              maxLength={140}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder={t.music.titlePlaceholder}
              className="sm:col-span-3 rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
            />
            <input
              type="text"
              maxLength={100}
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              placeholder={t.music.artistPlaceholder}
              className="sm:col-span-2 rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
            />
            <input
              type="text"
              maxLength={60}
              list="celestial-playlist-options"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder={t.music.categoryPlaceholder}
              className="sm:col-span-3 rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
            />
            <datalist id="celestial-playlist-options">
              <option value="Space Ambient" />
              <option value="Meditation" />
              <option value="Nocturne" />
              <option value="Lo-Fi" />
              {availablePlaylists.map((pl) => (
                <option key={pl} value={pl} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {errorMsg ? (
              <div className="flex items-center gap-2 text-xs text-[#F3B7B5]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            ) : (
              <span className="text-xs text-[#8E8778]">
                YouTube · youtu.be · youtube.com/shorts · music.youtube.com
              </span>
            )}

            <button
              type="submit"
              disabled={adding}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#090A0F] hover:bg-[#E2C25B] disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.music.saveTrack}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Playlist Selector + Track Grid */}
      <section className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
          <div className="flex items-center gap-2">
            <ListMusic className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
              {t.music.playlistsHeading} ({visibleTracks.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#C9A86A]/15 bg-[#0D1018] p-1">
            <button
              type="button"
              onClick={() => selectPlaylist('all')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedPlaylist === pl
                    ? 'bg-[#181C2A] text-[#D4AF37]'
                    : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
                }`}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>

        {visibleTracks.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8E8778]">{t.music.noTracks}</p>
        ) : (
          <div className="divide-y divide-[#C9A86A]/15 rounded-xl border border-[#C9A86A]/15 bg-[#0D1018]">
            {visibleTracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackErrored = embedError?.videoId === track.youtubeId && isCurrent;
              return (
                <div
                  key={track.id}
                  className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 px-4 py-3 transition-colors ${
                    isCurrent ? 'bg-[#181C2A]' : 'hover:bg-[#131622]/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isCurrent && isPlaying) {
                        togglePlayPause();
                      } else {
                        playTrack(track);
                      }
                    }}
                    className="flex flex-1 items-center gap-3.5 min-w-0 text-left cursor-pointer"
                  >
                    <div className="relative h-12 w-20 rounded-md overflow-hidden border border-[#C9A86A]/25 bg-[#090A0F] shrink-0">
                      <img
                        src={`https://i.ytimg.com/vi/${track.youtubeId}/mqdefault.jpg`}
                        alt={track.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        {isCurrent && isPlaying ? (
                          <Pause className="h-4 w-4 text-[#D4AF37]" />
                        ) : (
                          <Play className="h-4 w-4 text-[#F4ECD8]" />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${
                          isCurrent ? 'text-[#D4AF37]' : 'text-[#F4ECD8]'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="truncate text-xs text-[#9E9689]">
                        {track.artist || t.music.defaultArtist} · {track.category}
                      </p>
                      {isTrackErrored && (
                        <p className="mt-0.5 text-[11px] text-[#F3B7B5]">
                          {t.music.embedBlocked}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t.music.openOnYoutube}
                      aria-label={t.music.openOnYoutube}
                      className="rounded-md border border-[#C9A86A]/20 p-2 text-[#B8B0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(track.id)}
                      aria-label={t.common.delete}
                      className="rounded-md border border-[#C25450]/25 p-2 text-[#8E8778] hover:border-[#C25450]/60 hover:text-[#F3B7B5] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
