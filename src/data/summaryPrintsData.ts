/**
 * ===================================================================
 * 共通テスト社会科 赤シート・1画面ページ送り まとめプリントデータ（全5科目・全85単元）
 * ===================================================================
 * - 歴史総合・日本史探究 : 全18単元（jh1_1〜jh4_3）
 * - 歴史総合・世界史探究 : 全18単元（wh1_1〜wh4_3）
 * - 地理総合・地理探究   : 全16単元（ge1_1〜ge4_4）
 * - 公共・政治経済       : 全16単元（pe1_1〜pe4_3）
 * - 公共・倫理           : 全17単元（et1_1〜et4_4）
 * 合計 85単元（すべての演習チャプターIDに1対1対応）
 */
import type { SubjectKey } from './subjects';
import type { SummaryPrintSheet } from './summaryPrints/types';
import { jpHistoryPrints } from './summaryPrints/jpHistoryPrints';
import { worldHistoryPrints } from './summaryPrints/worldHistoryPrints';
import { geographyPrints } from './summaryPrints/geographyPrints';
import { politicsEconPrints } from './summaryPrints/politicsEconPrints';
import { ethicsPrints } from './summaryPrints/ethicsPrints';

export type { SummaryPrintSheet, SummaryPrintPage, PrintFlowBlock, PrintOxItem, PrintFigure } from './summaryPrints/types';

export const SUMMARY_PRINTS: readonly SummaryPrintSheet[] = [
  ...jpHistoryPrints,
  ...worldHistoryPrints,
  ...geographyPrints,
  ...politicsEconPrints,
  ...ethicsPrints,
];

const PRINTS_BY_SUBJECT: Record<SubjectKey, readonly SummaryPrintSheet[]> = {
  jp_history: jpHistoryPrints,
  world_history: worldHistoryPrints,
  geography: geographyPrints,
  politics_econ: politicsEconPrints,
  ethics: ethicsPrints,
};

export function getSummaryPrintsBySubject(subject: SubjectKey): SummaryPrintSheet[] {
  return [...(PRINTS_BY_SUBJECT[subject] ?? [])];
}
