/**
 * ===================================================================
 * 公共・政治経済（politics_econ） — 大学入学共通テスト完全攻略（全4編・16章・全144小問マーク演習）
 * ===================================================================
 * 章ID接頭辞: pe（^pe\d+_\d+$）
 */
import type { Part, Problem } from '../types/curriculum';
import { computeSocialSubjectStats } from './socialKit';
import { politicsEconPart1 } from './politicsEcon/pePart1';
import { pePart2 } from './politicsEcon/pePart2';
import { pePart3 } from './politicsEcon/pePart3';
import { pePart4 } from './politicsEcon/pePart4';
import { peExtraP1 } from './politicsEcon/peExtraP1';
import { peExtraP2 } from './politicsEcon/peExtraP2';
import { peExtraP3P4 } from './politicsEcon/peExtraP3P4';

const extraPeProblemsByChapter: Record<string, Problem[]> = {
  ...peExtraP1,
  ...peExtraP2,
  ...peExtraP3P4,
};

function withExtraPeProblems(part: Part): Part {
  return {
    ...part,
    chapters: part.chapters.map((ch) => ({
      ...ch,
      practiceProblems: [
        ...ch.practiceProblems,
        ...(extraPeProblemsByChapter[ch.id] ?? []),
      ],
    })),
  };
}

export const politicsEconData = {
  parts: [politicsEconPart1, pePart2, pePart3, pePart4].map(withExtraPeProblems),
};

export function getPoliticsEconStats() {
  return computeSocialSubjectStats(politicsEconData.parts);
}
