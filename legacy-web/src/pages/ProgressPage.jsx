import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyQuests } from '../hooks/useDailyQuests';
import { useBadges } from '../hooks/useBadges';
import { useUserMode } from '../hooks/useUserMode';
import { useMascot } from '../context/MascotContext';
import ParentNotesCard from '../components/ParentNotesCard';
import './ProgressPage.css';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [todayMinutes, setTodayMinutes] = useState('');
  const [todayWords, setTodayWords] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { isParentMode } = useUserMode();
  const { celebrate } = useMascot();
  
  const { quests, completeQuest, allQuestsCompleted, completedCount, totalQuests, checkQuestProgress } = useDailyQuests();
  const { badges, unlockedBadges, lockedBadges, unlockedCount, totalCount, refreshBadges } = useBadges();

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  // Initialize sample data if localStorage is empty
  const initializeSampleData = () => {
    const today = new Date();
    const sampleLogs = [];
    
    for (let i = 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      sampleLogs.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 20) + 5,
        words: Math.floor(Math.random() * 15) + 5,
        sessions: Math.floor(Math.random() * 3) + 1
      });
    }
    
    return sampleLogs;
  };

  // Load progress data from localStorage
  useEffect(() => {
    const storedLogs = localStorage.getItem('konusma_ilerleme_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      const sampleData = initializeSampleData();
      setLogs(sampleData);
      localStorage.setItem('konusma_ilerleme_logs', JSON.stringify(sampleData));
    }
  }, []);

  // Get last 7 days of data
  const getLast7Days = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const log = logs.find(l => l.date === dateStr);
      
      result.push({
        date: dateStr,
        dayName: dayNames[date.getDay()],
        dayNum: date.getDate(),
        month: date.getMonth() + 1,
        minutes: log?.minutes || 0,
        words: log?.words || 0,
        sessions: log?.sessions || 0
      });
    }
    
    return result;
  };

  const last7Days = getLast7Days();

  // Calculate weekly totals
  const weeklyTotals = last7Days.reduce((acc, day) => ({
    minutes: acc.minutes + day.minutes,
    words: acc.words + day.words,
    sessions: acc.sessions + day.sessions
  }), { minutes: 0, words: 0, sessions: 0 });

  // Get max values for scaling bars
  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1);
  const maxWords = Math.max(...last7Days.map(d => d.words), 1);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const minutes = parseInt(todayMinutes) || 0;
    const words = parseInt(todayWords) || 0;
    
    if (minutes === 0 && words === 0) {
      alert('Lütfen en az bir değer girin!');
      return;
    }

    // Check if today already has a log
    const existingLogIndex = logs.findIndex(l => l.date === today);
    let newLogs;
    
    if (existingLogIndex >= 0) {
      // Update existing log
      newLogs = [...logs];
      newLogs[existingLogIndex] = {
        date: today,
        minutes: newLogs[existingLogIndex].minutes + minutes,
        words: newLogs[existingLogIndex].words + words,
        sessions: newLogs[existingLogIndex].sessions + 1
      };
    } else {
      // Add new log
      newLogs = [...logs, {
        date: today,
        minutes,
        words,
        sessions: 1
      }];
    }
    
    // Save to localStorage
    localStorage.setItem('konusma_ilerleme_logs', JSON.stringify(newLogs));
    setLogs(newLogs);
    
    // Check quest progress
    checkQuestProgress('minutes', (newLogs.find(l => l.date === today)?.minutes || 0));
    checkQuestProgress('words', (newLogs.find(l => l.date === today)?.words || 0));
    
    // Refresh badges
    refreshBadges();
    
    // Trigger mascot celebration!
    celebrate('practiceDone');
    
    // Reset form
    setTodayMinutes('');
    setTodayWords('');
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="progress-container">
      <div className="progress-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="progress-title">📊 İlerleme Takibi</h1>
        <p className="progress-subtitle">Son 7 günlük pratik geçmişin</p>

        {/* Daily Quests */}
        <div className="daily-quests-section">
          <h2 className="quests-title">🎯 Bugünkü Görevler</h2>
          <p className="quests-subtitle">
            {completedCount}/{totalQuests} görev tamamlandı
          </p>
          
          <div className="quests-list">
            {quests.map(quest => (
              <div 
                key={quest.id} 
                className={`quest-card ${quest.completed ? 'completed' : ''}`}
              >
                <div className="quest-checkbox">
                  {quest.completed ? '✅' : '⭕'}
                </div>
                <div className="quest-info">
                  <h3 className="quest-title">{quest.title}</h3>
                  <p className="quest-description">{quest.description}</p>
                </div>
                {!quest.completed && (
                  <button 
                    className="quest-complete-btn"
                    onClick={() => completeQuest(quest.id)}
                  >
                    Tamamla
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {allQuestsCompleted && (
            <div className="quests-celebration">
              🎉 Tüm görevleri tamamladın, harikasın! 🎉
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div className="badges-section">
          <h2 className="badges-title">🏆 Rozetlerim</h2>
          <p className="badges-subtitle">
            {unlockedCount}/{totalCount} rozet kazanıldı
          </p>
          
          <div className="badges-grid">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon">{badge.unlocked ? badge.icon : '🔒'}</div>
                <h3 className="badge-title">{badge.title}</h3>
                <p className="badge-description">{badge.description}</p>
                {badge.unlocked && (
                  <div className="badge-unlocked-label">Kazanıldı!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Totals Summary */}
        <div className="weekly-summary">
          <h2 className="summary-title">📅 Haftalık Özet</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">⏱️</div>
              <div className="summary-value">{weeklyTotals.minutes}</div>
              <div className="summary-label">Dakika</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📝</div>
              <div className="summary-value">{weeklyTotals.words}</div>
              <div className="summary-label">Kelime</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-value">{weeklyTotals.sessions}</div>
              <div className="summary-label">Seans</div>
            </div>
          </div>
        </div>

        {/* 7-Day Progress Chart */}
        <div className="progress-chart">
          <h2 className="chart-title">📈 Günlük İlerleme</h2>
          
          {/* Minutes Chart */}
          <div className="chart-section">
            <h3 className="chart-subtitle">⏱️ Dakika</h3>
            <div className="chart-bars">
              {last7Days.map((day, index) => (
                <div key={index} className="chart-day">
                  <div className="bar-container">
                    <div 
                      className="bar bar-minutes"
                      style={{ 
                        height: `${(day.minutes / maxMinutes) * 100}%`,
                        minHeight: day.minutes > 0 ? '5%' : '0%'
                      }}
                    >
                      {day.minutes > 0 && <span className="bar-value">{day.minutes}</span>}
                    </div>
                  </div>
                  <div className="day-label">
                    <div className="day-name">{day.dayName}</div>
                    <div className="day-date">{day.dayNum}/{day.month}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Words Chart */}
          <div className="chart-section">
            <h3 className="chart-subtitle">📝 Kelime</h3>
            <div className="chart-bars">
              {last7Days.map((day, index) => (
                <div key={index} className="chart-day">
                  <div className="bar-container">
                    <div 
                      className="bar bar-words"
                      style={{ 
                        height: `${(day.words / maxWords) * 100}%`,
                        minHeight: day.words > 0 ? '5%' : '0%'
                      }}
                    >
                      {day.words > 0 && <span className="bar-value">{day.words}</span>}
                    </div>
                  </div>
                  <div className="day-label">
                    <div className="day-name">{day.dayName}</div>
                    <div className="day-date">{day.dayNum}/{day.month}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions Display */}
          <div className="chart-section">
            <h3 className="chart-subtitle">🎯 Seans Sayısı</h3>
            <div className="sessions-grid">
              {last7Days.map((day, index) => (
                <div key={index} className="session-day">
                  <div className="session-count">{day.sessions}</div>
                  <div className="day-label">
                    <div className="day-name">{day.dayName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Today's Practice Form */}
        <div className="add-practice-form">
          <h2 className="form-title">➕ Bugünkü Pratik</h2>
          <p className="form-subtitle">Yaptığın pratikleri ekle!</p>
          
          {showSuccess && (
            <div className="success-message">
              ✅ Pratik kaydedildi! Harika gidiyorsun! 🎉
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="minutes">⏱️ Kaç dakika pratik yaptın?</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="999"
                value={todayMinutes}
                onChange={(e) => setTodayMinutes(e.target.value)}
                placeholder="Örn: 15"
              />
            </div>

            <div className="form-group">
              <label htmlFor="words">📝 Kaç kelime pratik yaptın?</label>
              <input
                type="number"
                id="words"
                min="0"
                max="999"
                value={todayWords}
                onChange={(e) => setTodayWords(e.target.value)}
                placeholder="Örn: 20"
              />
            </div>

            <button type="submit" className="submit-btn">
              💾 Kaydet
            </button>
          </form>
        </div>

        {/* Parent Notes - Only visible in Parent Mode */}
        {isParentMode && <ParentNotesCard />}

        {/* Motivational Message */}
        <div className="motivation-box">
          <p className="motivation-text">
            {isParentMode ? (
              weeklyTotals.sessions >= 5 
                ? "🌟 Muhteşem! Bu hafta çok çalışkansın!"
                : weeklyTotals.sessions >= 3
                ? "👍 Harika gidiyorsun! Devam et!"
                : "💪 Her gün biraz pratik yapmaya çalış!"
            ) : (
              weeklyTotals.sessions >= 5 
                ? "🌟 Harikasın! Hadi biraz daha çalışalım 😊"
                : weeklyTotals.sessions >= 3
                ? "🎉 Çok iyisin! Oyunlar seni bekliyor!"
                : "⭐ Bugün pratik yapmaya ne dersin?"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
