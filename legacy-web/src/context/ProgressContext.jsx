import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ProgressContext = createContext({});

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    practiceCount: 0,
    gamesPlayed: 0,
    puzzlesSolved: 0,
    totalTime: 0,
    achievements: [],
  });

  useEffect(() => {
    if (user && supabase) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProgress(data);
      }
    } catch (error) {
      console.log('Progress not found, using defaults');
    }
  };

  const updateProgress = async (updates) => {
    if (!user || !supabase) return;

    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          ...newProgress,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const incrementPractice = () => {
    updateProgress({ practiceCount: progress.practiceCount + 1 });
  };

  const incrementGames = () => {
    updateProgress({ gamesPlayed: progress.gamesPlayed + 1 });
  };

  const incrementPuzzles = () => {
    updateProgress({ puzzlesSolved: progress.puzzlesSolved + 1 });
  };

  const addAchievement = (achievement) => {
    const achievements = [...progress.achievements, achievement];
    updateProgress({ achievements });
  };

  const value = {
    progress,
    incrementPractice,
    incrementGames,
    incrementPuzzles,
    addAchievement,
    updateProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
