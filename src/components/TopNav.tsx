import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCopy } from '../i18n/translations';
import { AvatarDisplay } from './AvatarDisplay';

export type NavTab = 'sanctuary' | 'readings' | 'archive' | 'records' | 'checkin' | 'profile';

interface TopNavProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export function TopNav({ activeTab, onNavigate }: TopNavProps) {
  const { profile, language } = useAuth();
  const t = getCopy(language);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'sanctuary', label: t.nav.sanctuary },
    { id: 'readings', label: t.nav.readings },
    { id: 'archive', label: t.nav.archive },
    { id: 'records', label: t.nav.records },
    { id: 'checkin', label: t.nav.checkin },
    { id: 'profile', label: t.nav.profile },
  ];

  const handleNav = (id: NavTab) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#C9A86A]/20 bg-[#090A0F]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark + English subtitle */}
        <button
          type="button"
          onClick={() => handleNav('sanctuary')}
          className="text-left group whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="block font-display text-base sm:text-xl font-semibold tracking-[0.12em] text-[#F4ECD8] group-hover:text-[#D4AF37] transition-colors leading-tight">
            {t.brand}
          </span>
          <span className="block text-[9px] sm:text-[10px] font-medium tracking-[0.22em] text-[#C9A86A] uppercase mt-0.5 leading-none">
            {t.brandSubtitle}
          </span>
        </button>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-[#D4AF37]'
                    : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-[#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action showing live Star Dust balance & Seeker profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('checkin')}
            className="flex items-center gap-2 sm:gap-2.5 rounded-lg border border-[#C9A86A]/35 bg-[#131622] px-2.5 sm:px-3.5 py-2 text-xs font-medium text-[#F4ECD8] hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="font-mono tabular-nums font-semibold text-[#D4AF37]">
              {(profile?.starDustBalance ?? 0).toLocaleString()} {t.common.sdShort}
            </span>
            <AvatarDisplay
              avatarUrl={profile?.avatarUrl}
              displayName={profile?.displayName}
              sizeClass="w-5 h-5"
            />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg border border-[#C9A86A]/25 p-2 text-[#ECE6D8] hover:border-[#D4AF37] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-[#C9A86A]/15 bg-[#0D1018] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#181C2A] text-[#D4AF37]'
                    : 'text-[#C8C0B0] hover:bg-[#131622]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
