import { TextStyle } from 'react-native';

export const typography = {
  screenTitle: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4 },
  sectionTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2 },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 15, fontWeight: '500' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400', letterSpacing: 0.4 },
  button: { fontSize: 16, fontWeight: '600' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
