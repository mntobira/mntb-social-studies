/**
 * ===================================================================
 * とびら君の「ミニ豆知識」データ（大学入学共通テスト 社会科）
 * ===================================================================
 */
import type { SubjectKey } from './subjects';

export type TipCategory =
  | 'exam'
  | 'jpHistory'
  | 'worldHistory'
  | 'geography'
  | 'politicsEcon'
  | 'ethics';

export type TipSubject = SubjectKey;
export type TipSubjectScope = 'common' | TipSubject;

export interface TipCategoryMeta {
  label: string;
  emoji: string;
}

export const TIP_CATEGORIES: Record<TipCategory, TipCategoryMeta> = {
  exam: { label: '共通テスト社会の鉄則', emoji: '🎯' },
  jpHistory: { label: '日本史探究のポイント', emoji: '🏯' },
  worldHistory: { label: '世界史探究のポイント', emoji: '🌍' },
  geography: { label: '地理探究のポイント', emoji: '🗺️' },
  politicsEcon: { label: '政治・経済のポイント', emoji: '⚖️' },
  ethics: { label: '倫理のポイント', emoji: '🦉' },
};

export const CATEGORY_SUBJECT: Record<TipCategory, TipSubjectScope> = {
  exam: 'common',
  jpHistory: 'jp_history',
  worldHistory: 'world_history',
  geography: 'geography',
  politicsEcon: 'politics_econ',
  ethics: 'ethics',
};

export interface MascotTip {
  id: string;
  category: TipCategory;
  text: string;
  subject?: TipSubjectScope;
}

export const mascotTips: MascotTip[] = [
  { id: 'cm_01', category: 'exam', subject: 'common', text: '共通テストの社会は「すべて」「まったく〜ない」などの強い断定表現に要注意。例外が1つでもあれば誤文になります。' },
  { id: 'cm_02', category: 'exam', subject: 'common', text: '「正しいものを選べ」か「誤っているものを選べ」か、設問文の末尾に必ず印をつけてから選択肢を見よう。' },
  { id: 'cm_03', category: 'exam', subject: 'common', text: '資料読解問題は、知識だけで飛びつかず「グラフや史料から直接読み取れる事実」と選択肢を先に照合しよう。' },

  { id: 'jh_01', category: 'jpHistory', text: '723年三世一身法（長屋王）→743年墾田永年私財法（橘諸兄・位階別上限あり）の流れは古代土地史の鉄板です。' },
  { id: 'jh_02', category: 'jpHistory', text: '894年の遣唐使廃止後も、博多（鴻臚館）には唐商や宋商の民間貿易船が盛んに来航していました。' },
  { id: 'jh_03', category: 'jpHistory', text: '琉球の江戸上り使節は、将軍代替わりが「慶賀使」、琉球王即位が「謝恩使」です。逆になりやすいので要注意。' },
  { id: 'jh_04', category: 'jpHistory', text: '1930年浜口内閣・井上準之助の金解禁（緊縮）と、1931年犬養内閣・高橋是清の金輸出再禁止（積極財政）を対比しよう。' },
  { id: 'jh_05', category: 'jpHistory', text: '1972年は5月に沖縄本土復帰（佐藤内閣）、9月に日中共同声明（田中内閣）です。同じ年の中の順序がよく出ます。' },

  { id: 'wh_01', category: 'worldHistory', text: '中国の税制は「租庸調→両税法(780楊炎)→一条鞭法(明末張居正)→地丁銀(清・雍正帝)」の4段階で整理しよう。' },
  { id: 'wh_02', category: 'worldHistory', text: 'サファヴィー朝は十二イマーム派（シーア派）を国教とし、スンナ派のオスマン帝国と対立しました。' },
  { id: 'wh_03', category: 'worldHistory', text: '1832年の英第1回選挙法改正で有権者になったのは産業資本家です。除外された労働者がチャーティスト運動を起こしました。' },
  { id: 'wh_04', category: 'worldHistory', text: 'フサイン＝マクマホン書簡・サイクス＝ピコ協定・バルフォア宣言の3つが第一次大戦中のイギリスの三枚舌外交です。' },

  { id: 'ge_01', category: 'geography', text: 'ヒマラヤ山脈は大陸プレート同士の衝突帯なので、巨大地震は多いですが活火山はほとんど分布しません。' },
  { id: 'ge_02', category: 'geography', text: 'アブラヤシ果実（パーム油）はインドネシアとマレーシアの2か国だけで世界の8割超を占めます。' },
  { id: 'ge_03', category: 'geography', text: '熱帯のラトソル（赤色）と冷帯タイガのポドゾル（灰白色）はどちらも酸性の痩せた土壌です。黒色肥沃土はチェルノーゼム。' },
  { id: 'ge_04', category: 'geography', text: '発電量の約9割が水力ならノルウェー、約7割が原子力ならフランスが統計判別の決め手になります。' },

  { id: 'pe_01', category: 'politicsEcon', text: '日本は具体的事件を前提とする付随的違憲審査制で、地方裁判所などの下級裁判所も違憲審査権をもっています。' },
  { id: 'pe_02', category: 'politicsEcon', text: '憲法改正の発議（各院の総議員3分の2以上）には衆議院の優越はありません。予算・条約30日、首相指名10日と区別しよう。' },
  { id: 'pe_03', category: 'politicsEcon', text: '不況期の日銀は「買いオペ」で国債を買い入れ、市中の資金供給量を増やして金利低下を促します。' },
  { id: 'pe_04', category: 'politicsEcon', text: '1ドル150円→120円は「円高ドル安」です。ドル建て輸出価格が上がるので輸出企業には向かい風になります。' },

  { id: 'et_01', category: 'ethics', text: '孟子は四端（惻隠＝仁・羞悪＝義・辞譲＝礼・是非＝智）を伸ばす性善説、荀子は礼で矯正する性悪説を説きました。' },
  { id: 'et_02', category: 'ethics', text: '荻生徂徠は古文辞学を唱え、「道とは古代の先王が天下を治めるために制作した礼楽刑政（政治制度）である」と説きました。' },
  { id: 'et_03', category: 'ethics', text: 'カントの定言命法は「無条件に〜せよ」と命じる道徳法則で、人格を単なる手段ではなく常に目的として扱うよう求めます。' },
  { id: 'et_04', category: 'ethics', text: 'ロールズの格差原理は「最も不遇な立場にある人々の最大の利益になる場合にのみ社会的・経済的不平等を認める」原理です。' },
];

/**
 * 指定された科目に出してよい豆知識一覧（共通の受験作法＋その科目専用）を返す。
 */
export function tipsForSubject(subject: TipSubject): MascotTip[] {
  return mascotTips.filter((tip) => {
    const scope = tip.subject ?? CATEGORY_SUBJECT[tip.category];
    return scope === 'common' || scope === subject;
  });
}

