/**
 * ===================================================================
 * 地理総合・地理探究（geography） — 大学入学共通テスト完全攻略（全4編・16章）
 * ===================================================================
 * 章ID接頭辞: ge（^ge\d+_\d+$）
 */
import { computeSocialSubjectStats } from './socialKit';
import { geoPart1 } from './geography/geoPart1';
import { geoPart2 } from './geography/geoPart2';
import { geoPart3 } from './geography/geoPart3';
import { geoPart4 } from './geography/geoPart4';

export const geographyData = {
  parts: [geoPart1, geoPart2, geoPart3, geoPart4],
};

export function getGeographyStats() {
  return computeSocialSubjectStats(geographyData.parts);
}
