import { Track } from './track';

export interface HistoryItem {
  id: number;
  track: Track;
  played_at: string;
}
