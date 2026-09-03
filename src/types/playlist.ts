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

/** Body for `POST /playlists/` — the API only requires a name. */
export interface CreatePlaylistPayload {
  name: string;
  description?: string;
}

/** Body for `PUT /playlists/{id}/`. */
export interface UpdatePlaylistPayload {
  name: string;
  description?: string;
}

/** Body shared by the add/remove-track endpoints. */
export interface PlaylistTrackPayload {
  playlistId: number;
  trackId: number;
}
