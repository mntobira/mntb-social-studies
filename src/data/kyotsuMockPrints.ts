/**
 * LR（レジェンドレア）：共通テスト 社会科（地歴・公民）予想問題プリント定義
 */
import type { GachaPrintDef } from './gachaPrints.generated';

export const KYOTSU_MOCK_PRINTS: readonly GachaPrintDef[] = [
  {
    id: 'print_lr_social_jh_1',
    label: '共通テスト 歴史総合・日本史探究 予想問題 第1回（60分・100点）',
    subject: 'jp_history',
    category: '演習プリント',
    file: '/prints/print_lr_social_jh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 16,
    kb: 420,
  },
  {
    id: 'print_lr_social_wh_1',
    label: '共通テスト 歴史総合・世界史探究 予想問題 第1回（60分・100点）',
    subject: 'world_history',
    category: '演習プリント',
    file: '/prints/print_lr_social_wh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 16,
    kb: 410,
  },
  {
    id: 'print_lr_social_ge_1',
    label: '共通テスト 地理総合・地理探究 予想問題 第1回（60分・100点）',
    subject: 'geography',
    category: '演習プリント',
    file: '/prints/print_lr_social_ge_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 16,
    kb: 430,
  },
  {
    id: 'print_lr_social_pe_1',
    label: '共通テスト 公共・政治経済 予想問題 第1回（60分・100点）',
    subject: 'politics_econ',
    category: '演習プリント',
    file: '/prints/print_lr_social_pe_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 14,
    kb: 390,
  },
  {
    id: 'print_lr_social_et_1',
    label: '共通テスト 公共・倫理 予想問題 第1回（60分・100点）',
    subject: 'ethics',
    category: '演習プリント',
    file: '/prints/print_lr_social_et_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 14,
    kb: 385,
  },
];

export const KYOTSU_FREE_FULL_IDS: readonly string[] = ['print_lr_social_jh_1'];
export const isFreeFullPrint = (id: string): boolean => KYOTSU_FREE_FULL_IDS.includes(id);
