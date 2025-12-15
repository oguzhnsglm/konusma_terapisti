export type ColorScheme = 'dark' | 'light';

export interface ThemeTokens {
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient: readonly [string, string, ...string[]];
    surface: string;
    surfaceLight: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
  };

  // Spacing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  // Border Radius
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };

  // Typography
  typography: {
    h1: { fontSize: number; fontWeight: string };
    h2: { fontSize: number; fontWeight: string };
    h3: { fontSize: number; fontWeight: string };
    body: { fontSize: number; fontWeight: string };
    caption: { fontSize: number; fontWeight: string };
  };

  // Shadows
  shadows: {
    sm: { shadowColor: string; shadowOpacity: number; shadowRadius: number };
    md: { shadowColor: string; shadowOpacity: number; shadowRadius: number };
    lg: { shadowColor: string; shadowOpacity: number; shadowRadius: number };
  };
}

// Default (Adult) Theme - Dark
export const defaultTheme: ThemeTokens = {
  colors: {
    primary: '#69ff9c',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#05070f',
    backgroundGradient: ['#05070f', '#070d19', '#091328'],
    surface: 'rgba(14, 20, 33, 0.6)',
    surfaceLight: 'rgba(14, 20, 33, 0.4)',
    border: 'rgba(255,255,255,0.12)',
    text: '#f5f7ff',
    textSecondary: '#d5dbff',
    textMuted: '#8f95c9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '800' },
    h2: { fontSize: 24, fontWeight: '700' },
    h3: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 15, fontWeight: '500' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    md: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 },
    lg: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12 },
  },
};

// Child Mode Theme - Colorful & Playful
export const childTheme: ThemeTokens = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#F7F9FF',
    backgroundGradient: [
      '#FFE5E5',
      '#E5F0FF',
      '#E5F9F7',
    ] as readonly [string, string, string],
    surface: 'rgba(255,255,255,0.85)',
    surfaceLight: 'rgba(255,255,255,0.6)',
    border: 'rgba(79, 205, 196, 0.2)',
    text: '#2D3436',
    textSecondary: '#636E72',
    textMuted: '#95A5A6',
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
    xxl: 52,
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 28,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 36, fontWeight: '900' },
    h2: { fontSize: 28, fontWeight: '800' },
    h3: { fontSize: 20, fontWeight: '700' },
    body: { fontSize: 17, fontWeight: '600' },
    caption: { fontSize: 13, fontWeight: '500' },
  },
  shadows: {
    sm: { shadowColor: '#4ECDC4', shadowOpacity: 0.15, shadowRadius: 6 },
    md: { shadowColor: '#4ECDC4', shadowOpacity: 0.2, shadowRadius: 10 },
    lg: { shadowColor: '#4ECDC4', shadowOpacity: 0.25, shadowRadius: 16 },
  },
};
