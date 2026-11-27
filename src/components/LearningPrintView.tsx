/**
 * ===================================================================
 * 磯和プリント方式 × マナトビリスニング第6問B準拠
 * 1画面ページ送り式 まとめプリント画面（LearningPrintView）
 * ===================================================================
 * 特徴:
 *  1. 全5科目・全85単元の体系的整理（編別目次モーダル＋単元クイックピルで自在ジャンプ）
 *  2. 科目横断レベルの「語句・人物・条約・判例・統計 1秒インデックス検索」（該当ページへダイレクト移動）
 *  3. 1画面完結のページ送りUI（前へ / 次へ・キーボード矢印・スワイプ対応で縦スクロール疲れを解消）
 *  4. マナトビリスニング第6問B準拠の視覚資料デッキ（SocialMaterialDeck）:
 *     - FitFigure: 枠の縦横比に合わせて1面に収め、図の上をタップして ○／× 鉛筆メモを直接書き込み可能
 *     - FigureCarousel: 複数グラフ（①〜④）は1枚ずつ大きく表示し、‹ › ボタン・①〜④ピル・スワイプで切替
 *     - モバイルでは「要点ノート / 図表資料（○×メモ）」1画面切替タブ、大画面では左右2ペイン並列表示
 *  5. 比較テーブルの各行にも第6問B/4問B流のワンタップ ○／×／未記入 鉛筆チェック列を搭載
 *  6. 磯和プリント3段階ハイライト完全再現:
 *     - {{重要語句}}         : 下線＋太字（8割必須モード・満点モードで赤シートマスク）
 *     - [[マイナー語句]]     : 細下線（満点モード時に紺シートマスク）
 *     - ~~波線(**導出太字**)~~ : 波線＋太字（思想内容・因果の急所。赤シート時も文脈ヒントとして表示）
 *  7. 要復習ページの「★ブックマーク保存（localStorage永続化）」＆即答○×正答率トラッカー搭載
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  List,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { DoorMascot } from './DoorMascot';
import { SocialMaterialDeck } from './SocialMaterialDeck';
import { subjectTheme } from '../data/subjectTheme';
import { DEFAULT_SUBJECT, type SubjectKey } from '../data/subjects';
import { getSummaryPrintsBySubject } from '../data/summaryPrintsData';
import type { SummaryPrintPage, SummaryPrintSheet } from '../data/summaryPrints/types';
import { recordVocabActivity } from '../battle/data/growthStore';

interface LearningPrintViewProps {
  subject?: SubjectKey;
  onBack: () => void;
  backLabel?: string;
  onPracticeChapter: (chapterId: string) => void;
  onChangeSubject?: () => void;
}

type MaskMode = 'off' | 'core' | 'all';
type SubPaneTab = 'notes' | 'materials';

interface SearchIndexEntry {
  sheetIdx: number;
  pageIdx: number;
  unitLabel: string;
  unitTitle: string;
  pageTitle: string;
  plainText: string;
}

const NEXT_ROW_MARK: Record<string, string> = { '': '○', '○': '×', '×': '' };
const BOOKMARK_STORAGE_KEY = 'mtb_print_bookmarks_v2';
const READ_STORAGE_KEY = 'mtb_print_read_pages_v2';

function stripPrintMarkup(raw: string): string {
  return raw
    .replace(/\{\{([^}]+)\}\}/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1');
}

function loadSavedSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((v): v is string => typeof v === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: ReadonlySet<string>): void {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
    // ignore storage quota errors
  }
}

/** **太字** と {{重要語句}} と [[マイナー語句]] を処理するインライン描画 */
function renderInlineTokens(
  text: string,
  maskMode: MaskMode,
  revealedKeys: ReadonlySet<string>,
  onToggleKey: (key: string) => void,
  keyPrefix: string,
  insideWave = false,
): React.ReactNode[] {
  const parts = text.split(/(\{\{[^}]+\}\}|\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (!part) return null;
    const k = `${keyPrefix}_${idx}`;

    // 1. {{重要語句}}（8割必須コア語句：下線＋太字）
    const coreMatch = /^\{\{([^}]+)\}\}$/.exec(part);
    if (coreMatch) {
      const term = coreMatch[1];
      const shouldMask = maskMode !== 'off';
      const hidden = shouldMask && !revealedKeys.has(k);
      if (!shouldMask) {
        return (
          <strong
            key={k}
            className="mx-0.5 rounded bg-[#FDE8E4] px-1.5 py-0.5 font-extrabold text-[#B83227] underline decoration-[#D64541] decoration-2 underline-offset-3"
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
          aria-label={hidden ? 'タップして重要語句を表示' : `${term}（タップして再び隠す）`}
          className={`mx-0.5 inline-flex min-h-[26px] items-center rounded-md px-2 py-0.5 text-[13.5px] font-extrabold transition align-baseline ${
            hidden
              ? 'bg-[#D64541] text-transparent shadow-inner select-none hover:bg-[#C0392B]'
              : 'border border-[#D64541]/60 bg-[#FFF3F1] text-[#B83227]'
          }`}
        >
          {term}
        </button>
      );
    }

    // 2. [[マイナー・ハイレベル語句]]（9割〜満点狙い：細下線）
    const minorMatch = /^\[\[([^\]]+)\]\]$/.exec(part);
    if (minorMatch) {
      const term = minorMatch[1];
      const shouldMask = maskMode === 'all';
      const hidden = shouldMask && !revealedKeys.has(k);
      if (!shouldMask) {
        return (
          <span
            key={k}
            className="mx-0.5 font-bold text-[#1F4E79] underline decoration-[#2E75B6]/70 decoration-1 underline-offset-3"
            title="ハイレベル・満点狙い語句（満点モードで赤シート対象）"
          >
            {term}
          </span>
        );
      }
      return (
        <button
          key={k}
          type="button"
          onClick={() => onToggleKey(k)}
          aria-label={hidden ? 'タップしてハイレベル語句を表示' : `${term}（タップして再び隠す）`}
          className={`mx-0.5 inline-flex min-h-[26px] items-center rounded-md px-2 py-0.5 text-[13px] font-extrabold transition align-baseline ${
            hidden
              ? 'bg-[#2C4C7E] text-transparent shadow-inner select-none hover:bg-[#1F3A64]'
              : 'border border-[#2C4C7E]/50 bg-[#EEF4FC] text-[#1F3A64]'
          }`}
        >
          {term}
        </button>
      );
    }

    // 3. **導出キーワード太字**
    const boldMatch = /^\*\*([^*]+)\*\*$/.exec(part);
    if (boldMatch) {
      return (
        <strong
          key={k}
          className={
            insideWave
              ? 'rounded-xs bg-[#FEF3C7]/85 px-1 font-extrabold text-[#9A4D00]'
              : 'font-extrabold text-[#1F2D3D]'
          }
        >
          {boldMatch[1]}
        </strong>
      );
    }

    return <React.Fragment key={k}>{part}</React.Fragment>;
  });
}

/** ~~波線ポイント~~ を含む磯和プリント式リッチテキスト描画 */
function renderIsowaText(
  text: string,
  maskMode: MaskMode,
  revealedKeys: ReadonlySet<string>,
  onToggleKey: (key: string) => void,
  keyPrefix: string,
) {
  const segments = text.split(/(~~[^~]+~~)/g);
  return segments.map((seg, sIdx) => {
    if (!seg) return null;
    const waveMatch = /^~~([^~]+)~~$/.exec(seg);
    if (waveMatch) {
      return (
        <span
          key={`${keyPrefix}_w${sIdx}`}
          className="rounded-xs bg-[#FFFBEB]/80 px-0.5 underline decoration-[#D97706]/80 decoration-wavy decoration-1 underline-offset-4"
        >
          {renderInlineTokens(
            waveMatch[1],
            maskMode,
            revealedKeys,
            onToggleKey,
            `${keyPrefix}_w${sIdx}`,
            true,
          )}
        </span>
      );
    }
    return (
      <React.Fragment key={`${keyPrefix}_p${sIdx}`}>
        {renderInlineTokens(
          seg,
          maskMode,
          revealedKeys,
          onToggleKey,
          `${keyPrefix}_p${sIdx}`,
          false,
        )}
      </React.Fragment>
    );
  });
}

/** 行頭記号（Ｑ / → / ＝ / ↔ / ※）に応じて「流れ」が見える行レイアウトを返す */
interface FlowLineProps {
  line: string;
  maskMode: MaskMode;
  revealedKeys: ReadonlySet<string>;
  onToggleKey: (key: string) => void;
  keyPrefix: string;
  accentColor: string;
}

const FlowLine: React.FC<FlowLineProps> = ({
  line,
  maskMode,
  revealedKeys,
  onToggleKey,
  keyPrefix,
  accentColor,
}) => {
  const trimmed = line.trim();

  // 問いかけ・背景行
  if (/^(Ｑ|Q\d*|【問い】|【背景】|【課題】|【前提|【動機】|【転機】|【決定的転機】)/.test(trimmed)) {
    return (
      <div className="rounded-lg border border-[#E6DEC8] bg-[#F6F0E2] px-3 py-1.5 text-[13px] font-bold text-[#4A3B22] sm:text-[13.5px]">
        {renderIsowaText(trimmed, maskMode, revealedKeys, onToggleKey, keyPrefix)}
      </div>
    );
  }

  // 結論・イコール行
  if (/^[＝=]/.test(trimmed)) {
    const body = trimmed.replace(/^[＝=]\s*/, '');
    return (
      <div className="flex items-start gap-2 pl-1.5 text-[13.5px] leading-relaxed text-[#1F2D3D] sm:text-sm">
        <span
          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-black text-white shadow-2xs"
          style={{ backgroundColor: accentColor }}
        >
          ＝
        </span>
        <div className="min-w-0 flex-1 font-semibold">
          {renderIsowaText(body, maskMode, revealedKeys, onToggleKey, keyPrefix)}
        </div>
      </div>
    );
  }

  // 因果・噛み砕き矢印行
  if (/^(→|⇒)/.test(trimmed)) {
    const arrow = trimmed[0];
    const body = trimmed.slice(1).trim();
    return (
      <div className="flex items-start gap-2 pl-1.5 text-[13px] leading-relaxed text-[#2C3E50] sm:text-[13.5px]">
        <span
          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black"
          style={{ color: accentColor }}
        >
          {arrow}
        </span>
        <div className="min-w-0 flex-1">
          {renderIsowaText(body, maskMode, revealedKeys, onToggleKey, keyPrefix)}
        </div>
      </div>
    );
  }

  // 対比・ひっかけ注意行
  if (/^(↔︎|↔|⇔|※)/.test(trimmed)) {
    const mark = trimmed.startsWith('↔︎') ? '↔' : trimmed[0];
    const body = trimmed.replace(/^(↔︎|↔|⇔|※)\s*/, '');
    const isContrast = mark !== '※';
    return (
      <div
        className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] leading-relaxed sm:text-[13px] ${
          isContrast
            ? 'border-[#CBE2F6] bg-[#F2F8FD] text-[#1B4F72]'
            : 'border-[#F7DC9F] bg-[#FFFBEB] text-[#784212]'
        }`}
      >
        <span
          className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] font-black ${
            isContrast ? 'bg-[#D6EAF8] text-[#154360]' : 'bg-[#FDEBD0] text-[#7E5109]'
          }`}
        >
          {isContrast ? '⇔対比' : '※急所'}
        </span>
        <div className="min-w-0 flex-1">
          {renderIsowaText(body, maskMode, revealedKeys, onToggleKey, keyPrefix)}
        </div>
      </div>
    );
  }

  // 通常ステップ行（先頭の「・」はスマートドットに置換）
  const cleanBody = trimmed.replace(/^・\s*/, '');
  return (
    <div className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[#2C3E50] sm:text-sm">
      <span
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="min-w-0 flex-1">
        {renderIsowaText(cleanBody, maskMode, revealedKeys, onToggleKey, keyPrefix)}
      </div>
    </div>
  );
};

export function LearningPrintView({
  subject = DEFAULT_SUBJECT,
  onBack,
  backLabel = '戻る',
  onPracticeChapter,
  onChangeSubject,
}: LearningPrintViewProps) {
  const sheets = useMemo(() => getSummaryPrintsBySubject(subject), [subject]);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [maskMode, setMaskMode] = useState<MaskMode>('core');
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(() => new Set());
  const [oxAnswers, setOxAnswers] = useState<Record<string, '○' | '×'>>({});
  const [tableRowMarks, setTableRowMarks] = useState<Record<string, string>>({});
  const [completedPages, setCompletedPages] = useState<Set<string>>(() => loadSavedSet(READ_STORAGE_KEY));
  const [bookmarkedPages, setBookmarkedPages] = useState<Set<string>>(() => loadSavedSet(BOOKMARK_STORAGE_KEY));
  const [tocOpen, setTocOpen] = useState(false);
  const [tocBookmarkOnly, setTocBookmarkOnly] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subPaneTab, setSubPaneTab] = useState<SubPaneTab>('notes');

  const cardScrollRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const unitPillRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const theme = subjectTheme(subject);

  useEffect(() => {
    setActiveSheetIdx(0);
    setPageIdx(0);
    setRevealedKeys(new Set());
    setTocOpen(false);
    setTocBookmarkOnly(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSubPaneTab('notes');
  }, [subject]);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchOpen]);

  const activeSheet: SummaryPrintSheet | undefined = sheets[activeSheetIdx] ?? sheets[0];
  const pages: SummaryPrintPage[] = activeSheet?.pages ?? [];
  const currentPage: SummaryPrintPage | undefined = pages[pageIdx] ?? pages[0];
  const totalPages = pages.length;
  const pageFigures = currentPage?.figures ?? [];
  const hasFigures = pageFigures.length > 0;
  const currentPageKey = activeSheet ? `${activeSheet.id}_p${pageIdx}` : '';
  const isCurrentBookmarked = currentPageKey ? bookmarkedPages.has(currentPageKey) : false;

  // 科目内全ページの高速検索インデックス
  const searchIndex = useMemo<SearchIndexEntry[]>(() => {
    const entries: SearchIndexEntry[] = [];
    sheets.forEach((sheet, sIdx) => {
      sheet.pages.forEach((pg, pIdx) => {
        const raw = [
          sheet.unitLabel,
          sheet.title,
          sheet.subtitle,
          pg.pageTitle,
          pg.lead ?? '',
          ...(pg.blocks ?? []).flatMap((b) => [b.heading, ...b.lines]),
          ...(pg.table ? [...pg.table.headers, ...pg.table.rows.flat()] : []),
          pg.pointBox ? `${pg.pointBox.title} ${pg.pointBox.body}` : '',
          ...(pg.oxChecks ?? []).flatMap((o) => [o.q, o.why]),
        ].join(' ');
        entries.push({
          sheetIdx: sIdx,
          pageIdx: pIdx,
          unitLabel: sheet.unitLabel,
          unitTitle: sheet.title,
          pageTitle: pg.pageTitle,
          plainText: stripPrintMarkup(raw),
        });
      });
    });
    return entries;
  }, [sheets]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    const matches: { entry: SearchIndexEntry; snippet: string }[] = [];
    for (const entry of searchIndex) {
      const lower = entry.plainText.toLowerCase();
      if (terms.every((t) => lower.includes(t))) {
        const firstIdx = lower.indexOf(terms[0]);
        const start = Math.max(0, firstIdx - 28);
        const end = Math.min(entry.plainText.length, firstIdx + 76);
        const snippet =
          (start > 0 ? '…' : '') +
          entry.plainText.slice(start, end).replace(/\s+/g, ' ') +
          (end < entry.plainText.length ? '…' : '');
        matches.push({ entry, snippet });
        if (matches.length >= 40) break;
      }
    }
    return matches;
  }, [searchIndex, searchQuery]);

  // この科目のブックマーク済みページ一覧
  const subjectBookmarks = useMemo(() => {
    const list: { sheetIdx: number; pageIdx: number; key: string; unitLabel: string; unitTitle: string; pageTitle: string }[] = [];
    sheets.forEach((sheet, sIdx) => {
      sheet.pages.forEach((pg, pIdx) => {
        const key = `${sheet.id}_p${pIdx}`;
        if (bookmarkedPages.has(key)) {
          list.push({
            sheetIdx: sIdx,
            pageIdx: pIdx,
            key,
            unitLabel: sheet.unitLabel,
            unitTitle: sheet.title,
            pageTitle: pg.pageTitle,
          });
        }
      });
    });
    return list;
  }, [sheets, bookmarkedPages]);

  useEffect(() => {
    cardScrollRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setSubPaneTab('notes');
  }, [activeSheetIdx, pageIdx]);

  // 選択中の単元ピルを横スクロールバーの中央付近へ自動スクロール
  useEffect(() => {
    const btn = unitPillRefs.current[activeSheetIdx];
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeSheetIdx]);

  // 編ごとのグルーピング（目次モーダル用）
  const groupedByPart = useMemo(() => {
    const map = new Map<string, { sheet: SummaryPrintSheet; index: number }[]>();
    sheets.forEach((sheet, index) => {
      const list = map.get(sheet.partTitle) ?? [];
      list.push({ sheet, index });
      map.set(sheet.partTitle, list);
    });
    return Array.from(map.entries());
  }, [sheets]);

  const toggleKey = useCallback((k: string) => {
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
  }, []);

  const toggleBookmarkCurrentPage = useCallback(() => {
    if (!currentPageKey) return;
    setBookmarkedPages((prev) => {
      const next = new Set<string>(prev);
      if (next.has(currentPageKey)) {
        next.delete(currentPageKey);
      } else {
        next.add(currentPageKey);
      }
      saveSet(BOOKMARK_STORAGE_KEY, next);
      return next;
    });
  }, [currentPageKey]);

  const cycleMaskMode = () => {
    setMaskMode((prev) => (prev === 'core' ? 'all' : prev === 'all' ? 'off' : 'core'));
    setRevealedKeys(new Set());
  };

  const markCurrentPageRead = useCallback(() => {
    if (!activeSheet) return;
    const key = `${activeSheet.id}_p${pageIdx}`;
    setCompletedPages((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set<string>(prev);
      next.add(key);
      saveSet(READ_STORAGE_KEY, next);
      void recordVocabActivity('vocab_quiz', 1, `print:${key}`);
      return next;
    });
  }, [activeSheet, pageIdx]);

  const goPrev = useCallback(() => {
    if (pageIdx > 0) {
      setPageIdx((p) => p - 1);
    } else if (activeSheetIdx > 0) {
      const prevSheet = sheets[activeSheetIdx - 1];
      setActiveSheetIdx((s) => s - 1);
      setPageIdx(Math.max(0, (prevSheet?.pages.length ?? 1) - 1));
    }
  }, [pageIdx, activeSheetIdx, sheets]);

  const goNext = useCallback(() => {
    markCurrentPageRead();
    if (pageIdx + 1 < totalPages) {
      setPageIdx((p) => p + 1);
    } else if (activeSheetIdx + 1 < sheets.length) {
      setActiveSheetIdx((s) => s + 1);
      setPageIdx(0);
    }
  }, [pageIdx, totalPages, activeSheetIdx, sheets.length, markCurrentPageRead]);

  // キーボード左右矢印でページ送り・Ctrl/Cmd+Kで検索（モーダル表示中は除外）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (tocOpen || searchOpen || document.querySelector('[data-material-zoom]')) {
        if (e.key === 'Escape') {
          setTocOpen(false);
          setSearchOpen(false);
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tocOpen, searchOpen, goNext, goPrev]);

  const selectUnit = (idx: number, targetPage = 0) => {
    setActiveSheetIdx(idx);
    setPageIdx(targetPage);
    setRevealedKeys(new Set());
    setTocOpen(false);
    setSearchOpen(false);
  };

  // 現在ページの○×正答スコア集計
  const currentOxStats = useMemo(() => {
    const checks = currentPage?.oxChecks ?? [];
    if (!activeSheet || checks.length === 0) return { total: 0, answered: 0, correct: 0 };
    let answered = 0;
    let correct = 0;
    checks.forEach((ox, oIdx) => {
      const picked = oxAnswers[`${activeSheet.id}_p${pageIdx}_ox${oIdx}`];
      if (picked) {
        answered += 1;
        if (picked === ox.a) correct += 1;
      }
    });
    return { total: checks.length, answered, correct };
  }, [activeSheet, currentPage, oxAnswers, pageIdx]);

  const resetCurrentPageOx = () => {
    if (!activeSheet || !currentPage?.oxChecks) return;
    setOxAnswers((prev) => {
      const next = { ...prev };
      currentPage.oxChecks?.forEach((_, oIdx) => {
        delete next[`${activeSheet.id}_p${pageIdx}_ox${oIdx}`];
      });
      return next;
    });
  };

  const totalSubjectPages = searchIndex.length;
  const maskLabel =
    maskMode === 'core' ? '赤シート：必須語' : maskMode === 'all' ? '赤シート：満点＋細字' : '赤シートOFF';

  const canGoPrev = pageIdx > 0 || activeSheetIdx > 0;
  const isLastPageOfUnit = pageIdx + 1 >= totalPages;
  const hasNextUnit = activeSheetIdx + 1 < sheets.length;

  return (
    <div
      className="mtb-page flex h-full max-h-[100dvh] min-h-0 w-full flex-col overflow-hidden notebook-paper px-2.5 pt-2 pb-[calc(var(--app-nav-h,4.5rem)+0.5rem)] sm:px-4 sm:pt-3 md:px-6 font-modern"
      style={{ '--subject-accent': theme.accent, '--subject-soft': theme.accentSoft } as React.CSSProperties}
    >
      {/* 1. 上部コンパクト操作バー */}
      <header className="flex shrink-0 items-center justify-between gap-1.5 pb-1.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#DFD6C0] bg-white/95 px-2.5 text-xs font-extrabold text-[#2C3E50] shadow-2xs hover:bg-white sm:px-3 sm:text-sm"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setTocOpen(true)}
            data-open-print-toc
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#D4C9B0] bg-[#FFFDF7] px-2.5 text-xs font-extrabold text-[#2C3E50] shadow-2xs hover:bg-white sm:px-3 sm:text-sm"
          >
            <List size={15} style={{ color: theme.accent }} aria-hidden="true" />
            <span>目次</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[11px] font-black text-white"
              style={{ backgroundColor: theme.accent }}
            >
              {activeSheetIdx + 1}/{sheets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            data-open-print-search
            aria-label="語句・人物・判例・統計を検索"
            title="科目内の全ページから語句・人物・判例を1秒検索（Ctrl+K）"
            className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#D4C9B0] bg-white px-2.5 text-xs font-extrabold text-[#2C3E50] shadow-2xs hover:bg-slate-50 sm:px-3"
          >
            <Search size={15} style={{ color: theme.accent }} aria-hidden="true" />
            <span className="hidden md:inline">語句検索</span>
          </button>
        </div>

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="truncate text-[10.5px] font-bold text-[#6C7A89] sm:text-xs">
            {theme.label}（全{sheets.length}単元・{totalSubjectPages}ページ完全網羅）
          </p>
          <h1 className="truncate text-xs font-extrabold text-[#1F2D3D] sm:text-[15px]">
            {activeSheet?.unitLabel}　{activeSheet?.title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {onChangeSubject && (
            <button
              type="button"
              onClick={onChangeSubject}
              className="hidden min-h-[40px] rounded-full border border-[#DFD6C0] bg-white px-3 text-xs font-bold text-[#34495E] hover:bg-slate-50 lg:inline-flex lg:items-center"
            >
              科目変更
            </button>
          )}
          <button
            type="button"
            onClick={cycleMaskMode}
            data-mask-toggle={maskMode}
            className={`inline-flex min-h-[40px] items-center gap-1 rounded-full px-2.5 text-xs font-extrabold shadow-2xs transition sm:px-3.5 ${
              maskMode === 'core'
                ? 'bg-[#D64541] text-white hover:bg-[#C0392B]'
                : maskMode === 'all'
                  ? 'bg-[#1F3A64] text-white hover:bg-[#162B4C]'
                  : 'border border-[#D64541]/45 bg-white text-[#C0392B] hover:bg-[#FFF5F5]'
            }`}
            title="タップで『必須語のみ隠す』→『満点細字まで隠す』→『赤シートOFF』を切替"
          >
            {maskMode === 'off' ? (
              <Eye size={15} aria-hidden="true" />
            ) : maskMode === 'all' ? (
              <Sparkles size={15} aria-hidden="true" />
            ) : (
              <EyeOff size={15} aria-hidden="true" />
            )}
            <span>{maskLabel}</span>
          </button>
          <div className="hidden xl:block">
            <DoorMascot subject={subject} showSpeech={false} size="mini" />
          </div>
        </div>
      </header>

      {/* 2. 単元クイック切替ピルバー */}
      <div
        className="mb-1.5 flex shrink-0 items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="単元切替"
      >
        {sheets.map((sheet, idx) => {
          const active = idx === activeSheetIdx;
          const doneCount = sheet.pages.filter((_, p) => completedPages.has(`${sheet.id}_p${p}`)).length;
          const allDone = doneCount === sheet.pages.length && sheet.pages.length > 0;
          const sheetHasFigs = sheet.pages.some((p) => (p.figures?.length ?? 0) > 0);
          const hasBookmark = sheet.pages.some((_, p) => bookmarkedPages.has(`${sheet.id}_p${p}`));
          return (
            <button
              key={sheet.id}
              ref={(el) => {
                unitPillRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectUnit(idx)}
              className={`inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                active
                  ? 'text-white shadow-2xs'
                  : 'border-[#E2D9C2] bg-white/92 text-[#34495E] hover:bg-white'
              }`}
              style={active ? { backgroundColor: theme.accent, borderColor: theme.accent } : undefined}
            >
              {allDone && <CheckCircle2 size={13} className={active ? 'text-white' : 'text-[#27AE60]'} />}
              {hasBookmark && (
                <Bookmark
                  size={12}
                  fill="currentColor"
                  className={active ? 'text-amber-200' : 'text-amber-500'}
                  aria-label="要復習ブックマークあり"
                />
              )}
              <span className="font-extrabold">{sheet.unitLabel}</span>
              <span className="max-w-[128px] truncate">{sheet.title}</span>
              {sheetHasFigs && (
                <BarChart3
                  size={12}
                  aria-label="図表資料あり"
                  className={active ? 'text-white/90' : 'text-slate-400'}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. メイン1画面シート本体 */}
      {activeSheet && currentPage ? (
        <main
          ref={cardScrollRef}
          onTouchStart={(e) => {
            if ((e.target as HTMLElement | null)?.closest('[data-social-material-deck]')) {
              touchStartRef.current = null;
              return;
            }
            const t = e.touches[0];
            touchStartRef.current = t ? { x: t.clientX, y: t.clientY } : null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartRef.current;
            touchStartRef.current = null;
            const t = e.changedTouches[0];
            if (!start || !t) return;
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) > 68 && Math.abs(dx) > Math.abs(dy) * 1.6) {
              if (dx < 0) goNext();
              else goPrev();
            }
          }}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-[#DFD5BE] bg-[#FFFDF9] p-3 shadow-xs sm:p-4"
        >
          {/* ページ見出し帯 */}
          <div className="mb-2.5 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#EFE8D5] pb-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold">
                <span
                  className="rounded-md px-2 py-0.5 text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  {activeSheet.unitLabel}・Step {pageIdx + 1}/{totalPages}
                </span>
                <span className="truncate text-[#6C7A89]">{activeSheet.partTitle}</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FEF5E7] px-2 py-0.5 text-[#B9770E]">
                  {Array.from({ length: currentPage.priority }, (_, i) => (
                    <Star key={i} size={11} fill="#F39C12" stroke="#F39C12" aria-hidden="true" />
                  ))}
                </span>
              </div>
              <h2 className="mt-1 text-[15px] font-extrabold leading-snug text-[#1F2D3D] sm:text-lg">
                {currentPage.pageTitle}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {/* 要復習しおり（ブックマーク）ボタン */}
              <button
                type="button"
                onClick={toggleBookmarkCurrentPage}
                data-bookmark-page={isCurrentBookmarked ? 'on' : 'off'}
                aria-pressed={isCurrentBookmarked}
                title={isCurrentBookmarked ? '要復習ブックマークを解除' : 'このページを要復習ブックマークに追加'}
                className={`inline-flex min-h-[34px] items-center gap-1 rounded-full border px-2.5 text-xs font-extrabold transition ${
                  isCurrentBookmarked
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : 'border-[#E2D9C2] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark
                  size={13}
                  fill={isCurrentBookmarked ? '#F59E0B' : 'none'}
                  stroke={isCurrentBookmarked ? '#D97706' : 'currentColor'}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{isCurrentBookmarked ? '要復習中' : '要復習'}</span>
              </button>

              {/* 図表資料があるページではモバイル〜タブレット用に1画面モード切替タブを表示 */}
              {hasFigures ? (
                <div
                  className="flex shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 p-0.5 lg:hidden"
                  role="tablist"
                  aria-label="ノートと図表資料の切替"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={subPaneTab === 'notes'}
                    onClick={() => setSubPaneTab('notes')}
                    className={`inline-flex min-h-[34px] items-center gap-1 rounded-full px-3 text-xs font-extrabold transition ${
                      subPaneTab === 'notes'
                        ? 'bg-white text-[#1F2D3D] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText size={13} aria-hidden="true" />
                    <span>要点ノート</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    data-open-materials-tab
                    aria-selected={subPaneTab === 'materials'}
                    onClick={() => setSubPaneTab('materials')}
                    className={`inline-flex min-h-[34px] items-center gap-1 rounded-full px-3 text-xs font-extrabold transition ${
                      subPaneTab === 'materials'
                        ? 'text-white shadow-2xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                    style={subPaneTab === 'materials' ? { backgroundColor: theme.accent } : undefined}
                  >
                    <BarChart3 size={13} aria-hidden="true" />
                    <span>図表資料({pageFigures.length})</span>
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 text-[11px] text-[#5D6D7E] xl:flex">
                  <span className="rounded bg-[#FDE8E4] px-1.5 py-0.5 font-extrabold text-[#B83227] underline">
                    必須8割語句
                  </span>
                  <span className="rounded bg-[#FFFBEB] px-1.5 py-0.5 font-bold text-[#9A4D00] underline decoration-[#D97706] decoration-wavy">
                    波線＝思想・因果の急所
                  </span>
                  <span className="font-bold text-[#1F4E79] underline">細下線＝満点語句</span>
                </div>
              )}
            </div>
          </div>

          {/* 2ペイン対応ボディ：図表があるページは lg以上で左58%ノート・右42%第6問B式資料デッキ！ */}
          <div
            className={`min-h-0 flex-1 ${
              hasFigures ? 'flex flex-col lg:grid lg:grid-cols-12 lg:gap-4' : ''
            }`}
          >
            {/* 左（または単独）：要点ノート＆比較表＆即答○× */}
            <div
              className={`${
                hasFigures
                  ? `${subPaneTab === 'materials' ? 'hidden lg:block' : 'block'} lg:col-span-7 lg:overflow-y-auto lg:pr-1`
                  : ''
              } space-y-2.5`}
            >
              {/* 冒頭リード（流れの導入） */}
              {currentPage.lead && (
                <div
                  className="rounded-xl border-l-4 bg-[#FAF6EC] px-3 py-2 text-xs font-semibold leading-relaxed text-[#34495E] sm:text-[13.5px]"
                  style={{ borderLeftColor: theme.accent }}
                >
                  {renderIsowaText(
                    currentPage.lead,
                    maskMode,
                    revealedKeys,
                    toggleKey,
                    `${activeSheet.id}_p${pageIdx}_lead`,
                  )}
                </div>
              )}

              {/* モバイルで図表があるとき、ノート側からもワンタップで図表資料へ飛べる案内バナー */}
              {hasFigures && subPaneTab === 'notes' && (
                <button
                  type="button"
                  onClick={() => setSubPaneTab('materials')}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-left text-xs font-extrabold text-[#2C3E50] transition hover:bg-slate-100 lg:hidden"
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart3 size={15} style={{ color: theme.accent }} aria-hidden="true" />
                    <span>
                      共通テスト形式の図表資料（全{pageFigures.length}枚・タップで○×書き込み可）を開く
                    </span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-slate-500" />
                </button>
              )}

              {/* 論理フローブロック群 */}
              {(currentPage.blocks ?? []).map((block, bIdx) => (
                <section
                  key={bIdx}
                  className="rounded-xl border border-[#E8E0CC] bg-white p-3 shadow-2xs sm:p-3.5"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
                    <h3 className="text-[13.5px] font-extrabold text-[#1F2D3D] sm:text-[15px]">
                      {block.heading}
                    </h3>
                    {block.badge && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                        style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                      >
                        {block.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {block.lines.map((line, lIdx) => (
                      <FlowLine
                        key={lIdx}
                        line={line}
                        maskMode={maskMode}
                        revealedKeys={revealedKeys}
                        onToggleKey={toggleKey}
                        keyPrefix={`${activeSheet.id}_p${pageIdx}_b${bIdx}_l${lIdx}`}
                        accentColor={theme.accent}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {/* 比較・整理テーブル（第6問B/4問B流：右端にワンタップ○×仕分けメモ列つき！） */}
              {currentPage.table && (
                <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-2xs">
                  <table className="w-full min-w-[440px] border-collapse text-left text-xs sm:text-[13px]">
                    <thead>
                      <tr className="bg-[#F3EFE2] text-[#1F2D3D]">
                        {currentPage.table.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            scope="col"
                            className="border-b border-r border-slate-300 px-2.5 py-2 font-extrabold last:border-r-0"
                          >
                            {renderIsowaText(
                              h,
                              'off',
                              revealedKeys,
                              toggleKey,
                              `${activeSheet.id}_p${pageIdx}_th${hIdx}`,
                            )}
                          </th>
                        ))}
                        <th
                          scope="col"
                          className="w-12 border-b border-slate-300 px-1.5 py-2 text-center text-[11px] font-extrabold text-slate-600"
                          title="タップして ○ → × → 空欄 で要復習チェック！"
                        >
                          メモ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPage.table.rows.map((row, rIdx) => {
                        const rowMarkKey = `${activeSheet.id}_p${pageIdx}_tr${rIdx}`;
                        const rowMark = tableRowMarks[rowMarkKey] || '';
                        return (
                          <tr key={rIdx} className="even:bg-[#FCF9F2]">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="border-b border-r border-slate-200 px-2.5 py-2 leading-relaxed text-[#2C3E50] whitespace-pre-line"
                              >
                                {renderIsowaText(
                                  cell,
                                  maskMode,
                                  revealedKeys,
                                  toggleKey,
                                  `${activeSheet.id}_p${pageIdx}_r${rIdx}_c${cIdx}`,
                                )}
                              </td>
                            ))}
                            <td className="border-b border-slate-200 p-0 text-center">
                              <button
                                type="button"
                                data-table-row-mark={rowMark || 'none'}
                                onClick={() =>
                                  setTableRowMarks((m) => ({
                                    ...m,
                                    [rowMarkKey]: NEXT_ROW_MARK[rowMark] ?? '',
                                  }))
                                }
                                aria-label={`行${rIdx + 1}のメモ：${rowMark || '未記入'}（タップで ○・× 切替）`}
                                className={`flex min-h-[40px] w-full items-center justify-center text-base font-black transition ${
                                  rowMark === '○'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : rowMark === '×'
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'
                                }`}
                              >
                                {rowMark || '・'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 枠囲み Point ボックス */}
              {currentPage.pointBox && (
                <div className="rounded-xl border-2 border-[#E6B86A] bg-[#FFFDF4] p-3">
                  <p className="mb-1 text-xs font-black text-[#A05A00]">
                    ★ {currentPage.pointBox.title}
                  </p>
                  <p className="text-xs leading-relaxed text-[#2C3E50] whitespace-pre-line sm:text-[13px]">
                    {renderIsowaText(
                      currentPage.pointBox.body,
                      maskMode,
                      revealedKeys,
                      toggleKey,
                      `${activeSheet.id}_p${pageIdx}_pt`,
                    )}
                  </p>
                </div>
              )}

              {/* 磯和式「×の理由を指摘できるか」即答○×チェック（スコア＆解き直しボタン付き） */}
              {currentPage.oxChecks && currentPage.oxChecks.length > 0 && (
                <section className="rounded-xl border border-[#DCE6F2] bg-[#F7FAFE] p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-extrabold text-[#1F4E79]">
                      ✓ 1秒即答 ○×チェック（×はどこが違うか根拠まで言えれば完璧！）
                    </p>
                    <div className="flex items-center gap-2 text-xs font-extrabold">
                      {currentOxStats.answered > 0 && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 ${
                            currentOxStats.correct === currentOxStats.total
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          正答 {currentOxStats.correct}/{currentOxStats.total}
                        </span>
                      )}
                      {currentOxStats.answered > 0 && (
                        <button
                          type="button"
                          onClick={resetCurrentPageOx}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <RotateCcw size={11} aria-hidden="true" />
                          <span>解き直す</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentPage.oxChecks.map((ox, oIdx) => {
                      const oxKey = `${activeSheet.id}_p${pageIdx}_ox${oIdx}`;
                      const picked = oxAnswers[oxKey];
                      const isCorrect = picked === ox.a;
                      return (
                        <div key={oxKey} className="rounded-lg border border-[#E3ECF6] bg-white p-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="flex-1 text-xs leading-relaxed text-[#1F2D3D] sm:text-[13px]">
                              <span className="mr-1.5 font-extrabold text-[#2E75B6]">Q{oIdx + 1}.</span>
                              {ox.q}
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {(['○', '×'] as const).map((choice) => {
                                const selected = picked === choice;
                                return (
                                  <button
                                    key={choice}
                                    type="button"
                                    onClick={() => {
                                      setOxAnswers((prev) => ({ ...prev, [oxKey]: choice }));
                                      void recordVocabActivity('vocab_learn', 1, oxKey);
                                    }}
                                    className={`h-9 w-9 rounded-full border text-sm font-black transition ${
                                      selected
                                        ? choice === ox.a
                                          ? 'border-[#27AE60] bg-[#27AE60] text-white'
                                          : 'border-[#E74C3C] bg-[#E74C3C] text-white'
                                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-[#EFF6FF]'
                                    }`}
                                  >
                                    {choice}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          {picked && (
                            <div
                              className={`mt-1.5 rounded-md px-2.5 py-1.5 text-xs leading-relaxed ${
                                isCorrect
                                  ? 'bg-[#EAFAF1] text-[#1E8449]'
                                  : 'bg-[#FDEDEC] text-[#B03A2E]'
                              }`}
                            >
                              <span className="mr-1.5 font-black">
                                {isCorrect ? `正解（${ox.a}）！` : `正解は「${ox.a}」！`}
                              </span>
                              <span>{ox.why}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* 右（またはモバイルの「図表資料」タブ時）：マナトビリスニング第6問B準拠 1画面図表資料デッキ */}
            {hasFigures && (
              <aside
                aria-label="共通テスト図表資料"
                className={`${
                  subPaneTab === 'materials' ? 'flex flex-1' : 'hidden lg:flex'
                } min-h-0 flex-col lg:col-span-5`}
              >
                <SocialMaterialDeck
                  figures={pageFigures}
                  memoItems={currentPage.figureMemoItems}
                  accentColor={theme.accent}
                />
              </aside>
            )}
          </div>
        </main>
      ) : null}

      {/* 4. 下部固定 1画面ページ送りバー */}
      {activeSheet && (
        <footer className="mt-1.5 flex shrink-0 items-center justify-between gap-2 rounded-2xl border border-[#DFD5BE] bg-white/96 px-3 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#E5DEC9] bg-[#FAF7F0] px-3 text-xs font-extrabold text-[#2C3E50] transition hover:bg-white disabled:opacity-35 sm:px-3.5 sm:text-sm"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span>{pageIdx > 0 ? '前のページ' : '前の単元'}</span>
          </button>

          {/* 中央：ページドット＆この単元を演習 */}
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
            <div className="flex items-center gap-1.5" role="navigation" aria-label="ページ位置">
              {pages.map((_, idx) => {
                const active = idx === pageIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPageIdx(idx)}
                    aria-label={`ページ ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      active ? 'w-6' : 'w-2.5 bg-[#D5CBB4] hover:bg-[#B8AC90]'
                    }`}
                    style={active ? { backgroundColor: theme.accent } : undefined}
                  />
                );
              })}
              <span className="ml-1 text-xs font-extrabold text-[#5D6D7E]">
                {pageIdx + 1} / {totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                markCurrentPageRead();
                void recordVocabActivity('vocab_perfect', 1, `practice:${activeSheet.id}`);
                onPracticeChapter(activeSheet.chapterId);
              }}
              className="inline-flex min-h-[34px] items-center gap-1 rounded-full border px-3 text-xs font-extrabold transition hover:opacity-90"
              style={{ borderColor: theme.accent, color: theme.accent, backgroundColor: theme.accentSoft }}
            >
              <BookOpen size={14} aria-hidden="true" />
              <span>この単元を演習</span>
            </button>
          </div>

          {/* 右：次のページ or 次の単元へ */}
          {!isLastPageOfUnit ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full px-3.5 text-xs font-extrabold text-white shadow-2xs transition hover:opacity-95 sm:px-4 sm:text-sm"
              style={{ backgroundColor: theme.accent }}
            >
              <span>次のページ</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : hasNextUnit ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full bg-[#1E8449] px-3.5 text-xs font-extrabold text-white shadow-2xs transition hover:bg-[#196F3D] sm:px-4 sm:text-sm"
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>次の単元へ</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                markCurrentPageRead();
                onPracticeChapter(activeSheet.chapterId);
              }}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full bg-[#1E8449] px-3.5 text-xs font-extrabold text-white shadow-2xs sm:px-4 sm:text-sm"
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>全単元完走！演習へ</span>
            </button>
          )}
        </footer>
      )}

      {/* 5. 1秒インデックス語句検索モーダル */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-3 pt-12 sm:p-6 sm:pt-16"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#E2D9C2] bg-[#FFFDF8] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-[#EFE8D5] px-3.5 py-2.5">
              <Search size={18} style={{ color: theme.accent }} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${theme.label}の全${totalSubjectPages}ページから人物・条約・判例・語句を検索…`}
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#1F2D3D] placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#34495E]"
                aria-label="検索を閉じる"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {!searchQuery.trim() ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <p className="font-bold text-slate-700">
                    調べたいキーワードを入力すると、該当する単元・Stepへ1タップでジャンプします
                  </p>
                  <p className="mt-1">複数語スペース区切り（AND検索）にも対応しています</p>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="py-6 text-center text-xs font-bold text-slate-500">
                  「{searchQuery}」に一致するページは見つかりませんでした
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="px-1 text-[11px] font-extrabold text-slate-500">
                    {searchResults.length}件ヒット（タップで該当ページへ直行）
                  </p>
                  {searchResults.map(({ entry, snippet }) => (
                    <button
                      key={`${entry.sheetIdx}_${entry.pageIdx}`}
                      type="button"
                      onClick={() => selectUnit(entry.sheetIdx, entry.pageIdx)}
                      className="flex w-full flex-col items-start rounded-xl border border-[#E5DEC9] bg-white p-2.5 text-left transition hover:border-slate-400 hover:bg-[#FCF9F2]"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold">
                        <span
                          className="rounded px-1.5 py-0.5 text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          {entry.unitLabel}・Step {entry.pageIdx + 1}
                        </span>
                        <span className="text-[#1F2D3D]">{entry.unitTitle}</span>
                      </div>
                      <p className="mt-1 text-xs font-extrabold text-[#2C3E50]">{entry.pageTitle}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-slate-600">
                        {snippet}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. 単元目次モーダル（全単元一覧 ⇔ 要復習ブックマーク切替対応） */}
      {tocOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-6"
          onClick={() => setTocOpen(false)}
        >
          <div
            className="flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E2D9C2] bg-[#FFFDF8] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8D5] px-4 py-3">
              <div>
                <p className="text-xs font-bold text-[#6C7A89]">
                  {theme.label}（全{sheets.length}単元・全{totalSubjectPages}ページ完全網羅）
                </p>
                <h2 className="text-base font-extrabold text-[#1F2D3D]">単元別 まとめプリント目次</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTocBookmarkOnly((v) => !v)}
                  className={`inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3 text-xs font-extrabold transition ${
                    tocBookmarkOnly
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'border-[#E5DEC9] bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark size={13} fill={tocBookmarkOnly ? '#F59E0B' : 'none'} aria-hidden="true" />
                  <span>要復習のみ({subjectBookmarks.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTocOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#34495E]"
                  aria-label="目次を閉じる"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {tocBookmarkOnly ? (
                subjectBookmarks.length === 0 ? (
                  <p className="py-8 text-center text-xs font-bold text-slate-500">
                    まだ要復習ブックマークされたページがありません。各ページ右上の「要復習」ボタンで登録できます。
                  </p>
                ) : (
                  <div className="space-y-2">
                    {subjectBookmarks.map((bm) => (
                      <button
                        key={bm.key}
                        type="button"
                        onClick={() => selectUnit(bm.sheetIdx, bm.pageIdx)}
                        className="flex w-full flex-col items-start rounded-xl border border-amber-300 bg-amber-50/40 p-3 text-left transition hover:bg-amber-50"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800">
                          <Bookmark size={12} fill="#F59E0B" aria-hidden="true" />
                          <span>
                            {bm.unitLabel}・Step {bm.pageIdx + 1}｜{bm.unitTitle}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-[#1F2D3D]">{bm.pageTitle}</p>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                groupedByPart.map(([partTitle, entries]) => (
                  <div key={partTitle}>
                    <h3
                      className="mb-2 text-xs font-black tracking-wide uppercase"
                      style={{ color: theme.accent }}
                    >
                      ■ {partTitle}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {entries.map(({ sheet, index }) => {
                        const active = index === activeSheetIdx;
                        const readPages = sheet.pages.filter((_, p) =>
                          completedPages.has(`${sheet.id}_p${p}`),
                        ).length;
                        const figCount = sheet.pages.reduce(
                          (acc, p) => acc + (p.figures?.length ?? 0),
                          0,
                        );
                        return (
                          <button
                            key={sheet.id}
                            type="button"
                            onClick={() => selectUnit(index)}
                            className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                              active
                                ? 'border-2 bg-[#FAF6EC]'
                                : 'border-[#E5DEC9] bg-white hover:bg-[#FCF9F2]'
                            }`}
                            style={active ? { borderColor: theme.accent } : undefined}
                          >
                            <div className="flex w-full items-center justify-between gap-2 text-[11px] font-extrabold">
                              <span className="flex items-center gap-1" style={{ color: theme.accent }}>
                                <span>{sheet.unitLabel}</span>
                                {figCount > 0 && (
                                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                                    資料{figCount}
                                  </span>
                                )}
                              </span>
                              <span className="text-[#6C7A89]">
                                {readPages}/{sheet.pages.length} ページ読了
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-extrabold text-[#1F2D3D]">{sheet.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-[11.5px] text-[#5D6D7E]">
                              {sheet.subtitle}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
