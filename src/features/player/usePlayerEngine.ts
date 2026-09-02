import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logPlay } from "../tracks/services/tracksService";
import { next, setPlaying, setProgress } from "./playerSlice";
import { getAudioPlayer, loadAndPlay, seekAudio } from "./services/audioService";

const POLL_INTERVAL_MS = 500;

/**
 * The single place audio side-effects live. Screens only dispatch player
 * actions; this hook loads whatever track the slice says is current, mirrors
 * playback position back into Redux, and advances the queue when a track ends.
 *
 * Mounted once, above the navigators.
 */
export const usePlayerEngine = (): void => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const repeat = useAppSelector((state) => state.player.repeat);
  const trackId = currentTrack?.id;
  const loadedIdRef = useRef<number | null>(null);

  // Follow the slice: any path that changes the current track (tile press,
  // skip buttons, carousel swipe, mini player) lands here.
  useEffect(() => {
    if (!currentTrack || loadedIdRef.current === trackId) {
      return;
    }
    loadedIdRef.current = trackId ?? null;
    void loadAndPlay(currentTrack);
    void logPlay(currentTrack.id);
    dispatch(setPlaying(true));
    // `currentTrack` is intentionally read fresh while only its id gates the effect.
  }, [dispatch, trackId, currentTrack]);

  useEffect(() => {
    const timer = setInterval(() => {
      const player = getAudioPlayer();
      if (!player) {
        return;
      }

      const positionMs = player.currentTime * 1000;
      const durationMs = player.duration * 1000;
      dispatch(setProgress({ positionMs, durationMs }));

      const hasEnded = durationMs > 0 && positionMs >= durationMs - POLL_INTERVAL_MS;
      if (!hasEnded) {
        return;
      }

      if (repeat === "one") {
        void seekAudio(0);
      } else if (repeat === "off") {
        dispatch(setPlaying(false));
      } else {
        dispatch(next());
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [dispatch, repeat]);
};
