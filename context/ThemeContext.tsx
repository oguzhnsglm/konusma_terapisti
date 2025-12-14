import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, ColorSchemeName, useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';
type Language = 'tr' | 'en';

type ThemeContextValue = {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setTheme: (mode: Theme) => void;
  changeLanguage: (lang: Language) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function safeGet(key: string, fallback: string) {
  if (Platform.OS !== 'web') return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: string) {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme: ColorSchemeName = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(() => (safeGet('theme', '') as Theme) || (systemScheme === 'dark' ? 'dark' : 'light'));
  const [language, setLanguage] = useState<Language>(() => (safeGet('language', '') as Language) || 'tr');

  useEffect(() => {
    safeSet('theme', theme);
    if (Platform.OS === 'web') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    safeSet('language', language);
  }, [language]);

  const value = useMemo(
    () => ({
      theme,
      language,
      toggleTheme: () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
      setTheme: (mode: Theme) => setThemeState(mode),
      changeLanguage: (lang: Language) => setLanguage(lang),
      isDark: theme === 'dark',
    }),
    [theme, language],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
