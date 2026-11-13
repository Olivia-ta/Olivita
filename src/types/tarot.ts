export type Language = 'vi' | 'en';

export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'coins';

export type Orientation = 'upright' | 'reversed';

export type ReadingAreaId = 'single_spark' | 'triad_alignment' | 'astral_grimoire';

export interface ReadingAreaConfig {
  id: ReadingAreaId;
  cardCount: 1 | 3 | 5;
  cost: 100 | 300 | 500;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  positionsVi: string[];
  positionsEn: string[];
}

export interface TarotCardMetadata {
  id: string;
  index: number;
  romanNumeral: string;
  nameEn: string;
  nameVi: string;
  arcana: 'major' | 'minor';
  suit: Suit;
  elementVi: string;
  elementEn: string;
}

export interface TarotGuidebookEntry {
  cardId: string;
  suitIntroVi: string;
  storyVi?: string;
  predictiveMeaningVi: string;
  adviceVi: string;
  reversedMeaningVi: string;
  sourcePages: string;
}

export interface SelectedTarotCard {
  cardId: string;
  positionIndex: number;
  positionLabel: string;
  orientation: Orientation;
}

export interface CardInsight {
  cardId: string;
  positionLabel: string;
  orientation: Orientation;
  insight: string;
  guidebookCitation: string;
}

export interface TarotInterpretation {
  overview: string;
  synthesis: string;
  guidance: string;
  cardInsights: CardInsight[];
}

export interface ArchivedCardRecord {
  cardId: string;
  cardNameEn: string;
  cardNameVi: string;
  positionIndex: number;
  positionLabel: string;
  orientation: Orientation;
  guidebookExcerpt: {
    predictiveMeaningVi: string;
    adviceVi: string;
    reversedMeaningVi: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  mysticTitle: string;
  avatarUrl: string;
  language: Language;
  starDustBalance: number;
  checkInStreak: number;
  lastCheckInDate: string;
  lastCheckInAt?: unknown;
  totalCheckIns: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export type TransactionType =
  | 'welcome_grant'
  | 'daily_checkin'
  | 'streak_bonus'
  | 'tarot_reading';

export interface StarDustTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  relatedReadingId?: string;
  createdAt: unknown;
}

export interface TarotReading {
  id: string;
  userId: string;
  areaId: ReadingAreaId;
  areaName: string;
  cost: 100 | 300 | 500;
  question: string;
  language: Language;
  cards: ArchivedCardRecord[];
  interpretation: TarotInterpretation;
  createdAt: unknown;
}

export interface PlaylistTrack {
  id: string;
  userId: string;
  title: string;
  artist?: string;
  youtubeId: string;
  category: string;
  createdAt: unknown;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface MusicPreferences {
  id: 'music';
  userId: string;
  lastTrackId: string;
  lastPlaylist: string;
  volume: number;
  muted: boolean;
  repeatMode: RepeatMode;
  updatedAt: unknown;
}
