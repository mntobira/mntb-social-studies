/**
 * 単元一覧の上に出す「共通テスト社会科 読み方・解き方の鉄則」（開閉式）
 */
import { Lightbulb } from 'lucide-react';

export function ListeningTechniqueCard({ chapterId: _chapterId }: { chapterId: string }) {
  return (
    <details className="lt-card" data-listening-technique>
      <summary>
        <Lightbulb size={16} aria-hidden="true" />
        <span>共通テスト社会科 資料読解・正誤判別の鉄則</span>
      </summary>
      <div className="lt-body">
        <section aria-label="どこを見るか">
          <h4>1. 設問文と資料の着眼点</h4>
          <ul>
            <li>「正しいもの」か「誤っているもの」か、設問末尾の条件を最初に確認する</li>
            <li>史料・統計表・地図は「年代（世紀・西暦）」「単位（％か実数か）」「出典・注記」を必ず読む</li>
          </ul>
        </section>
        <section aria-label="消去法のコツ">
          <h4>2. 誤答肢を見抜く急所</h4>
          <ul>
            <li>「すべて」「一切〜なかった」「完全に途絶えた」などの極端な限定表現は例外がないか疑う</li>
            <li>因果の逆転（Aの結果Bが起きたのに、Bの結果Aとするひっかけ）に注意する</li>
          </ul>
        </section>
      </div>
    </details>
  );
}
