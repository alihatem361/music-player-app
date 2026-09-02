import { request, toApiError } from "../../../services/api";
import type { Track, TrackQuery } from "../../../types";

export const getTracks = (params?: TrackQuery): Promise<Track[]> =>
  request<Track[]>({ url: "/tracks/", params });

export const searchTracksRequest = (q: string): Promise<Track[]> =>
  request<Track[]>({ url: "/tracks/search/", params: { q } });

/**
 * Records a play so the backend's `/history/` feed stays accurate. Fired on
 * playback start; a failure here must never interrupt audio, so it is swallowed.
 */
export const logPlay = async (trackId: number): Promise<void> => {
  try {
    await request({ url: `/tracks/${trackId}/play/`, method: "POST" });
  } catch (error) {
    if (__DEV__) {
      console.warn("Could not log play:", toApiError(error).message);
    }
  }
};
