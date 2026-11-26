/**
 * ===================================================================
 * カリキュラム・問題・赤シートプリント・図解SVG 整合性テスト
 * ===================================================================
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { jpHistoryData, getJpHistoryStats } from '../src/data/jpHistoryData';
import { worldHistoryData, getWorldHistoryStats } from '../src/data/worldHistoryData';
import { ethicsData, getEthicsStats } from '../src/data/ethicsData';
import { politicsEconData, getPoliticsEconStats } from '../src/data/politicsEconData';
import { geographyData, getGeographyStats } from '../src/data/geographyData';
import { SUBJECT_INDEX } from '../src/data/chapterIndex.generated';
import { SUMMARY_PRINTS, getSummaryPrintsBySubject } from '../src/data/summaryPrintsData';
import { subjectDefinitionOf, type SubjectKey } from '../src/data/subjects';
import type { Part } from '../src/types/curriculum';

const PUBLIC_DIR = resolve(process.cwd(), 'public');

function verifySubjectCurriculum(params: {
  subject: SubjectKey;
  parts: Part[];
  expectedParts: number;
  expectedChapters: number;
  expectedMarks: number;
  actualMarks: number;
}) {
  const { subject, parts, expectedParts, expectedChapters, expectedMarks, actualMarks } = params;
  expect(parts.length).toBe(expectedParts);
  const chapters = parts.flatMap((p) => p.chapters);
  expect(chapters.length).toBe(expectedChapters);

  const chapterIds = new Set<string>();
  const subIds = new Set<string>();
  const idPattern = subjectDefinitionOf(subject)!.chapterIdPattern;

  for (const ch of chapters) {
    expect(idPattern.test(ch.id)).toBe(true);
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

  expect(actualMarks).toBe(expectedMarks);
}

describe('社会科全5科目（日本史・世界史・地理・倫理・政経）の完全網羅・データ整合性', () => {
  it('日本史探究（jp_history）は全4編・18章・54小問すべてが一意なID・妥当な4択・図版・解説をもつ', () => {
    verifySubjectCurriculum({
      subject: 'jp_history',
      parts: jpHistoryData.parts,
      expectedParts: 4,
      expectedChapters: 18,
      expectedMarks: 54,
      actualMarks: getJpHistoryStats().marks,
    });
  });

  it('世界史探究（world_history）は全4編・18章・54小問すべてが一意なID・妥当な4択・図版・解説をもつ', () => {
    verifySubjectCurriculum({
      subject: 'world_history',
      parts: worldHistoryData.parts,
      expectedParts: 4,
      expectedChapters: 18,
      expectedMarks: 54,
      actualMarks: getWorldHistoryStats().marks,
    });
  });

  it('倫理（ethics）は全4編・17章・51小問すべてが一意なID・妥当な4択・解説をもつ', () => {
    verifySubjectCurriculum({
      subject: 'ethics',
      parts: ethicsData.parts,
      expectedParts: 4,
      expectedChapters: 17,
      expectedMarks: 51,
      actualMarks: getEthicsStats().marks,
    });
  });

  it('政治・経済（politics_econ）は全4編・16章・48小問すべてが一意なID・妥当な4択・解説をもつ', () => {
    verifySubjectCurriculum({
      subject: 'politics_econ',
      parts: politicsEconData.parts,
      expectedParts: 4,
      expectedChapters: 16,
      expectedMarks: 48,
      actualMarks: getPoliticsEconStats().marks,
    });
  });

  it('地理探究（geography）は全4編・16章・48小問すべてが一意なID・妥当な4択・図版・解説をもつ', () => {
    verifySubjectCurriculum({
      subject: 'geography',
      parts: geographyData.parts,
      expectedParts: 4,
      expectedChapters: 16,
      expectedMarks: 48,
      actualMarks: getGeographyStats().marks,
    });
  });

  it('生成済み SUBJECT_INDEX（全85章）と1画面ページ送りまとめプリント（全85単元・1対1対応）および図表SVG参照がすべて有効である', () => {
    const allIndexedIds = new Set<string>();
    for (const subj of SUBJECT_INDEX) {
      for (const ch of subj.chapters) {
        allIndexedIds.add(ch.id);
      }
    }

    expect(allIndexedIds.size).toBe(85);
    expect(SUMMARY_PRINTS.length).toBe(85);
    expect(getSummaryPrintsBySubject('jp_history').length).toBe(18);
    expect(getSummaryPrintsBySubject('world_history').length).toBe(18);
    expect(getSummaryPrintsBySubject('geography').length).toBe(16);
    expect(getSummaryPrintsBySubject('politics_econ').length).toBe(16);
    expect(getSummaryPrintsBySubject('ethics').length).toBe(17);

    const sheetIds = new Set<string>();
    const coveredChapters = new Set<string>();

    for (const sheet of SUMMARY_PRINTS) {
      expect(sheetIds.has(sheet.id)).toBe(false);
      sheetIds.add(sheet.id);
      expect(allIndexedIds.has(sheet.chapterId)).toBe(true);
      expect(coveredChapters.has(sheet.chapterId)).toBe(false);
      coveredChapters.add(sheet.chapterId);
      expect(sheet.pages.length).toBeGreaterThanOrEqual(2);

      const allPageText = sheet.pages
        .flatMap((pg) => [
          pg.lead ?? '',
          ...(pg.blocks ?? []).flatMap((b) => b.lines),
          ...(pg.table?.rows.flat() ?? []),
          pg.pointBox?.body ?? '',
        ])
        .join('\n');

      const maskedTokens = allPageText.match(/\{\{[^}]+\}\}/g);
      expect((maskedTokens ?? []).length).toBeGreaterThanOrEqual(4);

      for (const pg of sheet.pages) {
        for (const fig of pg.figures ?? []) {
          const figPath = resolve(PUBLIC_DIR, fig.src.replace(/^\//, ''));
          expect(existsSync(figPath)).toBe(true);
        }
      }
    }

    expect(coveredChapters.size).toBe(85);
  });
});
