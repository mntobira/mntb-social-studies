/**
 * 共通テスト社会科の科目選択画面（SubjectSelection）
 * 既存の ListeningSubjectSelection と同じ props を受け取り、5科目の本棚カード＋対戦導線を表示する。
 */
import { ArrowRight, BookOpen, Briefcase, ChevronLeft, Globe2, PenLine, Swords } from 'lucide-react';
import type { SubjectId } from '../data/subjectLabels';
import { getSubjectStats } from '../data/chapterIndex.generated';
import { SUBJECT_REGISTRY } from '../data/subjects';
import './listening-home.css';
import { KineticText } from '../motion';

export interface SubjectSelectionProps {
  onSelectSubject: (subject: SubjectId) => void;
  currentSubject?: SubjectId;
  backLabel?: string;
  isGuest: boolean;
  onBack?: () => void;
  onRika?: () => void;
  onBattle?: () => void;
}

const SUBJECT_ICON_MAP = {
  jp_history: BookOpen,
  world_history: Globe2,
  geography: Globe2,
  politics_econ: Briefcase,
  ethics: PenLine,
} as const;

export function SubjectSelection({
  onSelectSubject,
  currentSubject,
  onBack,
  onBattle,
  backLabel = 'ホームに戻る',
}: SubjectSelectionProps) {
  return (
    <main className="listening-home ls-subjects" data-listening-subjects>
      <div className="lh-container">
        <header className="lh-header">
          {onBack ? (
            <button className="ls-subjects-back" onClick={onBack} aria-label={backLabel}>
              <ChevronLeft size={18} />
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          <div className="lh-brand">
            <img src="/brand/manatobi-logo.webp" alt="マナトビ" width={1008} height={321} />
          </div>
        </header>

        <section className="ls-subjects-title">
          <p className="lh-eyebrow">共通テスト 社会科（地歴・公民）</p>
          <h1>
            <KineticText text="どの科目で扉をひらく？" step={50} variant="wave" />
          </h1>
          <p>新課程共通テストの5科目に対応。演習も赤シート暗記も対戦もこれ1本で。</p>
        </section>

        <section className="ls-foundation" aria-labelledby="ls-social-subjects-title">
          <div className="lh-section-heading">
            <h2 id="ls-social-subjects-title">地歴・公民 5科目</h2>
            <span>進捗と復習ノートは科目ごとに保存されます。</span>
          </div>
          <div className="ls-foundation-grid">
            {SUBJECT_REGISTRY.map((subj) => {
              const stats = getSubjectStats(subj.id);
              const Icon = SUBJECT_ICON_MAP[subj.id];
              const isCurrent = currentSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  data-subject-id={subj.id}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => onSelectSubject(subj.id)}
                  style={isCurrent ? { borderColor: subj.theme.accent, backgroundColor: subj.theme.surface } : undefined}
                >
                  <Icon size={22} style={{ color: subj.theme.accent }} />
                  <span>
                    <strong>{subj.label}</strong>
                    <small>
                      全{stats.chapters ?? 0}単元・大問{stats.questions ?? 0}題（設問{stats.marks ?? 0}問）
                    </small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              );
            })}
          </div>
          {onBattle && (
            <button className="ls-foundation-battle" onClick={onBattle}>
              <span className="lh-battle-icon">
                <Swords size={22} />
              </span>
              <span>
                <strong>社会科バトルで実戦力を試す</strong>
                <small>日本史・世界史・地理・政経・倫理をAI・友だち・全国対戦で早解き</small>
              </span>
              <ArrowRight size={18} />
            </button>
          )}
        </section>

        <p className="ls-subjects-note">
          2025年度〜新課程「歴史総合・探究／地理総合・探究／公共・政経・倫理」準拠
        </p>
      </div>
    </main>
  );
}
