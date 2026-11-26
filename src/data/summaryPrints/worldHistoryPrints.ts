/**
 * ===================================================================
 * 歴史総合・世界史探究 まとめプリント（全18単元 統合エクスポート）
 * ===================================================================
 */
import type { SummaryPrintSheet } from './types';
import { worldHistoryPrintsPart1 } from './worldHistoryPrintsPart1';
import { worldHistoryPrintsPart2a } from './worldHistoryPrintsPart2a';
import { worldHistoryPrintsPart2b } from './worldHistoryPrintsPart2b';

export const worldHistoryPrints: readonly SummaryPrintSheet[] = [
  ...worldHistoryPrintsPart1,
  ...worldHistoryPrintsPart2a,
  ...worldHistoryPrintsPart2b,
];
