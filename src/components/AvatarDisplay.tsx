import { useState } from 'react';
import { Moon, Star, Sun } from 'lucide-react';
import { AVATAR_PRESETS } from '../utils/avatarUtils';

interface AvatarDisplayProps {
  avatarUrl?: string;
  displayName?: string;
  sizeClass?: string;
}

export function AvatarDisplay({
  avatarUrl,
  displayName = 'Seeker',
  sizeClass = 'w-10 h-10',
}: AvatarDisplayProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const preset = AVATAR_PRESETS.find((p) => p.id === avatarUrl);
  const isImageUrl =
    avatarUrl &&
    !preset &&
    (avatarUrl.startsWith('data:image/') || avatarUrl.startsWith('https://')) &&
    !imgFailed;

  if (isImageUrl) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden border border-[#C9A86A]/40 bg-[#131622] shrink-0`}
      >
        <img
          src={avatarUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const activePreset = preset || AVATAR_PRESETS[0];

  return (
    <div
      className={`${sizeClass} rounded-full border border-[#C9A86A]/45 flex items-center justify-center shrink-0`}
      style={{ backgroundColor: activePreset.bg, color: activePreset.accent }}
      aria-label={displayName}
    >
      {activePreset.id === 'preset:moon' ? (
        <Moon className="w-1/2 h-1/2 stroke-[1.6]" />
      ) : activePreset.id === 'preset:sun' ? (
        <Sun className="w-1/2 h-1/2 stroke-[1.6]" />
      ) : activePreset.id === 'preset:eclipse' ? (
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="7" />
          <path d="M12 5a7 7 0 0 0 0 14" fill="currentColor" fillOpacity="0.28" />
        </svg>
      ) : (
        <Star className="w-1/2 h-1/2 stroke-[1.6]" />
      )}
    </div>
  );
}
