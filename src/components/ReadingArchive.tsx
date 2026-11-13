import { useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TAROT_CARD_BY_ID } from '../data/tarotDeck';
import { getCopy } from '../i18n/translations';
import { deleteTarotReading } from '../services/firestoreService';
import type { ReadingAreaId } from '../types/tarot';
import { TarotCardVisual } from './TarotCardVisual';

interface ReadingArchiveProps {
  initialSelectedId?: string | null;
}

export function ReadingArchive({ initialSelectedId = null }: ReadingArchiveProps) {
  const { user, readings, language } = useAuth();
  const t = getCopy(language);

  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [areaFilter, setAreaFilter] = useState<'all' | ReadingAreaId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReadings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return readings.filter((r) => {
      if (areaFilter !== 'all' && r.areaId !== areaFilter) return false;
      if (!q) return true;
      return (
        r.question.toLowerCase().includes(q) ||
        r.cards.some(
          (c) =>
            c.cardNameEn.toLowerCase().includes(q) ||
            c.cardNameVi.toLowerCase().includes(q),
        )
      );
    });
  }, [readings, areaFilter, searchTerm]);

  const activeReading = useMemo(
    () =>
      filteredReadings.find((r) => r.id === selectedId) ||
      filteredReadings[0] ||
      null,
    [filteredReadings, selectedId],
  );

  const handleDelete = async (readingId: string) => {
    if (!user) return;
    setDeletingId(readingId);
    try {
      await deleteTarotReading(user.uid, readingId);
      if (selectedId === readingId) setSelectedId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#C9A86A]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4ECD8]">
            {t.archive.title}
          </h1>
          <p className="mt-1 text-sm text-[#B8B0A0]">{t.archive.subtitle}</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8778]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.archive.searchPlaceholder}
            className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#131622] pl-9 pr-3 py-2 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 bg-[#131622] p-1.5 rounded-lg border border-[#C9A86A]/15 w-fit">
        {(
          [
            { id: 'all', label: t.common.all },
            { id: 'single_spark', label: '1-Card · 100 SD' },
            { id: 'triad_alignment', label: '3-Card · 300 SD' },
            { id: 'astral_grimoire', label: '5-Card · 500 SD' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setAreaFilter(tab.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              areaFilter === tab.id
                ? 'bg-[#181C2A] text-[#D4AF37]'
                : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredReadings.length === 0 ? (
        <div className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-10 text-center text-sm text-[#9E9689]">
          {t.archive.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Index */}
          <aside className="lg:col-span-4 rounded-xl border border-[#C9A86A]/20 bg-[#131622] divide-y divide-[#C9A86A]/15 max-h-[75vh] overflow-y-auto">
            {filteredReadings.map((rd) => {
              const isActive = activeReading?.id === rd.id;
              return (
                <button
                  key={rd.id}
                  type="button"
                  onClick={() => setSelectedId(rd.id)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isActive ? 'bg-[#181C2A]' : 'hover:bg-[#181C2A]/50'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2 text-[11px] font-mono">
                    <span className="text-[#C9A86A]">{rd.areaName}</span>
                    <span className="tabular-nums text-[#D4AF37]">
                      -{rd.cost} {t.common.sdShort}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-[#F4ECD8] line-clamp-2">
                    {rd.question}
                  </p>
                  <p className="mt-1 text-xs text-[#8E8778] truncate">
                    {rd.cards.map((c) => c.cardNameEn).join(' · ')}
                  </p>
                </button>
              );
            })}
          </aside>

          {/* Right Parchment Folio */}
          <main className="lg:col-span-8">
            {activeReading ? (
              <article className="rounded-xl border border-[#C9A86A]/35 bg-[#F4ECD8] text-[#1F1B16] p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1F1B16]/15 pb-4">
                  <div>
                    <p className="font-mono text-xs text-[#785A28]">
                      {activeReading.areaName} · -{activeReading.cost} {t.common.sdShort}
                    </p>
                    <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1F1B16]">
                      {activeReading.question}
                    </h2>
                  </div>

                  <button
                    type="button"
                    disabled={deletingId === activeReading.id}
                    onClick={() => handleDelete(activeReading.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#9A3412]/30 px-3 py-1.5 text-xs font-medium text-[#9A3412] hover:bg-[#9A3412]/10 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.common.delete}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {activeReading.cards.map((c) => {
                    const meta = TAROT_CARD_BY_ID[c.cardId];
                    if (!meta) return null;
                    return (
                      <div key={c.cardId} className="space-y-1.5">
                        <p className="text-xs font-medium text-[#5C4E3C] truncate">
                          {c.positionIndex + 1}. {c.positionLabel}
                        </p>
                        <TarotCardVisual
                          card={meta}
                          orientation={c.orientation}
                          language={language}
                          compact
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#2D261E]">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1F1B16]">
                      {t.reader.resultOverview}
                    </h3>
                    <p className="mt-1.5">{activeReading.interpretation.overview}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-xl font-semibold text-[#1F1B16]">
                      {t.reader.resultCardBreakdown}
                    </h3>
                    {activeReading.cards.map((cardRec) => {
                      const insight = activeReading.interpretation.cardInsights?.find(
                        (ci) => ci.cardId === cardRec.cardId,
                      );
                      return (
                        <div
                          key={cardRec.cardId}
                          className="rounded-lg border border-[#1F1B16]/15 bg-[#EFE4CC] p-4 space-y-2"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-display text-lg font-semibold text-[#1F1B16]">
                              {cardRec.positionLabel}: {cardRec.cardNameEn} ({cardRec.cardNameVi})
                            </span>
                            <span className="font-mono text-[11px] uppercase text-[#785A28]">
                              {cardRec.orientation}
                            </span>
                          </div>
                          {insight && <p className="text-sm">{insight.insight}</p>}
                          <p className="text-xs text-[#5C4E3C]">
                            <strong>Mystical Manga Tarot:</strong>{' '}
                            {cardRec.orientation === 'reversed'
                              ? cardRec.guidebookExcerpt.reversedMeaningVi
                              : cardRec.guidebookExcerpt.predictiveMeaningVi}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1F1B16]">
                      {t.reader.resultSynthesis}
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line">
                      {activeReading.interpretation.synthesis}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1F1B16]">
                      {t.reader.resultGuidance}
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line">
                      {activeReading.interpretation.guidance}
                    </p>
                  </div>
                </div>
              </article>
            ) : (
              <div className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-10 text-center text-sm text-[#9E9689]">
                {t.archive.selectPrompt}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
