import type { Language, Orientation, Suit, TarotCardMetadata } from '../types/tarot';

interface TarotCardVisualProps {
  card: TarotCardMetadata;
  orientation: Orientation;
  language: Language;
  compact?: boolean;
}

const SUIT_COLORS: Record<Suit, { border: string; sigil: string; bg: string }> = {
  major: { border: '#D4AF37', sigil: '#F0C75E', bg: '#151828' },
  wands: { border: '#D48A5A', sigil: '#E8A568', bg: '#1B1413' },
  cups: { border: '#6BA7B8', sigil: '#8EC5D6', bg: '#111A21' },
  swords: { border: '#9BA8B8', sigil: '#C8D3E0', bg: '#14171F' },
  coins: { border: '#8FB078', sigil: '#B5D39E', bg: '#131A15' },
};

function SuitGlyph({ suit, color }: { suit: Suit; color: string }) {
  if (suit === 'wands') {
    return (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.6">
        <path d="M24 6v36M19 13l5-7 5 7M18 24c2-3 10-3 12 0M20 35h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (suit === 'cups') {
    return (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.6">
        <path d="M14 12h20l-2 11a8 8 0 0 1-16 0l-2-11ZM24 31v9M17 40h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (suit === 'swords') {
    return (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.6">
        <path d="M24 6v28M24 6l-4 7h8l-4-7ZM16 32h16M24 34v8M21 42h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (suit === 'coins') {
    return (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.6">
        <circle cx="24" cy="24" r="14" />
        <path d="M24 11l3.6 9.2h9.8l-7.9 5.8 3 9.4L24 29.7l-8.5 5.7 3-9.4-7.9-5.8h9.8L24 11Z" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="24" cy="24" r="15" strokeDasharray="3 3" />
      <path d="M24 7v34M7 24h34M13 13l22 22M35 13L13 35" strokeOpacity="0.65" />
      <circle cx="24" cy="24" r="4" fill={color} fillOpacity="0.25" />
    </svg>
  );
}

export function TarotCardVisual({
  card,
  orientation,
  language,
  compact = false,
}: TarotCardVisualProps) {
  const palette = SUIT_COLORS[card.suit];
  const isReversed = orientation === 'reversed';

  return (
    <div
      className={`relative rounded-xl border p-3 flex flex-col justify-between transition-transform duration-200 ${
        compact ? 'min-h-[154px]' : 'min-h-[210px]'
      }`}
      style={{
        backgroundColor: palette.bg,
        borderColor: `${palette.border}55`,
      }}
    >
      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
        <span style={{ color: palette.sigil }}>{card.romanNumeral}</span>
        <span className={isReversed ? 'text-[#E3908C]' : 'text-[#C9A86A]'}>
          {isReversed
            ? language === 'vi'
              ? 'NGƯỢC'
              : 'REVERSED'
            : language === 'vi'
              ? 'XUÔI'
              : 'UPRIGHT'}
        </span>
      </div>

      <div
        className={`my-2 flex flex-col items-center justify-center transition-transform duration-200 ${
          isReversed ? 'rotate-180' : ''
        }`}
      >
        <div
          className="rounded-full border p-3"
          style={{ borderColor: `${palette.border}40` }}
        >
          <SuitGlyph suit={card.suit} color={palette.sigil} />
        </div>
      </div>

      <div className="text-center border-t border-[#C9A86A]/15 pt-2">
        <p className="font-display text-sm font-semibold text-[#F4ECD8] leading-tight">
          {card.nameEn}
        </p>
        <p className="mt-0.5 text-[11px] text-[#B8B0A0] truncate">
          {card.nameVi}
        </p>
      </div>
    </div>
  );
}
