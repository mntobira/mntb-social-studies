/**
 * ===================================================================
 * 公共・政治経済 まとめプリント 全16単元 統合エクスポート
 * ===================================================================
 */
import type { SummaryPrintSheet } from './types';
import { politicsEconPrintsPart1 } from './politicsEconPrintsPart1';
import { politicsEconPrintsPart2 } from './politicsEconPrintsPart2';

export const politicsEconPrints: SummaryPrintSheet[] = [
  ...politicsEconPrintsPart1,
  ...politicsEconPrintsPart2,
];
