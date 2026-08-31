import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, ThemeColors, ThemeMode } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

interface ThemeContextValue {
  theme: Theme;
  /** `null` means "follow the OS setting". */
  setMode: (mode: ThemeMode | null) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ThemeMode | null>(null);

  const mode: ThemeMode = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleMode = useCallback(() => {
    setOverride(mode === 'dark' ? 'light' : 'dark');
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: { mode, colors: palettes[mode], spacing, radius, typography },
      setMode: setOverride,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context.theme;
};

export const useThemeControls = (): Omit<ThemeContextValue, 'theme'> => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeControls must be used inside a ThemeProvider');
  }
  const { setMode, toggleMode } = context;
  return { setMode, toggleMode };
};
