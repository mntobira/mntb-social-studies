/**
 * ===================================================================
 * battleRules — 共通テスト社会科5科目の対戦ルール（既定値）
 * ===================================================================
 * ★このファイルは他の src を一切 import しない（葉モジュール）。★
 */
import type { BattleAnswerFormat, BattleRule } from './types';

const BASE: Omit<BattleRule, 'subject'> = {
  enabled: true,
  questionCount: 10,
  timeLimitOverride: 28,
  pointsCorrect: 100,
  pointsSpeedMax: 50,
  pointsStreak: 15,
  tiebreak: 'time',
  formats: ['choice4', 'choice', 'kana'],
  kanaShare: 0,
  note: '',
};

const SOCIAL_SUBJECTS = ['jp_history', 'world_history', 'geography', 'politics_econ', 'ethics'] as const;

export const BATTLE_RULES: Readonly<Record<string, BattleRule>> = {
  jp_history: {
    ...BASE,
    subject: 'jp_history',
    note: '史料・年代整序・組合せ4択',
  },
  world_history: {
    ...BASE,
    subject: 'world_history',
    note: '横のつながり・条約・年代整序4択',
  },
  geography: {
    ...BASE,
    subject: 'geography',
    note: '地形防災・気候・統計判別4択',
  },
  politics_econ: {
    ...BASE,
    subject: 'politics_econ',
    timeLimitOverride: 32,
    note: '判例・統治・金融財政・為替ドント計算',
  },
  ethics: {
    ...BASE,
    subject: 'ethics',
    note: '源流思想・日本思想・西洋近現代・応用倫理',
  },
};

export function defaultRuleOf(subject: string): BattleRule {
  const found = BATTLE_RULES[subject];
  if (found) return found;
  return { ...BASE, subject, enabled: false, note: '' };
}

export function defaultEnabledSubjects(): string[] {
  return Object.values(BATTLE_RULES)
    .filter((r) => r.enabled)
    .map((r) => r.subject);
}

export function normalizeRule(subject: string, raw: unknown): BattleRule {
  const base = defaultRuleOf(subject);
  if (!(SOCIAL_SUBJECTS as readonly string[]).includes(subject)) return base;
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;

  const num = (v: unknown, fallback: number, min: number, max: number): number => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return fallback;
    return Math.min(max, Math.max(min, Math.round(v)));
  };

  const formats: BattleAnswerFormat[] = Array.isArray(r.formats)
    ? (r.formats.filter(
        (f): f is BattleAnswerFormat =>
          f === 'choice4' || f === 'choice' || f === 'kana' || f === 'word' || f === 'panel',
      ) as BattleAnswerFormat[])
    : base.formats;

  const kanaShare: number =
    typeof r.kanaShare === 'number' && Number.isFinite(r.kanaShare)
      ? Math.min(1, Math.max(0, r.kanaShare))
      : base.kanaShare;

  return {
    ...(r.scoringVersion === 2 ? { scoringVersion: 2 as const } : {}),
    subject,
    enabled: typeof r.enabled === 'boolean' ? r.enabled : base.enabled,
    questionCount: num(r.questionCount, base.questionCount, 3, 20),
    timeLimitOverride:
      r.timeLimitOverride === null
        ? null
        : typeof r.timeLimitOverride === 'number'
          ? num(r.timeLimitOverride, 25, 5, 120)
          : base.timeLimitOverride,
    pointsCorrect: num(r.pointsCorrect, base.pointsCorrect, 1, 1000),
    pointsSpeedMax: num(r.pointsSpeedMax, base.pointsSpeedMax, 0, 500),
    pointsStreak: num(r.pointsStreak, base.pointsStreak, 0, 200),
    tiebreak:
      r.tiebreak === 'time' || r.tiebreak === 'sudden' || r.tiebreak === 'draw'
        ? r.tiebreak
        : base.tiebreak,
    formats: formats.length > 0 ? formats : base.formats,
    kanaShare,
    note: typeof r.note === 'string' ? r.note.slice(0, 120) : base.note,
  };
}
