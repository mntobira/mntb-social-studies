// 共通テスト社会科 ガチャ学習プリント定義（SR / UR）

export type GachaPrintCategory = '出題傾向' | '演習プリント' | '単語テスト' | '完全版';

export interface GachaPrintDef {
  id: string;
  label: string;
  subject: string;
  category: GachaPrintCategory;
  file: string;
  thumb: string;
  pages: number;
  kb: number;
}

export const GACHA_PRINTS: readonly GachaPrintDef[] = [
  {
    id: 'print_book_jh_complete',
    label: '【完全版】歴史総合・日本史探究 史料＆年代整序 総まとめブック',
    subject: 'jp_history',
    category: '完全版',
    file: '/prints/print_lr_social_jh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 24,
    kb: 480,
  },
  {
    id: 'print_book_wh_complete',
    label: '【完全版】歴史総合・世界史探究 横のつながり＆条約 完全攻略本',
    subject: 'world_history',
    category: '完全版',
    file: '/prints/print_lr_social_wh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 24,
    kb: 470,
  },
  {
    id: 'print_book_ge_complete',
    label: '【完全版】地理総合・地理探究 統計判別＆気候土壌 マスターブック',
    subject: 'geography',
    category: '完全版',
    file: '/prints/print_lr_social_ge_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 22,
    kb: 460,
  },
  {
    id: 'print_book_pe_complete',
    label: '【完全版】公共・政治経済 最高裁判例＆経済計算 パーフェクトノート',
    subject: 'politics_econ',
    category: '完全版',
    file: '/prints/print_lr_social_pe_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 20,
    kb: 440,
  },
  {
    id: 'print_book_et_complete',
    label: '【完全版】公共・倫理 源流〜現代思想家 対比マップ完全版',
    subject: 'ethics',
    category: '完全版',
    file: '/prints/print_lr_social_et_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 20,
    kb: 435,
  },
  {
    id: 'print_trend_jh_1',
    label: '日本史探究 古代〜近世の土地制度・外交史 出題傾向シート',
    subject: 'jp_history',
    category: '出題傾向',
    file: '/prints/print_lr_social_jh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 6,
    kb: 210,
  },
  {
    id: 'print_trend_wh_1',
    label: '世界史探究 中国税制変遷＆近世イスラーム三帝国 比較シート',
    subject: 'world_history',
    category: '出題傾向',
    file: '/prints/print_lr_social_wh_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 6,
    kb: 205,
  },
  {
    id: 'print_trend_ge_1',
    label: '地理探究 農鉱工業・電源構成 世界統計の決定打シート',
    subject: 'geography',
    category: '出題傾向',
    file: '/prints/print_lr_social_ge_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 6,
    kb: 215,
  },
  {
    id: 'print_trend_pe_1',
    label: '政治・経済 ドント式・為替・比較生産費説 計算パターン集',
    subject: 'politics_econ',
    category: '演習プリント',
    file: '/prints/print_lr_social_pe_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 6,
    kb: 200,
  },
  {
    id: 'print_trend_et_1',
    label: '倫理 カント義務論・功利主義・ロールズ正義論 徹底対比シート',
    subject: 'ethics',
    category: '出題傾向',
    file: '/prints/print_lr_social_et_1.pdf',
    thumb: '/brand/app-icon-logo.webp',
    pages: 6,
    kb: 195,
  },
];
