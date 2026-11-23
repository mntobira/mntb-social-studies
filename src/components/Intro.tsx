import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronLeft, Coins, Compass, Heart, Music, PenLine, Repeat2, Swords, Target, Trophy } from 'lucide-react';
import { TobiraBuddy } from './TobiraBuddy';
import './intro.css';
import { KineticText } from '../motion';

/**
 * 使い方（2026-10-01 D 作り直し）
 *   以前は見出し＋段落3つだけで、何から始めればいいか伝わらなかった。
 *   ① 4ステップ（演習 → 単語 → 復習 → 対戦）を絵と短い一言で
 *   ② ごほうび（マナコイン・ミッション・ガチャ）の流れ
 *   ③ 困ったとき（よくある質問）は畳む
 *   ④ クレジット（BGM の配布元・URL は利用規約で記載が必須）
 */
const STEPS = [
  { icon: Compass, tone: 'blue', title: '5科目の実戦大問を解く', body: '日本史・世界史・地理・政経・倫理。史料・統計・年代整序・組合せ正誤を本番形式で演習。' },
  { icon: BookOpen, tone: 'gold', title: '赤シートで要点を固める', body: '各科目のまとめプリントで頻出用語・判例・統計判別・思想対比をタップ開閉で暗記。' },
  { icon: Repeat2, tone: 'lilac', title: '間違いを復習ノートへ', body: '間違えた問題は自動で復習リストへ。忘却曲線に沿って出し直すので苦手が残らない。' },
  { icon: Swords, tone: 'night', title: '社会科バトルで力試し', body: 'AIはゲストでもすぐ。フレンド・全国対戦はログインで。正解＋速さで勝負。' },
] as const;

const FAQ = [
  { q: 'BGMを切り替えたい', a: 'ホーム右上のスピーカーボタン、または設定画面から BGM のオン・オフと音量を切り替えられます。' },
  { q: '赤シートはどう使う？', a: '学習タブから各科目の「赤シートまとめプリント」を開き、赤い空欄をタップすると1語ずつ表示・非表示を切り替えられます。右上のボタンで一括ON/OFFもできます。' },
  { q: '対戦がつながらない', a: '対戦メニューの「つながらないとき」から通信チェックができます。学校の Wi‑Fi では自動で通信方式を切り替えます。' },
  { q: '記録はどこに保存される？', a: 'ゲストはこの端末に保存します。Google でログインすると、ほかの端末でも同じ記録を使えます。' },
  { q: 'マナコインは何に使う？', a: 'ガチャ・ショップで、とびら君のきせかえや共通テスト予想プリントと交換できます。課金はありません。' },
];

export function Intro({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  return <main className="intro-page pb-app-nav" data-intro>
    <header className="intro-head">
      <button type="button" className="intro-back" onClick={onBack} aria-label="ホームに戻る"><ChevronLeft size={18} aria-hidden="true" /><span>ホーム</span></button>
      <h1><KineticText text="使い方" /></h1>
    </header>

    <section className="intro-hero" aria-label="マナトビとは">
      <TobiraBuddy size="md" input={{ screen: 'home' }} pose="/mascots/bowing.webp" line="ようこそ！ 4ステップで、共通テスト社会の得点源をつくろう" />
    </section>

    <ol className="intro-steps" aria-label="4つのステップ">
      {STEPS.map((s, i) => <li key={s.title} className="intro-step" data-tone={s.tone}>
        <span className="intro-step-no" aria-hidden="true">{i + 1}</span>
        <span className="intro-step-icon" aria-hidden="true"><s.icon /></span>
        <h2>{s.title}</h2>
        <p>{s.body}</p>
      </li>)}
    </ol>

    <section className="intro-loop" aria-label="ごほうびの流れ">
      <h2>がんばると、こうなる</h2>
      <ul>
        <li><PenLine aria-hidden="true" /><span>解く・覚える</span></li>
        <li aria-hidden="true" className="intro-arrow">→</li>
        <li><Target aria-hidden="true" /><span>ミッション達成</span></li>
        <li aria-hidden="true" className="intro-arrow">→</li>
        <li><Coins aria-hidden="true" /><span>マナコイン</span></li>
        <li aria-hidden="true" className="intro-arrow">→</li>
        <li><Trophy aria-hidden="true" /><span>ガチャ・きせかえ</span></li>
      </ul>
    </section>

    <section className="intro-faq" aria-label="困ったとき">
      <h2>困ったとき</h2>
      {FAQ.map((f, i) => <div key={f.q} className="intro-faq-item" data-open={open === i || undefined}>
        <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span>{f.q}</span><ChevronDown size={18} aria-hidden="true" /></button>
        {open === i && <p>{f.a}</p>}
      </div>)}
    </section>

    {/* ★応援してくださっている方（2026-10-01）★ 利用者の依頼で明記。URLは動画の概要欄で確認済み */}
    <section className="intro-support" aria-label="応援してくださっている方" data-intro-support>
      <h2><Heart size={16} aria-hidden="true" />応援してくださっている方</h2>
      <p>このアプリは、YouTubeチャンネル<b>「カサニマロ【べんとう・ふきのとうの授業動画】」</b>さんに支えていただいています。
        理科基礎の動画の概要欄で、元のマナトビのアプリ（化学基礎）を紹介していただきました。ありがとうございます！</p>
      <ul>
        <li><span>紹介していただいた動画（2026年7月29日公開）</span>
          <a href={KASANIMARO.video} target="_blank" rel="noopener noreferrer">【最短】理科基礎で9割取る方法【アプリ・参考書・勉強法】</a></li>
        <li><span>カサニマロ YouTube チャンネル</span><a href={KASANIMARO.channel} target="_blank" rel="noopener noreferrer">{KASANIMARO.channel}</a></li>
        <li><span>カサニマロ 公式サイト</span><a href={KASANIMARO.site} target="_blank" rel="noopener noreferrer">{KASANIMARO.site}</a></li>
        <li><span>動画で紹介された元のマナトビ（化学基礎）</span><a href={KASANIMARO.app} target="_blank" rel="noopener noreferrer">{KASANIMARO.app}</a></li>
      </ul>
    </section>

    <section className="intro-credit" aria-label="クレジット" data-intro-credit>
      <h2><Music size={16} aria-hidden="true" />クレジット</h2>
      <dl>
        <div><dt>対戦の待ち時間 BGM</dt><dd>「夕凪」作曲：やっすん</dd></div>
        <div><dt>対戦中 BGM</dt><dd>「風の列車」作曲：坂田白</dd></div>
        <div><dt>配布元</dt><dd>創作堂さくら紅葉 <a href="https://yukizakura.net/" target="_blank" rel="noopener noreferrer">https://yukizakura.net/</a></dd></div>
        <div><dt>対戦中 BGM</dt><dd>「カナリアスキップ」作曲：まんぼう二等兵（OpenTracks）</dd></div>
      </dl>
    </section>

    {/* D4（2026-10-30）：下の「対戦ロビーへ」「さっそく始める」は削除（上の ← ホームで戻る） */}
  </main>;
}

/** カサニマロさん関連のURL（動画概要欄 https://www.youtube.com/watch?v=g1PBc7Axnlo で確認 2026-10-01） */
export const KASANIMARO = {
  video: 'https://www.youtube.com/watch?v=g1PBc7Axnlo',
  channel: 'https://www.youtube.com/@kasanimaro',
  site: 'https://kasanimaro.com/',
  app: 'https://chembasis.manatobi.jp/',
} as const;
