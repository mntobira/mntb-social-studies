/**
 * ===================================================================
 * 歴史総合・世界史探究（world_history） — 大学入学共通テスト・私大・国公立完全網羅
 * ===================================================================
 * 全4部・18章・54小問（古代〜現代通史＋東西・イスラーム文化史＋ただよび名物テーマ史完全網羅）
 * 章ID接頭辞: wh（^wh\d+_\d+$）
 */
import { computeSocialSubjectStats } from './socialKit';
import { whPart1 } from './worldHistory/whPart1';
import { whPart2 } from './worldHistory/whPart2';
import { whPart3 } from './worldHistory/whPart3';
import { whPart4 } from './worldHistory/whPart4';

export const worldHistoryData = {
  parts: [whPart1, whPart2, whPart3, whPart4],
};

export function getWorldHistoryStats() {
  return computeSocialSubjectStats(worldHistoryData.parts);
}
