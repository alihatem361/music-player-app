import {api} from "../../../services/api";

export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  audio_url?: string;
  cover_image?: string;
  is_preview_only?: boolean;
}