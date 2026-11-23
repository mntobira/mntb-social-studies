/**
 * ===================================================================
 * 外部教科（本体に教科データを持たない教科）の登録簿
 * ===================================================================
 * 共通テスト社会科版では全5科目が src/data/subjects.ts に実体を持つため、外部教科は空にする。
 * ★このファイルは何も import しない（葉）★
 */

export interface ExternalSubject {
  id: string;
  label: string;
  accent: string;
  accentSoft: string;
  surface: string;
  bubbleBorderClass: string;
  bubbleBgClass: string;
  bubbleShadow: string;
  chipTextClass: string;
  chipBgClass: string;
  progressBarClass: string;
  chapters: readonly { id: string; title: string }[];
}

export const EXTERNAL_SUBJECTS: readonly ExternalSubject[] = [];

export function externalSubjectOf(id: string | null | undefined): ExternalSubject | undefined {
  if (!id) return undefined;
  return EXTERNAL_SUBJECTS.find((subject) => subject.id === id);
}

export function isExternalSubject(id: string | null | undefined): boolean {
  return externalSubjectOf(id) !== undefined;
}

export function externalChapterTitleOf(
  subjectId: string | null | undefined,
  chapterId: string | null | undefined,
): string | undefined {
  if (!chapterId) return undefined;
  const subject = externalSubjectOf(subjectId);
  if (!subject) return undefined;
  return subject.chapters.find((chapter) => chapter.id === chapterId)?.title;
}

export const BATTLE_ONLY_SUBJECTS: readonly string[] = [];

export function isBattleOnlySubject(id: string | null | undefined): boolean {
  return !!id && BATTLE_ONLY_SUBJECTS.includes(id);
}
