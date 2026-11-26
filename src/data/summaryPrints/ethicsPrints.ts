/**
 * ===================================================================
 * 公共・倫理 まとめプリント 全17単元 統合エクスポート
 * ===================================================================
 */
import type { SummaryPrintSheet } from './types';
import { ethicsPrintsPart1 } from './ethicsPrintsPart1';
import { ethicsPrintsPart2a } from './ethicsPrintsPart2a';
import { ethicsPrintsPart2b } from './ethicsPrintsPart2b';

export const ethicsPrints: SummaryPrintSheet[] = [
  ...ethicsPrintsPart1,
  ...ethicsPrintsPart2a,
  ...ethicsPrintsPart2b,
];
