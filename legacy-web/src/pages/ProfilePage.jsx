import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useProgress();

  const achievements = [
    { 
      id: 1, 
      emoji: '🎯', 
      title: 'İlk Adım', 
      description: '5 pratik tamamla',
      unlocked: progress.practiceCount >= 5 
    },
    { 
      id: 2, 
      emoji: '🎮', 
      title: 'Oyun Ustası', 
      description: '10 oyun oyna',
      unlocked: progress.gamesPlayed >= 10 
    },
    { 
      id: 3, 
      emoji: '🧩', 
      title: 'Bulmaca Dehası', 
      description: '5 bulmaca çöz',
      unlocked: progress.puzzlesSolved >= 5 
    },
    { 
      id: 4, 
      emoji: '🔥', 
      title: 'Ateş Topu', 
      description: '20 pratik tamamla',
      unlocked: progress.practiceCount >= 20 
    },
    { 
      id: 5, 
      emoji: '⭐', 
      title: 'Süper Yıldız', 
      description: '50 aktivite tamamla',
      unlocked: (progress.practiceCount + progress.gamesPlayed + progress.puzzlesSolved) >= 50 
    },
    { 
      id: 6, 
      emoji: '👑', 
      title: 'Şampiyon', 
      description: '100 aktivite tamamla',
      unlocked: (progress.practiceCount + progress.gamesPlayed + progress.puzzlesSolved) >= 100 
    },
  ];

  const totalActivities = progress.practiceCount + progress.gamesPlayed + progress.puzzlesSolved;
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="profile-title">👤 Profilim</h1>

        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-emoji">😊</span>
          </div>
          <h2 className="profile-name">{user?.email}</h2>
          <p className="profile-subtitle">Konuşma Terapisi Öğrencisi</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-emoji">🗣️</span>
            <h3 className="stat-number">{progress.practiceCount}</h3>
            <p className="stat-label">Pratik</p>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🎮</span>
            <h3 className="stat-number">{progress.gamesPlayed}</h3>
            <p className="stat-label">Oyun</p>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🧩</span>
            <h3 className="stat-number">{progress.puzzlesSolved}</h3>
            <p className="stat-label">Bulmaca</p>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🏆</span>
            <h3 className="stat-number">{totalActivities}</h3>
            <p className="stat-label">Toplam</p>
          </div>
        </div>

        <div className="achievements-section">
          <h2 className="section-title">
            🏆 Başarılar ({unlockedCount}/{achievements.length})
          </h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="achievement-emoji">{achievement.emoji}</span>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-desc">{achievement.description}</p>
                {achievement.unlocked && (
                  <span className="unlock-badge">✓ Kazanıldı</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
