import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  ArchivedCardRecord,
  Language,
  MusicPreferences,
  ReadingAreaId,
  RepeatMode,
  TarotInterpretation,
  UserProfile,
} from '../types/tarot';

export function getUtcDateString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isYesterdayUtc(prevDateStr: string, todayDateStr: string): boolean {
  if (!prevDateStr || prevDateStr.length !== 10) return false;
  const prevMs = Date.parse(`${prevDateStr}T00:00:00Z`);
  const todayMs = Date.parse(`${todayDateStr}T00:00:00Z`);
  if (Number.isNaN(prevMs) || Number.isNaN(todayMs)) return false;
  const diffDays = Math.round((todayMs - prevMs) / 86400000);
  return diffDays === 1;
}

function generateId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}

const DEFAULT_PLAYLIST_SEEDS = [
  {
    id: 'seed_celestial_rain',
    title: 'Midnight Observatory — Celestial Ambient',
    artist: 'Lofi Girl Synthwave',
    youtubeId: '4xDzrJKXOOY',
    category: 'Space Ambient',
  },
  {
    id: 'seed_tarot_lofi',
    title: 'Candlelit Study — Deep Meditation Lo-Fi',
    artist: 'Lofi Girl',
    youtubeId: 'jfKfPfyJRdk',
    category: 'Meditation',
  },
  {
    id: 'seed_moonlit_piano',
    title: 'Moonlit Parchment — 1 A.M Study Session',
    artist: 'Lofi Records',
    youtubeId: 'lTRiuFIWV54',
    category: 'Nocturne',
  },
];

export async function ensureUserSanctuary(
  user: User,
  preferredLanguage: Language = 'vi',
): Promise<void> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  let existingSnap;
  try {
    existingSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (existingSnap.exists()) {
    return;
  }

  const displayName = (
    user.displayName?.trim() ||
    user.email?.split('@')[0] ||
    'Astral Seeker'
  ).slice(0, 80);

  const txId = generateId('tx_welcome');
  const batch = writeBatch(db);

  batch.set(userRef, {
    uid: user.uid,
    email: (user.email || '').slice(0, 320),
    displayName,
    mysticTitle:
      preferredLanguage === 'vi' ? 'Người Giữ Huyền Thư' : 'Keeper of the Grimoire',
    avatarUrl: user.photoURL && user.photoURL.length < 2000 ? user.photoURL : 'preset:star',
    language: preferredLanguage,
    starDustBalance: 500,
    checkInStreak: 0,
    lastCheckInDate: '',
    totalCheckIns: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const txRef = doc(db, 'users', user.uid, 'transactions', txId);
  batch.set(txRef, {
    id: txId,
    userId: user.uid,
    type: 'welcome_grant',
    amount: 500,
    balanceAfter: 500,
    description:
      preferredLanguage === 'vi'
        ? 'Quà khai mở Huyền Thư (+500 Bụi Sao)'
        : 'Sanctuary Initiation Grant (+500 Star Dust)',
    createdAt: serverTimestamp(),
  });

  for (const track of DEFAULT_PLAYLIST_SEEDS) {
    const trackRef = doc(db, 'users', user.uid, 'playlists', track.id);
    batch.set(trackRef, {
      id: track.id,
      userId: user.uid,
      title: track.title,
      artist: track.artist,
      youtubeId: track.youtubeId,
      category: track.category,
      createdAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, userPath);
  }
}

export async function updateUserProfile(
  uid: string,
  updates: {
    displayName: string;
    mysticTitle: string;
    avatarUrl: string;
    language: Language;
  },
): Promise<void> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  const sanitized = {
    displayName: updates.displayName.trim().slice(0, 80) || 'Astral Seeker',
    mysticTitle: updates.mysticTitle.trim().slice(0, 120),
    avatarUrl: updates.avatarUrl.slice(0, 120000),
    language: updates.language === 'en' ? 'en' : 'vi',
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(userRef, sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

export interface CheckInResult {
  reward: number;
  baseReward: number;
  bonusReward: number;
  newStreak: number;
  newBalance: number;
  dateUtc: string;
}

export async function performDailyCheckIn(
  uid: string,
  language: Language,
): Promise<CheckInResult> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  const todayUtc = getUtcDateString();

  try {
    return await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);
      if (!snap.exists()) {
        throw new Error('User sanctuary profile does not exist.');
      }

      const data = snap.data() as UserProfile;
      if (data.lastCheckInDate === todayUtc || data.lastCheckInDate > todayUtc) {
        throw new Error(
          language === 'vi'
            ? 'Bạn đã điểm danh nhận Bụi Sao hôm nay rồi. Hãy quay lại vào ngày mai (UTC).'
            : 'Today’s Star Dust check-in has already been claimed. Return tomorrow (UTC).',
        );
      }

      const isConsecutive = isYesterdayUtc(data.lastCheckInDate, todayUtc);
      const newStreak = isConsecutive ? data.checkInStreak + 1 : 1;
      const isSeventhBonus = newStreak % 7 === 0;
      const baseReward = 500;
      const bonusReward = isSeventhBonus ? 1000 : 0;
      const reward = baseReward + bonusReward;
      const newBalance = data.starDustBalance + reward;

      const txId = generateId('tx_checkin');
      const txRef = doc(db, 'users', uid, 'transactions', txId);

      transaction.update(userRef, {
        starDustBalance: newBalance,
        checkInStreak: newStreak,
        lastCheckInDate: todayUtc,
        lastCheckInAt: serverTimestamp(),
        totalCheckIns: (data.totalCheckIns || 0) + 1,
        updatedAt: serverTimestamp(),
      });

      transaction.set(txRef, {
        id: txId,
        userId: uid,
        type: isSeventhBonus ? 'streak_bonus' : 'daily_checkin',
        amount: reward,
        balanceAfter: newBalance,
        description: isSeventhBonus
          ? language === 'vi'
            ? `Điểm danh ngày ${newStreak}: +500 ngày & +1,000 thưởng chuỗi 7 ngày`
            : `Day ${newStreak} Check-In: +500 daily & +1,000 7-day streak bonus`
          : language === 'vi'
            ? `Điểm danh hằng ngày (Chuỗi ${newStreak} ngày)`
            : `Daily Sanctuary Check-In (Day ${newStreak} streak)`,
        createdAt: serverTimestamp(),
      });

      return {
        reward,
        baseReward,
        bonusReward,
        newStreak,
        newBalance,
        dateUtc: todayUtc,
      };
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('already been claimed') ||
        error.message.includes('đã điểm danh'))
    ) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function commitTarotReading(
  uid: string,
  payload: {
    areaId: ReadingAreaId;
    areaName: string;
    cost: 100 | 300 | 500;
    question: string;
    language: Language;
    cards: ArchivedCardRecord[];
    interpretation: TarotInterpretation;
  },
): Promise<{ readingId: string; newBalance: number }> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  const readingId = generateId('rd');
  const txId = generateId('tx_read');
  const readingRef = doc(db, 'users', uid, 'readings', readingId);
  const txRef = doc(db, 'users', uid, 'transactions', txId);

  try {
    return await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);
      if (!snap.exists()) {
        throw new Error('User profile missing.');
      }

      const data = snap.data() as UserProfile;
      if (data.starDustBalance < payload.cost) {
        throw new Error(
          payload.language === 'vi'
            ? `Không đủ Bụi Sao (cần ${payload.cost}, hiện có ${data.starDustBalance}).`
            : `Insufficient Star Dust (requires ${payload.cost}, available ${data.starDustBalance}).`,
        );
      }

      const newBalance = data.starDustBalance - payload.cost;

      transaction.update(userRef, {
        starDustBalance: newBalance,
        updatedAt: serverTimestamp(),
      });

      transaction.set(readingRef, {
        id: readingId,
        userId: uid,
        areaId: payload.areaId,
        areaName: payload.areaName.slice(0, 100),
        cost: payload.cost,
        question: payload.question.trim().slice(0, 500),
        language: payload.language,
        cards: payload.cards,
        interpretation: payload.interpretation,
        createdAt: serverTimestamp(),
      });

      transaction.set(txRef, {
        id: txId,
        userId: uid,
        type: 'tarot_reading',
        amount: -payload.cost,
        balanceAfter: newBalance,
        description: `${payload.areaName.slice(0, 90)} (-${payload.cost} SD)`,
        relatedReadingId: readingId,
        createdAt: serverTimestamp(),
      });

      return { readingId, newBalance };
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Insufficient Star Dust') ||
        error.message.includes('Không đủ Bụi Sao'))
    ) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function deleteTarotReading(uid: string, readingId: string): Promise<void> {
  const path = `users/${uid}/readings/${readingId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'readings', readingId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addPlaylistTrack(
  uid: string,
  track: { title: string; artist?: string; youtubeId: string; category: string },
): Promise<string> {
  const trackId = generateId('trk');
  const path = `users/${uid}/playlists/${trackId}`;
  try {
    await setDoc(doc(collection(db, 'users', uid, 'playlists'), trackId), {
      id: trackId,
      userId: uid,
      title: track.title.trim().slice(0, 140),
      artist: (track.artist?.trim() || 'Celestial Records').slice(0, 100),
      youtubeId: track.youtubeId.trim().slice(0, 11),
      category: (track.category.trim() || 'Ambient').slice(0, 60),
      createdAt: serverTimestamp(),
    });
    return trackId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removePlaylistTrack(uid: string, trackId: string): Promise<void> {
  const path = `users/${uid}/playlists/${trackId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'playlists', trackId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveMusicPreferences(
  uid: string,
  prefs: {
    lastTrackId: string;
    lastPlaylist: string;
    volume: number;
    muted: boolean;
    repeatMode: RepeatMode;
  },
): Promise<void> {
  const path = `users/${uid}/preferences/music`;
  const prefRef = doc(db, 'users', uid, 'preferences', 'music');
  const clampedVol = Math.max(0, Math.min(100, Math.round(prefs.volume)));
  const repeatMode: RepeatMode =
    prefs.repeatMode === 'all' || prefs.repeatMode === 'one' ? prefs.repeatMode : 'off';

  const payload: Omit<MusicPreferences, 'updatedAt'> & { updatedAt: unknown } = {
    id: 'music',
    userId: uid,
    lastTrackId: prefs.lastTrackId.slice(0, 128),
    lastPlaylist: (prefs.lastPlaylist.trim() || 'all').slice(0, 60),
    volume: clampedVol,
    muted: Boolean(prefs.muted),
    repeatMode,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(prefRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
