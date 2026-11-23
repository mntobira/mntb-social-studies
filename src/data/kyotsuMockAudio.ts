/**
 * 共通テスト予想問題の音声トラック定義（社会科では音声トラックなし＝常に空を返す）
 */
export interface KyotsuAudioTrack {
  q: string;
  part: string;
  label: string;
  file: string;
  sec: number;
  twice?: boolean;
}

export function kyotsuAudioOf(_printId: string): readonly KyotsuAudioTrack[] {
  return [];
}

export function kyotsuFullAudioOf(_printId: string): string | null {
  return null;
}

export function kyotsuAudioLabel(q: string): string {
  return q;
}
