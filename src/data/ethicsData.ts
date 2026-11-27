/**
 * ===================================================================
 * 公共・倫理（ethics） 全単元データ入口（17章完全網羅・共通テスト実戦増設版）
 * ===================================================================
 * 全4部・17章・51大問・153小問（全問4択マーク形式・記述問題ゼロ）
 * 章ID接頭辞: et（^et\d+_\d+$）
 * - 第1編（et1_1〜et1_5）: 青年期の課題と東西の源流思想（ギリシア・一神教・インド仏教・中国思想）
 * - 第2編（et2_1〜et2_4）: 日本の伝統思想と近代化の苦闘（神道・仏教・江戸儒学国学民衆思想・明治〜戦後思想）
 * - 第3編（et3_1〜et3_4）: 西洋近代思想（ルネサンス宗教改革・経験論合理論・社会契約・カントヘーゲル・功利主義マルクス）
 * - 第4編（et4_1〜et4_4）: 現代思想（実存現象学・構造ポストモダン科学哲学・正義論ケア）と応用倫理（生命・環境・情報）
 */
import type { Part, Problem } from '../types/curriculum';
import { computeSocialSubjectStats } from './socialKit';
import { ethicsPart1 } from './ethics/ethicsPart1';
import { ethicsPart2 } from './ethics/ethicsPart2';
import { ethicsPart3 } from './ethics/ethicsPart3';
import { ethicsPart4 } from './ethics/ethicsPart4';
import { etExtraP1 } from './ethics/etExtraP1';
import { etExtraP2 } from './ethics/etExtraP2';
import { etExtraP3 } from './ethics/etExtraP3';
import { etExtraP4 } from './ethics/etExtraP4';

const extraEthicsProblemsByChapter: Record<string, Problem[]> = {
  ...etExtraP1,
  ...etExtraP2,
  ...etExtraP3,
  ...etExtraP4,
};

function withExtraEthicsProblems(part: Part): Part {
  return {
    ...part,
    chapters: part.chapters.map((ch) => ({
      ...ch,
      practiceProblems: [...ch.practiceProblems, ...(extraEthicsProblemsByChapter[ch.id] ?? [])],
    })),
  };
}

export const ethicsData = {
  parts: [ethicsPart1, ethicsPart2, ethicsPart3, ethicsPart4].map(withExtraEthicsProblems),
};

export function getEthicsStats() {
  return computeSocialSubjectStats(ethicsData.parts);
}
