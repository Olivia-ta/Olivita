import type { ReadingAreaConfig, TarotCardMetadata } from '../types/tarot';

export const READING_AREAS: ReadingAreaConfig[] = [
  {
    id: 'single_spark',
    cardCount: 1,
    cost: 100,
    nameVi: 'Tia Sáng Đơn (1 Lá)',
    nameEn: '1-Card Spark',
    subtitleVi: 'Thông điệp trọng tâm & năng lượng hiện tại',
    subtitleEn: 'Focused signal & immediate clarity',
    descriptionVi:
      'Chọn thủ công 1 lá bài từ bộ 78 lá Mystical Manga Tarot để soi rọi câu hỏi cốt lõi hoặc định hướng trong ngày.',
    descriptionEn:
      'Manually draw 1 card from the 78-card Mystical Manga Tarot deck to illuminate a single pressing question or daily anchor.',
    positionsVi: ['Thông Điệp Trọng Tâm'],
    positionsEn: ['Core Signal'],
  },
  {
    id: 'triad_alignment',
    cardCount: 3,
    cost: 300,
    nameVi: 'Tam Giác Định Mệnh (3 Lá)',
    nameEn: '3-Card Alignment',
    subtitleVi: 'Quá Khứ · Hiện Tại · Tương Lai',
    subtitleEn: 'Past · Present · Future',
    descriptionVi:
      'Chọn thủ công 3 lá bài theo dòng thời gian để nhìn thấy gốc rễ vấn đề, thế đứng hiện tại và hướng chuyển hóa sắp tới.',
    descriptionEn:
      'Manually select 3 cards across the temporal arc to trace root causes, present momentum, and the emerging trajectory.',
    positionsVi: ['Quá Khứ', 'Hiện Tại', 'Tương Lai'],
    positionsEn: ['Past', 'Present', 'Future'],
  },
  {
    id: 'astral_grimoire',
    cardCount: 5,
    cost: 500,
    nameVi: 'Đại Trận Huyền Thư (5 Lá)',
    nameEn: '5-Card Grimoire Spread',
    subtitleVi: 'Phân tích toàn diện 5 tầng huyền học',
    subtitleEn: 'Deep five-pillar arcana synthesis',
    descriptionVi:
      'Trải bài chuyên sâu 5 lá khám phá tình huống bề mặt, ảnh hưởng tiềm thức, thử thách, lời khuyên hành động và kết quả.',
    descriptionEn:
      'Comprehensive 5-card spread examining the visible situation, hidden currents, core obstacle, actionable counsel, and outcome.',
    positionsVi: [
      'Tình Huống Hiện Tại',
      'Ảnh Hưởng Ẩn',
      'Thử Thách Cốt Lõi',
      'Lời Khuyên',
      'Kết Quả Tiềm Năng',
    ],
    positionsEn: [
      'Present Situation',
      'Hidden Influence',
      'Core Obstacle',
      'Counsel',
      'Potential Outcome',
    ],
  },
];

const MAJOR_ARCANA: TarotCardMetadata[] = [
  { id: 'the-fool', index: 0, romanNumeral: '0', nameEn: 'The Fool', nameVi: 'Kẻ Khờ', arcana: 'major', suit: 'major', elementVi: 'Khí · Khởi Nguyên', elementEn: 'Air · Pure Potential' },
  { id: 'the-magician', index: 1, romanNumeral: 'I', nameEn: 'The Magician', nameVi: 'Pháp Sư', arcana: 'major', suit: 'major', elementVi: 'Khí · Ý Chí', elementEn: 'Air · Manifestation' },
  { id: 'the-high-priestess', index: 2, romanNumeral: 'II', nameEn: 'The High Priestess', nameVi: 'Nữ Tư Tế', arcana: 'major', suit: 'major', elementVi: 'Nước · Trực Giác', elementEn: 'Water · Inner Knowing' },
  { id: 'the-empress', index: 3, romanNumeral: 'III', nameEn: 'The Empress', nameVi: 'Nữ Hoàng', arcana: 'major', suit: 'major', elementVi: 'Đất · Trù Phú', elementEn: 'Earth · Abundance' },
  { id: 'the-emperor', index: 4, romanNumeral: 'IV', nameEn: 'The Emperor', nameVi: 'Hoàng Đế', arcana: 'major', suit: 'major', elementVi: 'Lửa · Trật Tự', elementEn: 'Fire · Structure' },
  { id: 'the-hierophant', index: 5, romanNumeral: 'V', nameEn: 'The Hierophant', nameVi: 'Giáo Hoàng', arcana: 'major', suit: 'major', elementVi: 'Đất · Truyền Thống', elementEn: 'Earth · Sacred Tradition' },
  { id: 'the-lovers', index: 6, romanNumeral: 'VI', nameEn: 'The Lovers', nameVi: 'Tình Nhân', arcana: 'major', suit: 'major', elementVi: 'Khí · Lựa Chọn', elementEn: 'Air · Heart Alignment' },
  { id: 'the-chariot', index: 7, romanNumeral: 'VII', nameEn: 'The Chariot', nameVi: 'Chiến Xa', arcana: 'major', suit: 'major', elementVi: 'Nước · Tiến Bước', elementEn: 'Water · Driven Momentum' },
  { id: 'strength', index: 8, romanNumeral: 'VIII', nameEn: 'Strength', nameVi: 'Sức Mạnh', arcana: 'major', suit: 'major', elementVi: 'Lửa · Dũng Khí', elementEn: 'Fire · Inner Courage' },
  { id: 'the-hermit', index: 9, romanNumeral: 'IX', nameEn: 'The Hermit', nameVi: 'Ẩn Sĩ', arcana: 'major', suit: 'major', elementVi: 'Đất · Tĩnh Lặng', elementEn: 'Earth · Solitary Lamp' },
  { id: 'wheel-of-fortune', index: 10, romanNumeral: 'X', nameEn: 'The Wheel of Fortune', nameVi: 'Bánh Xe Số Phận', arcana: 'major', suit: 'major', elementVi: 'Lửa · Chu Kỳ', elementEn: 'Fire · Turning Cycles' },
  { id: 'justice', index: 11, romanNumeral: 'XI', nameEn: 'Justice', nameVi: 'Công Lý', arcana: 'major', suit: 'major', elementVi: 'Khí · Nhân Quả', elementEn: 'Air · Cosmic Balance' },
  { id: 'the-hanged-man', index: 12, romanNumeral: 'XII', nameEn: 'The Hanged Man', nameVi: 'Người Treo Ngược', arcana: 'major', suit: 'major', elementVi: 'Nước · Tĩnh Chờ', elementEn: 'Water · Sacred Pause' },
  { id: 'death', index: 13, romanNumeral: 'XIII', nameEn: 'Death', nameVi: 'Tái Sinh', arcana: 'major', suit: 'major', elementVi: 'Nước · Chuyển Hóa', elementEn: 'Water · Transformation' },
  { id: 'temperance', index: 14, romanNumeral: 'XIV', nameEn: 'Temperance', nameVi: 'Điều Độ', arcana: 'major', suit: 'major', elementVi: 'Lửa · Hòa Hợp', elementEn: 'Fire · Alchemy' },
  { id: 'the-devil', index: 15, romanNumeral: 'XV', nameEn: 'The Devil', nameVi: 'Ác Quỷ', arcana: 'major', suit: 'major', elementVi: 'Đất · Ràng Buộc', elementEn: 'Earth · Shadow Bonds' },
  { id: 'the-tower', index: 16, romanNumeral: 'XVI', nameEn: 'The Tower', nameVi: 'Tòa Tháp', arcana: 'major', suit: 'major', elementVi: 'Lửa · Phá Vỡ', elementEn: 'Fire · Awakening Shock' },
  { id: 'the-star', index: 17, romanNumeral: 'XVII', nameEn: 'The Star', nameVi: 'Ngôi Sao', arcana: 'major', suit: 'major', elementVi: 'Khí · Chữa Lành', elementEn: 'Air · North Star' },
  { id: 'the-moon', index: 18, romanNumeral: 'XVIII', nameEn: 'The Moon', nameVi: 'Mặt Trăng', arcana: 'major', suit: 'major', elementVi: 'Nước · Tiềm Thức', elementEn: 'Water · Deep Reflection' },
  { id: 'the-sun', index: 19, romanNumeral: 'XIX', nameEn: 'The Sun', nameVi: 'Mặt Trời', arcana: 'major', suit: 'major', elementVi: 'Lửa · Rạng Rỡ', elementEn: 'Fire · Pure Radiance' },
  { id: 'judgment', index: 20, romanNumeral: 'XX', nameEn: 'Judgment', nameVi: 'Phán Xét', arcana: 'major', suit: 'major', elementVi: 'Lửa · Tiếng Gọi', elementEn: 'Fire · Higher Calling' },
  { id: 'the-world', index: 21, romanNumeral: 'XXI', nameEn: 'The World', nameVi: 'Thế Giới', arcana: 'major', suit: 'major', elementVi: 'Đất · Viên Mãn', elementEn: 'Earth · Completion' },
];

const SUIT_RANKS: {
  slug: string;
  roman: string;
  en: string;
  vi: string;
}[] = [
  { slug: 'ace', roman: 'I', en: 'Ace', vi: 'Át' },
  { slug: 'two', roman: 'II', en: 'Two', vi: 'Hai' },
  { slug: 'three', roman: 'III', en: 'Three', vi: 'Ba' },
  { slug: 'four', roman: 'IV', en: 'Four', vi: 'Bốn' },
  { slug: 'five', roman: 'V', en: 'Five', vi: 'Năm' },
  { slug: 'six', roman: 'VI', en: 'Six', vi: 'Sáu' },
  { slug: 'seven', roman: 'VII', en: 'Seven', vi: 'Bảy' },
  { slug: 'eight', roman: 'VIII', en: 'Eight', vi: 'Tám' },
  { slug: 'nine', roman: 'IX', en: 'Nine', vi: 'Chín' },
  { slug: 'ten', roman: 'X', en: 'Ten', vi: 'Mười' },
  { slug: 'page', roman: 'P', en: 'Page', vi: 'Tiểu Đồng' },
  { slug: 'knight', roman: 'Kn', en: 'Knight', vi: 'Hiệp Sĩ' },
  { slug: 'queen', roman: 'Q', en: 'Queen', vi: 'Nữ Hoàng' },
  { slug: 'king', roman: 'K', en: 'King', vi: 'Quốc Vương' },
];

function buildSuitCards(
  suit: 'wands' | 'cups' | 'swords' | 'coins',
  startIndex: number,
  suitNameEn: string,
  suitNameVi: string,
  elementVi: string,
  elementEn: string,
): TarotCardMetadata[] {
  return SUIT_RANKS.map((rank, offset) => ({
    id: `${rank.slug}-of-${suit}`,
    index: startIndex + offset,
    romanNumeral: rank.roman,
    nameEn: `${rank.en} of ${suitNameEn}`,
    nameVi: `${rank.vi} ${suitNameVi}`,
    arcana: 'minor',
    suit,
    elementVi,
    elementEn,
  }));
}

export const TAROT_DECK_78: TarotCardMetadata[] = [
  ...MAJOR_ARCANA,
  ...buildSuitCards('wands', 22, 'Wands', 'Gậy', 'Lửa · Đam Mê', 'Fire · Will & Action'),
  ...buildSuitCards('cups', 36, 'Cups', 'Cốc', 'Nước · Cảm Xúc', 'Water · Emotion & Bonds'),
  ...buildSuitCards('swords', 50, 'Swords', 'Kiếm', 'Khí · Trí Tuệ', 'Air · Truth & Intellect'),
  ...buildSuitCards('coins', 64, 'Coins', 'Tiền', 'Đất · Vật Chất', 'Earth · Material & Craft'),
];

export const TAROT_CARD_BY_ID: Record<string, TarotCardMetadata> = Object.fromEntries(
  TAROT_DECK_78.map((card) => [card.id, card]),
);
