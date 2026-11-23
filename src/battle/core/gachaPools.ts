/**
 * ガチャの種類（共通テスト社会科ガチャ ／ 2次試験論述ガチャ ／ 大学選択ガチャ）
 */
import { NIJI_MOCK_PRINTS, NIJI_UNIVERSITIES, OTHER_MOCK_UNIVERSITIES } from '../../data/nijiMockPrints';
import { PRINT_SHELVES, UNIV_REGION, univOfPrint, type PrintShelfId } from './printShelves';

export type GachaPoolId = 'kyotsu' | 'niji' | 'univ';

export interface GachaPoolDef {
  id: GachaPoolId;
  title: string;
  short: string;
  lrName: string;
  lrNote: string;
  preferSubjects: readonly string[];
}

export const GACHA_POOLS: readonly GachaPoolDef[] = [
  {
    id: 'kyotsu',
    title: '共通テスト社会科ガチャ',
    short: '共通テスト',
    lrName: '共通テスト 社会科（地歴・公民）予想問題',
    lrNote: '日本史探究・世界史探究・地理探究・政治経済・倫理の本番形式オリジナル予想問題。',
    preferSubjects: ['jp_history', 'world_history', 'geography', 'politics_econ', 'ethics'],
  },
  {
    id: 'niji',
    title: '2次試験ガチャ',
    short: '2次試験',
    lrName: '国公立2次 社会科論述 予想問題',
    lrNote: '東大・京大・一橋大などの論述形式に沿った書き下ろし予想問題（解答・採点基準つき）。大学の公式問題・過去問ではありません。',
    preferSubjects: ['jp_history', 'world_history', 'geography'],
  },
  {
    id: 'univ',
    title: '大学選択ガチャ',
    short: '大学選択',
    lrName: '選んだ大学の社会科 予想問題',
    lrNote: '選んだ1大学の予想問題だけがLRで出ます。1回 500マナコイン。大学の公式問題・過去問ではありません。',
    preferSubjects: ['jp_history', 'world_history', 'geography'],
  },
];

export const DEFAULT_GACHA_POOL: GachaPoolId = 'kyotsu';

export function gachaPoolOf(id: GachaPoolId): GachaPoolDef {
  return GACHA_POOLS.find((p) => p.id === id) ?? GACHA_POOLS[0];
}

export const NIJI_NEW_ITEM_IDS: readonly string[] = [
  'hat_hachimaki_red', 'hat_hachimaki_navy', 'hat_hachimaki_gold',
  'aura_pencil', 'aura_pencil_gold',
  'wall_campus', 'wall_sheet', 'wall_nightdesk', 'wall_dawn',
  'frame_niji_ink', 'frame_niji_sakura', 'frame_niji_midnight',
];

export const UNIV_MOCK_PRINT_IDS: readonly string[] = NIJI_MOCK_PRINTS.map((p) => p.id);

export const NIJI_ONLY_IDS: ReadonlySet<string> = new Set([...NIJI_NEW_ITEM_IDS, ...UNIV_MOCK_PRINT_IDS]);

export const NIJI_SHARED_IDS: readonly string[] = [
  'print_book_jh_complete', 'print_book_wh_complete', 'print_book_ge_complete',
  'print_book_pe_complete', 'print_book_et_complete',
  'print_trend_jh_1', 'print_trend_wh_1', 'print_trend_ge_1', 'print_trend_pe_1', 'print_trend_et_1',
  'pose_studying', 'pose_thinking', 'pose_trophy', 'frame_prism',
  'hat_graduation', 'hat_beanie_navy', 'hat_wizard',
  'glasses_round', 'glasses_square', 'glasses_monocle', 'glasses_star',
  'cheek_blush', 'cheek_sticker',
  'aura_abc', 'aura_formula', 'aura_flame', 'aura_stars',
  'wall_grid', 'wall_lined', 'wall_library', 'wall_english', 'wall_chalk', 'wall_night',
];

export interface SelectableUniversity {
  id: string;
  name: string;
  track: string;
  label: string;
  region: PrintShelfId;
  regionLabel: string;
  printIds: readonly string[];
}

const REGION_ORDER: readonly PrintShelfId[] = ['hokkaido_tohoku', 'kanto_chubu', 'kinki', 'chugoku_shikoku', 'kyushu_okinawa'];

function buildSelectableUniversities(): readonly SelectableUniversity[] {
  const byId = new Map<string, string[]>();
  for (const printId of UNIV_MOCK_PRINT_IDS) {
    const key = univOfPrint(printId);
    if (!key) continue;
    const list = byId.get(key) ?? [];
    list.push(printId);
    byId.set(key, list);
  }
  const raw: SelectableUniversity[] = [];
  for (const [id, printIds] of byId.entries()) {
    const niji = NIJI_UNIVERSITIES.find((u) => u.id === id);
    const other = OTHER_MOCK_UNIVERSITIES.find((u) => u.id === id);
    const name = niji?.name ?? other?.name ?? id;
    const track = niji?.track ?? other?.track ?? '';
    const region = UNIV_REGION[id] ?? 'kanto_chubu';
    const regionLabel = PRINT_SHELVES.find((s) => s.id === region)?.label.replace(/^2次\s*/, '') ?? '関東・中部';
    raw.push({
      id,
      name,
      track,
      label: track ? `${name}（${track}）` : name,
      region,
      regionLabel,
      printIds,
    });
  }
  return raw.sort((a, b) => {
    const ra = REGION_ORDER.indexOf(a.region);
    const rb = REGION_ORDER.indexOf(b.region);
    const oa = ra === -1 ? 99 : ra;
    const ob = rb === -1 ? 99 : rb;
    return oa - ob;
  });
}

export const SELECTABLE_UNIVERSITIES: readonly SelectableUniversity[] = buildSelectableUniversities();
export const DEFAULT_GACHA_UNIV_ID: string = SELECTABLE_UNIVERSITIES[0]?.id ?? 'todai';

export function selectableUniversityOf(univId?: string | null): SelectableUniversity {
  return SELECTABLE_UNIVERSITIES.find((u) => u.id === univId) ?? SELECTABLE_UNIVERSITIES[0];
}

export function normalizeGachaUnivId(univId?: string | null): string {
  return selectableUniversityOf(univId)?.id ?? 'todai';
}

const UNIV_MOCK_SET: ReadonlySet<string> = new Set(UNIV_MOCK_PRINT_IDS);

export function inGachaPool(id: string, pool: GachaPoolId, univId?: string): boolean {
  if (pool === 'univ') {
    const targetUniv = normalizeGachaUnivId(univId);
    if (UNIV_MOCK_SET.has(id)) return univOfPrint(id) === targetUniv;
    return NIJI_NEW_ITEM_IDS.includes(id) || NIJI_SHARED_IDS.includes(id);
  }
  if (pool === 'niji') return NIJI_ONLY_IDS.has(id) || NIJI_SHARED_IDS.includes(id);
  return !NIJI_ONLY_IDS.has(id);
}
