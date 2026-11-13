import { ArrowRight, BookOpen, CalendarCheck2, Globe, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { READING_AREAS } from '../data/tarotDeck';
import { getCopy } from '../i18n/translations';
import { getUtcDateString, updateUserProfile } from '../services/firestoreService';
import type { ReadingAreaId } from '../types/tarot';
import type { NavTab } from './TopNav';

interface SanctuaryHomeProps {
  onSelectAreaAndGo: (areaId: ReadingAreaId) => void;
  onNavigate: (tab: NavTab) => void;
  onInspectReading: (readingId: string) => void;
}

export function SanctuaryHome({
  onSelectAreaAndGo,
  onNavigate,
  onInspectReading,
}: SanctuaryHomeProps) {
  const { profile, readings, language, setUiLanguage, user } = useAuth();
  const t = getCopy(language);

  const todayUtc = getUtcDateString();
  const checkedInToday = profile?.lastCheckInDate === todayUtc;

  const toggleLanguage = async () => {
    const next = language === 'vi' ? 'en' : 'vi';
    setUiLanguage(next);
    if (user && profile) {
      await updateUserProfile(user.uid, {
        displayName: profile.displayName,
        mysticTitle: profile.mysticTitle,
        avatarUrl: profile.avatarUrl,
        language: next,
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Sanctuary Hero Header */}
      <section className="rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[#C9A86A]">
              {t.brandSubtitle}
            </p>
            <h1 className="mt-1.5 font-display text-3xl sm:text-5xl font-semibold tracking-[0.06em] text-[#F4ECD8]">
              {t.brand}
            </h1>
            <p className="mt-3 text-base text-[#ECE6D8]">
              {t.sanctuary.welcomeBack} <span className="font-medium text-[#F4ECD8]">{profile?.displayName}</span>
            </p>
            <p className="mt-1 text-sm text-[#B8B0A0]">
              {profile?.mysticTitle} ·{' '}
              <span className="font-mono tabular-nums text-[#D4AF37]">
                {(profile?.starDustBalance ?? 0).toLocaleString()} {t.common.starDust}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-lg border border-[#C9A86A]/30 bg-[#0D1018] px-3.5 py-2 text-xs font-medium text-[#ECE6D8] hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{language === 'vi' ? 'Tiếng Việt · Switch EN' : 'English · Chuyển VI'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('checkin')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                checkedInToday
                  ? 'border border-[#4B8F78]/40 bg-[#4B8F78]/15 text-[#A8DFCA]'
                  : 'bg-[#D4AF37] text-[#090A0F] hover:bg-[#E2C25B]'
              }`}
            >
              <CalendarCheck2 className="h-3.5 w-3.5" />
              <span>
                {checkedInToday ? t.sanctuary.dailyClaimed : t.sanctuary.dailyAvailable}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Three Tarot Reading Areas */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4ECD8]">
              {t.sanctuary.areasHeading}
            </h2>
            <p className="mt-1 text-sm text-[#B8B0A0] max-w-2xl">
              {t.sanctuary.areasDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {READING_AREAS.map((area) => {
            const canAfford = (profile?.starDustBalance ?? 0) >= area.cost;
            return (
              <div
                key={area.id}
                className="flex flex-col justify-between rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 hover:border-[#D4AF37]/50 transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 text-xs text-[#C9A86A]">
                    <span>
                      {area.cardCount}{' '}
                      {language === 'vi' ? 'lá bài' : area.cardCount === 1 ? 'card' : 'cards'}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-[#D4AF37]">
                      {area.cost} {t.common.sdShort}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold text-[#F4ECD8]">
                    {language === 'vi' ? area.nameVi : area.nameEn}
                  </h3>
                  <p className="mt-1 text-xs text-[#C9A86A]">
                    {language === 'vi' ? area.subtitleVi : area.subtitleEn}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#B8B0A0]">
                    {language === 'vi' ? area.descriptionVi : area.descriptionEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C9A86A]/15 flex items-center justify-between">
                  <span className={`text-xs ${canAfford ? 'text-[#A8DFCA]' : 'text-[#E3908C]'}`}>
                    {canAfford
                      ? language === 'vi'
                        ? 'Đủ Bụi Sao'
                        : 'Available'
                      : language === 'vi'
                        ? 'Thiếu Bụi Sao'
                        : 'Low Star Dust'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectAreaAndGo(area.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#181C2A] border border-[#C9A86A]/35 px-3.5 py-2 text-xs font-semibold text-[#F4ECD8] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>{t.sanctuary.startReading}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Split: Recent Readings + Guidebook Knowledge Reference */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
              <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
                {t.sanctuary.recentHeading}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('archive')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#D4AF37] hover:underline cursor-pointer"
              >
                <span>{t.sanctuary.viewArchive}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {readings.length === 0 ? (
              <p className="py-8 text-sm text-[#9E9689]">{t.sanctuary.emptyReadings}</p>
            ) : (
              <div className="divide-y divide-[#C9A86A]/15">
                {readings.slice(0, 4).map((rd) => (
                  <button
                    key={rd.id}
                    type="button"
                    onClick={() => onInspectReading(rd.id)}
                    className="w-full py-3.5 text-left hover:bg-[#181C2A]/60 px-2 rounded-md transition-colors cursor-pointer"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-medium text-[#F4ECD8] truncate">
                        {rd.question}
                      </p>
                      <span className="font-mono tabular-nums text-xs text-[#D4AF37] shrink-0">
                        -{rd.cost} {t.common.sdShort}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#9E9689]">
                      {rd.areaName} ·{' '}
                      {rd.cards.map((c) => c.cardNameEn).join(' · ')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-[#C9A86A]/20 bg-[#F4ECD8] text-[#1F1B16] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#785A28]">
              <BookOpen className="h-4 w-4" />
              <span>Mystical Manga Tarot · 78 Cards</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-[#1F1B16]">
              {t.sanctuary.guidebookTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4A4236]">
              {t.sanctuary.guidebookDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1F1B16]/15 flex items-center justify-between">
            <span className="font-mono text-xs text-[#785A28]">Rann &amp; Barbara Moore</span>
            <a
              href="/assets/aistudio/Tarot_Mystical_ac676fd1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F1B16] px-3.5 py-2 text-xs font-semibold text-[#F4ECD8] hover:bg-[#332C24] transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t.sanctuary.openPdf}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
