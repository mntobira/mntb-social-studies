/**
 * ===================================================================
 * マナトビリスニング第6問B準拠 社会科図表資料ビューア（SocialMaterialDeck）
 * ===================================================================
 * マナトビリスニング第6問B（ListeningMaterials.tsx）の設計思想・手触りを完全継承：
 *  1. FitFigure: ResizeObserver＋画像の自然縦横比から枠内に収まる最大実寸を算出し、
 *     CSS object-contain の余白による印ズレをゼロにする。
 *  2. タップ○×鉛筆メモ: 図やグラフの任意の場所をタップすると ○ → × → 消去（44px判定半径）。
 *     本番の試験冊子に鉛筆で○×を書き込んで消去法で絞る感覚をそのまま再現。
 *  3. FigureCarousel: 複数枚の資料（①〜④）は縦に並べてスクロールさせるのではなく、
 *     1枚ずつ大きく表示し、左右の44px「‹」「›」ボタン・番号ピル・左右スワイプ・矢印キーで切替。
 *     切り替えても各図に書き込んだ○×メモは消えずに保持される。
 *  4. 1行比較○×メモバー: 図の上に比較項目ボタンを1行で並べ、タップで ○ → × → 未記入 を切替。
 *  5. 拡大ダイアログ: 右上44px「拡大」ボタンで全画面ピンチズーム・ドラッグ確認が可能。
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PrintFigure } from '../data/summaryPrints/types';

export type FigureMark = { x: number; y: number; m: '○' | '×' };

const MARK_HIT = 22;
const NEXT_MARK: Record<string, string> = { '': '○', '○': '×', '×': '' };

export function SocialFitFigure({
  figure,
  badge,
  marks,
  onMarks,
  onZoom,
}: {
  figure: PrintFigure;
  badge?: string;
  marks: FigureMark[];
  onMarks: (next: FigureMark[]) => void;
  onZoom: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [ratio, setRatio] = useState(4 / 3);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth && img.naturalHeight) {
      setRatio(img.naturalWidth / img.naturalHeight);
    }
    const el = boxRef.current;
    if (!el) return;
    const measure = () =>
      setBox((b) =>
        b.w === el.clientWidth && b.h === el.clientHeight
          ? b
          : { w: el.clientWidth, h: el.clientHeight },
      );
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [figure.src]);

  const size =
    ratio && box.w && box.h
      ? box.w / box.h > ratio
        ? { width: Math.floor(box.h * ratio), height: box.h }
        : { width: box.w, height: Math.floor(box.w / ratio) }
      : null;

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const hit = marks.findIndex(
      (k) => Math.hypot(k.x * r.width - px, k.y * r.height - py) <= MARK_HIT,
    );
    if (hit < 0) {
      onMarks([...marks, { x: px / r.width, y: py / r.height, m: '○' }]);
      return;
    }
    onMarks(
      marks[hit].m === '○'
        ? marks.map((k, i) => (i === hit ? { ...k, m: '×' } : k))
        : marks.filter((_, i) => i !== hit),
    );
  };

  return (
    <figure data-social-material-graph className="relative m-0 flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <figcaption className="sr-only">{figure.caption}</figcaption>
      <div ref={boxRef} className="relative min-h-[190px] flex-1 overflow-hidden sm:min-h-[240px]">
        <div
          data-material-figure-tap
          role="button"
          tabIndex={0}
          onClick={onTap}
          aria-label={`${figure.caption}：タップした場所に ○／× メモを書く（現在 ${marks.length} 個）`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onZoom();
            }
          }}
          className="absolute cursor-crosshair select-none overflow-hidden rounded-[3px] border border-slate-400 bg-white shadow-2xs"
          style={
            size
              ? {
                  width: size.width,
                  height: size.height,
                  left: (box.w - size.width) / 2,
                  top: (box.h - size.height) / 2,
                  touchAction: 'manipulation',
                }
              : { inset: 0, visibility: 'hidden' }
          }
        >
          <img
            ref={imgRef}
            src={figure.src}
            alt={figure.caption}
            draggable={false}
            className="block h-full w-full"
            onLoad={(e) => {
              const i = e.currentTarget;
              if (i.naturalWidth && i.naturalHeight) {
                setRatio(i.naturalWidth / i.naturalHeight);
              }
            }}
          />
          {marks.map((k, i) => (
            <span
              key={i}
              aria-hidden="true"
              data-figure-mark={k.m}
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[28px] font-black leading-none ${
                k.m === '○' ? 'text-rose-600' : 'text-blue-700'
              }`}
              style={{
                left: `${k.x * 100}%`,
                top: `${k.y * 100}%`,
                textShadow: '0 0 3px #fff, 0 0 4px #fff',
              }}
            >
              {k.m}
            </span>
          ))}
          {!marks.length && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-white/92 px-2 py-0.5 text-[11px] font-extrabold text-[#2C3E50] ring-1 ring-slate-300"
            >
              図をタップで ○×メモ
            </span>
          )}
          {badge && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1 top-1 rounded bg-[#2C3E50]/95 px-2 py-0.5 text-xs font-extrabold text-white shadow-2xs"
            >
              {badge}
            </span>
          )}
        </div>

        {/* 右上：印クリア（印があるときのみ）＋ 44px 拡大ボタン */}
        <div className="absolute right-0 top-0 flex items-start gap-1 p-0.5">
          {marks.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarks([]);
              }}
              className="mt-0.5 rounded-full border border-slate-300 bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              印を消す
            </button>
          )}
          <button
            type="button"
            onClick={onZoom}
            aria-label={`${figure.caption}を全画面で拡大する`}
            data-material-zoom-open
            className="flex h-11 w-11 items-start justify-end p-0.5"
          >
            <span
              aria-hidden="true"
              className="rounded-full bg-[#2C3E50]/92 px-2 py-0.5 text-xs font-extrabold leading-5 text-white shadow-2xs"
            >
              拡大
            </span>
          </button>
        </div>
      </div>
    </figure>
  );
}

export function SocialMaterialDeck({
  figures,
  memoItems,
  accentColor = '#2C3E50',
  compactHeight = false,
}: {
  figures: PrintFigure[];
  memoItems?: string[];
  accentColor?: string;
  /** ProblemPane 埋め込み時など高さを自動制御したいとき */
  compactHeight?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [itemMarks, setItemMarks] = useState<Record<number, string>>({});
  const [figureMarks, setFigureMarks] = useState<Record<string, FigureMark[]>>({});
  const [zoomed, setZoomed] = useState<PrintFigure | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIndex(0);
    setItemMarks({});
    setFigureMarks({});
    setZoomed(null);
  }, [figures]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed]);

  if (!figures.length) return null;

  const safeIndex = index < figures.length ? index : 0;
  const activeFig = figures[safeIndex];
  const count = figures.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  const labels = figures.map(
    (f, i) => f.badge ?? f.caption.match(/^[①②③④⑤⑥]|\S+/)?.[0] ?? String(i + 1),
  );

  return (
    <div
      data-social-material-deck
      className={`flex min-h-0 min-w-0 flex-col rounded-xl border border-slate-300 bg-[#F8FAFC] p-2.5 sm:p-3 ${
        compactHeight ? '' : 'flex-1'
      }`}
      onKeyDown={(e) => {
        if (count < 2) return;
        if (e.key === 'ArrowLeft') {
          e.stopPropagation();
          e.preventDefault();
          go(-1);
        } else if (e.key === 'ArrowRight') {
          e.stopPropagation();
          e.preventDefault();
          go(1);
        }
      }}
    >
      {/* 第6問B式：1行比較○×メモバー（タップで ○ → × → 空欄） */}
      {memoItems && memoItems.length > 0 && (
        <div
          data-material-memo
          className="mb-2 flex shrink-0 flex-wrap items-center gap-1.5"
          aria-label="資料の比較○×メモ欄"
        >
          <span className="shrink-0 rounded bg-slate-200/80 px-1.5 py-0.5 text-[11px] font-extrabold text-slate-700">
            比較メモ
          </span>
          {memoItems.map((label, i) => {
            const mark = itemMarks[i] || '';
            return (
              <button
                key={i}
                type="button"
                data-material-mark={mark || 'none'}
                onClick={() => setItemMarks((m) => ({ ...m, [i]: NEXT_MARK[mark] ?? '' }))}
                aria-label={`${label}：${mark === '○' ? '○' : mark === '×' ? '×' : '未記入'}（タップで切替）`}
                className={`flex min-h-[38px] min-w-[78px] flex-1 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-extrabold transition sm:min-h-[42px] sm:text-[13px] ${
                  mark === '○'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : mark === '×'
                      ? 'border-rose-400 bg-rose-50 text-rose-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="min-w-0 truncate">{label}</span>
                <span aria-hidden="true" className="text-base font-black leading-none">
                  {mark || '・'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* メイン図版エリア（複数枚なら第6問Bカルーセル、1枚なら単独FitFigure） */}
      <div
        className={`relative flex min-h-0 flex-1 items-stretch gap-1.5 ${
          compactHeight ? 'h-[230px] sm:h-[270px]' : 'min-h-[210px] sm:min-h-[260px]'
        }`}
        onTouchStart={(e) => {
          if (count < 2) return;
          const t = e.touches[0];
          touchRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (count < 2) return;
          const s = touchRef.current;
          touchRef.current = null;
          const t = e.changedTouches[0];
          if (!s || !t) return;
          const dx = t.clientX - s.x;
          const dy = t.clientY - s.y;
          if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            e.stopPropagation();
            go(dx < 0 ? 1 : -1);
          }
        }}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="前の資料図へ"
            data-carousel-prev
            className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl font-black text-[#2C3E50] shadow-2xs transition hover:bg-slate-50 active:bg-slate-100"
          >
            ‹
          </button>
        )}

        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          aria-live="polite"
          aria-label={`資料 ${safeIndex + 1} / ${count}（${activeFig.caption}）`}
        >
          <SocialFitFigure
            figure={activeFig}
            badge={count > 1 ? labels[safeIndex] : activeFig.badge}
            marks={figureMarks[activeFig.src] ?? []}
            onMarks={(next) => setFigureMarks((m) => ({ ...m, [activeFig.src]: next }))}
            onZoom={() => setZoomed(activeFig)}
          />
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="次の資料図へ"
            data-carousel-next
            className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl font-black text-[#2C3E50] shadow-2xs transition hover:bg-slate-50 active:bg-slate-100"
          >
            ›
          </button>
        )}
      </div>

      {/* キャプション＆着眼点ワンポイント */}
      <div className="mt-2 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <p className="text-xs font-extrabold text-[#1F2D3D] sm:text-[13px]">{activeFig.caption}</p>
        {activeFig.note && (
          <p className="mt-0.5 text-[11.5px] font-semibold leading-snug text-slate-600 sm:text-xs">
            <span className="mr-1 font-extrabold" style={{ color: accentColor }}>
              着眼点：
            </span>
            {activeFig.note}
          </p>
        )}
      </div>

      {/* 複数枚時の第6問B式 番号タブピル（44pxタッチターゲット） */}
      {count > 1 && (
        <div
          className="mt-2 flex shrink-0 flex-wrap items-center justify-center gap-1.5"
          role="tablist"
          aria-label="資料を切り替える"
        >
          {labels.map((label, i) => {
            const active = i === safeIndex;
            const markCount = (figureMarks[figures[i].src] ?? []).length;
            return (
              <button
                key={figures[i].src}
                type="button"
                role="tab"
                aria-selected={active}
                data-carousel-dot={i}
                onClick={() => setIndex(i)}
                className={`inline-flex min-h-[40px] min-w-[44px] items-center justify-center gap-1 rounded-full border px-3 text-xs font-extrabold transition sm:text-[13px] ${
                  active
                    ? 'text-white shadow-2xs'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                style={
                  active ? { backgroundColor: accentColor, borderColor: accentColor } : undefined
                }
              >
                <span>{label}</span>
                {markCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-black ${
                      active ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {markCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 第6問B準拠：全画面ピンチズーム拡大モーダル */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomed.caption}（拡大表示）`}
          data-material-zoom
          className="fixed inset-0 z-[200] flex flex-col bg-black/90"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2 text-white">
            <span className="min-w-0 truncate text-sm font-bold">{zoomed.caption}</span>
            <button
              type="button"
              onClick={() => setZoomed(null)}
              autoFocus
              className="min-h-11 min-w-11 shrink-0 rounded-lg bg-white px-3.5 text-sm font-extrabold text-[#2C3E50]"
            >
              閉じる
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center overflow-auto overscroll-contain p-2"
            style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setZoomed(null);
            }}
          >
            <img
              src={zoomed.src}
              alt={zoomed.caption}
              className="mx-auto block h-auto max-w-none rounded bg-white shadow-lg"
              style={{ width: 'max(100%, min(960px, 165vh))' }}
            />
          </div>
          <p className="shrink-0 px-3 py-1.5 text-center text-xs text-slate-200">
            ピンチ操作で拡大・ドラッグで細部を確認できます（Escまたは背景タップで閉じる）
          </p>
        </div>
      )}
    </div>
  );
}
