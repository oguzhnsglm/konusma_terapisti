import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorldMapPage.css';

// World definitions
const WORLDS = [
  {
    id: 'world_1',
    name: 'Ses Ormanı',
    emoji: '🌳',
    description: 'Sesleri ve harfleri öğren',
    unlockCondition: 'Her zaman açık',
    requiredMinutes: 0,
    requiredDays: 0,
    color: '#34D399'
  },
  {
    id: 'world_2',
    name: 'Harf Adası',
    emoji: '🏝️',
    description: 'Harfleri birleştir, kelimeler oluştur',
    unlockCondition: '10 dakika pratik yap',
    requiredMinutes: 10,
    requiredDays: 0,
    color: '#60A5FA'
  },
  {
    id: 'world_3',
    name: 'Kelime Köyü',
    emoji: '🏘️',
    description: 'Yeni kelimeler öğren ve pratik yap',
    unlockCondition: '3 gün üst üste pratik yap',
    requiredMinutes: 15,
    requiredDays: 3,
    color: '#A78BFA'
  },
  {
    id: 'world_4',
    name: 'Cümle Şehri',
    emoji: '🏙️',
    description: 'Kelimelerden cümleler kur',
    unlockCondition: '5 hikaye sayfası oku',
    requiredMinutes: 25,
    requiredStoryPages: 5,
    color: '#FBBF24'
  },
  {
    id: 'world_5',
    name: 'Konuşma Kalesi',
    emoji: '🏰',
    description: 'Akıcı konuşma pratiği yap',
    unlockCondition: 'Tüm günlük görevleri tamamla',
    requiredMinutes: 40,
    requiredQuestsCompleted: true,
    color: '#F87171'
  }
];

const WorldMapPage = () => {
  const navigate = useNavigate();
  const [worldsProgress, setWorldsProgress] = useState({});
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [userProgress, setUserProgress] = useState({
    totalMinutes: 0,
    streak: 0,
    storyPagesRead: 0,
    questsCompleted: false
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    // Load world map progress
    const worldMapData = localStorage.getItem('speech_world_map_v1');
    if (worldMapData) {
      setWorldsProgress(JSON.parse(worldMapData));
    }

    // Load user progress from various sources
    const progress = {
      totalMinutes: 0,
      streak: 0,
      storyPagesRead: 0,
      questsCompleted: false
    };

    // Try to get total minutes from progress logs
    try {
      const logs = localStorage.getItem('konusma_ilerleme_logs');
      if (logs) {
        const parsed = JSON.parse(logs);
        progress.totalMinutes = parsed.reduce((sum, log) => sum + (log.minutes || 0), 0);
        
        // Calculate streak
        const sortedLogs = parsed
          .map(l => l.date)
          .sort()
          .reverse();
        
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date(today);
        
        for (let date of sortedLogs) {
          const logDate = new Date(date).toISOString().split('T')[0];
          const checkDateStr = checkDate.toISOString().split('T')[0];
          
          if (logDate === checkDateStr) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        progress.streak = streak;
      }
    } catch (e) {
      console.log('Progress logs not available');
    }

    // Try to get story pages read
    try {
      const storyProgress = localStorage.getItem('speech_storybook_progress_v1');
      if (storyProgress) {
        const parsed = JSON.parse(storyProgress);
        let totalPages = 0;
        Object.values(parsed).forEach(story => {
          if (story.pagesRead) {
            totalPages += story.pagesRead.length;
          }
        });
        progress.storyPagesRead = totalPages;
      }
    } catch (e) {
      console.log('Storybook progress not available');
    }

    // Try to check if quests are completed
    try {
      const quests = localStorage.getItem('speech_daily_quests_v1');
      if (quests) {
        const parsed = JSON.parse(quests);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.date === today && parsed.quests) {
          progress.questsCompleted = parsed.quests.every(q => q.completed);
        }
      }
    } catch (e) {
      console.log('Quests not available');
    }

    setUserProgress(progress);
  };

  const isWorldUnlocked = (world) => {
    if (world.id === 'world_1') return true;

    if (world.requiredMinutes && userProgress.totalMinutes < world.requiredMinutes) {
      return false;
    }

    if (world.requiredDays && userProgress.streak < world.requiredDays) {
      return false;
    }

    if (world.requiredStoryPages && userProgress.storyPagesRead < world.requiredStoryPages) {
      return false;
    }

    if (world.requiredQuestsCompleted && !userProgress.questsCompleted) {
      return false;
    }

    return true;
  };

  const handleWorldClick = (world) => {
    if (!isWorldUnlocked(world)) return;

    setSelectedWorld(world);

    // Mark world as entered
    const newProgress = {
      ...worldsProgress,
      [world.id]: {
        entered: true,
        enteredAt: new Date().toISOString()
      }
    };
    localStorage.setItem('speech_world_map_v1', JSON.stringify(newProgress));
    setWorldsProgress(newProgress);

    // Optional mascot celebration
    try {
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('mascotCelebrate', {
          detail: { type: 'default' }
        }));
      }
    } catch (e) {
      // Mascot not available
    }
  };

  const unlockedCount = WORLDS.filter(w => isWorldUnlocked(w)).length;

  return (
    <div className="worldmap-page">
      <div className="worldmap-header">
        <button className="back-btn-world" onClick={() => navigate('/')}>
          ← Geri
        </button>
        <div className="worldmap-title-section">
          <h1 className="worldmap-title">🗺️ Dünyalar Haritası</h1>
          <p className="worldmap-subtitle">
            {unlockedCount} / {WORLDS.length} dünya açıldı
          </p>
        </div>
      </div>

      <div className="worldmap-container">
        {/* World Map */}
        <div className="worlds-grid">
          {WORLDS.map((world, index) => {
            const unlocked = isWorldUnlocked(world);
            const entered = worldsProgress[world.id]?.entered;

            return (
              <div
                key={world.id}
                className={`world-node ${unlocked ? 'unlocked' : 'locked'} ${entered ? 'entered' : ''}`}
                onClick={() => handleWorldClick(world)}
                style={{
                  '--world-color': world.color
                }}
              >
                <div className="world-number">{index + 1}</div>
                <div className="world-emoji">{unlocked ? world.emoji : '🔒'}</div>
                <h3 className="world-name">{world.name}</h3>
                {!unlocked && <div className="lock-overlay">🔒</div>}
                {entered && <div className="entered-badge">✓</div>}
              </div>
            );
          })}
        </div>

        {/* World Details Panel */}
        {selectedWorld && (
          <div className="world-details-panel">
            <div className="world-details-card">
              <button 
                className="close-details"
                onClick={() => setSelectedWorld(null)}
              >
                ✕
              </button>
              
              <div className="world-details-header">
                <span className="world-details-emoji">{selectedWorld.emoji}</span>
                <h2>{selectedWorld.name}</h2>
              </div>

              <p className="world-description">{selectedWorld.description}</p>

              <div className="world-unlock-info">
                <h3>🔓 Açılış Koşulu:</h3>
                <p>{selectedWorld.unlockCondition}</p>
              </div>

              {isWorldUnlocked(selectedWorld) && (
                <div className="world-unlocked-message">
                  <p>🎉 Bu dünyaya girdin!</p>
                  <button className="start-world-btn">
                    Başla (Yakında)
                  </button>
                </div>
              )}

              {/* User Progress Info */}
              <div className="user-progress-info">
                <h3>📊 İlerlemeniz:</h3>
                <ul>
                  <li>⏱️ Toplam: {userProgress.totalMinutes} dakika</li>
                  <li>🔥 Seri: {userProgress.streak} gün</li>
                  <li>📖 Hikaye: {userProgress.storyPagesRead} sayfa</li>
                  <li>✅ Görevler: {userProgress.questsCompleted ? 'Tamamlandı' : 'Devam ediyor'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMapPage;
