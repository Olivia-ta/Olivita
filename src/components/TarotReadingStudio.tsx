import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  RefreshCw,
  RotateCw,
  Search,
  Shuffle,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { READING_AREAS, TAROT_CARD_BY_ID, TAROT_DECK_78 } from '../data/tarotDeck';
import { getCopy } from '../i18n/translations';
import { commitTarotReading } from '../services/firestoreService';
import type {
  ArchivedCardRecord,
  Orientation,
  ReadingAreaId,
  SelectedTarotCard,
  Suit,
  TarotGuidebookEntry,
  TarotInterpretation,
} from '../types/tarot';
import { TarotCardVisual } from './TarotCardVisual';

interface TarotReadingStudioProps {
  initialAreaId?: ReadingAreaId;
  onGoCheckIn: () => void;
}

interface CompletedReadingState {
  readingId: string;
  areaName: string;
  cost: 100 | 300 | 500;
  question: string;
  cards: ArchivedCardRecord[];
  interpretation: TarotInterpretation;
}

export function TarotReadingStudio({
  initialAreaId = 'single_spark',
  onGoCheckIn,
}: TarotReadingStudioProps) {
  const { user, profile, language } = useAuth();
  const t = getCopy(language);

  const [areaId, setAreaId] = useState<ReadingAreaId>(initialAreaId);
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedTarotCard[]>([]);
  const [suitFilter, setSuitFilter] = useState<'all' | Suit>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completed, setCompleted] = useState<CompletedReadingState | null>(null);

  const [loreModalCardId, setLoreModalCardId] = useState<string | null>(null);
  const [loreEntry, setLoreEntry] = useState<TarotGuidebookEntry | null>(null);
  const [loreLoading, setLoreLoading] = useState(false);

  const activeArea = useMemo(
    () => READING_AREAS.find((a) => a.id === areaId) || READING_AREAS[0],
    [areaId],
  );

  const positionLabels = language === 'vi' ? activeArea.positionsVi : activeArea.positionsEn;
  const balance = profile?.starDustBalance ?? 0;
  const canAfford = balance >= activeArea.cost;

  const filteredDeck = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return TAROT_DECK_78.filter((card) => {
      if (suitFilter !== 'all' && card.suit !== suitFilter) return false;
      if (!q) return true;
      return (
        card.nameEn.toLowerCase().includes(q) ||
        card.nameVi.toLowerCase().includes(q) ||
        card.romanNumeral.toLowerCase().includes(q)
      );
    });
  }, [suitFilter, searchTerm]);

  const handleAreaChange = (nextId: ReadingAreaId) => {
    setAreaId(nextId);
    const nextArea = READING_AREAS.find((a) => a.id === nextId)!;
    const nextPositions = language === 'vi' ? nextArea.positionsVi : nextArea.positionsEn;
    setSelectedCards((prev) =>
      prev.slice(0, nextArea.cardCount).map((item, idx) => ({
        ...item,
        positionIndex: idx,
        positionLabel: nextPositions[idx],
      })),
    );
    setErrorMsg(null);
  };

  const toggleSelectCard = (cardId: string) => {
    setErrorMsg(null);
    const existingIdx = selectedCards.findIndex((c) => c.cardId === cardId);
    if (existingIdx !== -1) {
      const updated = selectedCards
        .filter((c) => c.cardId !== cardId)
        .map((c, idx) => ({
          ...c,
          positionIndex: idx,
          positionLabel: positionLabels[idx],
        }));
      setSelectedCards(updated);
      return;
    }

    if (selectedCards.length >= activeArea.cardCount) {
      return;
    }

    const nextIdx = selectedCards.length;
    setSelectedCards([
      ...selectedCards,
      {
        cardId,
        positionIndex: nextIdx,
        positionLabel: positionLabels[nextIdx],
        orientation: 'upright',
      },
    ]);
  };

  const toggleOrientation = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.map((c) =>
        c.cardId === cardId
          ? { ...c, orientation: c.orientation === 'upright' ? 'reversed' : 'upright' }
          : c,
      ),
    );
  };

  const removeSelected = (cardId: string) => {
    setSelectedCards((prev) =>
      prev
        .filter((c) => c.cardId !== cardId)
        .map((c, idx) => ({
          ...c,
          positionIndex: idx,
          positionLabel: positionLabels[idx],
        })),
    );
  };

  const fillRemainingRandomly = () => {
    const needed = activeArea.cardCount - selectedCards.length;
    if (needed <= 0) return;
    const usedIds = new Set(selectedCards.map((c) => c.cardId));
    const pool = TAROT_DECK_78.filter((c) => !usedIds.has(c.id));
    const next = [...selectedCards];
    for (let i = 0; i < needed && pool.length > 0; i += 1) {
      const randIdx = Math.floor(Math.random() * pool.length);
      const [picked] = pool.splice(randIdx, 1);
      const orientation: Orientation = Math.random() < 0.3 ? 'reversed' : 'upright';
      const posIdx = next.length;
      next.push({
        cardId: picked.id,
        positionIndex: posIdx,
        positionLabel: positionLabels[posIdx],
        orientation,
      });
    }
    setSelectedCards(next);
  };

  const inspectCardLore = async (cardId: string) => {
    setLoreModalCardId(cardId);
    setLoreLoading(true);
    setLoreEntry(null);
    try {
      const resp = await fetch(`/api/tarot/knowledge/${encodeURIComponent(cardId)}`);
      if (!resp.ok) throw new Error('Failed to load guidebook entry.');
      const data = await resp.json();
      setLoreEntry(data.entry);
    } catch {
      setLoreEntry(null);
    } finally {
      setLoreLoading(false);
    }
  };

  const handleSubmitReading = async () => {
    if (!user) return;
    setErrorMsg(null);

    if (!question.trim()) {
      setErrorMsg(
        language === 'vi'
          ? 'Vui lòng nhập câu hỏi hoặc ý định trước khi giải mã.'
          : 'Please enter your question or intention before interpreting.',
      );
      return;
    }

    if (selectedCards.length !== activeArea.cardCount) {
      setErrorMsg(
        language === 'vi'
          ? `Vui lòng chọn đủ ${activeArea.cardCount} lá bài từ bộ bài 78 lá.`
          : `Please select all ${activeArea.cardCount} cards from the 78-card deck.`,
      );
      return;
    }

    if (!canAfford) {
      setErrorMsg(t.reader.insufficientDust);
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaId: activeArea.id,
          question: question.trim(),
          language,
          cards: selectedCards.map((c, idx) => ({
            cardId: c.cardId,
            positionIndex: idx,
            positionLabel: positionLabels[idx],
            orientation: c.orientation,
          })),
        }),
      });

      const payload = await resp.json();
      if (!resp.ok) {
        throw new Error(payload.error || 'Gemini Tarot interpretation failed.');
      }

      const { readingId } = await commitTarotReading(user.uid, {
        areaId: payload.areaId,
        areaName: payload.areaName,
        cost: payload.cost,
        question: question.trim(),
        language,
        cards: payload.cards,
        interpretation: payload.interpretation,
      });

      setCompleted({
        readingId,
        areaName: payload.areaName,
        cost: payload.cost,
        question: question.trim(),
        cards: payload.cards,
        interpretation: payload.interpretation,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to complete reading.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A86A]/20 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#C9A86A]">
              {completed.areaName} · -{completed.cost} {t.common.sdShort}
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[#F4ECD8]">
              {completed.question}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setCompleted(null);
              setSelectedCards([]);
              setQuestion('');
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-xs font-semibold text-[#090A0F] hover:bg-[#E2C25B] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t.reader.newReading}</span>
          </button>
        </div>

        {/* Drawn Cards Visual Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {completed.cards.map((cardRec) => {
            const meta = TAROT_CARD_BY_ID[cardRec.cardId];
            if (!meta) return null;
            return (
              <div key={cardRec.cardId} className="space-y-2">
                <p className="text-xs font-medium text-[#C9A86A] truncate">
                  {cardRec.positionIndex + 1}. {cardRec.positionLabel}
                </p>
                <TarotCardVisual
                  card={meta}
                  orientation={cardRec.orientation}
                  language={language}
                  compact
                />
              </div>
            );
          })}
        </div>

        {/* Parchment Reading Folio */}
        <article className="rounded-xl border border-[#C9A86A]/35 bg-[#F4ECD8] text-[#1F1B16] p-6 sm:p-10 space-y-8">
          <section className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#1F1B16]">
              {t.reader.resultOverview}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#2D261E]">
              {completed.interpretation.overview}
            </p>
          </section>

          <div className="h-px bg-[#1F1B16]/15" />

          <section className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-[#1F1B16]">
              {t.reader.resultCardBreakdown}
            </h2>
            <div className="space-y-6">
              {completed.cards.map((cardRec) => {
                const insight = completed.interpretation.cardInsights.find(
                  (ci) => ci.cardId === cardRec.cardId,
                );
                return (
                  <div
                    key={cardRec.cardId}
                    className="rounded-lg border border-[#1F1B16]/15 bg-[#EFE4CC] p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold text-[#1F1B16]">
                        {cardRec.positionIndex + 1}. {cardRec.positionLabel} — {cardRec.cardNameEn} ({cardRec.cardNameVi})
                      </h3>
                      <span className="font-mono text-xs uppercase text-[#785A28]">
                        {cardRec.orientation === 'reversed' ? t.common.reversed : t.common.upright}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-[#2D261E] max-w-3xl">
                      {insight?.insight}
                    </p>

                    <div className="border-t border-[#1F1B16]/10 pt-3 text-xs leading-relaxed text-[#4F4538] space-y-1">
                      <p className="font-semibold text-[#785A28]">
                        {t.reader.guidebookSource}:
                      </p>
                      <p>
                        <strong>Nghĩa tiên đoán:</strong> {cardRec.guidebookExcerpt.predictiveMeaningVi}
                      </p>
                      <p>
                        <strong>Lời khuyên:</strong> {cardRec.guidebookExcerpt.adviceVi}
                      </p>
                      {cardRec.orientation === 'reversed' && (
                        <p>
                          <strong>Xoay ngược:</strong> {cardRec.guidebookExcerpt.reversedMeaningVi}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="h-px bg-[#1F1B16]/15" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section>
              <h2 className="font-display text-2xl font-semibold text-[#1F1B16]">
                {t.reader.resultSynthesis}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#2D261E] whitespace-pre-line">
                {completed.interpretation.synthesis}
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold text-[#1F1B16]">
                {t.reader.resultGuidance}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#2D261E] whitespace-pre-line">
                {completed.interpretation.guidance}
              </p>
            </section>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Reading Area & Intention */}
      <section className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4ECD8]">
            {t.reader.step1}
          </h1>
          <span className="font-mono tabular-nums text-xs text-[#D4AF37]">
            {t.common.starDust}: {balance.toLocaleString()} {t.common.sdShort}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {READING_AREAS.map((area) => {
            const selected = area.id === areaId;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => handleAreaChange(area.id)}
                className={`text-left rounded-lg border p-4 transition-colors cursor-pointer ${
                  selected
                    ? 'border-[#D4AF37] bg-[#181C2A]'
                    : 'border-[#C9A86A]/20 bg-[#0D1018] hover:border-[#C9A86A]/50'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-lg font-semibold text-[#F4ECD8]">
                    {language === 'vi' ? area.nameVi : area.nameEn}
                  </span>
                  <span className="font-mono tabular-nums text-xs font-semibold text-[#D4AF37]">
                    {area.cost} {t.common.sdShort}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#B8B0A0]">
                  {language === 'vi' ? area.subtitleVi : area.subtitleEn}
                </p>
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="tarot-question" className="text-xs font-medium text-[#C8C0B0]">
              {t.reader.questionLabel}
            </label>
            <span className="font-mono tabular-nums text-[11px] text-[#8E8778]">
              {question.length}/500
            </span>
          </div>
          <textarea
            id="tarot-question"
            rows={2}
            maxLength={500}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.reader.questionPlaceholder}
            className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </section>

      {/* Selected Spread Slots & Submit */}
      <section className="rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
              {t.reader.selectedTray} ({selectedCards.length}/{activeArea.cardCount})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fillRemainingRandomly}
              disabled={selectedCards.length >= activeArea.cardCount}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A86A]/30 bg-[#0D1018] px-3 py-1.5 text-xs font-medium text-[#ECE6D8] hover:border-[#D4AF37] disabled:opacity-40 cursor-pointer"
            >
              <Shuffle className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{t.reader.quickDraw}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCards([])}
              disabled={selectedCards.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A86A]/20 bg-[#0D1018] px-3 py-1.5 text-xs font-medium text-[#B8B0A0] hover:text-[#ECE6D8] disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t.reader.clearSelection}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {positionLabels.map((posLabel, idx) => {
            const slot = selectedCards[idx];
            const cardMeta = slot ? TAROT_CARD_BY_ID[slot.cardId] : null;
            return (
              <div
                key={posLabel}
                className="rounded-xl border border-[#C9A86A]/20 bg-[#0D1018] p-3 flex flex-col justify-between min-h-[220px]"
              >
                <p className="text-xs font-medium text-[#C9A86A] mb-2 truncate">
                  {idx + 1}. {posLabel}
                </p>

                {slot && cardMeta ? (
                  <>
                    <TarotCardVisual
                      card={cardMeta}
                      orientation={slot.orientation}
                      language={language}
                      compact
                    />
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleOrientation(slot.cardId)}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-[#C9A86A]/30 bg-[#181C2A] px-2 py-1.5 text-[11px] font-medium text-[#ECE6D8] hover:border-[#D4AF37] cursor-pointer"
                        title={t.reader.flipOrientation}
                      >
                        <RotateCw className="h-3 w-3 text-[#D4AF37]" />
                        <span>
                          {slot.orientation === 'upright'
                            ? language === 'vi'
                              ? 'Xuôi'
                              : 'Upright'
                            : language === 'vi'
                              ? 'Ngược'
                              : 'Reversed'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSelected(slot.cardId)}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-[#C25450]/35 bg-[#181C2A] px-2 py-1.5 text-[11px] font-medium text-[#F3B7B5] hover:bg-[#C25450]/20 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>{t.reader.removeCard}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-[#C9A86A]/20 p-4 text-center text-xs text-[#7D7669]">
                    {t.reader.emptySlot}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#C25450]/45 bg-[#C25450]/10 p-3.5 text-xs text-[#F3B7B5]">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!canAfford && (
              <button
                type="button"
                onClick={onGoCheckIn}
                className="rounded-md bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-[#090A0F] cursor-pointer"
              >
                {t.sanctuary.goCheckIn}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#C9A86A]/15">
          <div className="text-xs text-[#B8B0A0]">
            {language === 'vi'
              ? `Chi phí: ${activeArea.cost} Bụi Sao · Trừ nguyên tử khi Gemini trả kết quả thành công.`
              : `Cost: ${activeArea.cost} Star Dust · Deducted atomically only when interpretation succeeds.`}
          </div>
          <button
            type="button"
            disabled={submitting || selectedCards.length !== activeArea.cardCount || !canAfford}
            onClick={handleSubmitReading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-[#090A0F] hover:bg-[#E2C25B] transition-colors disabled:opacity-45 cursor-pointer"
          >
            <Sparkles className={`h-4 w-4 ${submitting ? 'animate-spin' : ''}`} />
            <span>{submitting ? t.reader.interpreting : t.reader.submitReading}</span>
          </button>
        </div>
      </section>

      {/* Step 2: Manual 78-Card Deck Picker */}
      <section className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A86A]/15 pb-3">
          <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
            {t.reader.step2}
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8778]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.reader.searchCardPlaceholder}
              className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] pl-9 pr-3 py-2 text-xs text-[#F4ECD8] placeholder:text-[#6E675A] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#0D1018] p-1.5 rounded-lg border border-[#C9A86A]/15">
          {(
            [
              { id: 'all', label: t.reader.filterAll },
              { id: 'major', label: t.reader.filterMajor },
              { id: 'wands', label: t.reader.filterWands },
              { id: 'cups', label: t.reader.filterCups },
              { id: 'swords', label: t.reader.filterSwords },
              { id: 'coins', label: t.reader.filterCoins },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSuitFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                suitFilter === tab.id
                  ? 'bg-[#181C2A] text-[#D4AF37]'
                  : 'text-[#B8B0A0] hover:text-[#F4ECD8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredDeck.map((card) => {
            const isPicked = selectedCards.some((c) => c.cardId === card.id);
            const full = selectedCards.length >= activeArea.cardCount;
            return (
              <div
                key={card.id}
                className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${
                  isPicked
                    ? 'border-[#D4AF37] bg-[#181C2A]'
                    : 'border-[#C9A86A]/20 bg-[#0D1018] hover:border-[#C9A86A]/55'
                }`}
              >
                <button
                  type="button"
                  disabled={!isPicked && full}
                  onClick={() => toggleSelectCard(card.id)}
                  className="text-left w-full disabled:opacity-45 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#C9A86A]">
                    <span>{card.romanNumeral}</span>
                    {isPicked && <Check className="h-3.5 w-3.5 text-[#D4AF37]" />}
                  </div>
                  <p className="mt-1.5 font-display text-base font-semibold text-[#F4ECD8] leading-snug">
                    {card.nameEn}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#B8B0A0] truncate">
                    {card.nameVi}
                  </p>
                  <p className="mt-1 text-[10px] text-[#8E8778]">
                    {language === 'vi' ? card.elementVi : card.elementEn}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => inspectCardLore(card.id)}
                  className="mt-2.5 pt-2 border-t border-[#C9A86A]/10 inline-flex items-center gap-1 text-[11px] text-[#C9A86A] hover:text-[#D4AF37] cursor-pointer"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>{t.reader.viewLore}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guidebook Lore Modal */}
      {loreModalCardId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#C9A86A]/35 bg-[#F4ECD8] text-[#1F1B16] p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-[#1F1B16]/15 pb-3">
              <div>
                <p className="font-mono text-xs text-[#785A28]">
                  Mystical Manga Tarot {loreEntry ? `· ${loreEntry.sourcePages}` : ''}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#1F1B16]">
                  {TAROT_CARD_BY_ID[loreModalCardId]?.nameEn} ·{' '}
                  {TAROT_CARD_BY_ID[loreModalCardId]?.nameVi}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLoreModalCardId(null)}
                className="rounded-lg border border-[#1F1B16]/20 p-1.5 text-[#1F1B16] hover:bg-[#1F1B16]/10 cursor-pointer"
                aria-label={t.common.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loreLoading ? (
              <p className="py-6 text-sm text-[#4F4538]">{t.common.loading}</p>
            ) : loreEntry ? (
              <div className="space-y-4 text-sm leading-relaxed text-[#2D261E]">
                <p className="text-xs italic text-[#5C4E3C]">{loreEntry.suitIntroVi}</p>
                {loreEntry.storyVi && (
                  <div>
                    <h4 className="font-semibold text-[#1F1B16]">Hành trình nguyên mẫu</h4>
                    <p className="mt-1">{loreEntry.storyVi}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-[#1F1B16]">Nghĩa tiên đoán</h4>
                  <p className="mt-1">{loreEntry.predictiveMeaningVi}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1F1B16]">Lời khuyên</h4>
                  <p className="mt-1">{loreEntry.adviceVi}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1F1B16]">Nếu bài xoay ngược</h4>
                  <p className="mt-1">{loreEntry.reversedMeaningVi}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#9A3412]">Unable to retrieve lore.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
