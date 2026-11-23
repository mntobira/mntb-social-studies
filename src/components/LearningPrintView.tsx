/**
 * ===================================================================
 * 赤シート対応 まとめプリント画面（LearningPrintView）
 * ===================================================================
 * マナトビのクリーム色の紙・科目テーマ配色・1画面性を保ち、
 * ・赤シート ON / OFF 一括切替（＋各語句タップで個別に開く）
 * ・出題重要度 ★ バッジ表示
 * ・「この単元の演習問題を解く」直行ボタン
 * を備えたインプット画面。
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Eye, EyeOff, Star } from 'lucide-react';
import { DoorMascot } from './DoorMascot';
import { subjectTheme } from '../data/subjectTheme';
import { DEFAULT_SUBJECT, type SubjectKey } from '../data/subjects';
import { getSummaryPrintsBySubject, type SummaryPrintSheet } from '../data/summaryPrintsData';
import { recordVocabActivity } from '../battle/data/growthStore';

interface LearningPrintViewProps {
  subject?: SubjectKey;
  onBack: () => void;
  backLabel?: string;
  onPracticeChapter: (chapterId: string) => void;
  onChangeSubject?: () => void;
}

/** {{語句}} を分割し、赤シートON時はタップ開閉可能なチップとして描画する */
function renderClozeText(
  text: string,
  redSheet: boolean,
  revealedKeys: ReadonlySet<string>,
  onToggleKey: (key: string) => void,
  keyPrefix: string,
) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, idx) => {
    const m = /^\{\{([^}]+)\}\}$/.exec(part);
    if (!m) return <React.Fragment key={idx}>{part}</React.Fragment>;
    const term = m[1];
    const k = `${keyPrefix}_${idx}`;
    const hidden = redSheet && !revealedKeys.has(k);
    if (!redSheet) {
      return (
        <strong
          key={k}
          className="mx-0.5 rounded bg-[#FDE8E4] px-1.5 py-0.5 font-extrabold text-[#C0392B] underline decoration-[#E74C3C]/50 decoration-2 underline-offset-2"
        >
          {term}
        </strong>
      );
    }
    return (
      <button
        key={k}
        type="button"
        onClick={() => onToggleKey(k)}
        aria-label={hidden ? 'タップして語句を表示' : `${term}（タップして再び隠す）`}
        className={`mx-0.5 inline-flex min-h-[28px] items-center rounded-md px-2 py-0.5 text-[14px] font-extrabold transition ${
          hidden
            ? 'bg-[#D64541] text-transparent shadow-inner select-none hover:bg-[#C0392B]'
            : 'border border-[#D64541]/50 bg-[#FFF3F1] text-[#B83227]'
        }`}
      >
        {term}
      </button>
    );
  });
}

export function LearningPrintView({
  subject = DEFAULT_SUBJECT,
  onBack,
  backLabel = '戻る',
  onPracticeChapter,
  onChangeSubject,
}: LearningPrintViewProps) {
  const sheets = useMemo(() => getSummaryPrintsBySubject(subject), [subject]);
  const [activeSheetId, setActiveSheetId] = useState<string>(() => sheets[0]?.id ?? '');
  const [redSheet, setRedSheet] = useState(true);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(() => new Set());
  const [completedSheets, setCompletedSheets] = useState<Set<string>>(() => new Set());
  const theme = subjectTheme(subject);

  useEffect(() => {
    setActiveSheetId(sheets[0]?.id ?? '');
    setRevealedKeys(new Set());
  }, [subject, sheets]);

  const activeSheet: SummaryPrintSheet | undefined =
    sheets.find((s) => s.id === activeSheetId) ?? sheets[0];

  const toggleKey = (k: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) {
        next.delete(k);
      } else {
        next.add(k);
        void recordVocabActivity('vocab_learn', 1, k);
      }
      return next;
    });
  };

  const markSheetCompleted = (sheetId: string) => {
    setCompletedSheets((prev) => {
      const next = new Set(prev);
      if (!next.has(sheetId)) {
        next.add(sheetId);
        void recordVocabActivity('vocab_quiz', 1, `sheet:${sheetId}`);
      }
      return next;
    });
  };

  const toggleRedSheet = () => {
    setRedSheet((v) => !v);
    setRevealedKeys(new Set());
  };

  return (
    <div
      className="mtb-page flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 w-full flex-col overflow-hidden notebook-paper p-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:p-5 md:p-6 font-modern"
      style={{ '--subject-accent': theme.accent, '--subject-soft': theme.accentSoft } as React.CSSProperties}
    >
      {/* 上部バー */}
      <header className="flex shrink-0 items-center justify-between gap-2 pb-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#E5DEC9] bg-white/95 px-3.5 text-sm font-bold text-[#2C3E50] shadow-xs"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          <span>{backLabel}</span>
        </button>

        <div className="min-w-0 text-center">
          <p className="truncate text-[12px] font-bold tracking-wider text-[#6C7A89]">赤シート対応 まとめプリント</p>
          <h1 className="truncate text-base font-extrabold sm:text-lg" style={{ color: theme.accent }}>
            {theme.label}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleRedSheet}
            aria-pressed={redSheet}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-xs font-extrabold shadow-xs transition sm:text-sm ${
              redSheet
                ? 'bg-[#D64541] text-white'
                : 'border border-[#D64541]/40 bg-white text-[#C0392B]'
            }`}
          >
            {redSheet ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            <span>{redSheet ? '赤シートON' : '赤シートOFF'}</span>
          </button>
          <div className="hidden sm:block">
            <DoorMascot subject={subject} showSpeech={false} size="mini" />
          </div>
        </div>
      </header>

      {/* シート切替タブ */}
      {sheets.length > 1 && (
        <div className="mb-2.5 flex shrink-0 gap-2 overflow-x-auto pb-1" role="tablist" aria-label="まとめシート切替">
          {sheets.map((sheet, idx) => {
            const active = sheet.id === activeSheet?.id;
            return (
              <button
                key={sheet.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveSheetId(sheet.id);
                  setRevealedKeys(new Set());
                }}
                className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 py-2 text-left text-xs font-bold transition sm:text-sm ${
                  active
                    ? 'text-white shadow-sm'
                    : 'border-[#E5DEC9] bg-white/90 text-[#34495E] hover:bg-white'
                }`}
                style={active ? { backgroundColor: theme.accent, borderColor: theme.accent } : undefined}
              >
                <span className="mr-1.5 opacity-85">シート{idx + 1}</span>
                <span>{sheet.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 本文スクロール領域 */}
      {activeSheet ? (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#E6DFC8] bg-[#FFFDF8]/95 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8D5] pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2D3D] sm:text-xl">{activeSheet.title}</h2>
              <p className="mt-0.5 text-xs text-[#5D6D7E] sm:text-sm">{activeSheet.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {onChangeSubject && (
                <button
                  type="button"
                  onClick={onChangeSubject}
                  className="min-h-[44px] rounded-full border border-[#E5DEC9] bg-white px-3.5 text-xs font-bold text-[#34495E]"
                >
                  科目変更
                </button>
              )}
              <button
                type="button"
                onClick={() => markSheetCompleted(activeSheet.id)}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-xs font-extrabold transition ${
                  completedSheets.has(activeSheet.id)
                    ? 'border-[#27AE60] bg-[#EAFAF1] text-[#1E8449]'
                    : 'border-[#E5DEC9] bg-white text-[#34495E] hover:bg-[#FAF7F0]'
                }`}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{completedSheets.has(activeSheet.id) ? '確認済み' : 'このシート完了'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markSheetCompleted(activeSheet.id);
                  void recordVocabActivity('vocab_perfect', 1, `practice:${activeSheet.id}`);
                  onPracticeChapter(activeSheet.chapterId);
                }}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-xs font-extrabold text-white shadow-sm sm:text-sm"
                style={{ backgroundColor: theme.accent }}
              >
                <BookOpen size={16} aria-hidden="true" />
                <span>この単元を演習する</span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          {redSheet && (
            <p className="mb-3 rounded-xl bg-[#FFF3F1] px-3 py-2 text-xs font-semibold text-[#B83227]">
              赤い空欄をタップすると1語ずつ確認できます。右上の「赤シートON」ボタンで一括表示・非表示を切り替えられます。
            </p>
          )}

          <div className="space-y-5">
            {activeSheet.sections.map((sec, sIdx) => (
              <section key={sec.heading} className="rounded-xl border border-[#EDE6D3] bg-white p-4">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-[#1F2D3D] sm:text-base">{sec.heading}</h3>
                  <span
                    className="inline-flex items-center gap-0.5 rounded-full bg-[#FEF5E7] px-2.5 py-0.5 text-[12px] font-bold text-[#B9770E]"
                    aria-label={`共通テスト頻出度 星${sec.priority}`}
                  >
                    <span className="mr-1">頻出度</span>
                    {Array.from({ length: sec.priority }, (_, i) => (
                      <Star key={i} size={12} fill="#F39C12" stroke="#F39C12" aria-hidden="true" />
                    ))}
                  </span>
                </div>

                <ul className="space-y-2.5 text-sm leading-relaxed text-[#2C3E50]">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: theme.accent }} />
                      <span className="flex-1">
                        {renderClozeText(b, redSheet, revealedKeys, toggleKey, `${activeSheet.id}_s${sIdx}_b${bIdx}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                {sec.table && (
                  <div className="mt-3.5 overflow-x-auto rounded-lg border border-[#E5DEC9]">
                    <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#F8F4E8] text-[#2C3E50]">
                          {sec.table.headers.map((h) => (
                            <th key={h} className="border-b border-[#E5DEC9] px-3 py-2 font-extrabold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="even:bg-[#FCF9F2]">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="border-b border-[#EFE9D8] px-3 py-2 text-[#2C3E50]">
                                {renderClozeText(
                                  cell,
                                  redSheet,
                                  revealedKeys,
                                  toggleKey,
                                  `${activeSheet.id}_s${sIdx}_r${rIdx}_c${cIdx}`,
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-[#E6DFC8] bg-white p-6 text-sm text-[#5D6D7E]">
          この科目のまとめプリントは準備中です。
        </div>
      )}
    </div>
  );
}
