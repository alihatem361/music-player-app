import {api} from "../../../services/api";
import { Song } from "../types/songTypes";

export const getSongs = async (): Promise<Song[]> => {
  const response = await api.get("/tracks/");
  return response.data;
};

export const searchSongs = async (
  query: string
): Promise<Song[]> => {
  const response = await api.get("/tracks/search/", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export const getSongById = async (
  trackId: number
): Promise<Song> => {
  const response = await api.get(`/tracks/${trackId}/`);
  return response.data;
};