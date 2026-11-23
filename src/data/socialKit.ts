/**
 * ===================================================================
 * 共通テスト社会科 問題データ作成キット v2（全5科目共通）
 * ===================================================================
 *
 * ■ 共通テスト研究を踏まえた品質設計（v2 アップグレード）
 *   1. 選択肢位置の決定的シャッフル（①〜④ の正解率を約25%ずつに均等配分）
 *      - 従来のデータでは正解が①に偏っていた（5科目73問中41問＝56%が①）。
 *      - 小問IDの FNV-1a ハッシュによって選択肢を再現可能（決定論的）に並べ替え、
 *        テスト・ビルド・全国対戦プール（gen-battle-pool）で常に同一の並びを保ちつつ
 *        ①②③④に偏りなく配分する。
 *      - 年代整序（Ⅰ→Ⅱ→Ⅲ 等）や X・Y 正誤組合せ（正・正／正・誤／誤・正／誤・誤）は
 *        受験生にとって定型の並び順が自然な場合があるため、preserveOrder または
 *        自動検出で並び順の整合性を保ちつつ、大問設計側でも正誤パターンを多様化する。
 *
 *   2. 小問別解説スライシング（<!--sq:id--> / <!--sqb--> / <!--sqall-->）完全対応
 *      - マナトビリスニングの Explanation.tsx / SubQuestionCard.tsx が用いる
 *        機械可読マーカーを自動出力し、スマホの正誤チップ（問1○ / 問2×）をタップした際に
 *        「その小問専用の解説＋なぜ他の選択肢が誤りか（消去法の根拠）」がピンポイントで開く。
 *
 *   3. 図表・グラフ・史料・小テスト（miniTest）対応
 *      - Problem.imageUrl / imageCaption で SVG 図版・統計図・地図を表示。
 *      - Problem.text / explanation 内の Markdown 表（|...|）は ExplanationBody が
 *        本物の HTML <table> として描画。
 */
import type { Chapter, Distractor, Part, Problem, SubQuestion } from '../types/curriculum';
import { SQ_BODY_MARK, SQ_MARK, SQ_SHARED_MARK } from '../utils/explanationSlices';
import { countProblemsInChapters } from './problemCount';

export interface SocialSubInput {
  id: string;
  /** 設問ラベル（対戦モードの単問プロンプトとしても機能するよう具体的な問いを書く） */
  label: string;
  /** 4択の本文（先頭に ①〜④ を自動で付与する） */
  choices: [string, string, string, string];
  /** 元の choices 配列における正解番号（1〜4） */
  answer: 1 | 2 | 3 | 4;
  /** true のとき choices の並び順を固定する（省略時は定型パターンを除き決定論的シャッフル） */
  preserveOrder?: boolean;
  /** 配点（既定 4点） */
  points?: number;
  /** 想定正答率（%） */
  rate?: number;
  /** 分野スキルタグ（結果画面の弱点分析で使用） */
  skill: string;
  /** 解法の型（例：'史料読解' / '年代整序' / '統計判別' / '正誤組合せ' / '地図・グラフ読解'） */
  solveType: string;
  /** 難易度 1〜5 */
  difficulty?: number;
  /** 思考ステップ（解説アコーディオンの「正解までの道すじ」に表示） */
  steps: string[];
  /** 1行まとめ解説（核心＆対戦リザルトの1行解説にも使われる） */
  oneLine: string;
  /**
   * 誤答肢の切り方（元の choices 配列の番号 1〜4 で指定するか、文字列配列3本で誤答順に指定）
   * シャッフル後の新しい番号（①〜④）に自動追従して変換する。
   */
  distractors?: { no: number; why: string; type?: string }[];
  /** 元の choices のうち誤答3つに対する理由（choices の誤答順に3つ並べれば自動で番号対応） */
  wrongReasons?: [string, string, string];
  /** 小問固有の詳細解説（省略時は steps と誤答分析から自動構成） */
  explanationBody?: string;
  /** 対戦時の制限時間（秒・既定 25秒） */
  battleTimeLimit?: number;
  /** 小問固有の図版URL（任意） */
  imageUrl?: string;
  imageCaption?: string;
}

export interface SocialProblemInput {
  id: string;
  category: string;
  /** 大問リード文（史料・会話文・Markdown統計表などを含む） */
  text: string;
  subQuestions: SocialSubInput[];
  /** 大問全体の総括解説（共通の背景・歴史的意義・出題の急所） */
  explanation: string;
  /** 周辺知識（解説下部の整理ボックス） */
  surroundingKnowledge: string[];
  /** 共通テスト深掘りテーマ */
  deepDiveTopics: string[];
  timeLimitSec?: number;
  /** 大問に付属する地図・グラフ・概念図（public/ 配下のパス） */
  imageUrl?: string;
  imageCaption?: string;
}

const CIRCLED = ['①', '②', '③', '④'] as const;

/** FNV-1a 32bit 決定論的ハッシュ */
function fnv1a32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** 24通りの順列テーブル */
const PERMS_4: readonly (readonly [number, number, number, number])[] = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1],
  [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
  [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0],
  [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0],
];

/**
 * 選択肢が「Ｘ：正　Ｙ：正 / 正・誤 / 誤・正 / 誤・誤」のような定型マトリクスか判定。
 * ただし選択肢位置の偏りを防ぐため、preserveOrder が明示された場合のみ固定し、
 * 通常はターゲット正解スロット（0〜3）へ決定論的に割り当てる。
 */
function pickPermutation(sqId: string, origAnswerIdx: number, preserveOrder?: boolean): readonly [number, number, number, number] {
  if (preserveOrder) return [0, 1, 2, 3];
  const h = fnv1a32(`mntb-social-v2:${sqId}`);
  const targetAnswerPos = h % 4; // 0, 1, 2, 3 に均等分散
  // perm[targetAnswerPos] === origAnswerIdx となる6通りの順列から1つ選ぶ
  const matching = PERMS_4.filter((p) => p[targetAnswerPos] === origAnswerIdx);
  return matching[(h >>> 3) % matching.length] ?? [0, 1, 2, 3];
}

/** 元テキスト中の丸数字（①②③④）が元の選択肢番号を指している場合、シャッフル後の丸数字へ置換しないよう選択肢内容ベースで記述を補う */
function buildSubSliceBody(
  sq: SocialSubInput,
  perm: readonly [number, number, number, number],
  remappedDistractors: Distractor[],
  correctCircled: string,
  correctChoiceBody: string,
): string {
  const lines: string[] = [];
  lines.push(`【正解の決め手】${correctCircled} ${correctChoiceBody}`);
  if (sq.explanationBody) {
    lines.push(sq.explanationBody.trim());
  } else {
    lines.push(sq.oneLine.trim());
  }

  if (remappedDistractors.length > 0) {
    lines.push('');
    lines.push('【選択肢ごとの正誤判定（消去法の根拠）】');
    const sorted = [...remappedDistractors].sort((a, b) => a.no - b.no);
    for (const d of sorted) {
      const cMark = CIRCLED[d.no - 1] ?? `(${d.no})`;
      const origIdx = perm[d.no - 1]!;
      const shortOpt = sq.choices[origIdx]!.length > 34
        ? `${sq.choices[origIdx]!.slice(0, 34)}…`
        : sq.choices[origIdx]!;
      lines.push(`・${cMark}（誤り：「${shortOpt}」）→ ${d.why}`);
    }
  }
  return lines.join('\n');
}

export function makeSocialProblem(input: SocialProblemInput): Problem {
  const subSlices: string[] = [];

  const subQuestions: SubQuestion[] = input.subQuestions.map((sq) => {
    const origAnsIdx = sq.answer - 1;
    // X・Y正誤マトリクスで steps 内に「よって②」等の番号直書きがある既存設問との整合性のため、
    // steps 内に丸数字の結論（よって①〜④ / したがって①〜④ / ①が誤り 等）が含まれ wrongReasons が未指定の場合は元の並びを保持
    const hasHardcodedCircledRef = !sq.wrongReasons && !sq.distractors && /[①②③④]/.test(sq.steps.join(' '));
    const perm = pickPermutation(sq.id, origAnsIdx, sq.preserveOrder || hasHardcodedCircledRef);

    const options = perm.map((origIdx, newIdx) => `${CIRCLED[newIdx]} ${sq.choices[origIdx]}`);
    const newAnsIdx = perm.indexOf(origAnsIdx);
    const correctAnswer = options[newAnsIdx]!;

    // 誤答理由のリマップ（元の番号 → 新しい番号 1..4）
    const origWrongIndices = [0, 1, 2, 3].filter((i) => i !== origAnsIdx);
    const reasonByOrigIdx = new Map<number, { why: string; type?: string }>();
    if (sq.distractors && sq.distractors.length > 0) {
      for (const d of sq.distractors) {
        reasonByOrigIdx.set(d.no - 1, { why: d.why, type: d.type });
      }
    } else if (sq.wrongReasons) {
      origWrongIndices.forEach((origIdx, wi) => {
        if (sq.wrongReasons?.[wi]) {
          reasonByOrigIdx.set(origIdx, { why: sq.wrongReasons[wi]! });
        }
      });
    }

    const remappedDistractors: Distractor[] = [];
    perm.forEach((origIdx, newIdx) => {
      if (origIdx === origAnsIdx) return;
      const found = reasonByOrigIdx.get(origIdx);
      if (found) {
        remappedDistractors.push({
          no: newIdx + 1,
          why: found.why,
          type: found.type,
        });
      }
    });

    const sliceBody = buildSubSliceBody(
      sq,
      perm,
      remappedDistractors,
      CIRCLED[newAnsIdx]!,
      sq.choices[origAnsIdx]!,
    );
    subSlices.push(`${SQ_MARK(sq.id)}${SQ_BODY_MARK}${sliceBody}`);

    return {
      id: sq.id,
      label: sq.label,
      type: 'multiple_choice',
      options,
      correctAnswer,
      optionTexts: perm.map((origIdx) => sq.choices[origIdx]!),
      correctAnswerRate: sq.rate ?? 62,
      examPoints: sq.points ?? 4,
      skill: sq.skill,
      oneLine: sq.oneLine,
      explainJa: sq.oneLine,
      battleTimeLimit: sq.battleTimeLimit ?? 25,
      distractors: remappedDistractors.length > 0 ? remappedDistractors : undefined,
      imageUrl: sq.imageUrl,
      imageCaption: sq.imageCaption,
      detailedExplanation: {
        theme: `${sq.skill} — ${sq.oneLine}`,
        type: sq.solveType,
        difficulty: sq.difficulty ?? 3,
        steps: sq.steps,
      },
    };
  });

  const structuredExplanation = [
    SQ_SHARED_MARK,
    input.explanation.trim(),
    ...subSlices,
  ].join('\n\n');

  return {
    id: input.id,
    category: input.category,
    text: input.text,
    subQuestions,
    explanation: structuredExplanation,
    surroundingKnowledge: input.surroundingKnowledge,
    deepDiveTopics: input.deepDiveTopics,
    timeLimitSec: input.timeLimitSec ?? 240,
    imageUrl: input.imageUrl,
    imageCaption: input.imageCaption,
  };
}

export function makeSocialChapter(params: {
  id: string;
  realTitle: string;
  abstractTitle: string;
  questionGroup: string;
  topics: string[];
  practiceProblems: Problem[];
  miniTest?: Problem[];
}): Chapter {
  return {
    id: params.id,
    realTitle: params.realTitle,
    abstractTitle: params.abstractTitle,
    title: params.abstractTitle,
    questionGroup: params.questionGroup,
    topics: params.topics,
    practiceProblems: params.practiceProblems,
    miniTest: params.miniTest ?? [],
  };
}

export function computeSocialSubjectStats(parts: Part[]) {
  const chapters = parts.flatMap((p) => p.chapters);
  const questions = countProblemsInChapters(chapters);
  const marks = chapters.reduce(
    (sum, c) =>
      sum +
      [...(c.practiceProblems || []), ...(c.miniTest || [])].reduce(
        (s, p) => s + (p.subQuestions?.length || 0),
        0,
      ),
    0,
  );
  return {
    chapters: chapters.length,
    units: chapters.length,
    questions,
    marks,
    points: 100,
  };
}
