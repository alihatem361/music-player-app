import { request } from '../../services/api';
import {
  CreatePlaylistPayload,
  Playlist,
  PlaylistSummary,
  Track,
  UpdatePlaylistPayload,
} from '../../types';

/**
 * DRF list endpoints sometimes return a bare array and sometimes a paginated
 * `{ count, results }` envelope. This normalizes both so callers always get an
 * array back regardless of how pagination is configured server-side.
 */
const unwrapList = <T>(data: T[] | { results?: T[] } | null | undefined): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.results ?? [];
};

export const playlistsService = {
  /** GET /playlists/ — the current user's playlists. */
  list: async (): Promise<PlaylistSummary[]> => {
    const data = await request<PlaylistSummary[] | { results?: PlaylistSummary[] }>({
      url: '/playlists/',
      method: 'GET',
    });
    return unwrapList(data);
  },

  /** GET /playlists/{id}/ — a single playlist with its tracks. */
  get: (playlistId: number): Promise<Playlist> =>
    request<Playlist>({ url: `/playlists/${playlistId}/`, method: 'GET' }),

  /** POST /playlists/ — create an empty playlist. */
  create: (payload: CreatePlaylistPayload): Promise<PlaylistSummary> =>
    request<PlaylistSummary>({ url: '/playlists/', method: 'POST', data: payload }),

  /** PUT /playlists/{id}/ — rename (and optionally re-describe) a playlist. */
  update: (playlistId: number, payload: UpdatePlaylistPayload): Promise<Playlist> =>
    request<Playlist>({ url: `/playlists/${playlistId}/`, method: 'PUT', data: payload }),

  /** DELETE /playlists/{id}/ */
  remove: (playlistId: number): Promise<void> =>
    request<void>({ url: `/playlists/${playlistId}/`, method: 'DELETE' }),

  /** POST /playlists/{id}/add_track/ */
  addTrack: (playlistId: number, trackId: number): Promise<void> =>
    request<void>({
      url: `/playlists/${playlistId}/add_track/`,
      method: 'POST',
      data: { track_id: trackId },
    }),

  /** DELETE /playlists/{id}/remove_track/ — DRF reads the body on DELETE. */
  removeTrack: (playlistId: number, trackId: number): Promise<void> =>
    request<void>({
      url: `/playlists/${playlistId}/remove_track/`,
      method: 'DELETE',
      data: { track_id: trackId },
    }),

  /**
   * GET /tracks/ (or /tracks/search/) — used only by the "add tracks" picker so
   * the playlist detail screen can offer songs to add. The Library feature owns
   * the full tracks service; this is a scoped read to keep this feature usable
   * before that lands.
   */
  searchTracks: async (query?: string): Promise<Track[]> => {
    const trimmed = query?.trim();
    const data = await request<Track[] | { results?: Track[] }>(
      trimmed
        ? { url: '/tracks/search/', method: 'GET', params: { q: trimmed } }
        : { url: '/tracks/', method: 'GET', params: { limit: 50, offset: 0 } },
    );
    return unwrapList(data);
  },
};
