/**
 * 地理総合・地理探究 まとめプリント全16単元（ge1_1〜ge4_4 完全対応）
 */
import type { SummaryPrintSheet } from './types';
import { geographyPrintsPart1 } from './geographyPrintsPart1';
import { geographyPrintsPart2 } from './geographyPrintsPart2';

export const geographyPrints: SummaryPrintSheet[] = [
  ...geographyPrintsPart1,
  ...geographyPrintsPart2,
];
