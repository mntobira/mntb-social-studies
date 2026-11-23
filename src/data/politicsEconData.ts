/**
 * ===================================================================
 * 公共・政治経済（politics_econ） — 大学入学共通テスト完全攻略（全4編・16章）
 * ===================================================================
 * 章ID接頭辞: pe（^pe\d+_\d+$）
 */
import { computeSocialSubjectStats } from './socialKit';
import { politicsEconPart1 } from './politicsEcon/pePart1';
import { pePart2 } from './politicsEcon/pePart2';
import { pePart3 } from './politicsEcon/pePart3';
import { pePart4 } from './politicsEcon/pePart4';

export const politicsEconData = {
  parts: [politicsEconPart1, pePart2, pePart3, pePart4],
};

export function getPoliticsEconStats() {
  return computeSocialSubjectStats(politicsEconData.parts);
}
