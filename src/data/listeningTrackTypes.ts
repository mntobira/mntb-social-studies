/**
 * リスニング音声コンポーネントが参照する型エイリアス（葉モジュール）。
 * 社会科版では音声再生は行わないが、共通UIコンポーネント（ProblemPane / Explanation 等）の
 * 型整合性をそのまま維持するためにエクスポートする。
 */
import type {
  AudioTrack,
  KeyPhrase,
  SpeakerTurn,
  TrackMaterial,
} from '../types/curriculum';

export type ListeningMaterial = TrackMaterial;
export type ListeningSpeakerTurn = SpeakerTurn;
export type ListeningKeyPhrase = KeyPhrase;
export type ListeningAudioTrack = AudioTrack;
