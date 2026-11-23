import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type SubjectKey } from '../data/allChapters';
import { DEFAULT_SUBJECT } from '../data/subjects';
import { ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { DoorMascot } from './DoorMascot';
import { subjectTheme } from '../data/subjectTheme';
import type { Chapter } from '../types/curriculum';
import { problemKey, readSolvedMap } from '../utils/progress';
import {
  quizAnswersKey,
  quizExplKey,
  quizIndexKey,
  quizRunKey,
} from '../utils/quizStorageKeys';
import { auth } from '../firebase';
import { buildUnitSections } from '../data/unitSections';
import { UnitCard } from './UnitCard';
import './unit-select.css';
import { accuracyOf, readUnitStats } from '../utils/unitStats';
import { isStageCleared, readStageRecords, stageKey } from '../utils/stageRecords';
import { safeGetItem, safeParseJson } from '../utils/safeLocalStorage';
import { getChapterGroups, splitTabTitle } from '../utils/chapterGroups';

interface ChapterSelectionProps {
  mode: 'mini_test' | 'practice';
  onSelectChapter: (
    id: string,
    questionIndex?: number,
    resume?: boolean,
    range?: { startIndex: number; endIndex: number } | null,
  ) => void;
  onBack: () => void;
  onChangeSubject?: () => void;
  onOpenLearning?: () => void;
  rememberedGroup?: string;
  onGroupChange?: (group: string) => void;
  backLabel?: string;
  subject?: SubjectKey;
}

export function ChapterSelection({
  mode,
  onSelectChapter,
  onBack,
  onChangeSubject,
  onOpenLearning,
  subject = DEFAULT_SUBJECT,
  rememberedGroup,
  onGroupChange,
  backLabel = '戻る',
}: ChapterSelectionProps) {
  const theme = subjectTheme(subject);

  const groups = useMemo(() => {
    return getChapterGroups(subject);
  }, [subject]);

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [activeGroupTitle, setActiveGroupTitle] = useState(
    groups.some((g) => g.title === rememberedGroup) ? rememberedGroup! : groups[0]?.title || '',
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [solvedMap] = useState(() => readSolvedMap(auth.currentUser?.uid || 'guest'));
  const [stageRecords] = useState(() => readStageRecords(auth.currentUser?.uid || 'guest'));
  const [unitStats] = useState(() => readUnitStats(auth.currentUser?.uid || 'guest'));

  useEffect(() => {
    setActiveGroupTitle(
      groups.some((g) => g.title === rememberedGroup) ? rememberedGroup! : groups[0]?.title || '',
    );
    setExpandedChapterId(null);
  }, [groups, rememberedGroup]);

  useEffect(() => {
    tabRefs.current[activeGroupTitle]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeGroupTitle]);

  const activeGroup = groups.find((group) => group.title === activeGroupTitle) || groups[0];

  const chapterNumberById = useMemo(() => {
    const m = new Map<string, number>();
    groups.flatMap((g) => g.chapters).forEach((c, i) => m.set(c.id, i));
    return m;
  }, [groups]);

  const unitSections = useMemo(
    () =>
      buildUnitSections<Chapter>(subject, activeGroup?.chapters ?? [], (c) =>
        (mode === 'mini_test' ? c.miniTest || [] : c.practiceProblems || []).length,
      ),
    [subject, activeGroup, mode],
  );
  const orderedChapters = useMemo(() => unitSections.flatMap((sec) => sec.chapters), [unitSections]);
  const unitSectionByChapter = useMemo(() => {
    const m = new Map<string, (typeof unitSections)[number]>();
    for (const sec of unitSections) for (const c of sec.chapters) m.set(c.id, sec);
    return m;
  }, [unitSections]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mtb-page chapter-route flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 w-full flex-col overflow-hidden notebook-paper p-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:p-6 md:pb-[calc(5.75rem+env(safe-area-inset-bottom))] relative font-handwriting">
      <header className="chapter-route-heading unit-head shrink-0">
        <button type="button" onClick={onBack} className="unit-head-back" aria-label={`${backLabel}へ戻る`}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>{backLabel}</span>
        </button>
        <div className="unit-head-title">
          <h2 style={{ color: theme.accent }}>{theme.label}</h2>
          <p>{mode === 'mini_test' ? '小テスト' : '共通テスト実戦演習 ／ 単元を選ぶ'}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenLearning && (
            <button
              type="button"
              onClick={onOpenLearning}
              className="hidden sm:inline-flex min-h-[38px] items-center gap-1 rounded-full border border-[#E5DEC9] bg-white/95 px-3 text-xs font-extrabold text-[#2C3E50] shadow-xs hover:bg-white"
              title="赤シートまとめプリントを開く"
            >
              <BookOpen size={14} style={{ color: theme.accent }} aria-hidden="true" />
              <span>赤シート整理</span>
            </button>
          )}
          {onChangeSubject && (
            <button
              type="button"
              onClick={onChangeSubject}
              className="inline-flex min-h-[38px] items-center rounded-full border border-[#E5DEC9] bg-white/95 px-3 text-xs font-extrabold text-[#2C3E50] shadow-xs hover:bg-white"
            >
              科目切替
            </button>
          )}
          <DoorMascot subject={subject} showSpeech={false} size="mini" className="unit-head-mascot w-auto" />
        </div>
      </header>

      <div className="chapter-workspace flex min-h-0 flex-1 flex-col font-handwriting">
        <div className="chapter-index mb-3 shrink-0 border-b border-slate-200/80" data-few-tabs={groups.length <= 3 || undefined}>
          <div
            role="tablist"
            aria-label="章を選択"
            className="flex touch-pan-x snap-x snap-mandatory gap-1.5 overflow-x-auto overscroll-x-contain px-0.5 pb-2 [scrollbar-width:thin] sm:grid sm:grid-cols-3 sm:overflow-x-visible sm:overscroll-auto lg:grid-cols-4 xl:grid-cols-5"
          >
            {groups.map((group, index) => {
              const isActive = group.title === activeGroup?.title;
              const { kicker: chapterNumber, label: shortTitle } = group.kicker
                ? { kicker: `${group.kicker}・${group.chapters.length}単元`, label: group.label as string }
                : splitTabTitle(group.title, index);

              return (
                <React.Fragment key={group.title}>
                  <button
                    ref={(element) => {
                      tabRefs.current[group.title] = element;
                    }}
                    id={`chapter-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="chapter-tab-panel"
                    onClick={() => {
                      setActiveGroupTitle(group.title);
                      onGroupChange?.(group.title);
                      setExpandedChapterId(null);
                      document.getElementById('chapter-tab-panel')?.scrollTo({ top: 0 });
                    }}
                    className={`flex h-full min-h-[3rem] w-[42vw] min-w-[8.5rem] max-w-[11rem] shrink-0 snap-center flex-col justify-center rounded-xl border px-2.5 py-2 text-left transition-all cursor-pointer sm:w-auto sm:min-w-0 sm:max-w-none sm:shrink ${
                      isActive
                        ? 'border-[#A9CCE3] bg-[#2C3E50] text-white shadow-sm'
                        : 'border-slate-200 bg-white/75 text-slate-600 hover:border-[#A9CCE3] hover:bg-white'
                    }`}
                  >
                    <span
                      className="block text-xs font-bold leading-none"
                      style={{ color: isActive ? theme.accentSoft : theme.accent }}
                    >
                      {chapterNumber}
                    </span>
                    <span className="mt-1 block text-xs sm:text-sm font-bold leading-snug break-words [overflow-wrap:anywhere]">
                      {shortTitle}
                    </span>
                    {(() => {
                      const ready = group.chapters.filter(
                        (c) => ((mode === 'mini_test' ? c.miniTest : c.practiceProblems) || []).length > 0,
                      ).length;
                      if (ready === group.chapters.length) return null;
                      return (
                        <span className="chapter-tab-status" data-ready={ready > 0}>
                          {ready === 0 ? '準備中' : `${ready}/${group.chapters.length}単元`}
                        </span>
                      );
                    })()}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {activeGroup && (
          <section
            id="chapter-tab-panel"
            role="tabpanel"
            aria-labelledby={`chapter-tab-${groups.indexOf(activeGroup)}`}
            tabIndex={0}
            className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/35 p-3 pb-6 sm:p-4 sm:pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <p className="text-xs font-bold" style={{ color: theme.accent }}>
                {activeGroup.partTitle}
              </p>
              {onOpenLearning && (
                <button
                  type="button"
                  onClick={onOpenLearning}
                  className="sm:hidden inline-flex min-h-[34px] items-center gap-1 rounded-full border border-[#E5DEC9] bg-white px-2.5 text-xs font-extrabold text-[#2C3E50]"
                >
                  <BookOpen size={13} style={{ color: theme.accent }} aria-hidden="true" />
                  <span>赤シートまとめを見る</span>
                </button>
              )}
            </div>

            <div className="chapter-route-list unit-card-list">
              {orderedChapters.map((chapter, routeIndex) => {
                const questions = mode === 'mini_test' ? chapter.miniTest || [] : chapter.practiceProblems || [];
                const hasQuestions = questions.length > 0;
                const savedIndex = Math.max(
                  0,
                  Math.min(
                    questions.length - 1,
                    parseInt(safeGetItem(quizIndexKey(chapter.id, mode)) || '0', 10) || 0,
                  ),
                );
                const hasSavedProgress =
                  hasQuestions &&
                  (savedIndex > 0 ||
                    safeGetItem(quizExplKey(chapter.id, mode)) === 'true' ||
                    !!safeGetItem(quizRunKey(chapter.id, mode)) ||
                    Object.keys(safeParseJson<object>(safeGetItem(quizAnswersKey(chapter.id, mode)), {}) ?? {})
                      .length > 0);
                const solvedCount = questions.filter((q) => !!solvedMap[problemKey(chapter.id, q.id)]).length;
                const stat = unitStats[chapter.id];
                const stage = stageRecords[stageKey(chapter.id)];
                const status = isStageCleared(stage)
                  ? 'done'
                  : solvedCount > 0 || hasSavedProgress || !!stat || !!stage
                  ? 'doing'
                  : 'todo';

                const section = unitSectionByChapter.get(chapter.id);
                const prevSection =
                  routeIndex > 0 ? unitSectionByChapter.get(orderedChapters[routeIndex - 1].id) : undefined;
                const stageHeading =
                  section?.label && section !== prevSection ? (
                    <h4
                      className="math-stage-heading col-span-full"
                      data-stage={section.key?.split(':')[1] ?? section.key ?? ''}
                    >
                      <span>{section.label}</span>
                      <small>{section.chapters.length}単元</small>
                    </h4>
                  ) : null;
                const expanded = expandedChapterId === chapter.id;

                return (
                  <React.Fragment key={chapter.id}>
                    {stageHeading}
                    <div data-unit-id={chapter.id}>
                      <UnitCard
                        index={chapterNumberById.get(chapter.id) ?? routeIndex}
                        title={chapter.abstractTitle}
                        topics={chapter.topics}
                        questionCount={questions.length}
                        status={status}
                        accuracy={accuracyOf(stat)}
                        perfects={stage?.p ?? 0}
                        hasSavedProgress={hasSavedProgress}
                        expanded={expanded}
                        accent={theme.accent}
                        onToggle={() => setExpandedChapterId(expanded ? null : chapter.id)}
                        onStart={() => onSelectChapter(chapter.id, 0, false)}
                        onResume={() => onSelectChapter(chapter.id, savedIndex, true)}
                      >
                        {hasQuestions && questions.length > 1 && (
                          <div className="chapter-question-list unit-card-questions">
                            {questions.map((question, questionIndex: number) => (
                              <button
                                key={question.id}
                                type="button"
                                onClick={() => onSelectChapter(chapter.id, questionIndex, false)}
                              >
                                <span>{question.category || `問 ${questionIndex + 1}`}</span>
                                <ChevronRight size={14} aria-hidden="true" />
                              </button>
                            ))}
                          </div>
                        )}
                      </UnitCard>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
