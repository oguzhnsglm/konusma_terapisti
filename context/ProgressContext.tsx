import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

// Günlük istatistikler
type DailyStats = {
  date: string; // YYYY-MM-DD
  minutesPracticed: number;
  wordsLearned: number;
  sessionsCompleted: number;
  starsEarned: number;
};

// Oyun başarısı
type GameAchievement = {
  gameId: string; // 'puzzles', 'word-fill', 'rhyme', 'colors'
  difficulty: 'easy' | 'medium' | 'hard';
  starsEarned: number; // 1-3
  timestamp: number;
};

// Avatar ve aksesuar
type AvatarState = {
  name: string;
  avatarId: string;
  accessories: string[]; // kazanılan aksesuar ID'leri
};

type ProgressState = {
  // Günlük veri
  dailyStats: DailyStats[];
  
  // Oyun başarısı
  achievements: GameAchievement[];
  totalStarsEarned: number;
  
  // Avatar
  avatar: AvatarState;
  
  // Açılan dünyalar
  unlockedWorlds: string[]; // 'forest', 'ocean', 'space', 'glacier'
  currentWorld: string;
};

type ProgressContextValue = {
  progress: ProgressState;
  
  // Günlük istatistikler
  getTodayStats: () => DailyStats;
  addMinutesToday: (minutes: number) => void;
  addWordToday: () => void;
  addSessionToday: () => void;
  addStarsToday: (stars: number) => void;
  incrementGames: () => void;
  
  // Oyun başarısı
  addAchievement: (gameId: string, difficulty: 'easy' | 'medium' | 'hard', stars: number) => void;
  
  // Avatar
  setAvatarName: (name: string) => void;
  setAvatarId: (id: string) => void;
  addAccessory: (id: string) => void;
  
  // Dünyalar
  unlockWorld: (worldId: string) => void;
  setCurrentWorld: (worldId: string) => void;
};

const defaultState: ProgressState = {
  dailyStats: [],
  achievements: [],
  totalStarsEarned: 0,
  avatar: {
    name: 'Yeni Arkadaş',
    avatarId: 'avatar-1',
    accessories: [],
  },
  unlockedWorlds: ['forest'],
  currentWorld: 'forest',
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function loadState(): ProgressState {
  if (Platform.OS !== 'web') return defaultState;
  try {
    const raw = window.localStorage.getItem('progress_v2');
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
    window.localStorage.setItem('progress_v2', JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadState());

  const getTodayStats = (): DailyStats => {
    const today = getTodayDate();
    return (
      progress.dailyStats.find((s) => s.date === today) || {
        date: today,
        minutesPracticed: 0,
        wordsLearned: 0,
        sessionsCompleted: 0,
        starsEarned: 0,
      }
    );
  };

  const updateTodayStats = (updater: (stats: DailyStats) => DailyStats) => {
    const today = getTodayDate();
    const newStats = [...progress.dailyStats];
    const idx = newStats.findIndex((s) => s.date === today);
    const currentStats = getTodayStats();
    const updated = updater(currentStats);

    if (idx >= 0) {
      newStats[idx] = updated;
    } else {
      newStats.push(updated);
    }

    const newProgress = { ...progress, dailyStats: newStats };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const addMinutesToday = (minutes: number) => {
    updateTodayStats((stats) => ({
      ...stats,
      minutesPracticed: stats.minutesPracticed + minutes,
    }));
  };

  const addWordToday = () => {
    updateTodayStats((stats) => ({
      ...stats,
      wordsLearned: stats.wordsLearned + 1,
    }));
  };

  const addSessionToday = () => {
    updateTodayStats((stats) => ({
      ...stats,
      sessionsCompleted: stats.sessionsCompleted + 1,
    }));
  };

  const addStarsToday = (stars: number) => {
    updateTodayStats((stats) => ({
      ...stats,
      starsEarned: stats.starsEarned + stars,
    }));
  };

  const incrementGames = () => {
    addSessionToday();
  };

  const addAchievement = (gameId: string, difficulty: 'easy' | 'medium' | 'hard', stars: number) => {
    const newAchievements = [
      ...progress.achievements,
      {
        gameId,
        difficulty,
        starsEarned: stars,
        timestamp: Date.now(),
      },
    ];
    const newProgress = {
      ...progress,
      achievements: newAchievements,
      totalStarsEarned: progress.totalStarsEarned + stars,
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const setAvatarName = (name: string) => {
    const newProgress = {
      ...progress,
      avatar: { ...progress.avatar, name },
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const setAvatarId = (id: string) => {
    const newProgress = {
      ...progress,
      avatar: { ...progress.avatar, avatarId: id },
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const addAccessory = (id: string) => {
    if (progress.avatar.accessories.includes(id)) return;
    const newProgress = {
      ...progress,
      avatar: {
        ...progress.avatar,
        accessories: [...progress.avatar.accessories, id],
      },
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const unlockWorld = (worldId: string) => {
    if (progress.unlockedWorlds.includes(worldId)) return;
    const newProgress = {
      ...progress,
      unlockedWorlds: [...progress.unlockedWorlds, worldId],
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const setCurrentWorld = (worldId: string) => {
    const newProgress = {
      ...progress,
      currentWorld: worldId,
    };
    setProgress(newProgress);
    persistState(newProgress);
  };

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      getTodayStats,
    addMinutesToday,
    addWordToday,
    addSessionToday,
    addStarsToday,
    incrementGames,
    addAchievement,
      setAvatarName,
      setAvatarId,
      addAccessory,
      unlockWorld,
      setCurrentWorld,
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
