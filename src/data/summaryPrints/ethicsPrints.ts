/**
 * ===================================================================
 * 公共・倫理 まとめプリント 全17単元 統合エクスポート
 * ===================================================================
 * 基本パート（Part1 / Part2a / Part2b）に深掘り増補ページ（ethicsSupplement）を結合
 */
import type { SummaryPrintSheet } from './types';
import { ethicsPrintsPart1 } from './ethicsPrintsPart1';
import { ethicsPrintsPart2a } from './ethicsPrintsPart2a';
import { ethicsPrintsPart2b } from './ethicsPrintsPart2b';
import { ethicsSupplementPages } from './ethicsSupplement';

export const ethicsPrints: SummaryPrintSheet[] = [
  ...ethicsPrintsPart1,
  ...ethicsPrintsPart2a,
  ...ethicsPrintsPart2b,
].map((unit) => ({
  ...unit,
  pages: [...unit.pages, ...(ethicsSupplementPages[unit.chapterId] ?? [])],
}));
