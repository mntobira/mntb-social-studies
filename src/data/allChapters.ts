/**
 * ===================================================================
 * 教科データの入口（章の一覧・章の検索）— 共通テスト社会科5科目
 * ===================================================================
 */

import { jpHistoryData } from './jpHistoryData';
import { worldHistoryData } from './worldHistoryData';
import { geographyData } from './geographyData';
import { politicsEconData } from './politicsEconData';
import { ethicsData } from './ethicsData';
import type { Chapter, Part, Problem } from '../types/curriculum';
import { SUBJECT_REGISTRY, type SubjectKey } from './subjects';
export type { SubjectKey } from './subjects';

interface PartsLike {
  parts: Part[];
}

interface SubjectEntry {
  id: SubjectKey;
  label: string;
  data: PartsLike;
}

const SUBJECT_DATA: Record<SubjectKey, PartsLike> = {
  jp_history: jpHistoryData,
  world_history: worldHistoryData,
  geography: geographyData,
  politics_econ: politicsEconData,
  ethics: ethicsData,
};

export const SUBJECTS: readonly SubjectEntry[] = SUBJECT_REGISTRY.map((s) => ({
  id: s.id,
  label: s.label,
  data: SUBJECT_DATA[s.id],
}));

function flattenChapters(data: PartsLike): Chapter[] {
  return (data.parts || []).flatMap((part) => part.chapters || []);
}

const chaptersBySubject = new Map<SubjectKey, Chapter[]>();

export function getChaptersOfSubject(subjectId: string | null | undefined): Chapter[] {
  const entry = SUBJECTS.find((subject) => subject.id === subjectId) ?? SUBJECTS[0];
  const cached = chaptersBySubject.get(entry.id);
  if (cached) return cached;
  const chapters = flattenChapters(entry.data);
  chaptersBySubject.set(entry.id, chapters);
  return chapters;
}

export function getPartsOfSubject(subjectId: string | null | undefined): Part[] {
  const entry = SUBJECTS.find((subject) => subject.id === subjectId) ?? SUBJECTS[0];
  return entry.data.parts || [];
}

let cachedChapters: Chapter[] | null = null;

function getAllChapters(): Chapter[] {
  if (cachedChapters) return cachedChapters;
  cachedChapters = SUBJECTS.flatMap((subject) => getChaptersOfSubject(subject.id));
  return cachedChapters;
}

export function findChapterById(chapterId: string | null | undefined): Chapter | undefined {
  if (!chapterId) return undefined;
  return getAllChapters().find((chapter) => chapter.id === chapterId);
}

export function miniTestProblemsOf(chapter: Pick<Chapter, 'miniTest'> | null | undefined): Problem[] {
  const mini: unknown = chapter?.miniTest;
  if (Array.isArray(mini)) return mini as Problem[];
  return (mini as { problems?: Problem[] } | undefined)?.problems || [];
}
