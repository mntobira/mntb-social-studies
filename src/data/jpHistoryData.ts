/**
 * ===================================================================
 * 歴史総合・日本史探究（jp_history） — 大学入学共通テスト・私大・国公立完全網羅
 * ===================================================================
 * 全4部・18章・54小問（原始・古代〜現代＋文化史総整理＋テーマ史ファイナルチェック）
 * 章ID接頭辞: jh（^jh\d+_\d+$）
 */
import { computeSocialSubjectStats } from './socialKit';
import { jhPart1 } from './jpHistory/jhPart1';
import { jhPart2 } from './jpHistory/jhPart2';
import { jhPart3 } from './jpHistory/jhPart3';
import { jhPart4 } from './jpHistory/jhPart4';

export const jpHistoryData = {
  parts: [jhPart1, jhPart2, jhPart3, jhPart4],
};

export function getJpHistoryStats() {
  return computeSocialSubjectStats(jpHistoryData.parts);
}
