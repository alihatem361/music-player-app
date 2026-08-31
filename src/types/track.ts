export type Genre = 'pop' | 'rock' | 'jazz' | 'classical' | 'hiphop' | 'electronic' | 'other';

export interface Track {
  id: number;
  title: string;
  artist: string;
  /** Upstream provider, e.g. "deezer". */
  source: string;
  external_id: string;
  is_preview_only: boolean;
  genre: Genre;
  /** Seconds. */
  duration: number;
  cover_url: string;
  /** Served over HTTP — always run through `toHttps()` before playing. */
  stream_url: string;
  created_at: string;
}

export interface TrackQuery {
  q?: string;
  genre?: Genre;
  limit?: number;
  offset?: number;
}

export interface LikeToggleResponse {
  liked: boolean;
  detail: string;
}
