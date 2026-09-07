import axios from 'axios';
import { Song } from '../types';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4ODA5ODk4LCJpYXQiOjE3ODg4MDYyOTgsImp0aSI6IjA2ODdmZTFlMDM4ZDRjOGE5Y2VhMTcwZWI2Zjc4MTAwIiwidXNlcl9pZCI6IjMyIn0.DOu-MAR_48QXRNRhcR0W7yHB8fk3Vi_2Q1G75eM7u6o';
const BASE_URL = 'https://musicapp-production-bcd8.up.railway.app/api';

export const recommendationsService = {
  getRecommendedSongs: async (): Promise<Song[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/recommendations/`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      console.log("API RAW Response:", response.data);

      return Array.isArray(response.data) ? response.data : (response.data.results || response.data.songs || []);
    } catch (error: any) {
      console.error("Error fetching recommendations:", error.response?.data || error.message);
      throw error;
    }
  },
};