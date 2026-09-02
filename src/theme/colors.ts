/**
 * Palette derived from the Figma design: a light, blue-tinted surface with
 * deep navy typography. The dark palette mirrors the same roles so that every
 * component can be written against `ThemeColors` and stay theme-agnostic.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  input: string;
  text: string;
  textMuted: string;
  textSoft: string;
  primary: string;
  accent: string;
  onPrimary: string;
  border: string;
  track: string;
  danger: string;
  like: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: "#F7FAFF",
  surface: "#FFFFFF",
  surfaceMuted: "#E8ECF4",
  input: "#F1D8D5",
  text: "#091127",
  textMuted: "#8996B8",
  textSoft: "#6E6A7C",
  primary: "#D4401E",
  accent: "#5F33E1",
  onPrimary: "#FFFFFF",
  border: "#DEE3ED",
  track: "#D3D8DF",
  danger: "#D64550",
  like: "#E8506E",
  overlay: "rgba(9, 17, 39, 0.7)",
};

export const darkColors: ThemeColors = {
  background: "#0B0F1A",
  surface: "#151B2B",
  surfaceMuted: "#1F2739",
  input: "#3A2730",
  text: "#F5F7FB",
  textMuted: "#8A94A6",
  textSoft: "#B8C0D1",
  primary: "#F5F7FB",
  accent: "#9C84F7",
  onPrimary: "#0B0F1A",
  border: "#232C40",
  track: "#3A4459",
  danger: "#F2707A",
  like: "#E8506E",
  overlay: "rgba(0, 0, 0, 0.6)",
};

export type ThemeMode = "light" | "dark";

export const palettes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
