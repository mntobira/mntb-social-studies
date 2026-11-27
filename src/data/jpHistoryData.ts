/**
 * ===================================================================
 * 歴史総合・日本史探究（jp_history） — 大学入学共通テスト完全網羅版
 * ===================================================================
 * 全4部・18章・72大問・216小問（全問4択マーク形式・記述問題ゼロ）
 * 章ID接頭辞: jh（^jh\d+_\d+$）
 */
import type { Part, Problem } from '../types/curriculum';
import { computeSocialSubjectStats } from './socialKit';
import { jhPart1 } from './jpHistory/jhPart1';
import { jhPart2 } from './jpHistory/jhPart2';
import { jhPart3 } from './jpHistory/jhPart3';
import { jhPart4 } from './jpHistory/jhPart4';
import { jhExtraP1P2 } from './jpHistory/jhExtraP1P2';
import { jhExtraP3P4 } from './jpHistory/jhExtraP3P4';
import { jhExtraP4A } from './jpHistory/jhExtraP4A';
import { jhExtraP4B } from './jpHistory/jhExtraP4B';

const extraWave1ByChapter: Record<string, Problem[]> = {
  ...jhExtraP1P2,
  ...jhExtraP3P4,
};

const extraWave2ByChapter: Record<string, Problem[]> = {
  ...jhExtraP4A,
  ...jhExtraP4B,
};

function mergeExtraProblems(part: Part): Part {
  return {
    ...part,
    chapters: part.chapters.map((ch) => ({
      ...ch,
      practiceProblems: [
        ...ch.practiceProblems,
        ...(extraWave1ByChapter[ch.id] ?? []),
        ...(extraWave2ByChapter[ch.id] ?? []),
      ],
    })),
  };
}

export const jpHistoryData = {
  parts: [jhPart1, jhPart2, jhPart3, jhPart4].map(mergeExtraProblems),
};

export function getJpHistoryStats() {
  return computeSocialSubjectStats(jpHistoryData.parts);
}
