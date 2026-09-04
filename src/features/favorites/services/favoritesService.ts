import axios from 'axios';
import { Song, LikeResponse } from '../types';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4NTE2OTE5LCJpYXQiOjE3ODg1MTMzMTksImp0aSI6IjYxY2FhYjM2MWEyODRlYzk5Nzc3NDZlMTNjNWE1NmFiIiwidXNlcl9pZCI6IjMyIn0.K9G1QzqMsxR0W-rNDIAuEJgQ_3-tDguvgk05Ci5WfIo';
const BASE_URL = 'https://musicapp-production-bcd8.up.railway.app/api';

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
      }
    );
    return response.data;
  },
};

export default favoritesService;