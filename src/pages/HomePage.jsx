import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ModeSwitch from '../components/ModeSwitch';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();

  const texts = {
    tr: {
      title: '🎤 Konuşma Terapisti',
      subtitle: 'Çocuklar için eğlenceli konuşma pratiği',
      description: 'Konuşma Terapisti, çocukların dil gelişimini destekleyen, eğlenceli ve etkileşimli bir platformdur. Harf telaffuzu, kelime dağarcığı geliştirme, kafiye oyunları ve daha fazlası ile çocuğunuzun konuşma becerilerini oyunlaştırarak geliştirin!',
      features: [
        '🗣️ Sesli pratik yapma imkanı',
        '🎮 Eğlenceli mini oyunlar',
        '🧩 Zihin geliştirici bulmacalar',
        '📊 İlerleme takibi',
        '🏆 Motivasyonu artıran başarı rozetleri',
      ],
      practice: 'Konuşma Pratiğine Başla',
      games: 'Mini Oyunlar',
      puzzles: 'Bulmacalar',
      progress: 'İlerleme Takibi',
      storybook: 'Sesli Hikâye Kitabı',
      worldmap: 'Dünyalar Haritası',
      login: 'Giriş Yap',
      register: 'Hemen Kayıt Ol',
    },
    en: {
      title: '🎤 Speech Therapist',
      subtitle: 'Fun speech practice for children',
      description: 'Speech Therapist is a fun and interactive platform that supports children\'s language development. Improve your child\'s speech skills through letter pronunciation, vocabulary building, rhyme games and more by gamifying learning!',
      features: [
        '🗣️ Voice practice opportunities',
        '🎮 Fun mini games',
        '🧩 Mind-developing puzzles',
        '📊 Progress tracking',
        '🏆 Motivating achievement badges',
      ],
      practice: 'Start Speech Practice',
      games: 'Mini Games',
      puzzles: 'Puzzles',
      progress: 'Progress Tracking',
      storybook: 'Voice Storybook',
      worldmap: 'World Map',
      login: 'Login',
      register: 'Sign Up Now',
    },
  };

  const t = texts[language] || texts.tr;

  return (
    <div className="home-container">
      <div className="mode-switch-wrapper">
        <ModeSwitch />
      </div>
      <div className="home-content">
        <div className="hero-section">
          <h1 className="home-title">{t.title}</h1>
          <p className="home-subtitle">{t.subtitle}</p>
          
          <div className="description-box">
            <p className="description-text">{t.description}</p>
            <ul className="features-list">
              {t.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="button-grid">
          <button 
            className="home-btn practice-btn"
            onClick={() => navigate('/practice')}
          >
            🗣️ {t.practice}
          </button>

          <button 
            className="home-btn puzzle-btn"
            onClick={() => navigate('/puzzles')}
          >
            🧩 {t.puzzles}
          </button>

          <button 
            className="home-btn game-btn"
            onClick={() => navigate('/games')}
          >
            🎮 {t.games}
          </button>

          <button 
            className="home-btn progress-btn"
            onClick={() => navigate('/progress')}
          >
            📊 {t.progress}
          </button>

          <button 
            className="home-btn storybook-btn"
            onClick={() => navigate('/storybook')}
          >
            📚 {t.storybook}
          </button>

          <button 
            className="home-btn worldmap-btn"
            onClick={() => navigate('/world-map')}
          >
            🗺️ {t.worldmap}
          </button>
        </div>

        <div className="auth-buttons">
          <button 
            className="home-btn login-btn"
            onClick={() => navigate('/login')}
          >
            🔐 {t.login}
          </button>

          <button 
            className="home-btn register-btn"
            onClick={() => navigate('/register')}
          >
            ✨ {t.register}
          </button>
        </div>

        <div className="settings-button-container">
          <button 
            className="home-btn settings-btn"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Ayarlar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
