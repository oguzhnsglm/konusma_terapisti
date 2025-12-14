import { useState, useEffect } from 'react';

const BADGES_KEY = 'speech_badges_v1';

const BADGE_DEFINITIONS = [
  {
    id: 'badge_first_step',
    title: 'İlk Adım',
    description: 'İlk pratik seansını tamamladın',
    icon: '🌟',
    condition: (data) => data.totalMinutes > 0
  },
  {
    id: 'badge_streak_3',
    title: '3 Gün Üst Üste',
    description: '3 gün üst üste pratik yaptın',
    icon: '🔥',
    condition: (data) => data.currentStreak >= 3
  },
  {
    id: 'badge_streak_7',
    title: '7 Gün Şampiyonu',
    description: '7 gün üst üste pratik yaptın',
    icon: '👑',
    condition: (data) => data.currentStreak >= 7
  },
  {
    id: 'badge_quest_master',
    title: 'Görev Ustası',
    description: 'Tüm günlük görevleri tamamladın',
    icon: '🎯',
    condition: (data) => data.hasCompletedAllQuests
  },
  {
    id: 'badge_word_master',
    title: 'Kelime Ustası',
    description: '50 farklı kelime tekrar ettin',
    icon: '📚',
    condition: (data) => data.totalWords >= 50
  },
  {
    id: 'badge_practice_hero',
    title: 'Pratik Kahramanı',
    description: 'Toplam 100 dakika pratik yaptın',
    icon: '🦸',
    condition: (data) => data.totalMinutes >= 100
  },
  {
    id: 'badge_game_master',
    title: 'Oyun Ustası',
    description: '10 mini oyun tamamladın',
    icon: '🎮',
    condition: (data) => data.totalGames >= 10
  },
  {
    id: 'badge_week_warrior',
    title: 'Haftalık Savaşçı',
    description: 'Bir haftada 60 dakika pratik yaptın',
    icon: '⚔️',
    condition: (data) => data.weeklyMinutes >= 60
  }
];

export const useBadges = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    checkAndUpdateBadges();
  }, []);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) return 0;
    
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      const logDateStr = logDate.toISOString().split('T')[0];
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (logDateStr === expectedDateStr && sortedLogs[i].minutes > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const checkAndUpdateBadges = () => {
    // Load progress data
    const logsData = localStorage.getItem('konusma_ilerleme_logs');
    const logs = logsData ? JSON.parse(logsData) : [];
    
    // Calculate totals
    const totalMinutes = logs.reduce((sum, log) => sum + (log.minutes || 0), 0);
    const totalWords = logs.reduce((sum, log) => sum + (log.words || 0), 0);
    const totalSessions = logs.reduce((sum, log) => sum + (log.sessions || 0), 0);
    
    // Calculate weekly data (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= sevenDaysAgo && logDate <= today;
    });
    
    const weeklyMinutes = weeklyLogs.reduce((sum, log) => sum + (log.minutes || 0), 0);
    
    // Calculate streak
    const currentStreak = calculateStreak(logs);
    
    // Check quest completion history
    const questHistory = JSON.parse(localStorage.getItem('speech_quest_history_v1') || '[]');
    const hasCompletedAllQuests = questHistory.length > 0;
    
    // Load game progress from progress context
    const progressData = localStorage.getItem('speech_progress');
    const progress = progressData ? JSON.parse(progressData) : { gamesPlayed: 0 };
    const totalGames = progress.gamesPlayed || 0;
    
    // Prepare data object for badge conditions
    const data = {
      totalMinutes,
      totalWords,
      totalSessions,
      totalGames,
      weeklyMinutes,
      currentStreak,
      hasCompletedAllQuests
    };
    
    // Load existing badge states
    const storedBadges = localStorage.getItem(BADGES_KEY);
    const existingBadges = storedBadges ? JSON.parse(storedBadges) : {};
    
    // Check each badge
    const updatedBadges = BADGE_DEFINITIONS.map(badge => {
      const isUnlocked = badge.condition(data);
      const wasUnlocked = existingBadges[badge.id]?.unlocked || false;
      
      return {
        ...badge,
        unlocked: isUnlocked,
        newlyUnlocked: isUnlocked && !wasUnlocked
      };
    });
    
    // Save updated badge states
    const badgeStates = {};
    updatedBadges.forEach(badge => {
      badgeStates[badge.id] = { unlocked: badge.unlocked };
    });
    localStorage.setItem(BADGES_KEY, JSON.stringify(badgeStates));
    
    setBadges(updatedBadges);
  };

  const getUnlockedBadges = () => {
    return badges.filter(b => b.unlocked);
  };

  const getLockedBadges = () => {
    return badges.filter(b => !b.unlocked);
  };

  const getNewlyUnlockedBadges = () => {
    return badges.filter(b => b.newlyUnlocked);
  };

  return {
    badges,
    unlockedBadges: getUnlockedBadges(),
    lockedBadges: getLockedBadges(),
    newlyUnlocked: getNewlyUnlockedBadges(),
    refreshBadges: checkAndUpdateBadges,
    unlockedCount: getUnlockedBadges().length,
    totalCount: badges.length
  };
};
