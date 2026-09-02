import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { getAccessToken } from "../../../services/tokenStorage";
import type { Track } from "../../../types";
import { toHttps } from "../../../utils";

let player: AudioPlayer | null = null;

export const prepareAudio = async (): Promise<void> => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: "doNotMix",
  });
};

/**
 * The stream endpoint is authenticated, and ExoPlayer does not go through the
 * axios interceptor — so the bearer token has to ride along on the media
 * request itself, or the source fails with a 401.
 */
const buildSource = async (track: Track) => {
  const access = await getAccessToken();
  return {
    uri: toHttps(track.stream_url),
    headers: access ? { Authorization: `Bearer ${access}` } : undefined,
  };
};

export const loadAndPlay = async (track: Track): Promise<AudioPlayer> => {
  await prepareAudio();
  const source = await buildSource(track);

  if (!player) {
    player = createAudioPlayer(source, { updateInterval: 500 });
  } else {
    player.replace(source);
  }
  player.play();
  return player;
};

export const getAudioPlayer = (): AudioPlayer | null => player;

export const pauseAudio = (): void => player?.pause();

export const resumeAudio = (): void => player?.play();

export const seekAudio = async (positionMs: number): Promise<void> => {
  await player?.seekTo(positionMs / 1000);
};
