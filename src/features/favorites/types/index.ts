export interface Song {
  id: number;
  title: string;
  artist: string;
  cover_url: string;
  stream_url: string;
  source?: string;
  external_id?: string;
  is_preview_only?: boolean;
  duration?: number;
  genre?: string;
  created_at?: string;
}

export interface LikeResponse {
  liked: boolean;
  detail: string;
}