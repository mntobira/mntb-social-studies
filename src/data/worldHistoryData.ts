/**
 * ===================================================================
 * 歴史総合・世界史探究（world_history） — 大学入学共通テスト完全網羅版
 * ===================================================================
 * 全4部・18章・54大問・162小問（全問4択マーク形式・記述問題ゼロ）
 * 章ID接頭辞: wh（^wh\d+_\d+$）
 */
import type { Part, Problem } from '../types/curriculum';
import { computeSocialSubjectStats } from './socialKit';
import { whPart1 } from './worldHistory/whPart1';
import { whPart2 } from './worldHistory/whPart2';
import { whPart3 } from './worldHistory/whPart3';
import { whPart4 } from './worldHistory/whPart4';
import { whExtraP1 } from './worldHistory/whExtraP1';
import { whExtraP2 } from './worldHistory/whExtraP2';
import { whExtraP3 } from './worldHistory/whExtraP3';
import { whExtraP4 } from './worldHistory/whExtraP4';

const extraProblemsByChapter: Record<string, Problem[]> = {
  ...whExtraP1,
  ...whExtraP2,
  ...whExtraP3,
  ...whExtraP4,
};

function mergeExtraProblems(part: Part): Part {
  return {
    ...part,
    chapters: part.chapters.map((ch) => ({
      ...ch,
      practiceProblems: [...ch.practiceProblems, ...(extraProblemsByChapter[ch.id] ?? [])],
    })),
  };
}

export const worldHistoryData = {
  parts: [whPart1, whPart2, whPart3, whPart4].map(mergeExtraProblems),
};

export function getWorldHistoryStats() {
  return computeSocialSubjectStats(worldHistoryData.parts);
}
