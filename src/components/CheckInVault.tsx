import { useState } from 'react';
import { AlertCircle, CalendarCheck2, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCopy } from '../i18n/translations';
import {
  getUtcDateString,
  isYesterdayUtc,
  performDailyCheckIn,
} from '../services/firestoreService';

export function CheckInVault() {
  const { user, profile, transactions, language } = useAuth();
  const t = getCopy(language);

  const [claiming, setClaiming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const todayUtc = getUtcDateString();
  const checkedInToday = profile?.lastCheckInDate === todayUtc;

  const rawStreak = profile?.checkInStreak ?? 0;
  const activeStreak =
    checkedInToday || isYesterdayUtc(profile?.lastCheckInDate || '', todayUtc)
      ? rawStreak
      : 0;

  // Cycle position 0..6 within current 7-day cycle
  const cycleCompleted = activeStreak === 0 ? 0 : ((activeStreak - 1) % 7) + 1;

  const handleClaim = async () => {
    if (!user || checkedInToday) return;
    setClaiming(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const result = await performDailyCheckIn(user.uid, language);
      setSuccessMsg(
        result.bonusReward > 0
          ? language === 'vi'
            ? `Điểm danh thành công! Nhận +500 ngày & +1,000 thưởng chuỗi 7 ngày (Tổng +${result.reward.toLocaleString()} SD).`
            : `Claimed +500 daily & +1,000 7-day streak bonus (+${result.reward.toLocaleString()} SD total).`
          : language === 'vi'
            ? `Điểm danh thành công! Đã cộng +500 Bụi Sao (Chuỗi ${result.newStreak} ngày).`
            : `Daily check-in complete! +500 Star Dust credited (Day ${result.newStreak} streak).`,
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Check-in transaction failed.');
    } finally {
      setClaiming(false);
    }
  };

  const formatTimestamp = (ts: unknown): string => {
    if (!ts || typeof ts !== 'object') return 'Just now';
    const maybe = ts as { toDate?: () => Date };
    if (typeof maybe.toDate === 'function') {
      return maybe.toDate().toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Syncing';
  };

  return (
    <div className="space-y-8">
      {/* Header & Metrics */}
      <section className="rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#C9A86A]/15 pb-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4ECD8]">
              {t.checkin.title}
            </h1>
            <p className="mt-2 text-sm text-[#B8B0A0]">{t.checkin.subtitle}</p>
          </div>

          <button
            type="button"
            disabled={claiming || checkedInToday}
            onClick={handleClaim}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              checkedInToday
                ? 'border border-[#4B8F78]/40 bg-[#4B8F78]/15 text-[#A8DFCA] cursor-default'
                : 'bg-[#D4AF37] text-[#090A0F] hover:bg-[#E2C25B] disabled:opacity-50'
            }`}
          >
            <CalendarCheck2 className="h-4 w-4" />
            <span>
              {claiming
                ? t.checkin.claiming
                : checkedInToday
                  ? t.checkin.claimedToday
                  : t.checkin.claimBtn}
            </span>
          </button>
        </div>

        {/* 3 KPI figures */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#C9A86A]/15 bg-[#0D1018] p-4">
            <p className="text-xs text-[#9E9689]">{t.common.starDust}</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#D4AF37]">
              {(profile?.starDustBalance ?? 0).toLocaleString()} {t.common.sdShort}
            </p>
          </div>
          <div className="rounded-lg border border-[#C9A86A]/15 bg-[#0D1018] p-4">
            <p className="text-xs text-[#9E9689]">{t.checkin.currentStreak}</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#F4ECD8]">
              {activeStreak} {t.checkin.daysUnit}
            </p>
          </div>
          <div className="rounded-lg border border-[#C9A86A]/15 bg-[#0D1018] p-4">
            <p className="text-xs text-[#9E9689]">{t.checkin.totalCheckIns}</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#F4ECD8]">
              {profile?.totalCheckIns ?? 0}
            </p>
          </div>
        </div>

        {/* 7-Day Constellation Track */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#C9A86A]">
            <span>
              {language === 'vi'
                ? 'Chu kỳ 7 ngày liên tiếp (UTC)'
                : '7-Day Consecutive Constellation (UTC)'}
            </span>
            <span>{t.checkin.bonusLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const completed = day <= cycleCompleted;
              const isSeventh = day === 7;
              const rewardText = isSeventh ? '+1,500' : '+500';
              return (
                <div
                  key={day}
                  className={`rounded-lg border p-3.5 text-center transition-colors ${
                    completed
                      ? 'border-[#D4AF37] bg-[#181C2A]'
                      : isSeventh
                        ? 'border-[#C9A86A]/45 bg-[#0D1018]'
                        : 'border-[#C9A86A]/15 bg-[#0D1018]'
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wider text-[#9E9689]">
                    {language === 'vi' ? `Ngày ${day}` : `Day ${day}`}
                  </p>
                  <p
                    className={`mt-2 font-mono tabular-nums text-sm font-semibold ${
                      completed || isSeventh ? 'text-[#D4AF37]' : 'text-[#ECE6D8]'
                    }`}
                  >
                    {rewardText} SD
                  </p>
                  <p className="mt-1 text-[10px] text-[#8E8778]">
                    {completed
                      ? language === 'vi'
                        ? 'Đã nhận'
                        : 'Claimed'
                      : isSeventh
                        ? '+1,000 Bonus'
                        : language === 'vi'
                          ? 'Thường'
                          : 'Daily'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-lg border border-[#C25450]/45 bg-[#C25450]/10 p-3 text-xs text-[#F3B7B5]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 rounded-lg border border-[#4B8F78]/45 bg-[#4B8F78]/10 p-3 text-xs text-[#A8DFCA]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </section>

      {/* Immutable Ledger */}
      <section className="rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#C9A86A]/15 pb-3">
          <h2 className="font-display text-2xl font-semibold text-[#F4ECD8]">
            {t.checkin.ledgerTitle}
          </h2>
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        </div>

        {transactions.length === 0 ? (
          <p className="py-6 text-sm text-[#9E9689]">{t.checkin.ledgerEmpty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#C9A86A]/15 text-xs text-[#9E9689]">
                  <th className="py-2.5 pr-4 font-medium">
                    {language === 'vi' ? 'Mô Tả' : 'Description'}
                  </th>
                  <th className="py-2.5 pr-4 font-medium">
                    {language === 'vi' ? 'Thời Gian' : 'Timestamp'}
                  </th>
                  <th className="py-2.5 pr-4 font-medium text-right">
                    {language === 'vi' ? 'Biến Động' : 'Amount'}
                  </th>
                  <th className="py-2.5 font-medium text-right">
                    {language === 'vi' ? 'Số Dư Sau' : 'Balance After'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A86A]/10">
                {transactions.map((tx) => {
                  const positive = tx.amount > 0;
                  return (
                    <tr key={tx.id}>
                      <td className="py-3 pr-4 text-[#ECE6D8]">{tx.description}</td>
                      <td className="py-3 pr-4 text-xs font-mono text-[#8E8778] whitespace-nowrap">
                        {formatTimestamp(tx.createdAt)}
                      </td>
                      <td
                        className={`py-3 pr-4 text-right font-mono tabular-nums font-medium whitespace-nowrap ${
                          positive ? 'text-[#A8DFCA]' : 'text-[#E3908C]'
                        }`}
                      >
                        {positive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} SD
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-[#D4AF37] whitespace-nowrap">
                        {tx.balanceAfter.toLocaleString()} SD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
