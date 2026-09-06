import axios from "axios";
import { Song, LikeResponse } from "../types";

const BASE_URL = "https://musicapp-production-bcd8.up.railway.app/api";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4NTI4OTk3LCJpYXQiOjE3ODg1MjUzOTcsImp0aSI6ImYwMjhhOTEwMTQwYjRkNzBhNzZiOGVhMjBmYzY5Zjg2IiwidXNlcl9pZCI6IjMwIn0.6-Qfkc4MpiFcc_vgymucNFoGbd-hcpRyPCbRVjRH3Ws";
export const favoritesService = {
  getLikedSongs: async (): Promise<Song[]> => {
    const response = await axios.get(`${BASE_URL}/liked/`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  },

  toggleLikeSong: async (trackId: number): Promise<LikeResponse> => {
    const response = await axios.post(
      `${BASE_URL}/tracks/${trackId}/like/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return response.data;
  },
};

export default favoritesService;
