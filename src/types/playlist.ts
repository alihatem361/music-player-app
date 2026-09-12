import { Track } from './track';

export interface PlaylistSummary {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  track_count: number;
}

export interface Playlist extends Omit<PlaylistSummary, 'track_count'> {
  updated_at: string;
  tracks: Track[];
}

/** `POST /playlists/` echoes the new row without `track_count`. */
export type PlaylistCreated = Omit<PlaylistSummary, 'track_count'>;

export interface CreatePlaylistPayload {
  name: string;
  description?: string;
}
