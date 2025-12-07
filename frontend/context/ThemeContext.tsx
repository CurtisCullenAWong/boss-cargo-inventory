import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Appearance, useColorScheme, Platform } from 'react-native';
import { lightTheme, darkTheme, type MD3Theme } from '../themes/paperTheme';

export type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: MD3Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to detect system theme on web
const getWebSystemTheme = (): 'light' | 'dark' => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
  return 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [currentSystemScheme, setCurrentSystemScheme] = useState<string | null | undefined>(
    Platform.OS === 'web' ? getWebSystemTheme() : Appearance.getColorScheme()
  );

  // Listen for system theme changes
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: Use matchMedia API
      if (typeof window !== 'undefined' && window.matchMedia) {
        try {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          
          const handleChange = (e: MediaQueryListEvent) => {
            setCurrentSystemScheme(e.matches ? 'dark' : 'light');
          };

          // Set initial value
          setCurrentSystemScheme(mediaQuery.matches ? 'dark' : 'light');

          // Listen for changes
          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => {
              mediaQuery.removeEventListener('change', handleChange);
            };
          } else if (mediaQuery.addListener) {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
            return () => {
              if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handleChange);
              }
            };
          }
        } catch {
          // If matchMedia fails, fallback to light
          setCurrentSystemScheme('light');
        }
      }
    } else {
      // Native: Use Appearance API
      const initialColorScheme = Appearance.getColorScheme();
      setCurrentSystemScheme(initialColorScheme);

      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setCurrentSystemScheme(colorScheme);
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  // Determine if we should use dark theme
  const isDark = useMemo(() => {
    if (themeMode === 'auto') {
      // Use the current system scheme, fallback to useColorScheme hook
      const scheme = currentSystemScheme ?? systemColorScheme;
      return scheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, currentSystemScheme, systemColorScheme]);

  // Get the appropriate theme
  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      theme,
      isDark,
    }),
    [themeMode, theme, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

