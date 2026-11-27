/**
 * ===================================================================
 * 地理総合・地理探究（geography） — 大学入学共通テスト完全攻略（全4編・16章・全144小問マーク演習）
 * ===================================================================
 * 章ID接頭辞: ge（^ge\d+_\d+$）
 */
import type { Part, Problem } from '../types/curriculum';
import { computeSocialSubjectStats } from './socialKit';
import { geoPart1 } from './geography/geoPart1';
import { geoPart2 } from './geography/geoPart2';
import { geoPart3 } from './geography/geoPart3';
import { geoPart4 } from './geography/geoPart4';
import { geoExtraP1P2 } from './geography/geoExtraP1P2';
import { geoExtraP3P4 } from './geography/geoExtraP3P4';

const extraGeoProblemsByChapter: Record<string, Problem[]> = {
  ...geoExtraP1P2,
  ...geoExtraP3P4,
};

function withExtraGeoProblems(part: Part): Part {
  return {
    ...part,
    chapters: part.chapters.map((ch) => ({
      ...ch,
      practiceProblems: [
        ...ch.practiceProblems,
        ...(extraGeoProblemsByChapter[ch.id] ?? []),
      ],
    })),
  };
}

export const geographyData = {
  parts: [geoPart1, geoPart2, geoPart3, geoPart4].map(withExtraGeoProblems),
};

export function getGeographyStats() {
  return computeSocialSubjectStats(geographyData.parts);
}
