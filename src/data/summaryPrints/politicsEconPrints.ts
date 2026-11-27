/**
 * ===================================================================
 * 公共・政治経済 まとめプリント 全16単元 統合エクスポート
 * ===================================================================
 * 基本パート（Part1 / Part2）に深掘り増補ページ（politicsEconSupplement）を結合
 */
import type { SummaryPrintSheet } from './types';
import { politicsEconPrintsPart1 } from './politicsEconPrintsPart1';
import { politicsEconPrintsPart2 } from './politicsEconPrintsPart2';
import { politicsEconSupplementPages } from './politicsEconSupplement';

export const politicsEconPrints: SummaryPrintSheet[] = [
  ...politicsEconPrintsPart1,
  ...politicsEconPrintsPart2,
].map((unit) => ({
  ...unit,
  pages: [...unit.pages, ...(politicsEconSupplementPages[unit.chapterId] ?? [])],
}));
