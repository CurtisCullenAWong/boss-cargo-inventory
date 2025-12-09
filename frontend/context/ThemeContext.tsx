import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Appearance, useColorScheme, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, type MD3Theme } from "../themes/paperTheme";

export type ThemeMode = "auto" | "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: MD3Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// --- Utility: get system theme for Web ---
const getWebSystemTheme = () => {
  if (Platform.OS !== "web") return null;

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const fallbackScheme = useColorScheme();
  const [systemScheme, setSystemScheme] = useState(
    Platform.OS === "web" ? getWebSystemTheme() : Appearance.getColorScheme()
  );

  // --- 1. Load saved theme on startup ---
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        let stored: string | null = null;

        if (Platform.OS === "web") {
          stored = localStorage.getItem("user-theme-mode");
        } else {
          stored = await AsyncStorage.getItem("user-theme-mode");
        }

        if (stored === "light" || stored === "dark" || stored === "auto") {
          setThemeMode(stored);
        }
      } catch (e) {
        console.warn("Failed to load theme:", e);
      }

      setLoaded(true);
    };

    loadTheme();
  }, []);

  // --- 2. Save theme whenever it changes ---
  const saveTheme = async (mode: ThemeMode) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("user-theme-mode", mode);
      } else {
        await AsyncStorage.setItem("user-theme-mode", mode);
      }
    } catch (e) {
      console.warn("Failed to save theme:", e);
    }
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  };

  // --- 3. Listen for OS theme changes ---
  useEffect(() => {
    if (Platform.OS === "web") {
      const media = window.matchMedia?.("(prefers-color-scheme: dark)");
      if (!media) return;

      const onChange = (e: MediaQueryListEvent) =>
        setSystemScheme(e.matches ? "dark" : "light");

      media.addEventListener?.("change", onChange);
      return () => media.removeEventListener?.("change", onChange);
    }

    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(colorScheme)
    );
    return () => sub.remove();
  }, []);

  // --- 4. Compute dark mode state ---
  const isDark = useMemo(() => {
    if (themeMode === "auto")
      return (systemScheme ?? fallbackScheme) === "dark";
    return themeMode === "dark";
  }, [themeMode, systemScheme, fallbackScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode: handleSetThemeMode,
      theme,
      isDark,
    }),
    [themeMode, theme, isDark]
  );

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
