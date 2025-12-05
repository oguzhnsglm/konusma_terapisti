import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { progress } = useProgress();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Çıkış yapılırken bir hata oluştu.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <div className="dashboard-header">
          <h1 className="dashboard-title">🎉 Hoş Geldin!</h1>
          <p className="dashboard-user">{user?.email}</p>
        </div>

        <div className="progress-summary">
          <div className="progress-item">
            <span className="progress-emoji">🗣️</span>
            <span className="progress-count">{progress.practiceCount}</span>
            <span className="progress-label">Pratik</span>
          </div>
          <div className="progress-item">
            <span className="progress-emoji">🎮</span>
            <span className="progress-count">{progress.gamesPlayed}</span>
            <span className="progress-label">Oyun</span>
          </div>
          <div className="progress-item">
            <span className="progress-emoji">🧩</span>
            <span className="progress-count">{progress.puzzlesSolved}</span>
            <span className="progress-label">Bulmaca</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">📅 Bugünün Önerisi</h2>
          <p className="card-text">
            "R" harfi ile pratik yapmaya ne dersin? 5 dakika pratik yap ve konuşmanı geliştir!
          </p>
        </div>

        <div className="dashboard-actions">
          <button 
            className="action-btn practice-btn"
            onClick={() => navigate('/practice')}
          >
            🗣️ Konuşma Pratiği
          </button>

          <button 
            className="action-btn game-btn"
            onClick={() => navigate('/games')}
          >
            🎮 Mini Oyunlar
          </button>

          <button 
            className="action-btn puzzle-btn"
            onClick={() => navigate('/puzzles')}
          >
            🧩 Bulmacalar
          </button>
        </div>

        <div className="dashboard-footer">
          <button 
            className="profile-btn"
            onClick={() => navigate('/profile')}
          >
            👤 Profilim
          </button>
          <button 
            className="settings-btn"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Ayarlar
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
