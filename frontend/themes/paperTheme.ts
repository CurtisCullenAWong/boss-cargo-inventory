import { 
  MD3LightTheme, 
  MD3DarkTheme, 
  configureFonts, 
  type MD3Theme 
} from 'react-native-paper';
import { colorConfigLight, colorConfigDark } from './colorConfig';

// UPDATED: Set font family to Arial
const customFonts = {
  bold: 'Arial',
  regular: 'Sans-Serif', 
};

export const getFontFamily = () => {
  return customFonts.regular;
};

export const getBoldFontFamily = () => {
  return customFonts.bold;
};

export const fontConfig = {
  displayLarge: {
    fontFamily: getBoldFontFamily(),
    fontWeight: '400' as const,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -0.2,
  },
  displayMedium: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 44,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 36,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: getBoldFontFamily(),
    fontWeight: '400' as const,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 24,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: getBoldFontFamily(),
    fontWeight: '500' as const,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: getFontFamily(),
    fontWeight: '500' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: getFontFamily(),
    fontWeight: '500' as const,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: getFontFamily(),
    fontWeight: '400' as const,
    fontSize: 12,
    lineHeight: 16,
  },
};

// 4. EXPORT THEMES
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colorConfigLight,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colorConfigDark,
  },
  fonts: configureFonts({ config: fontConfig }),
};