import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

type ProgressState = {
  practiceCount: number;
  gamesPlayed: number;
  puzzlesSolved: number;
  achievements: string[];
};

type ProgressContextValue = {
  progress: ProgressState;
  incrementPractice: () => void;
  incrementGames: () => void;
  incrementPuzzles: () => void;
  addAchievement: (item: string) => void;
};

const defaultState: ProgressState = {
  practiceCount: 0,
  gamesPlayed: 0,
  puzzlesSolved: 0,
  achievements: [],
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function loadState(): ProgressState {
  if (Platform.OS !== 'web') return defaultState;
  try {
    const raw = window.localStorage.getItem('progress');
    if (raw) {
      return { ...defaultState, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function persistState(state: ProgressState) {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem('progress', JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadState());

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      incrementPractice: () =>
        setProgress((prev) => {
          const next = { ...prev, practiceCount: prev.practiceCount + 1 };
          persistState(next);
          return next;
        }),
      incrementGames: () =>
        setProgress((prev) => {
          const next = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
          persistState(next);
          return next;
        }),
      incrementPuzzles: () =>
        setProgress((prev) => {
          const next = { ...prev, puzzlesSolved: prev.puzzlesSolved + 1 };
          persistState(next);
          return next;
        }),
      addAchievement: (item) =>
        setProgress((prev) => {
          const next = { ...prev, achievements: [...prev.achievements, item] };
          persistState(next);
          return next;
        }),
    }),
    [progress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
