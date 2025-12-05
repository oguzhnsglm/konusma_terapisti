import { useState, useEffect } from 'react';

const QUESTS_KEY = 'speech_daily_quests_v1';

const DEFAULT_QUESTS = [
  {
    id: 'quest_1',
    title: 'Günlük Pratik',
    description: 'Bugün en az 10 dakika konuşma pratiği yap',
    completed: false,
    target: 10,
    type: 'minutes'
  },
  {
    id: 'quest_2',
    title: 'Oyun Zamanı',
    description: 'En az 1 mini oyun tamamla',
    completed: false,
    target: 1,
    type: 'games'
  },
  {
    id: 'quest_3',
    title: 'Kelime Çalışması',
    description: 'En az 5 farklı kelime tekrar et',
    completed: false,
    target: 5,
    type: 'words'
  }
];

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useDailyQuests = () => {
  const [quests, setQuests] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = () => {
    const today = getTodayString();
    const storedData = localStorage.getItem(QUESTS_KEY);
    
    if (storedData) {
      const parsed = JSON.parse(storedData);
      
      // Check if quests need to be reset (new day)
      if (parsed.date !== today) {
        // New day, reset quests
        const resetQuests = DEFAULT_QUESTS.map(q => ({ ...q, completed: false }));
        const newData = { date: today, quests: resetQuests };
        localStorage.setItem(QUESTS_KEY, JSON.stringify(newData));
        setQuests(resetQuests);
        setLastUpdate(today);
      } else {
        // Same day, load existing quests
        setQuests(parsed.quests || DEFAULT_QUESTS);
        setLastUpdate(parsed.date);
      }
    } else {
      // First time, initialize quests
      const newData = { date: today, quests: DEFAULT_QUESTS };
      localStorage.setItem(QUESTS_KEY, JSON.stringify(newData));
      setQuests(DEFAULT_QUESTS);
      setLastUpdate(today);
    }
  };

  const completeQuest = (questId) => {
    const today = getTodayString();
    const updatedQuests = quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    );
    
    const data = { date: today, quests: updatedQuests };
    localStorage.setItem(QUESTS_KEY, JSON.stringify(data));
    setQuests(updatedQuests);

    // Track quest completion for badges
    trackQuestCompletion(updatedQuests);
  };

  const trackQuestCompletion = (currentQuests) => {
    const allCompleted = currentQuests.every(q => q.completed);
    if (allCompleted) {
      const historyKey = 'speech_quest_history_v1';
      const today = getTodayString();
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      if (!history.includes(today)) {
        history.push(today);
        localStorage.setItem(historyKey, JSON.stringify(history));
        
        // Trigger mascot celebration for all quests completed!
        window.dispatchEvent(new CustomEvent('mascotCelebrate', { 
          detail: { type: 'questCompleted' } 
        }));
      }
    }
  };

  const checkQuestProgress = (type, value) => {
    // Auto-complete quests based on progress
    const today = getTodayString();
    const updatedQuests = quests.map(q => {
      if (q.type === type && !q.completed && value >= q.target) {
        return { ...q, completed: true };
      }
      return q;
    });
    
    if (JSON.stringify(updatedQuests) !== JSON.stringify(quests)) {
      const data = { date: today, quests: updatedQuests };
      localStorage.setItem(QUESTS_KEY, JSON.stringify(data));
      setQuests(updatedQuests);
      trackQuestCompletion(updatedQuests);
    }
  };

  const allQuestsCompleted = () => {
    return quests.length > 0 && quests.every(q => q.completed);
  };

  const completedCount = () => {
    return quests.filter(q => q.completed).length;
  };

  return {
    quests,
    completeQuest,
    checkQuestProgress,
    allQuestsCompleted: allQuestsCompleted(),
    completedCount: completedCount(),
    totalQuests: quests.length,
    refreshQuests: loadQuests
  };
};
