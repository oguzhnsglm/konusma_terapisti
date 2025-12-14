import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import levelsSeed from '../logic/levels';
import {
  fetchLevelsWithWords,
  fetchUserLevelProgress,
  fetchUserWordProgress,
  LevelRow,
  upsertLevelProgress,
  upsertWordProgress,
  WordStatus,
} from '../logic/supabaseData';
import { supabase } from '../lib/supabaseClient';

export type PracticeLevel = {
  id: number;
  title: string;
  description: string;
  words: string[];
  wordIds: number[];
  progress: WordStatus[];
  unlocked: boolean;
  completed: boolean;
  orderIndex?: number | null;
};

type PracticeContextValue = {
  levels: PracticeLevel[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setWordStatus: (levelId: number, wordIndex: number, status: WordStatus) => void;
  resetLevel: (levelId: number) => void;
  resetAll: () => void;
};

const PracticeContext = createContext<PracticeContextValue | undefined>(undefined);

function seedLevels(): PracticeLevel[] {
  return (levelsSeed as { id: number; title: string; description: string; words: string[] }[]).map(
    (level, index) => ({
      id: level.id,
      title: level.title,
      description: level.description,
      words: level.words,
      wordIds: level.words.map((_, idx) => Number(`${level.id}${idx + 1}`) * -1), // negatif pseudo id
      progress: level.words.map(() => 'pending' as WordStatus),
      unlocked: index === 0,
      completed: false,
    }),
  );
}

function mapRemoteLevels(
  remoteLevels: LevelRow[],
  wordProgress: Record<number, WordStatus>,
  levelProgress: Record<number, { isCompleted: boolean; isUnlocked: boolean }>,
): PracticeLevel[] {
  return remoteLevels.map((levelRow, index) => {
    const words = [...(levelRow.words ?? [])].sort(
      (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
    );
    const wordIds = words.map((w) => w.id);
    const progress = wordIds.map(
      (id) => wordProgress[id] ?? ('pending' as WordStatus),
    );
    const completedFromWords = progress.length > 0 && progress.every((p) => p === 'success');
    const levelProg = levelProgress[levelRow.id] ?? { isCompleted: false, isUnlocked: index === 0 };

    return {
      id: levelRow.id,
      title: levelRow.title ?? 'Seviye',
      description: levelRow.description ?? '',
      words: words.map((w) => w.word ?? ''),
      wordIds,
      progress,
      unlocked: levelProg.isUnlocked || index === 0,
      completed: levelProg.isCompleted || completedFromWords,
      orderIndex: levelRow.order_index,
    };
  });
}

function unlockLevels(levels: PracticeLevel[]): PracticeLevel[] {
  return levels.map((level, index) => {
    if (index === 0) return { ...level, unlocked: true };
    const unlocked = levels[index - 1].completed || level.unlocked;
    return { ...level, unlocked };
  });
}

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [levels, setLevels] = useState<PracticeLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      userIdRef.current = userData?.user?.id ?? null;

      const [remoteLevels, userLevelRows, userWordRows] = await Promise.all([
        fetchLevelsWithWords(),
        userIdRef.current ? fetchUserLevelProgress(userIdRef.current) : Promise.resolve([]),
        userIdRef.current ? fetchUserWordProgress(userIdRef.current) : Promise.resolve([]),
      ]);

      if (!remoteLevels.length) {
        setLevels(seedLevels());
        return;
      }

      const wordProgressMap: Record<number, WordStatus> = {};
      userWordRows.forEach((row) => {
        if (row.status) wordProgressMap[row.word_id] = row.status;
      });

      const levelProgressMap: Record<number, { isCompleted: boolean; isUnlocked: boolean }> = {};
      userLevelRows.forEach((row) => {
        levelProgressMap[row.level_id] = {
          isCompleted: row.is_completed,
          isUnlocked: row.is_unlocked,
        };
      });

      const mapped = unlockLevels(mapRemoteLevels(remoteLevels, wordProgressMap, levelProgressMap));
      setLevels(mapped);
    } catch (err) {
      console.warn('Supabase yüklenemedi, yerel veriye düşülüyor', err);
      setLevels(seedLevels());
      setError('Supabase bağlantısında sorun var, yerel veriler yüklendi.');
    } finally {
      setLoading(false);
    }
  };

  const setWordStatus = (levelId: number, wordIndex: number, status: WordStatus) => {
    const userId = userIdRef.current;

    setLevels((prev) => {
      const next = prev.map((level, idx) => {
        if (level.id !== levelId) return level;
        const nextProgress = level.progress.map((item, i) => (i === wordIndex ? status : item));
        const completed = nextProgress.length > 0 && nextProgress.every((p) => p === 'success');
        return { ...level, progress: nextProgress, completed };
      });

      const unlocked = next.map((lvl, idx) => {
        if (idx === 0) return { ...lvl, unlocked: true };
        const prevLevelCompleted = next[idx - 1].completed;
        return { ...lvl, unlocked: prevLevelCompleted || lvl.unlocked };
      });

      const level = next.find((l) => l.id === levelId);
      const wordId = level?.wordIds?.[wordIndex];
      const levelCompleted = level?.completed ?? false;

      if (userId && wordId) {
        upsertWordProgress(userId, wordId, status).catch((err) =>
          console.warn('user_word_progress upsert error', err),
        );
      }
      if (userId) {
        upsertLevelProgress(userId, levelId, true, levelCompleted).catch((err) =>
          console.warn('user_progress upsert error', err),
        );
      }

      return unlockLevels(unlocked);
    });
  };

  const resetLevel = (levelId: number) => {
    setLevels((prev) =>
      unlockLevels(
        prev.map((level, index) => {
          if (level.id !== levelId) return level;
          return {
            ...level,
            progress: level.progress.map(() => 'pending' as WordStatus),
            completed: false,
            unlocked: index === 0 ? true : level.unlocked,
          };
        }),
      ),
    );
  };

  const resetAll = () => {
    setLevels((prev) =>
      prev.map((level, index) => ({
        ...level,
        progress: level.progress.map(() => 'pending' as WordStatus),
        completed: false,
        unlocked: index === 0,
      })),
    );
  };

  const value = useMemo(
    () => ({
      levels,
      loading,
      error,
      refresh,
      setWordStatus,
      resetLevel,
      resetAll,
    }),
    [levels, loading, error],
  );

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}
