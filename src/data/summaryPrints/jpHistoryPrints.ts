/**
 * ===================================================================
 * 歴史総合・日本史探究 まとめプリント（全18単元 統合エクスポート）
 * ===================================================================
 * 基本パート（Part1 / Part2a / Part2b）に深掘り増補ページ（jpHistorySupplement）を結合
 */
import type { SummaryPrintSheet } from './types';
import { jpHistoryPrintsPart1 } from './jpHistoryPrintsPart1';
import { jpHistoryPrintsPart2a } from './jpHistoryPrintsPart2a';
import { jpHistoryPrintsPart2b } from './jpHistoryPrintsPart2b';
import { jpHistorySupplementPages } from './jpHistorySupplement';

export const jpHistoryPrints: readonly SummaryPrintSheet[] = [
  ...jpHistoryPrintsPart1,
  ...jpHistoryPrintsPart2a,
  ...jpHistoryPrintsPart2b,
].map((unit) => ({
  ...unit,
  pages: [...unit.pages, ...(jpHistorySupplementPages[unit.chapterId] ?? [])],
}));
