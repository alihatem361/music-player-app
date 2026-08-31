/**
 * Palette derived from the Figma design: a light, blue-tinted surface with
 * deep navy typography. The dark palette mirrors the same roles so that every
 * component can be written against `ThemeColors` and stay theme-agnostic.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  border: string;
  danger: string;
  like: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#E8ECF4',
  text: '#0E1428',
  textMuted: '#8A94A6',
  primary: '#101A33',
  onPrimary: '#FFFFFF',
  border: '#DEE3ED',
  danger: '#D64550',
  like: '#E8506E',
  overlay: 'rgba(14, 20, 40, 0.45)',
};

export const darkColors: ThemeColors = {
  background: '#0B0F1A',
  surface: '#151B2B',
  surfaceMuted: '#1F2739',
  text: '#F5F7FB',
  textMuted: '#8A94A6',
  primary: '#F5F7FB',
  onPrimary: '#0B0F1A',
  border: '#232C40',
  danger: '#F2707A',
  like: '#E8506E',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type ThemeMode = 'light' | 'dark';

export const palettes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
