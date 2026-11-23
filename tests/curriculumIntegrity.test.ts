/**
 * ===================================================================
 * カリキュラム・問題・赤シートプリント・図解SVG 整合性テスト
 * ===================================================================
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ethicsData, getEthicsStats } from '../src/data/ethicsData';
import { politicsEconData, getPoliticsEconStats } from '../src/data/politicsEconData';
import { SUBJECT_INDEX } from '../src/data/chapterIndex.generated';
import { SUMMARY_PRINTS, getSummaryPrintsBySubject } from '../src/data/summaryPrintsData';
import { subjectDefinitionOf } from '../src/data/subjects';

const PUBLIC_DIR = resolve(process.cwd(), 'public');

describe('公共・倫理（ethics）と公共・政治経済（politics_econ）の完全網羅・データ整合性', () => {
  it('倫理は全4編・17章・51小問すべてが一意なID・妥当な4択・解説をもつ', () => {
    expect(ethicsData.parts.length).toBe(4);
    const chapters = ethicsData.parts.flatMap((p) => p.chapters);
    expect(chapters.length).toBe(17);

    const chapterIds = new Set<string>();
    const subIds = new Set<string>();
    const ethicsPattern = subjectDefinitionOf('ethics')!.chapterIdPattern;

    for (const ch of chapters) {
      expect(ethicsPattern.test(ch.id)).toBe(true);
      expect(chapterIds.has(ch.id)).toBe(false);
      chapterIds.add(ch.id);
      expect(ch.practiceProblems.length).toBeGreaterThanOrEqual(1);

      for (const prob of ch.practiceProblems) {
        if (prob.imageUrl) {
          const figPath = resolve(PUBLIC_DIR, prob.imageUrl.replace(/^\//, ''));
          expect(existsSync(figPath)).toBe(true);
        }
        expect(prob.explanation).toContain('<!--sqall-->');
        for (const sq of prob.subQuestions) {
          expect(subIds.has(sq.id)).toBe(false);
          subIds.add(sq.id);
          expect(sq.options?.length).toBe(4);
          expect(new Set(sq.optionTexts).size).toBe(4);
          expect(sq.options).toContain(sq.correctAnswer);
          expect(/^[①②③④]\s/.test(sq.correctAnswer)).toBe(true);
          expect(prob.explanation).toContain(`<!--sq:${sq.id}-->`);
        }
      }
    }

    const stats = getEthicsStats();
    expect(stats.marks).toBe(51);
  });

  it('政治・経済は全4編・16章・48小問すべてが一意なID・妥当な4択・解説をもつ', () => {
    expect(politicsEconData.parts.length).toBe(4);
    const chapters = politicsEconData.parts.flatMap((p) => p.chapters);
    expect(chapters.length).toBe(16);

    const chapterIds = new Set<string>();
    const subIds = new Set<string>();
    const pePattern = subjectDefinitionOf('politics_econ')!.chapterIdPattern;

    for (const ch of chapters) {
      expect(pePattern.test(ch.id)).toBe(true);
      expect(chapterIds.has(ch.id)).toBe(false);
      chapterIds.add(ch.id);
      expect(ch.practiceProblems.length).toBeGreaterThanOrEqual(1);

      for (const prob of ch.practiceProblems) {
        if (prob.imageUrl) {
          const figPath = resolve(PUBLIC_DIR, prob.imageUrl.replace(/^\//, ''));
          expect(existsSync(figPath)).toBe(true);
        }
        expect(prob.explanation).toContain('<!--sqall-->');
        for (const sq of prob.subQuestions) {
          expect(subIds.has(sq.id)).toBe(false);
          subIds.add(sq.id);
          expect(sq.options?.length).toBe(4);
          expect(new Set(sq.optionTexts).size).toBe(4);
          expect(sq.options).toContain(sq.correctAnswer);
          expect(/^[①②③④]\s/.test(sq.correctAnswer)).toBe(true);
          expect(prob.explanation).toContain(`<!--sq:${sq.id}-->`);
        }
      }
    }

    const stats = getPoliticsEconStats();
    expect(stats.marks).toBe(48);
  });

  it('生成済み SUBJECT_INDEX と赤シートまとめプリントの chapterId 参照がすべて有効である', () => {
    const allIndexedIds = new Set<string>();
    for (const subj of SUBJECT_INDEX) {
      for (const ch of subj.chapters) {
        allIndexedIds.add(ch.id);
      }
    }

    expect(getSummaryPrintsBySubject('ethics').length).toBe(4);
    expect(getSummaryPrintsBySubject('politics_econ').length).toBe(6);

    for (const sheet of SUMMARY_PRINTS) {
      expect(allIndexedIds.has(sheet.chapterId)).toBe(true);
      const maskedTokens = sheet.sections
        .flatMap((s) => [...s.bullets, ...(s.table?.rows.flat() ?? [])])
        .join('\n')
        .match(/\{\{[^}]+\}\}/g);
      expect((maskedTokens ?? []).length).toBeGreaterThanOrEqual(5);
    }
  });
});
