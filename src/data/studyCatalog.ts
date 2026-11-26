/**
 * 共通テスト社会科 学習カタログ（データ駆動）
 * ホーム ─「演習する」→ ［科目を選ぶ（5科目）］→［演習問題／まとめプリント（赤シート）］→ 単元一覧・演習
 */
import { getSubjectStats } from './chapterIndex.generated';
import { SUBJECT_REGISTRY } from './subjects';
import { getSummaryPrintsBySubject } from './summaryPrintsData';

export type StudyAction =
  | { kind: 'units'; subject: string }
  | { kind: 'learning'; subject: string };

export type StudyIcon = 'headphones' | 'pen' | 'letters' | 'book' | 'flask' | 'sigma' | 'globe' | 'briefcase';

export interface StudyContent {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: StudyIcon;
  primary?: boolean;
  section?: 'practice' | 'memorize' | 'spotlight';
  progressSubject?: string;
  badge?: string;
  action: StudyAction;
}

export interface StudySubject {
  id: string;
  label: string;
  description: string;
  icon: StudyIcon;
  contents: StudyContent[];
}

const SUBJECT_ICON: Record<string, StudyIcon> = {
  jp_history: 'book',
  world_history: 'globe',
  geography: 'globe',
  politics_econ: 'briefcase',
  ethics: 'pen',
};

export const STUDY_CATALOG: readonly StudySubject[] = SUBJECT_REGISTRY.map((s) => {
  const stats = getSubjectStats(s.id);
  const prints = getSummaryPrintsBySubject(s.id);
  const totalPages = prints.reduce((acc, p) => acc + p.pages.length, 0);
  const totalFigs = prints.reduce(
    (acc, p) => acc + p.pages.reduce((sum, pg) => sum + (pg.figures?.length ?? 0), 0),
    0,
  );
  return {
    id: s.id,
    label: s.label,
    description: s.practiceDescription,
    icon: SUBJECT_ICON[s.id] ?? 'book',
    contents: [
      {
        id: `${s.id}_practice`,
        title: `${s.shortLabel} 共通テスト実戦演習`,
        primary: true,
        icon: SUBJECT_ICON[s.id] ?? 'pen',
        description: s.practiceDescription,
        meta: `全${stats.chapters ?? 0}単元・大問${stats.questions ?? 0}題・設問${stats.marks ?? 0}問`,
        progressSubject: s.id,
        action: { kind: 'units', subject: s.id },
      },
      {
        id: `${s.id}_summary`,
        title: `${s.shortLabel} 1画面まとめプリント（赤シート＆図表資料）`,
        icon: 'book',
        section: 'memorize',
        badge: '3段階赤シート・○×メモ対応',
        description:
          s.learningDescription ??
          '因果の流れ・比較表・共通テスト図表資料を1画面ずつめくって仕上げる要点プリント',
        meta: `全${prints.length}単元・${totalPages}ページ・図表資料${totalFigs}点`,
        action: { kind: 'learning', subject: s.id },
      },
    ],
  };
});

export function findStudySubject(id: string | null | undefined): StudySubject | undefined {
  return STUDY_CATALOG.find((s) => s.id === id);
}
