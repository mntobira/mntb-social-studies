/**
 * ===================================================================
 * 歴史総合・日本史探究 まとめプリント（全18単元 統合エクスポート）
 * ===================================================================
 */
import type { SummaryPrintSheet } from './types';
import { jpHistoryPrintsPart1 } from './jpHistoryPrintsPart1';
import { jpHistoryPrintsPart2a } from './jpHistoryPrintsPart2a';
import { jpHistoryPrintsPart2b } from './jpHistoryPrintsPart2b';

export const jpHistoryPrints: readonly SummaryPrintSheet[] = [
  ...jpHistoryPrintsPart1,
  ...jpHistoryPrintsPart2a,
  ...jpHistoryPrintsPart2b,
];
