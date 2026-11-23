/**
 * ===================================================================
 * 教科の登録簿（マナトビ 大学受験・共通テスト社会科）
 * ===================================================================
 *
 * 2025年度〜新課程「大学入学共通テスト 地理歴史・公民」の主要5出題科目を登録。
 * 1. 歴史総合，日本史探究（jp_history / jh）
 * 2. 歴史総合，世界史探究（world_history / wh）
 * 3. 地理総合，地理探究（geography / ge）
 * 4. 公共，政治・経済（politics_econ / pe）
 * 5. 公共，倫理（ethics / et）
 *
 * ■ このファイルは何も import しない（葉モジュール）
 */

export interface SubjectTheme {
  label: string;
  accent: string;
  accentSoft: string;
  surface: string;
  bubbleBorderClass: string;
  bubbleBgClass: string;
  bubbleShadow: string;
  chipTextClass: string;
  chipBgClass: string;
  progressBarClass: string;
}

export interface ReviewSubjectStyle {
  textClass: string;
  bgClass: string;
  borderClass: string;
  activeClass: string;
  stripeClass: string;
}

export interface SubjectDefinition {
  id: string;
  label: string;
  shortLabel: string;
  enabled: boolean;
  chapterIdPattern: RegExp;
  entry: 'chapters' | 'mode_selection';
  practiceDescription: string;
  learningDescription?: string;
  classroom?: boolean;
  theme: SubjectTheme;
  reviewStyle: ReviewSubjectStyle;
}

export const SUBJECT_REGISTRY = [
  {
    id: 'jp_history',
    label: '歴史総合・日本史探究',
    shortLabel: '日本史探究',
    enabled: true,
    chapterIdPattern: /^jh\d+_\d+$/,
    entry: 'mode_selection',
    practiceDescription: '史料読解・年代整序・組合せ正誤・歴史総合（近現代の日欧アジア連関）まで、共通テスト本番形式の大問で実戦演習します。',
    learningDescription: '古代〜現代の政権・外交・土地制度・文化史と頻出史料フレーズを赤シート機能つきで総整理できます。',
    theme: {
      label: '歴史総合・日本史探究',
      accent: '#B84A39',
      accentSoft: '#F2CEC7',
      surface: '#FDF7F5',
      bubbleBorderClass: 'border-[#F2CEC7]/80',
      bubbleBgClass: 'bg-[#FFF9F8]/95',
      bubbleShadow: '0 10px 24px -14px rgba(184,74,57,0.55)',
      chipTextClass: 'text-[#963627]',
      chipBgClass: 'bg-[#F2CEC7]/35',
      progressBarClass: 'bg-[#D0604E]',
    },
    reviewStyle: {
      textClass: 'text-[#963627]',
      bgClass: 'bg-[#F2CEC7]/25',
      borderClass: 'border-[#F2CEC7]',
      activeClass: 'bg-[#B84A39] text-white border-[#B84A39]',
      stripeClass: 'bg-[#B84A39]',
    },
  },
  {
    id: 'world_history',
    label: '歴史総合・世界史探究',
    shortLabel: '世界史探究',
    enabled: true,
    chapterIdPattern: /^wh\d+_\d+$/,
    entry: 'mode_selection',
    practiceDescription: '諸地域の交易圏・帝国統治・近代化と世界大戦・冷戦後の国際秩序まで、資料・地図・グラフを用いた共通テスト型問題で演習します。',
    learningDescription: '横のつながり（同時代比較）・交易ネットワーク・条約と国際機関の要点を赤シート暗記で一気に固めます。',
    theme: {
      label: '歴史総合・世界史探究',
      accent: '#2B5B9E',
      accentSoft: '#C3D6F2',
      surface: '#F5F8FD',
      bubbleBorderClass: 'border-[#C3D6F2]/80',
      bubbleBgClass: 'bg-[#F8FAFE]/95',
      bubbleShadow: '0 10px 24px -14px rgba(43,91,158,0.55)',
      chipTextClass: 'text-[#1F467D]',
      chipBgClass: 'bg-[#C3D6F2]/35',
      progressBarClass: 'bg-[#4374B8]',
    },
    reviewStyle: {
      textClass: 'text-[#1F467D]',
      bgClass: 'bg-[#C3D6F2]/25',
      borderClass: 'border-[#C3D6F2]',
      activeClass: 'bg-[#2B5B9E] text-white border-[#2B5B9E]',
      stripeClass: 'bg-[#2B5B9E]',
    },
  },
  {
    id: 'geography',
    label: '地理総合・地理探究',
    shortLabel: '地理探究',
    enabled: true,
    chapterIdPattern: /^ge\d+_\d+$/,
    entry: 'mode_selection',
    practiceDescription: '地形図・GISと防災（地理総合）、気候グラフ（ハイサーグラフ）・農鉱工業統計・都市人口移動・地域調査の思考力問題を徹底攻略します。',
    learningDescription: '大地形・ケッペン気候区分・主要農畜産物＆資源統計の判別基準・世界地誌の急所を赤シートで整理します。',
    theme: {
      label: '地理総合・地理探究',
      accent: '#2E856E',
      accentSoft: '#BCE5D8',
      surface: '#F4FBF8',
      bubbleBorderClass: 'border-[#BCE5D8]/80',
      bubbleBgClass: 'bg-[#F8FEFC]/95',
      bubbleShadow: '0 10px 24px -14px rgba(46,133,110,0.55)',
      chipTextClass: 'text-[#216653]',
      chipBgClass: 'bg-[#BCE5D8]/35',
      progressBarClass: 'bg-[#45A188]',
    },
    reviewStyle: {
      textClass: 'text-[#216653]',
      bgClass: 'bg-[#BCE5D8]/25',
      borderClass: 'border-[#BCE5D8]',
      activeClass: 'bg-[#2E856E] text-white border-[#2E856E]',
      stripeClass: 'bg-[#2E856E]',
    },
  },
  {
    id: 'politics_econ',
    label: '公共・政治経済',
    shortLabel: '政治・経済',
    enabled: true,
    chapterIdPattern: /^pe\d+_\d+$/,
    entry: 'mode_selection',
    practiceDescription: '日本国憲法と重要判例・統治と選挙制度（ドント式計算）・市場機構と金融財政政策・国際経済と為替計算まで共通テスト頻出テーマを演習します。',
    learningDescription: '最高裁判例・国会と内閣の手続数字・日銀の金融政策・戦後日本経済史・国際機関の整理シートを収録しています。',
    theme: {
      label: '公共・政治経済',
      accent: '#C4762B',
      accentSoft: '#F2D6B8',
      surface: '#FDF9F3',
      bubbleBorderClass: 'border-[#F2D6B8]/80',
      bubbleBgClass: 'bg-[#FFFBF6]/95',
      bubbleShadow: '0 10px 24px -14px rgba(196,118,43,0.55)',
      chipTextClass: 'text-[#99581B]',
      chipBgClass: 'bg-[#F2D6B8]/35',
      progressBarClass: 'bg-[#DB8E42]',
    },
    reviewStyle: {
      textClass: 'text-[#99581B]',
      bgClass: 'bg-[#F2D6B8]/25',
      borderClass: 'border-[#F2D6B8]',
      activeClass: 'bg-[#C4762B] text-white border-[#C4762B]',
      stripeClass: 'bg-[#C4762B]',
    },
  },
  {
    id: 'ethics',
    label: '公共・倫理',
    shortLabel: '倫理',
    enabled: true,
    chapterIdPattern: /^et\d+_\d+$/,
    entry: 'mode_selection',
    practiceDescription: '源流思想（ギリシア・中国・インド）から西洋近現代思想・日本思想・生命環境情報倫理まで、原典読解・会話文考察問題を演習します。',
    learningDescription: '思想家ごとのキーワード・主著・対比構図（性善説vs性悪説、経験論vs合理論、功利主義vs義務論）を赤シートで暗記できます。',
    theme: {
      label: '公共・倫理',
      accent: '#734F96',
      accentSoft: '#DBCBE9',
      surface: '#F9F6FC',
      bubbleBorderClass: 'border-[#DBCBE9]/80',
      bubbleBgClass: 'bg-[#FCF9FE]/95',
      bubbleShadow: '0 10px 24px -14px rgba(115,79,150,0.55)',
      chipTextClass: 'text-[#583975]',
      chipBgClass: 'bg-[#DBCBE9]/35',
      progressBarClass: 'bg-[#8C68B0]',
    },
    reviewStyle: {
      textClass: 'text-[#583975]',
      bgClass: 'bg-[#DBCBE9]/25',
      borderClass: 'border-[#DBCBE9]',
      activeClass: 'bg-[#734F96] text-white border-[#734F96]',
      stripeClass: 'bg-[#734F96]',
    },
  },
] as const satisfies readonly SubjectDefinition[];

export type SubjectKey = (typeof SUBJECT_REGISTRY)[number]['id'];

export const SUBJECT_IDS: readonly SubjectKey[] = SUBJECT_REGISTRY.map((s) => s.id);

export const DEFAULT_SUBJECT: SubjectKey = SUBJECT_REGISTRY[0].id;

export function isSubjectKey(value: string | null | undefined): value is SubjectKey {
  return !!value && (SUBJECT_IDS as readonly string[]).includes(value);
}

export function subjectDefinitionOf(id: string | null | undefined): SubjectDefinition | undefined {
  return SUBJECT_REGISTRY.find((s) => s.id === id);
}

export function subjectOfChapterId(chapterId: string | null | undefined): SubjectKey | null {
  const id = (chapterId || '').trim();
  if (!id) return null;
  return SUBJECT_REGISTRY.find((s) => s.chapterIdPattern.test(id))?.id ?? null;
}
