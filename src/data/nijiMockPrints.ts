/**
 * 2次試験（国公立論述）社会科 予想問題プリント定義
 */
import type { GachaPrintDef } from './gachaPrints.generated';

export const NIJI_UNIVERSITIES = [
  { id: 'todai', name: '東京大学', track: '日本史・世界史・地理（前期論述）' },
  { id: 'kyodai', name: '京都大学', track: '日本史・世界史・地理（前期論述）' },
  { id: 'hitotsubashi', name: '一橋大学', track: '社会（地歴・公民論述）' },
  { id: 'handai', name: '大阪大学', track: '文学部・外国語学部（地歴論述）' },
  { id: 'nagoya', name: '名古屋大学', track: '文系（地歴論述）' },
  { id: 'kyudai', name: '九州大学', track: '文系（地歴論述）' },
] as const;

export const OTHER_MOCK_UNIVERSITIES: readonly { id: string; name: string; track?: string }[] = [];

export const NIJI_MOCK_PRINTS: readonly GachaPrintDef[] = [
  {
    id: 'print_lr_niji_todai_jh_1',
    label: '東京大学 前期対策 日本史論述 予想問題（解答・採点基準つき）',
    subject: 'jp_history',
    category: '演習プリント',
    file: '/prints/print_lr_social_jh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 10,
    kb: 320,
  },
  {
    id: 'print_lr_niji_kyodai_wh_1',
    label: '京都大学 前期対策 世界史大論述 予想問題（解答・構造図つき）',
    subject: 'world_history',
    category: '演習プリント',
    file: '/prints/print_lr_social_wh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 10,
    kb: 315,
  },
  {
    id: 'print_lr_niji_hitotsubashi_ge_1',
    label: '一橋大学 前期対策 地理統計論述 予想問題（解答・解説つき）',
    subject: 'geography',
    category: '演習プリント',
    file: '/prints/print_lr_social_ge_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 10,
    kb: 310,
  },
];

export const NIJI_DISCLAIMER = '各大学の出題傾向を参考にしたマナトビ編集部のオリジナル予想問題であり、各大学の公式問題・過去問ではありません。';

export function nijiDisclaimerFor(univName: string): string {
  return `${univName}の出題形式に沿ったオリジナル予想問題であり、大学の公式問題ではありません。`;
}

export function nijiUniversityOf(printId: string): { id: string; name: string; track: string } | undefined {
  const m = /^print_lr_niji_([a-z0-9]+)_/.exec(printId);
  if (!m) return undefined;
  return NIJI_UNIVERSITIES.find((u) => u.id === m[1]);
}

export function mockUniversityOf(printId: string): { id: string; name: string; track?: string } | undefined {
  return nijiUniversityOf(printId);
}
