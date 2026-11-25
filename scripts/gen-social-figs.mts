/**
 * ===================================================================
 * 共通テスト社会科（地歴・公民）専用 高精細SVG図版ジェネレーター
 * ===================================================================
 *   npx tsx scripts/gen-social-figs.mts
 *
 * 令和7年度〜新課程「大学入学共通テスト」で実際に頻出する図表・地図・統計グラフ・
 * 経済モデルを、スマホ(320px〜)でもPCでも拡大劣化ゼロで読めるベクターSVGとして
 * public/social_figs/ に出力する。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/social_figs');
mkdirSync(OUT_DIR, { recursive: true });

const SVG_HEAD = (w: number, h: number, title: string) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}" style="font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;background:#fffdf8">`;

const figs: Record<string, string> = {
  // 1. 日本史探究：幕末開港後の金銀比価差による金流出メカニズム＆貿易額推移
  'jh_bakumatsu_gold.svg': `${SVG_HEAD(680, 320, '幕末開港時の内外金銀比価と貿易構造')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　1859年開港直後の内外金銀比価と小判流出のしくみ</text>
  <!-- 左：日本の比価 -->
  <rect x="28" y="54" width="276" height="156" rx="12" fill="#fdf6ec" stroke="#d8b989" stroke-width="1.5"/>
  <text x="166" y="78" text-anchor="middle" font-size="14" font-weight="800" fill="#963627">日本国内の交換比率（金1：銀5）</text>
  <circle cx="92" cy="132" r="32" fill="#f3c64f" stroke="#b98519" stroke-width="2"/>
  <text x="92" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="#5c3d04">天保小判</text>
  <text x="92" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="#5c3d04">1枚(1両)</text>
  <text x="150" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#2c3e50">＝</text>
  <g fill="#dce4ec" stroke="#6c7d8e" stroke-width="1.5">
    <rect x="176" y="96" width="48" height="30" rx="5"/><rect x="232" y="96" width="48" height="30" rx="5"/>
    <rect x="176" y="136" width="48" height="30" rx="5"/><rect x="232" y="136" width="48" height="30" rx="5"/>
  </g>
  <text x="228" y="186" text-anchor="middle" font-size="12" font-weight="700" fill="#34495e">一分銀 4枚（＝洋銀約1.3枚分）</text>
  <!-- 右：国際市場の比価 -->
  <rect x="376" y="54" width="276" height="156" rx="12" fill="#f3f7fc" stroke="#9ab4d8" stroke-width="1.5"/>
  <text x="514" y="78" text-anchor="middle" font-size="14" font-weight="800" fill="#1f467d">上海・国際市場の比率（金1：銀15）</text>
  <circle cx="436" cy="132" r="32" fill="#f3c64f" stroke="#b98519" stroke-width="2"/>
  <text x="436" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="#5c3d04">金 1単位</text>
  <text x="436" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="#5c3d04">(小判1両相当)</text>
  <text x="492" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#2c3e50">＝</text>
  <rect x="516" y="96" width="118" height="72" rx="8" fill="#e3ecf5" stroke="#5d7896" stroke-width="1.5"/>
  <text x="575" y="126" text-anchor="middle" font-size="13" font-weight="800" fill="#1f467d">洋銀（メキシコ銀）</text>
  <text x="575" y="148" text-anchor="middle" font-size="14" font-weight="900" fill="#b84a39">約 4枚（一分銀12枚相当）</text>
  <!-- 矢印 -->
  <path d="M308 112 L368 112" stroke="#b84a39" stroke-width="3" marker-end="url(#arrR)"/>
  <path d="M368 154 L308 154" stroke="#2b5b9e" stroke-width="3" marker-end="url(#arrB)"/>
  <defs>
    <marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b84a39"/></marker>
    <marker id="arrB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2b5b9e"/></marker>
  </defs>
  <text x="340" y="104" text-anchor="middle" font-size="11" font-weight="800" fill="#b84a39">小判流出</text>
  <text x="340" y="172" text-anchor="middle" font-size="11" font-weight="800" fill="#2b5b9e">洋銀流入</text>
  <!-- 下部まとめ帯 -->
  <rect x="28" y="226" width="624" height="68" rx="10" fill="#fff5f2" stroke="#e4b9ae" stroke-width="1.5"/>
  <text x="44" y="250" font-size="13" font-weight="800" fill="#963627">● 外国商人の裁定取引：洋銀→一分銀→日本で小判に両替→上海で再び洋銀へ換えると1往復で約3倍の利益！</text>
  <text x="44" y="274" font-size="13" font-weight="700" fill="#2c3e50">● 幕府の対策（1860年）：【 万延の貨幣改鋳 】で小判の金含有量を約3分の1に引き下げ → 激しい物価騰貴を招いた。</text>
</svg>`,

  // 2. 日本史探究：1920〜36年の日本経済指標（卸売物価・生糸輸出額・軍事費比率）
  'jh_showa_depression.svg': `${SVG_HEAD(680, 330, '1926〜1936年の日本の卸売物価指数と為替相場推移')}
  <rect x="8" y="8" width="664" height="314" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図2　昭和初期の日本の卸売物価指数（1926年＝100）と対米為替の推移</text>
  <!-- 軸 -->
  <line x1="76" y1="62" x2="76" y2="256" stroke="#5d6d7e" stroke-width="1.8"/>
  <line x1="76" y1="256" x2="624" y2="256" stroke="#5d6d7e" stroke-width="1.8"/>
  <!-- 横グリッド -->
  <g stroke="#e6dfd1" stroke-dasharray="4 4" stroke-width="1">
    <line x1="76" y1="82" x2="624" y2="82"/>
    <line x1="76" y1="138" x2="624" y2="138"/>
    <line x1="76" y1="194" x2="624" y2="194"/>
  </g>
  <g font-size="12" fill="#5d6d7e" text-anchor="end" font-weight="700">
    <text x="68" y="86">100</text><text x="68" y="142">80</text><text x="68" y="198">60</text><text x="68" y="256">40</text>
  </g>
  <!-- 期間ハイライト -->
  <rect x="276" y="62" width="104" height="194" fill="#fdecea" opacity="0.75"/>
  <text x="328" y="78" text-anchor="middle" font-size="12" font-weight="800" fill="#b84a39">時期Ｘ(1930-31)</text>
  <rect x="380" y="62" width="208" height="194" fill="#eef6f2" opacity="0.75"/>
  <text x="484" y="78" text-anchor="middle" font-size="12" font-weight="800" fill="#216653">時期Ｙ(1932-35)</text>
  <!-- 折れ線：卸売物価指数 (1926:100, 1928:95, 1929:92, 1930:76, 1931:64, 1932:71, 1933:82, 1935:86) -->
  <polyline fill="none" stroke="#b84a39" stroke-width="3.5" points="96,82 174,96 252,104 304,149 356,183 418,163 488,132 588,121"/>
  <g fill="#b84a39">
    <circle cx="96" cy="82" r="5"/><circle cx="174" cy="96" r="5"/><circle cx="252" cy="104" r="5"/>
    <circle cx="304" cy="149" r="5.5"/><circle cx="356" cy="183" r="5.5"/>
    <circle cx="418" cy="163" r="5"/><circle cx="488" cy="132" r="5"/><circle cx="588" cy="121" r="5"/>
  </g>
  <!-- X軸年次 -->
  <g font-size="12" fill="#2c3e50" text-anchor="middle" font-weight="700">
    <text x="96" y="276">1926</text><text x="174" y="276">1928</text><text x="252" y="276">1929</text>
    <text x="304" y="276">1930</text><text x="356" y="276">1931</text><text x="418" y="276">1932</text>
    <text x="488" y="276">1933</text><text x="588" y="276">1935(年)</text>
  </g>
  <text x="356" y="204" text-anchor="middle" font-size="12" font-weight="800" fill="#963627">底：64（デフレ深刻化）</text>
  <text x="508" y="114" text-anchor="middle" font-size="12" font-weight="800" fill="#216653">円安・積極財政で物価・輸出回復</text>
  <text x="340" y="304" text-anchor="middle" font-size="12" fill="#5d6d7e">（日本銀行統計をもとに作成。1930年1月：旧平価金解禁 ／ 1931年12月：金輸出再禁止）</text>
</svg>`,

  // 3. 世界史探究：大西洋三角貿易と16〜18世紀の世界銀フロー概念図
  'wh_silver_triangle.svg': `${SVG_HEAD(680, 320, '16〜18世紀の世界の一体化と銀・商品の流れ')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　16〜18世紀における大西洋三角貿易と世界的な銀の環流</text>
  <!-- 4地域ボックス -->
  <rect x="250" y="54" width="160" height="58" rx="12" fill="#edf3fc" stroke="#2b5b9e" stroke-width="2"/>
  <text x="330" y="78" text-anchor="middle" font-size="14" font-weight="800" fill="#1f467d">西ヨーロッパ</text>
  <text x="330" y="98" text-anchor="middle" font-size="12" fill="#34495e">毛織物・武器・雑貨</text>

  <rect x="34" y="168" width="176" height="66" rx="12" fill="#fdf4e8" stroke="#c4762b" stroke-width="2"/>
  <text x="122" y="193" text-anchor="middle" font-size="14" font-weight="800" fill="#99581b">アメリカ大陸・カリブ海</text>
  <text x="122" y="214" text-anchor="middle" font-size="12" fill="#34495e">ポトシ銀山・砂糖・綿花・タバコ</text>

  <rect x="250" y="226" width="160" height="58" rx="12" fill="#faeee9" stroke="#b84a39" stroke-width="2"/>
  <text x="330" y="250" text-anchor="middle" font-size="14" font-weight="800" fill="#963627">西アフリカ</text>
  <text x="330" y="270" text-anchor="middle" font-size="12" fill="#34495e">黒人奴隷の強制連行</text>

  <rect x="468" y="142" width="180" height="92" rx="12" fill="#eef8f5" stroke="#2e856e" stroke-width="2"/>
  <text x="558" y="168" text-anchor="middle" font-size="14" font-weight="800" fill="#216653">東アジア（明・清／日本）</text>
  <text x="558" y="190" text-anchor="middle" font-size="12" fill="#34495e">生糸・絹織物・陶磁器・茶</text>
  <text x="558" y="210" text-anchor="middle" font-size="12" font-weight="800" fill="#216653">一条鞭法・地丁銀（銀需要）</text>

  <defs>
    <marker id="mBlue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2b5b9e"/></marker>
    <marker id="mRed" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b84a39"/></marker>
    <marker id="mGold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b9770e"/></marker>
  </defs>
  <!-- 矢印群 -->
  <path d="M312 114 L312 220" stroke="#2b5b9e" stroke-width="2.5" marker-end="url(#mBlue)"/>
  <text x="272" y="166" text-anchor="middle" font-size="12" font-weight="800" fill="#1f467d">【ア】武器・綿布</text>

  <path d="M248 252 L176 236" stroke="#b84a39" stroke-width="2.5" marker-end="url(#mRed)"/>
  <text x="206" y="268" text-anchor="middle" font-size="12" font-weight="800" fill="#963627">【イ】労働力</text>

  <path d="M138 166 L246 92" stroke="#b9770e" stroke-width="2.5" marker-end="url(#mGold)"/>
  <text x="164" y="114" text-anchor="middle" font-size="12" font-weight="800" fill="#99581b">【ウ】砂糖・銀</text>

  <path d="M412 86 L526 138" stroke="#b9770e" stroke-width="2.5" marker-end="url(#mGold)"/>
  <text x="494" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#99581b">銀による決済</text>

  <path d="M122 236 Q330 312 538 238" fill="none" stroke="#b9770e" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#mGold)"/>
  <text x="358" y="302" text-anchor="middle" font-size="12" font-weight="800" fill="#99581b">太平洋経由：【エ】貿易（アカプルコ〜マニラ・ガレオン船でメキシコ銀流入）</text>
</svg>`,

  // 4. 地理探究：世界の4都市のハイサーグラフ（気温・降水量）比較
  'ge_hythergraphs_4cities.svg': `${SVG_HEAD(680, 340, '世界の4都市ア〜エのハイサーグラフ')}
  <rect x="8" y="8" width="664" height="324" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　ユーラシア・オセアニア4都市（ア〜エ）のハイサーグラフ（1月・7月表示）</text>
  <!-- プロット枠 -->
  <line x1="88" y1="56" x2="88" y2="278" stroke="#5d6d7e" stroke-width="1.8"/>
  <line x1="88" y1="278" x2="628" y2="278" stroke="#5d6d7e" stroke-width="1.8"/>
  <g stroke="#e6dfd1" stroke-dasharray="4 4" stroke-width="1">
    <line x1="88" y1="88" x2="628" y2="88"/>
    <line x1="88" y1="148" x2="628" y2="148"/>
    <line x1="88" y1="208" x2="628" y2="208"/>
    <line x1="218" y1="56" x2="218" y2="278"/>
    <line x1="358" y1="56" x2="358" y2="278"/>
    <line x1="498" y1="56" x2="498" y2="278"/>
  </g>
  <!-- Y軸：月平均気温 (30, 20, 10, 0, -5) -->
  <g font-size="12" fill="#5d6d7e" text-anchor="end" font-weight="700">
    <text x="80" y="92">30℃</text><text x="80" y="152">15℃</text><text x="80" y="212">0℃</text><text x="80" y="274">-15℃</text>
  </g>
  <text x="30" y="172" text-anchor="middle" font-size="12" font-weight="800" fill="#34495e" transform="rotate(-90 30 172)">月平均気温（℃）</text>
  <!-- X軸：月降水量 (0, 100, 200, 300mm) -->
  <g font-size="12" fill="#5d6d7e" text-anchor="middle" font-weight="700">
    <text x="88" y="298">0</text><text x="218" y="298">100</text><text x="358" y="298">200</text><text x="498" y="298">300</text><text x="612" y="298">400(mm)</text>
  </g>
  <text x="358" y="320" text-anchor="middle" font-size="12" font-weight="800" fill="#34495e">月降水量（mm）</text>

  <!-- 都市ア：ローマ(Cs) 7月(25℃, 18mm)->(111,108), 1月(8℃, 80mm)->(192,176) 左上〜中央左の斜めループ -->
  <polygon points="111,108 136,126 192,176 164,154" fill="#f2cec7" fill-opacity="0.45" stroke="#b84a39" stroke-width="2.5"/>
  <circle cx="111" cy="108" r="4.5" fill="#b84a39"/><text x="114" y="98" font-size="12" font-weight="800" fill="#963627">ア(7月)</text>
  <circle cx="192" cy="176" r="4.5" fill="#b84a39"/><text x="200" y="184" font-size="12" font-weight="700" fill="#963627">1月</text>

  <!-- 都市イ：ロンドン(Cfb) 7月(17℃, 55mm)->(160,140), 1月(5℃, 60mm)->(166,188) 年較差小・降水年中安定の縦長小ループ -->
  <polygon points="160,140 174,162 166,188 148,166" fill="#c3d6f2" fill-opacity="0.55" stroke="#2b5b9e" stroke-width="2.5"/>
  <circle cx="160" cy="140" r="4.5" fill="#2b5b9e"/><text x="152" y="132" text-anchor="end" font-size="12" font-weight="800" fill="#1f467d">イ(7月)</text>
  <circle cx="166" cy="188" r="4.5" fill="#2b5b9e"/><text x="150" y="200" text-anchor="end" font-size="12" font-weight="700" fill="#1f467d">1月</text>

  <!-- 都市ウ：ソウル/北京系(Cw/Dwa モンスーン夏多雨・冬少雨寒冷) 7月(26℃, 320mm)->(524,104), 1月(-3℃, 18mm)->(111,222) -->
  <polygon points="524,104 340,145 111,222 290,168" fill="#bce5d8" fill-opacity="0.5" stroke="#2e856e" stroke-width="2.5"/>
  <circle cx="524" cy="104" r="4.5" fill="#2e856e"/><text x="532" y="102" font-size="12" font-weight="800" fill="#216653">ウ(7月)</text>
  <circle cx="111" cy="222" r="4.5" fill="#2e856e"/><text x="118" y="240" text-anchor="start" font-size="12" font-weight="700" fill="#216653">ウ(1月)</text>

  <!-- 都市エ：パース(南半球Cs！1月高温少雨・7月温和多雨) 1月(24℃, 12mm)->(104,112), 7月(13℃, 175mm)->(323,156) -->
  <polygon points="104,112 220,128 323,156 196,142" fill="#f2d6b8" fill-opacity="0.55" stroke="#c4762b" stroke-width="2.5" stroke-dasharray="5 3"/>
  <circle cx="104" cy="112" r="4.5" fill="#c4762b"/><text x="98" y="128" text-anchor="start" font-size="12" font-weight="800" fill="#99581b">エ(1月)</text>
  <circle cx="323" cy="156" r="4.5" fill="#c4762b"/><text x="332" y="160" font-size="12" font-weight="800" fill="#99581b">エ(7月)</text>
</svg>`,

  // 5. 政治・経済：比例代表ドント式の議席配分計算表＆小選挙区との比較
  'pe_dhondt_election.svg': `${SVG_HEAD(680, 310, '比例代表制におけるドント式の得票数と商の一覧表')}
  <rect x="8" y="8" width="664" height="294" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">表1　ある比例代表ブロック（定数6）における各党の得票数とドント式の商</text>
  <!-- テーブル -->
  <g transform="translate(36, 52)">
    <rect x="0" y="0" width="608" height="204" rx="10" fill="#ffffff" stroke="#d5c7ae" stroke-width="1.5"/>
    <rect x="0" y="0" width="608" height="40" rx="10" fill="#f7efe1"/>
    <!-- 列線 -->
    <line x1="128" y1="0" x2="128" y2="204" stroke="#e2d7c3"/>
    <line x1="248" y1="0" x2="248" y2="204" stroke="#e2d7c3"/>
    <line x1="368" y1="0" x2="368" y2="204" stroke="#e2d7c3"/>
    <line x1="488" y1="0" x2="488" y2="204" stroke="#e2d7c3"/>
    <!-- 行線 -->
    <line x1="0" y1="40" x2="608" y2="40" stroke="#d5c7ae" stroke-width="1.5"/>
    <line x1="0" y1="81" x2="608" y2="81" stroke="#ece3d3"/>
    <line x1="0" y1="122" x2="608" y2="122" stroke="#ece3d3"/>
    <line x1="0" y1="163" x2="608" y2="163" stroke="#ece3d3"/>
    <!-- ヘッダ -->
    <g font-size="13" font-weight="800" fill="#2c3e50" text-anchor="middle">
      <text x="64" y="26">政党（得票数）</text>
      <text x="188" y="26">Ａ党 (1,200票)</text>
      <text x="308" y="26">Ｂ党 (900票)</text>
      <text x="428" y="26">Ｃ党 (500票)</text>
      <text x="548" y="26">Ｄ党 (350票)</text>
    </g>
    <!-- ÷1 -->
    <g font-size="14" font-weight="700" fill="#2c3e50" text-anchor="middle">
      <text x="64" y="66" font-weight="800" fill="#5d6d7e">÷ 1</text>
      <text x="188" y="66" fill="#b84a39" font-weight="900">1,200</text>
      <text x="308" y="66" fill="#b84a39" font-weight="900">900</text>
      <text x="428" y="66" fill="#b84a39" font-weight="900">500</text>
      <text x="548" y="66">350</text>
    </g>
    <!-- ÷2 -->
    <g font-size="14" font-weight="700" fill="#2c3e50" text-anchor="middle">
      <text x="64" y="107" font-weight="800" fill="#5d6d7e">÷ 2</text>
      <text x="188" y="107" fill="#b84a39" font-weight="900">600</text>
      <text x="308" y="107" fill="#b84a39" font-weight="900">450</text>
      <text x="428" y="107">250</text>
      <text x="548" y="107">175</text>
    </g>
    <!-- ÷3 -->
    <g font-size="14" font-weight="700" fill="#2c3e50" text-anchor="middle">
      <text x="64" y="148" font-weight="800" fill="#5d6d7e">÷ 3</text>
      <text x="188" y="148" fill="#99581b" font-weight="900">400</text>
      <text x="308" y="148">300</text>
      <text x="428" y="148">166.6…</text>
      <text x="548" y="148">116.6…</text>
    </g>
    <!-- ÷4 -->
    <g font-size="14" font-weight="700" fill="#2c3e50" text-anchor="middle">
      <text x="64" y="189" font-weight="800" fill="#5d6d7e">÷ 4</text>
      <text x="188" y="189">300</text>
      <text x="308" y="189">225</text>
      <text x="428" y="189">125</text>
      <text x="548" y="189">87.5</text>
    </g>
  </g>
  <text x="340" y="282" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5d6d7e">※ 各党の得票数を整数 1, 2, 3, 4… で割り、商の大きい順に定数（6議席）まで配分する。</text>
</svg>`,

  // 6. 政治・経済：市場の需要・供給曲線シフトと政府介入（間接税・最高価格規制）
  'pe_supply_demand_shift.svg': `${SVG_HEAD(680, 320, '需要曲線・供給曲線のシフトと均衡価格の変化')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　競争市場における需要曲線（D）・供給曲線（S→S'）のシフト</text>
  <!-- 座標軸 -->
  <line x1="110" y1="54" x2="110" y2="266" stroke="#2c3e50" stroke-width="2.2"/>
  <line x1="110" y1="266" x2="430" y2="266" stroke="#2c3e50" stroke-width="2.2"/>
  <text x="74" y="70" font-size="13" font-weight="800" fill="#2c3e50">価格 P</text>
  <text x="412" y="290" font-size="13" font-weight="800" fill="#2c3e50">取引量 Q</text>
  <!-- 需要曲線 D -->
  <line x1="138" y1="76" x2="394" y2="246" stroke="#2b5b9e" stroke-width="3"/>
  <text x="404" y="250" font-size="14" font-weight="900" fill="#2b5b9e">D</text>
  <!-- 供給曲線 S (元) -->
  <line x1="138" y1="242" x2="386" y2="78" stroke="#2e856e" stroke-width="3"/>
  <text x="396" y="82" font-size="14" font-weight="900" fill="#2e856e">S</text>
  <!-- 供給曲線 S' (左上/上方シフト：従量税Tまたは原材料高騰) -->
  <line x1="138" y1="194" x2="342" y2="58" stroke="#b84a39" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="352" y="64" font-size="14" font-weight="900" fill="#b84a39">S'</text>
  <!-- 均衡点 E(262, 159) と E'(226, 135) -->
  <line x1="110" y1="159" x2="262" y2="159" stroke="#7f8c8d" stroke-dasharray="4 3"/>
  <line x1="262" y1="159" x2="262" y2="266" stroke="#7f8c8d" stroke-dasharray="4 3"/>
  <circle cx="262" cy="159" r="5.5" fill="#2e856e"/>
  <text x="272" y="166" font-size="13" font-weight="900" fill="#2e856e">E</text>
  <text x="92" y="164" text-anchor="end" font-size="12" font-weight="800" fill="#2e856e">P₀</text>
  <text x="262" y="284" text-anchor="middle" font-size="12" font-weight="800" fill="#2e856e">Q₀</text>

  <line x1="110" y1="135" x2="226" y2="135" stroke="#b84a39" stroke-dasharray="4 3"/>
  <line x1="226" y1="135" x2="226" y2="266" stroke="#b84a39" stroke-dasharray="4 3"/>
  <circle cx="226" cy="135" r="5.5" fill="#b84a39"/>
  <text x="226" y="123" font-size="13" font-weight="900" fill="#b84a39">E'</text>
  <text x="92" y="139" text-anchor="end" font-size="12" font-weight="800" fill="#b84a39">P₁</text>
  <text x="226" y="284" text-anchor="middle" font-size="12" font-weight="800" fill="#b84a39">Q₁</text>

  <!-- 1単位あたり税額 T の矢印 (x=226 で S上のyは 242 - (226-138)*(164/248) = 242 - 58.2 = 183.8) -->
  <line x1="226" y1="135" x2="226" y2="184" stroke="#963627" stroke-width="2.5"/>
  <text x="208" y="154" text-anchor="end" font-size="11.5" font-weight="800" fill="#963627">課税幅 T</text>

  <!-- 右側整理カード -->
  <rect x="448" y="64" width="204" height="202" rx="12" fill="#fcf7ee" stroke="#dfd2bc" stroke-width="1.5"/>
  <text x="550" y="88" text-anchor="middle" font-size="13.5" font-weight="800" fill="#2c3e50">読み取りのポイント</text>
  <text x="462" y="114" font-size="12" fill="#34495e">● S → S'（左上方シフト）：</text>
  <text x="470" y="132" font-size="12" font-weight="700" fill="#963627">原材料高騰・従量税課税</text>
  <text x="462" y="158" font-size="12" fill="#34495e">● 均衡の変化（E → E'）：</text>
  <text x="470" y="176" font-size="12" font-weight="700" fill="#2c3e50">価格 P₀→P₁上昇、量 Q₀→Q₁減少</text>
  <text x="462" y="202" font-size="12" fill="#34495e">● 価格上昇幅 (P₁−P₀) は</text>
  <text x="470" y="220" font-size="12" font-weight="700" fill="#1f467d">課税幅 T より小さい（消費者</text>
  <text x="470" y="238" font-size="12" font-weight="700" fill="#1f467d">と生産者の双方が税を負担）</text>
</svg>`,

  // 7. 倫理・公共：西洋近代倫理の3大潮流（功利主義・義務論・社会契約説／正義論）マトリクス図
  'et_modern_ethics_map.svg': `${SVG_HEAD(680, 320, '近代倫理思想における行為の評価軸と代表思想家の対比')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　「正しさ」の根拠をめぐる近現代倫理思想の対比マップ</text>
  <!-- 左：帰結主義（功利主義） -->
  <rect x="28" y="54" width="296" height="116" rx="12" fill="#eef8f5" stroke="#2e856e" stroke-width="2"/>
  <text x="176" y="78" text-anchor="middle" font-size="14" font-weight="800" fill="#216653">帰結主義（結果の幸福総量を重視）</text>
  <text x="42" y="102" font-size="12.5" font-weight="700" fill="#2c3e50">● ベンサム：【量的功利主義】快楽計算・最大多数の最大幸福</text>
  <text x="42" y="124" font-size="12.5" font-weight="700" fill="#2c3e50">● J.S.ミル：【質的功利主義】精神的快楽重視・他者危害原則</text>
  <text x="42" y="146" font-size="12" fill="#5d6d7e">課題：全体の幸福のために少数の権利犠牲が正当化されうる</text>

  <!-- 右：義務論 -->
  <rect x="356" y="54" width="296" height="116" rx="12" fill="#f5eefb" stroke="#734f96" stroke-width="2"/>
  <text x="504" y="78" text-anchor="middle" font-size="14" font-weight="800" fill="#583975">義務論（行為の動機・道徳法則を重視）</text>
  <text x="370" y="102" font-size="12.5" font-weight="700" fill="#2c3e50">● カント：善意志・仮言命法ではなく無条件の【定言命法】</text>
  <text x="370" y="124" font-size="12.5" font-weight="700" fill="#2c3e50">● 人格の尊厳：「人格を単に手段としてのみ扱ってはならない」</text>
  <text x="370" y="146" font-size="12" fill="#5d6d7e">特徴：結果の損得ではなく、実践理性の自律（道徳法則）に従う</text>

  <!-- 下段：現代の正義論（ロールズ vs リバタリアニズム vs コミュニタリアニズム） -->
  <rect x="28" y="188" width="624" height="106" rx="12" fill="#fdf6ec" stroke="#c4762b" stroke-width="2"/>
  <text x="340" y="212" text-anchor="middle" font-size="14" font-weight="800" fill="#99581b">20世紀後半〜現代の「公正としての正義」論争（公共・倫理 共通頻出）</text>
  <line x1="236" y1="222" x2="236" y2="284" stroke="#e4ceb2"/>
  <line x1="448" y1="222" x2="448" y2="284" stroke="#e4ceb2"/>
  <text x="132" y="238" text-anchor="middle" font-size="13" font-weight="800" fill="#99581b">ロールズ（リベラリズム）</text>
  <text x="132" y="258" text-anchor="middle" font-size="12" fill="#2c3e50">【無知のヴェール】の下で合意</text>
  <text x="132" y="276" text-anchor="middle" font-size="12" font-weight="800" fill="#b84a39">①基本的自由 ②格差原理</text>

  <text x="342" y="238" text-anchor="middle" font-size="13" font-weight="800" fill="#1f467d">ノージック（リバタリアニズム）</text>
  <text x="342" y="258" text-anchor="middle" font-size="12" fill="#2c3e50">個人の自己所有権・財産権絶対</text>
  <text x="342" y="276" text-anchor="middle" font-size="12" font-weight="800" fill="#1f467d">再分配課税を批判・最小国家</text>

  <text x="550" y="238" text-anchor="middle" font-size="13" font-weight="800" fill="#216653">サンデルら（共同体主義）</text>
  <text x="550" y="258" text-anchor="middle" font-size="12" fill="#2c3e50">「負荷なき自己」を批判</text>
  <text x="550" y="276" text-anchor="middle" font-size="12" font-weight="800" fill="#216653">歴史・共同体の共通善を重視</text>
</svg>`,

  // 8. 政治・経済：需要曲線D右シフト＆供給曲線S左シフトの対比モデル（pe2_2用）
  'pe_supply_demand.svg': `${SVG_HEAD(680, 320, '需要曲線D・供給曲線Sのシフトと均衡価格・取引量の変化')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　需要曲線Dの右シフト（Ⅰ）と供給曲線Sの左シフト（Ⅱ）の比較</text>
  <!-- 左グラフ：出来事Ⅰ（需要増 D→D'） -->
  <rect x="26" y="50" width="302" height="244" rx="12" fill="#f7fafe" stroke="#c8d9ef" stroke-width="1.5"/>
  <text x="177" y="72" text-anchor="middle" font-size="13" font-weight="800" fill="#1f467d">出来事Ⅰ：需要増加（D → D' 右シフト）</text>
  <line x1="68" y1="84" x2="68" y2="246" stroke="#2c3e50" stroke-width="2"/>
  <line x1="68" y1="246" x2="296" y2="246" stroke="#2c3e50" stroke-width="2"/>
  <text x="52" y="96" font-size="11.5" font-weight="800" fill="#2c3e50">P</text>
  <text x="292" y="264" font-size="11.5" font-weight="800" fill="#2c3e50">Q</text>
  <line x1="88" y1="226" x2="274" y2="96" stroke="#2e856e" stroke-width="2.5"/>
  <text x="282" y="98" font-size="12.5" font-weight="900" fill="#2e856e">S</text>
  <line x1="86" y1="106" x2="248" y2="230" stroke="#7f8c8d" stroke-width="2"/>
  <text x="254" y="236" font-size="12" font-weight="800" fill="#7f8c8d">D</text>
  <line x1="126" y1="92" x2="286" y2="216" stroke="#2b5b9e" stroke-width="3" stroke-dasharray="6 3"/>
  <text x="292" y="222" font-size="12.5" font-weight="900" fill="#2b5b9e">D'</text>
  <circle cx="169" cy="169" r="4.5" fill="#7f8c8d"/>
  <circle cx="196" cy="150" r="5" fill="#2b5b9e"/>
  <text x="177" y="278" text-anchor="middle" font-size="12" font-weight="800" fill="#1f467d">均衡価格 上昇↑ ／ 取引量 増加↑</text>

  <!-- 右グラフ：出来事Ⅱ（供給減 S→S'） -->
  <rect x="352" y="50" width="302" height="244" rx="12" fill="#fdf6f4" stroke="#e6c5bd" stroke-width="1.5"/>
  <text x="503" y="72" text-anchor="middle" font-size="13" font-weight="800" fill="#963627">出来事Ⅱ：供給減少（S → S' 左シフト）</text>
  <line x1="394" y1="84" x2="394" y2="246" stroke="#2c3e50" stroke-width="2"/>
  <line x1="394" y1="246" x2="622" y2="246" stroke="#2c3e50" stroke-width="2"/>
  <text x="378" y="96" font-size="11.5" font-weight="800" fill="#2c3e50">P</text>
  <text x="618" y="264" font-size="11.5" font-weight="800" fill="#2c3e50">Q</text>
  <line x1="414" y1="102" x2="600" y2="232" stroke="#2b5b9e" stroke-width="2.5"/>
  <text x="608" y="236" font-size="12.5" font-weight="900" fill="#2b5b9e">D</text>
  <line x1="432" y1="232" x2="606" y2="104" stroke="#7f8c8d" stroke-width="2"/>
  <text x="614" y="108" font-size="12" font-weight="800" fill="#7f8c8d">S</text>
  <line x1="406" y1="204" x2="572" y2="84" stroke="#b84a39" stroke-width="3" stroke-dasharray="6 3"/>
  <text x="580" y="88" font-size="12.5" font-weight="900" fill="#b84a39">S'</text>
  <circle cx="514" cy="172" r="4.5" fill="#7f8c8d"/>
  <circle cx="486" cy="152" r="5" fill="#b84a39"/>
  <text x="503" y="278" text-anchor="middle" font-size="12" font-weight="800" fill="#963627">均衡価格 上昇↑ ／ 取引量 減少↓</text>
</svg>`,

  // 9. 政治・経済：日本銀行の公開市場操作（買いオペ・売りオペ）と信用創造（pe2_4用）
  'pe_boj_policy.svg': `${SVG_HEAD(680, 320, '日本銀行の公開市場操作と信用創造のしくみ')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　日本銀行の公開市場操作（不況期 vs インフレ期）と信用創造公式</text>
  <defs>
    <marker id="aGrn" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#216653"/></marker>
    <marker id="aRed2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b84a39"/></marker>
  </defs>
  <!-- 上段左：日本銀行 -->
  <rect x="32" y="56" width="166" height="122" rx="12" fill="#edf3fc" stroke="#2b5b9e" stroke-width="2"/>
  <text x="115" y="82" text-anchor="middle" font-size="15" font-weight="900" fill="#1f467d">日本銀行</text>
  <text x="115" y="104" text-anchor="middle" font-size="11.5" fill="#34495e">①発券銀行 ②銀行の銀行</text>
  <text x="115" y="122" text-anchor="middle" font-size="11.5" fill="#34495e">③政府の銀行</text>
  <text x="115" y="148" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1f467d">政策委員会が決定</text>
  <text x="115" y="166" text-anchor="middle" font-size="11" fill="#5d6d7e">（独立性と透明性）</text>

  <!-- 上段右：民間金融機関＆市場 -->
  <rect x="462" y="56" width="186" height="122" rx="12" fill="#fdf6ec" stroke="#c4762b" stroke-width="2"/>
  <text x="555" y="82" text-anchor="middle" font-size="14.5" font-weight="900" fill="#99581b">民間銀行・企業・家計</text>
  <text x="555" y="106" text-anchor="middle" font-size="12" font-weight="700" fill="#216653">不況：資金量↑→金利↓→投資↑</text>
  <text x="555" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#b84a39">好況過熱：資金↓→金利↑→抑制</text>
  <text x="555" y="156" text-anchor="middle" font-size="11.5" fill="#5d6d7e">※既発国債の売買＝合法</text>

  <!-- 中央矢印（買いオペ・売りオペ） -->
  <path d="M206 90 L452 90" stroke="#216653" stroke-width="3" marker-end="url(#aGrn)"/>
  <text x="330" y="81" text-anchor="middle" font-size="12.5" font-weight="900" fill="#216653">不況・デフレ期：【買いオペ】国債を買取り資金供給↑</text>
  <path d="M452 146 L206 146" stroke="#b84a39" stroke-width="3" marker-end="url(#aRed2)"/>
  <text x="330" y="137" text-anchor="middle" font-size="12.5" font-weight="900" fill="#b84a39">好況・インフレ期：【売りオペ】国債を売却し資金吸収↓</text>

  <!-- 下段：信用創造ボックス -->
  <rect x="32" y="198" width="616" height="96" rx="12" fill="#eef8f5" stroke="#2e856e" stroke-width="2"/>
  <text x="340" y="222" text-anchor="middle" font-size="14" font-weight="900" fill="#216653">市中銀行の「信用創造」スピード計算公式（支払準備率 r のとき）</text>
  <text x="340" y="248" text-anchor="middle" font-size="13.5" font-weight="800" fill="#2c3e50">① 預金総額 ＝ 本源的預金 ÷ 支払準備率 r　／　② 派生的預金（新規貸出総額）＝ 預金総額 − 本源的預金</text>
  <text x="340" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#963627">例：本源的預金 1,000万円・準備率 20%(0.2) ⇒ 預金総額 5,000万円 ／ 派生的預金 4,000万円！</text>
</svg>`,

  // 10. 政治・経済：為替変動（円高・円安）とリカードの比較生産費説（pe4_3用）
  'pe_fx_comparative.svg': `${SVG_HEAD(680, 320, '外国為替相場（円高・円安）と比較生産費説の要点図')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　外国為替相場の計算ルールとリカードの比較生産費説（機会費用）</text>
  <!-- 左：円高と円安 -->
  <rect x="28" y="54" width="300" height="240" rx="12" fill="#edf3fc" stroke="#2b5b9e" stroke-width="1.8"/>
  <text x="178" y="78" text-anchor="middle" font-size="14" font-weight="900" fill="#1f467d">① 為替変動と購買力平価</text>
  <text x="42" y="106" font-size="12.5" font-weight="800" fill="#216653">● 1ドル＝160円 → 125円：【円高・ドル安】</text>
  <text x="52" y="126" font-size="12" fill="#2c3e50">・輸出ドル価格上昇（輸出不利・輸入有利）</text>
  <text x="52" y="146" font-size="12" fill="#2c3e50">・日本人海外旅行やドル建て借金返済に有利</text>
  <text x="42" y="176" font-size="12.5" font-weight="800" fill="#b84a39">● 1ドル＝125円 → 160円：【円安・ドル高】</text>
  <text x="52" y="196" font-size="12" fill="#2c3e50">・輸出企業の円換算利益増・訪日観光に有利</text>
  <text x="52" y="216" font-size="12" fill="#2c3e50">・輸入エネルギー・食料価格上昇（輸入インフレ）</text>
  <rect x="42" y="234" width="272" height="44" rx="8" fill="#ffffff" stroke="#9ab4d8"/>
  <text x="178" y="261" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1f467d">購買力平価 ＝ 日本円価格 ÷ 外貨価格</text>

  <!-- 右：比較生産費説 -->
  <rect x="352" y="54" width="300" height="240" rx="12" fill="#fdf6ec" stroke="#c4762b" stroke-width="1.8"/>
  <text x="502" y="78" text-anchor="middle" font-size="14" font-weight="900" fill="#99581b">② 比較生産費説（必要労働人数表）</text>
  <rect x="370" y="94" width="264" height="92" rx="8" fill="#ffffff" stroke="#dfd2bc"/>
  <line x1="370" y1="124" x2="634" y2="124" stroke="#dfd2bc"/>
  <line x1="370" y1="155" x2="634" y2="155" stroke="#ece3d3"/>
  <line x1="454" y1="94" x2="454" y2="186" stroke="#dfd2bc"/>
  <line x1="544" y1="94" x2="544" y2="186" stroke="#dfd2bc"/>
  <g font-size="12.5" font-weight="800" fill="#2c3e50" text-anchor="middle">
    <text x="412" y="114">国 ＼ 財</text><text x="499" y="114">小麦1単位</text><text x="589" y="114">布1単位</text>
    <text x="412" y="145">甲国</text><text x="499" y="145" fill="#b84a39">60人 ★</text><text x="589" y="145">90人</text>
    <text x="412" y="176">乙国</text><text x="499" y="176">100人</text><text x="589" y="176" fill="#216653">80人 ★</text>
  </g>
  <text x="368" y="212" font-size="12" font-weight="700" fill="#2c3e50">● 小麦1単位の機会費用（諦める布の量）：</text>
  <text x="378" y="232" font-size="12" font-weight="800" fill="#b84a39">甲国 60/90(0.67) ＜ 乙国 100/80(1.25)</text>
  <text x="368" y="256" font-size="12" font-weight="700" fill="#216653">⇒ 機会費用が小さい財（甲＝小麦、乙＝布）</text>
  <text x="378" y="274" font-size="12" font-weight="700" fill="#216653">に比較優位があり、特化・交換で双方利益！</text>
</svg>`,

  // 11. 日本史探究：土地制度・課税単位の通史変遷（公地公民→荘園公領制→太閤検地→地租改正）
  'jh_land_tax_evolution.svg': `${SVG_HEAD(680, 330, '日本史における土地制度と課税原則の4段階変遷図')}
  <rect x="8" y="8" width="664" height="314" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　日本の土地支配と課税原則の通史変遷（古代律令〜近代地租改正）</text>
  <defs>
    <marker id="arrJh" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#963627"/></marker>
  </defs>
  <!-- Step 1 -->
  <rect x="24" y="54" width="144" height="196" rx="10" fill="#fdf6ec" stroke="#d8b989" stroke-width="1.8"/>
  <text x="96" y="76" text-anchor="middle" font-size="13" font-weight="900" fill="#963627">① 律令制(701〜)</text>
  <text x="96" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#2c3e50">公地公民・班田収授</text>
  <text x="34" y="120" font-size="11" fill="#34495e">・6歳以上男女へ口分田</text>
  <text x="34" y="138" font-size="11" fill="#34495e">・人頭税：調・庸・雑徭</text>
  <text x="34" y="156" font-size="11" fill="#34495e">・723 三世一身法</text>
  <text x="34" y="174" font-size="11" font-weight="800" fill="#b84a39">・743 墾田永年私財法</text>
  <text x="34" y="194" font-size="10.5" fill="#5d6d7e">（位階上限・輸租田原則</text>
  <text x="34" y="208" font-size="10.5" fill="#5d6d7e">　→初期荘園の成立）</text>
  <text x="96" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#963627">人別課税が基本</text>

  <path d="M170 152 L186 152" stroke="#963627" stroke-width="2.4" marker-end="url(#arrJh)"/>

  <!-- Step 2 -->
  <rect x="190" y="54" width="144" height="196" rx="10" fill="#f3f7fc" stroke="#9ab4d8" stroke-width="1.8"/>
  <text x="262" y="76" text-anchor="middle" font-size="13" font-weight="900" fill="#1f467d">② 王朝国家〜中世</text>
  <text x="262" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#2c3e50">荘園公領制・職の体系</text>
  <text x="200" y="120" font-size="11" fill="#34495e">・負名体制（田堵請負）</text>
  <text x="200" y="138" font-size="11" font-weight="800" fill="#1f467d">・寄進地系荘園（不輸不入）</text>
  <text x="200" y="156" font-size="11" fill="#34495e">・1069 延久荘園整理令</text>
  <text x="200" y="174" font-size="11" fill="#34495e">・鎌倉：地頭請・下地中分</text>
  <text x="200" y="192" font-size="11" fill="#34495e">・室町：半済令・守護請</text>
  <text x="262" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#1f467d">重層的権利(本家・領家・地頭)</text>

  <path d="M336 152 L352 152" stroke="#963627" stroke-width="2.4" marker-end="url(#arrJh)"/>

  <!-- Step 3 -->
  <rect x="356" y="54" width="144" height="196" rx="10" fill="#eef8f5" stroke="#2e856e" stroke-width="1.8"/>
  <text x="428" y="76" text-anchor="middle" font-size="13" font-weight="900" fill="#216653">③ 織豊〜江戸幕藩制</text>
  <text x="428" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#2c3e50">太閤検地・石高制</text>
  <text x="366" y="120" font-size="11" font-weight="800" fill="#216653">・一地一作人の原則</text>
  <text x="366" y="138" font-size="11" fill="#34495e">・荘園消滅・兵農分離</text>
  <text x="366" y="156" font-size="11" fill="#34495e">・村請制（本途物成＝米納）</text>
  <text x="366" y="174" font-size="11" fill="#34495e">・1643 田畑永代売買禁止</text>
  <text x="366" y="192" font-size="11" fill="#34495e">・検見法 → 享保・定免法</text>
  <text x="428" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#216653">収穫高(石高)基準・物納</text>

  <path d="M502 152 L518 152" stroke="#963627" stroke-width="2.4" marker-end="url(#arrJh)"/>

  <!-- Step 4 -->
  <rect x="522" y="54" width="134" height="196" rx="10" fill="#fff5f2" stroke="#b84a39" stroke-width="1.8"/>
  <text x="589" y="76" text-anchor="middle" font-size="13" font-weight="900" fill="#b84a39">④ 明治〜戦後改革</text>
  <text x="589" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#2c3e50">地租改正・農地改革</text>
  <text x="530" y="120" font-size="11" font-weight="800" fill="#b84a39">・1873 地租改正条例</text>
  <text x="530" y="138" font-size="11" fill="#34495e">・地券交付・地価3％金納</text>
  <text x="530" y="156" font-size="11" fill="#34495e">・小作料は現物納のまま</text>
  <text x="530" y="174" font-size="11" fill="#34495e">・松方デフレ→寄生地主制</text>
  <text x="530" y="192" font-size="11" font-weight="800" fill="#963627">・1946 第2次農地改革</text>
  <text x="589" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#b84a39">地価基準・所有者金納</text>

  <rect x="24" y="264" width="632" height="44" rx="8" fill="#fcf7ee" stroke="#dfd2bc"/>
  <text x="340" y="291" text-anchor="middle" font-size="12.5" font-weight="800" fill="#2c3e50">★ 頻出の急所：10世紀に「人別課税→土地(名田)課税」、太閤検地で「重層職→一地一作人」、地租改正で「石高物納→地価金納」へ転換！</text>
</svg>`,

  // 12. 世界史探究：中国前近代の官僚登用制・土地税制の4段階構造転換（wh1_3用）
  'wh_chinese_tax_dynasties.svg': `${SVG_HEAD(680, 330, '中国歴代王朝の官僚登用制・土地税制の変遷図')}
  <rect x="8" y="8" width="664" height="314" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　中国前近代における官僚登用制と税制（4大転換）の体系整理</text>
  <!-- 上段：官僚登用制度 -->
  <rect x="26" y="52" width="628" height="72" rx="10" fill="#edf3fc" stroke="#2b5b9e" stroke-width="1.8"/>
  <text x="340" y="73" text-anchor="middle" font-size="13.5" font-weight="900" fill="#1f467d">【官僚登用制の3段階】 血縁・推薦から貴族制、そして試験官僚（士大夫・読書人）へ</text>
  <g font-size="12" font-weight="800" fill="#2c3e50" text-anchor="middle">
    <text x="122" y="104">漢：【郷挙里選】（地方推薦）</text>
    <text x="242" y="104" fill="#2b5b9e">⇒</text>
    <text x="352" y="104">魏晋南北朝：【九品中正】（門閥貴族）</text>
    <text x="476" y="104" fill="#2b5b9e">⇒</text>
    <text x="566" y="104" fill="#b84a39">隋〜1905：【科挙】（宋で殿試）</text>
  </g>

  <!-- 下段：税制4段階カード -->
  <rect x="26" y="140" width="148" height="164" rx="10" fill="#fdf6ec" stroke="#d8b989" stroke-width="1.6"/>
  <text x="100" y="162" text-anchor="middle" font-size="12.5" font-weight="900" fill="#99581b">① 租・庸・調</text>
  <text x="100" y="180" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5d6d7e">北魏(485)〜唐前期</text>
  <text x="36" y="204" font-size="11" fill="#2c3e50">・【均田制】が前提</text>
  <text x="36" y="222" font-size="11" fill="#2c3e50">・丁男に均等課税</text>
  <text x="36" y="240" font-size="11" fill="#2c3e50">・府兵制と三位一体</text>
  <text x="36" y="264" font-size="11" font-weight="800" fill="#b84a39">→ 安史の乱で崩壊</text>

  <rect x="186" y="140" width="148" height="164" rx="10" fill="#eef8f5" stroke="#2e856e" stroke-width="1.6"/>
  <text x="260" y="162" text-anchor="middle" font-size="12.5" font-weight="900" fill="#216653">② 両税法</text>
  <text x="260" y="180" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5d6d7e">唐後期(780・楊炎)〜明初</text>
  <text x="196" y="204" font-size="11" fill="#2c3e50">・荘園(大土地所有)公認</text>
  <text x="196" y="222" font-size="11" font-weight="800" fill="#216653">・夏・秋の年2回徴収</text>
  <text x="196" y="240" font-size="11" fill="#2c3e50">・現住地で資産別課税</text>
  <text x="196" y="264" font-size="11" fill="#5d6d7e">・募兵制と連動</text>

  <rect x="346" y="140" width="148" height="164" rx="10" fill="#f5eefb" stroke="#734f96" stroke-width="1.6"/>
  <text x="420" y="162" text-anchor="middle" font-size="12.5" font-weight="900" fill="#583975">③ 一条鞭法</text>
  <text x="420" y="180" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5d6d7e">明末(16C後半・張居正)</text>
  <text x="356" y="204" font-size="11" fill="#2c3e50">・日本銀・新大陸銀流入</text>
  <text x="356" y="222" font-size="11" font-weight="800" fill="#583975">・地税＋丁税を一括銀納</text>
  <text x="356" y="240" font-size="11" fill="#2c3e50">・複雑な徭役も銀へ換算</text>
  <text x="356" y="264" font-size="11" fill="#5d6d7e">※人頭税(丁銀)自体は残存</text>

  <rect x="506" y="140" width="148" height="164" rx="10" fill="#fff5f2" stroke="#b84a39" stroke-width="1.6"/>
  <text x="580" y="162" text-anchor="middle" font-size="12.5" font-weight="900" fill="#b84a39">④ 地丁銀制</text>
  <text x="580" y="180" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5d6d7e">清(18C・雍正帝期に確立)</text>
  <text x="516" y="204" font-size="11" fill="#2c3e50">・康熙帝：人頭税額固定</text>
  <text x="516" y="222" font-size="11" font-weight="800" fill="#b84a39">・丁銀を地銀へ完全統合</text>
  <text x="516" y="240" font-size="11" fill="#2c3e50">・実質的な人頭税廃止</text>
  <text x="516" y="264" font-size="11" font-weight="800" fill="#963627">→ 隠田・隠蔽解消で人口急増</text>
</svg>`,

  // 13. 世界史テーマ史：交易ネットワーク拡大とパンデミック・近代医学の歩み（wh4_2用）
  'wh_theme_epidemics_trade.svg': `${SVG_HEAD(680, 330, '世界史における交易網拡大・感染症パンデミック・医学発展の対応図')}
  <rect x="8" y="8" width="664" height="314" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　交易・移動ネットワークの拡大と主要パンデミック・医学の対抗史</text>
  <!-- 左：時代×ネットワーク×感染症テーブル -->
  <rect x="24" y="52" width="414" height="252" rx="10" fill="#ffffff" stroke="#d5c7ae" stroke-width="1.5"/>
  <rect x="24" y="52" width="414" height="34" rx="10" fill="#f7efe1"/>
  <line x1="24" y1="86" x2="438" y2="86" stroke="#d5c7ae" stroke-width="1.4"/>
  <line x1="24" y1="140" x2="438" y2="140" stroke="#ece3d3"/>
  <line x1="24" y1="194" x2="438" y2="194" stroke="#ece3d3"/>
  <line x1="24" y1="248" x2="438" y2="248" stroke="#ece3d3"/>
  <text x="231" y="74" text-anchor="middle" font-size="13" font-weight="900" fill="#2c3e50">時代・移動ネットワークと感染症の歴史的衝撃</text>

  <text x="34" y="108" font-size="12" font-weight="800" fill="#963627">● 14世紀：パクス＝モンゴリカ（ユーラシア陸海交易）</text>
  <text x="44" y="128" font-size="11.5" fill="#2c3e50">⇒【ペスト（黒死病）】欧州人口1/3減 → 西欧の農奴解放を促進</text>

  <text x="34" y="162" font-size="12" font-weight="800" fill="#99581b">● 16世紀：大航海時代・コロンブス交換</text>
  <text x="44" y="182" font-size="11.5" fill="#2c3e50">⇒【天然痘・麻疹】免疫なき新大陸先住民激減 → 黒人奴隷導入へ</text>

  <text x="34" y="216" font-size="12" font-weight="800" fill="#1f467d">● 19世紀：英領インド支配・蒸気船と鉄道・都市過密</text>
  <text x="44" y="236" font-size="11.5" fill="#2c3e50">⇒【コレラ】ベンガル風土病が世界流行 → 近代上下水道・衛生行政</text>

  <text x="34" y="270" font-size="12" font-weight="800" fill="#583975">● 1918〜20年：第一次世界大戦の総力戦兵士輸送</text>
  <text x="44" y="290" font-size="11.5" fill="#2c3e50">⇒【スペイン風邪】世界数千万人死亡・参戦国の戦力にも打撃</text>

  <!-- 右：医学史タイムライン -->
  <rect x="452" y="52" width="204" height="252" rx="10" fill="#eef8f5" stroke="#2e856e" stroke-width="1.8"/>
  <text x="554" y="75" text-anchor="middle" font-size="13" font-weight="900" fill="#216653">医学・細菌学の歩み</text>
  <g font-size="11.3" fill="#2c3e50">
    <text x="464" y="100" font-weight="800">・ヒポクラテス／ガレノス</text>
    <text x="472" y="116" fill="#5d6d7e">古代ギリシア・ローマ医学</text>
    <text x="464" y="138" font-weight="800" fill="#1f467d">・イブン＝シーナー(11C)</text>
    <text x="472" y="154" fill="#5d6d7e">『医学典範』ラテン語訳</text>
    <text x="464" y="176" font-weight="800">・ヴェサリウス／ハーヴェイ</text>
    <text x="472" y="192" fill="#5d6d7e">人体解剖(16C)・血液循環(17C)</text>
    <text x="464" y="214" font-weight="800" fill="#963627">・ジェンナー(18C末)</text>
    <text x="472" y="230" fill="#5d6d7e">牛痘による【種痘法】開発</text>
    <text x="464" y="252" font-weight="800" fill="#216653">・パストゥール／コッホ(19C)</text>
    <text x="472" y="268" fill="#5d6d7e">ワクチン・結核菌/コレラ菌</text>
    <text x="464" y="290" font-weight="800" fill="#b84a39">・フレミング(1928)：ペニシリン</text>
  </g>
</svg>`,

  // 14. 地理探究：世界の農業における土地生産性×労働生産性4象限モデル（ge2_1用）
  'ge_agri_productivity.svg': `${SVG_HEAD(680, 330, '世界の農業地域における土地生産性と労働生産性の散布モデル')}
  <rect x="8" y="8" width="664" height="314" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　世界の主要国グループ（ア〜エ）における農業の土地生産性と労働生産性</text>
  <line x1="96" y1="56" x2="96" y2="274" stroke="#2c3e50" stroke-width="2"/>
  <line x1="96" y1="274" x2="626" y2="274" stroke="#2c3e50" stroke-width="2"/>
  <line x1="360" y1="56" x2="360" y2="274" stroke="#d5c7ae" stroke-dasharray="5 4"/>
  <line x1="96" y1="165" x2="626" y2="165" stroke="#d5c7ae" stroke-dasharray="5 4"/>
  <text x="36" y="168" text-anchor="middle" font-size="12.5" font-weight="800" fill="#2c3e50" transform="rotate(-90 36 168)">土地生産性（1haあたり収量：高↑）</text>
  <text x="360" y="302" text-anchor="middle" font-size="12.5" font-weight="800" fill="#2c3e50">労働生産性（農業就業者1人あたり生産額：高→）</text>
  <ellipse cx="212" cy="108" rx="84" ry="38" fill="#fdecea" stroke="#b84a39" stroke-width="2"/>
  <text x="212" y="102" text-anchor="middle" font-size="14" font-weight="900" fill="#963627">グループ ア</text>
  <text x="212" y="122" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">小経営・労働集約・施肥多</text>
  <ellipse cx="496" cy="106" rx="92" ry="38" fill="#eef8f5" stroke="#2e856e" stroke-width="2"/>
  <text x="496" y="100" text-anchor="middle" font-size="14" font-weight="900" fill="#216653">グループ イ</text>
  <text x="496" y="120" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">施設園芸・高度機械化・高付加価値</text>
  <ellipse cx="514" cy="222" rx="92" ry="38" fill="#edf3fc" stroke="#2b5b9e" stroke-width="2"/>
  <text x="514" y="216" text-anchor="middle" font-size="14" font-weight="900" fill="#1f467d">グループ ウ</text>
  <text x="514" y="236" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">大経営・大型機械化・粗放的経営</text>
  <ellipse cx="212" cy="224" rx="84" ry="36" fill="#fdf6ec" stroke="#c4762b" stroke-width="2"/>
  <text x="212" y="218" text-anchor="middle" font-size="14" font-weight="900" fill="#99581b">グループ エ</text>
  <text x="212" y="238" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">伝統的自給農業・資本投入小</text>
</svg>`,

  // 15. 地理探究：人口転換モデルと年齢3区分人口ピラミッド推移（ge2_4用）
  'ge_demographic_transition.svg': `${SVG_HEAD(680, 320, '人口転換モデルにおける出生率・死亡率の推移と自然増加')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　人口転換モデル（第Ⅰ期〜第Ⅴ期）における出生率・死亡率の推移</text>
  <line x1="78" y1="56" x2="78" y2="252" stroke="#2c3e50" stroke-width="2"/>
  <line x1="78" y1="252" x2="628" y2="252" stroke="#2c3e50" stroke-width="2"/>
  <g stroke="#d5c7ae" stroke-dasharray="4 4">
    <line x1="188" y1="56" x2="188" y2="252"/>
    <line x1="312" y1="56" x2="312" y2="252"/>
    <line x1="436" y1="56" x2="436" y2="252"/>
    <line x1="542" y1="56" x2="542" y2="252"/>
  </g>
  <g font-size="12" font-weight="800" fill="#5d6d7e" text-anchor="middle">
    <text x="133" y="74">第Ⅰ期(多産多死)</text>
    <text x="250" y="74" fill="#b84a39">第Ⅱ期(多産少死)</text>
    <text x="374" y="74" fill="#99581b">第Ⅲ期(少産少死へ)</text>
    <text x="489" y="74" fill="#1f467d">第Ⅳ期(少産少死)</text>
    <text x="585" y="74" fill="#583975">第Ⅴ期(少子高齢)</text>
  </g>
  <polygon points="188,96 250,98 312,104 374,148 436,204 374,206 312,202 250,164 188,98" fill="#fde2dc" opacity="0.7"/>
  <polyline fill="none" stroke="#b84a39" stroke-width="3.5" points="92,96 188,96 250,98 312,104 374,148 436,204 510,208 612,226"/>
  <polyline fill="none" stroke="#2b5b9e" stroke-width="3.5" points="92,99 188,98 250,164 312,202 374,206 436,204 510,206 612,196"/>
  <text x="296" y="156" text-anchor="middle" font-size="12" font-weight="900" fill="#963627">人口爆発（自然増極大）</text>
  <text x="536" y="102" font-size="12" font-weight="800" fill="#b84a39">― 粗出生率</text>
  <text x="536" y="122" font-size="12" font-weight="800" fill="#2b5b9e">― 粗死亡率</text>
  <text x="586" y="184" text-anchor="middle" font-size="11" font-weight="800" fill="#583975">高齢化で死亡率↑</text>
  <text x="340" y="282" text-anchor="middle" font-size="12" font-weight="700" fill="#2c3e50">ピラミッド型：富士山型(Ⅱ期) → 釣り鐘型(Ⅳ期) → つぼ型(Ⅴ期：日本・独・伊・韓など自然減)</text>
</svg>`,

  // 16. 地理探究：日本列島周辺の4プレートと大地形・中央構造線・フォッサマグナ（ge4_1用）
  'ge_japan_tectonics.svg': `${SVG_HEAD(680, 320, '日本列島周辺の4つのプレート境界とフォッサマグナ・中央構造線')}
  <rect x="8" y="8" width="664" height="304" rx="14" fill="#fffdf8" stroke="#dfcfb5" stroke-width="2"/>
  <text x="340" y="34" text-anchor="middle" font-size="16" font-weight="800" fill="#2c3e50">図1　日本列島を取り巻く4プレートと主要構造線・海溝模式図</text>
  <rect x="28" y="56" width="270" height="232" rx="12" fill="#fdf6ec" stroke="#c4762b" stroke-width="2"/>
  <text x="163" y="82" text-anchor="middle" font-size="14" font-weight="900" fill="#99581b">ユーラシアプレート（大陸）</text>
  <text x="163" y="106" text-anchor="middle" font-size="12" font-weight="700" fill="#2c3e50">西南日本：内帯（花崗岩・中国山地）</text>
  <line x1="52" y1="126" x2="276" y2="126" stroke="#b84a39" stroke-width="3"/>
  <text x="163" y="146" text-anchor="middle" font-size="12" font-weight="900" fill="#b84a39">▲ 中央構造線（内帯と外帯の境界）</text>
  <text x="163" y="168" text-anchor="middle" font-size="12" font-weight="700" fill="#2c3e50">外帯（四国・九州山地：険しい褶曲山地）</text>
  <rect x="304" y="56" width="66" height="162" rx="8" fill="#fdecea" stroke="#b84a39" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="337" y="122" text-anchor="middle" font-size="11.5" font-weight="900" fill="#963627">フォッサ</text>
  <text x="337" y="140" text-anchor="middle" font-size="11.5" font-weight="900" fill="#963627">マグナ</text>
  <text x="337" y="164" text-anchor="middle" font-size="10.5" font-weight="700" fill="#34495e">西縁：糸魚川</text>
  <text x="337" y="180" text-anchor="middle" font-size="10.5" font-weight="700" fill="#34495e">静岡構造線</text>
  <rect x="376" y="56" width="276" height="106" rx="12" fill="#eef8f5" stroke="#2e856e" stroke-width="2"/>
  <text x="514" y="82" text-anchor="middle" font-size="14" font-weight="900" fill="#216653">北アメリカプレート（大陸）</text>
  <text x="514" y="106" text-anchor="middle" font-size="12" font-weight="700" fill="#2c3e50">東北日本・北海道（奥羽山脈に火山フロント）</text>
  <text x="514" y="138" text-anchor="middle" font-size="12" font-weight="800" fill="#1f467d">東沖：【日本海溝・千島海溝】←太平洋プレート沈み込み</text>
  <rect x="304" y="226" width="168" height="62" rx="10" fill="#edf3fc" stroke="#2b5b9e" stroke-width="2"/>
  <text x="388" y="250" text-anchor="middle" font-size="12.5" font-weight="900" fill="#1f467d">フィリピン海プレート</text>
  <text x="388" y="270" text-anchor="middle" font-size="11" font-weight="700" fill="#34495e">南海トラフ・相模トラフへ沈み込み</text>
  <rect x="484" y="176" width="168" height="112" rx="10" fill="#dce9fa" stroke="#1f467d" stroke-width="2"/>
  <text x="568" y="206" text-anchor="middle" font-size="13" font-weight="900" fill="#1f467d">太平洋プレート（海洋）</text>
  <text x="568" y="230" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">日本海溝・伊豆小笠原海溝</text>
  <text x="568" y="250" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2c3e50">へ沈み込み（深発地震面）</text>
</svg>`,
};

for (const [name, svg] of Object.entries(figs)) {
  writeFileSync(resolve(OUT_DIR, name), svg.trim() + '\n', 'utf8');
  console.log(`Generated: public/social_figs/${name}`);
}
