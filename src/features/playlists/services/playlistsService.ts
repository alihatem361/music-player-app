import { request } from "../../../services/api";
import type {
  CreatePlaylistPayload,
  Playlist,
  PlaylistCreated,
  PlaylistSummary,
} from "../../../types";

export const getPlaylists = (): Promise<PlaylistSummary[]> =>
  request<PlaylistSummary[]>({ url: "/playlists/" });

export const getPlaylist = (id: number): Promise<Playlist> =>
  request<Playlist>({ url: `/playlists/${id}/` });

export const createPlaylistRequest = (
  body: CreatePlaylistPayload,
): Promise<PlaylistCreated> =>
  request<PlaylistCreated>({ url: "/playlists/", method: "POST", data: body });

export const renamePlaylistRequest = (id: number, name: string): Promise<unknown> =>
  request({ url: `/playlists/${id}/`, method: "PUT", data: { name } });

export const deletePlaylistRequest = (id: number): Promise<void> =>
  request({ url: `/playlists/${id}/`, method: "DELETE" });

export const addTrackRequest = (playlistId: number, trackId: number): Promise<Playlist> =>
  request<Playlist>({
    url: `/playlists/${playlistId}/add_track/`,
    method: "POST",
    data: { track_id: trackId },
  });

/**
 * Note the body on a DELETE — this has to go through `request` with an explicit
 * `data` config; an `api.delete(url)` shorthand would drop it.
 */
export const removeTrackRequest = (playlistId: number, trackId: number): Promise<Playlist> =>
  request<Playlist>({
    url: `/playlists/${playlistId}/remove_track/`,
    method: "DELETE",
    data: { track_id: trackId },
  });
