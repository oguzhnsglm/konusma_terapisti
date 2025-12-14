import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import ModeSwitch from '../components/ModeSwitch';
import './HomePageModern.css';

// SVG Icon Components
const MicrophoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const GamepadIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
    <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);

const PuzzleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const MonsterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 3.5c2.33 0 4.31 1.46 5.11 3.5H6.89c.8-2.04 2.78-3.5 5.11-3.5z"/>
  </svg>
);

const WheelIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07l-2.83 2.83m-5.66 5.66l-2.83 2.83m14.14 0l-2.83-2.83m-5.66-5.66L4.93 4.93"/>
  </svg>
);

const EmotionIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="9" cy="10" r="1.5"/>
    <circle cx="15" cy="10" r="1.5"/>
    <path d="M8 15c0 2.21 1.79 4 4 4s4-1.79 4-4H8z"/>
  </svg>
);

const AvatarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const SoundIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

const HomePageModern = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const { playSfx } = useAudio();

  const texts = {
    tr: {
      greeting: 'Merhaba! 👋',
      title: 'Konuşma Terapisti',
      subtitle: 'Çocuklar için eğlenceli konuşma pratiği',
      quickStart: 'Hızlı Başlangıç',
      allActivities: 'Tüm Aktiviteler',
      practice: 'Konuşma Pratiği',
      practiceDesc: 'Kelime ve cümle pratiği yap',
      games: 'Mini Oyunlar',
      gamesDesc: 'Eğlenceli oyunlarla öğren',
      puzzles: 'Bulmacalar',
      puzzlesDesc: 'Zihin geliştirici bulmacalar',
      progress: 'İlerleme',
      progressDesc: 'Gelişimini takip et',
      storybook: 'Hikâye Kitabı',
      storybookDesc: 'Sesli hikayeler oku',
      worldmap: 'Dünyalar Haritası',
      worldmapDesc: 'Seviyeleri keşfet',
      letterMonster: 'Harf Canavarı Besleme Oyunu',
      letterMonsterDesc: 'Doğru harfi seç, canavarı besle!',
      soundWheel: 'Ses Çarkı',
      soundWheelDesc: 'Çarkı çevir, ses görevini yap!',
      emotionMatch: 'Duygu Eşleştirme',
      emotionMatchDesc: 'Yüz ifadelerini duygularla eşleştir',
      profileAvatar: 'Profil & Avatar',
      profileAvatarDesc: 'Avatarını seç, profilini kişiselleştir',
      voiceEncouragement: 'Sesli Güçlendirme',
      voiceEncouragementDesc: 'Bravo! Harika söyledin! ses paketleri',
      settings: 'Ayarlar',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
    },
    en: {
      greeting: 'Hello! 👋',
      title: 'Speech Therapist',
      subtitle: 'Fun speech practice for children',
      quickStart: 'Quick Start',
      allActivities: 'All Activities',
      practice: 'Speech Practice',
      practiceDesc: 'Practice words and sentences',
      games: 'Mini Games',
      gamesDesc: 'Learn with fun games',
      puzzles: 'Puzzles',
      puzzlesDesc: 'Mind-developing puzzles',
      progress: 'Progress',
      progressDesc: 'Track your development',
      storybook: 'Storybook',
      storybookDesc: 'Read voice stories',
      worldmap: 'World Map',
      worldmapDesc: 'Explore levels',
      letterMonster: 'Letter Monster Feeding Game',
      letterMonsterDesc: 'Choose the right letter, feed the monster!',
      soundWheel: 'Sound Wheel',
      soundWheelDesc: 'Spin the wheel, do the sound task!',
      emotionMatch: 'Emotion Matching',
      emotionMatchDesc: 'Match faces with emotions',
      profileAvatar: 'Profile & Avatar',
      profileAvatarDesc: 'Choose your avatar, customize profile',
      voiceEncouragement: 'Voice Encouragement',
      voiceEncouragementDesc: 'Bravo! Great job! sound packs',
      settings: 'Settings',
      login: 'Login',
      register: 'Sign Up',
    },
  };

  const t = texts[language] || texts.tr;

  const mainActivities = [
    {
      title: t.practice,
      desc: t.practiceDesc,
      icon: <MicrophoneIcon />,
      color: 'linear-gradient(135deg, #6d8bff 0%, #5b3dff 100%)',
      route: '/practice',
    },
    {
      title: t.games,
      desc: t.gamesDesc,
      icon: <GamepadIcon />,
      color: 'linear-gradient(135deg, #ff7ad1 0%, #ff3f6c 100%)',
      route: '/games',
    },
    {
      title: t.storybook,
      desc: t.storybookDesc,
      icon: <BookIcon />,
      color: 'linear-gradient(135deg, #ffb347 0%, #ffd452 100%)',
      route: '/storybook',
    },
  ];

  const secondaryActivities = [
    {
      title: t.puzzles,
      desc: t.puzzlesDesc,
      icon: <PuzzleIcon />,
      route: '/puzzles',
    },
    {
      title: t.worldmap,
      desc: t.worldmapDesc,
      icon: <MapIcon />,
      route: '/world-map',
    },
    {
      title: t.progress,
      desc: t.progressDesc,
      icon: <ChartIcon />,
      route: '/progress',
    },
    {
      title: t.letterMonster,
      desc: t.letterMonsterDesc,
      icon: <MonsterIcon />,
      route: '/harf-canavari-besleme',
    },
    {
      title: t.soundWheel,
      desc: t.soundWheelDesc,
      icon: <WheelIcon />,
      route: '/ses-carki',
    },
    {
      title: t.emotionMatch,
      desc: t.emotionMatchDesc,
      icon: <EmotionIcon />,
      route: '/duygu-eslestirme',
    },
    {
      title: t.profileAvatar,
      desc: t.profileAvatarDesc,
      icon: <AvatarIcon />,
      route: '/profil-avatar',
    },
    {
      title: t.voiceEncouragement,
      desc: t.voiceEncouragementDesc,
      icon: <SoundIcon />,
      route: '/sesli-guclendirme',
    },
  ];

  return (
    <div className="modern-home">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="sidebar-title">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
              <span>Kitaplığın</span>
            </div>
            <div className="sidebar-items">
              <div className="sidebar-item active" onClick={() => navigate('/')}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Ana Sayfa</span>
              </div>
              <div className="sidebar-item" onClick={() => navigate('/practice')}>
                <MicrophoneIcon />
                <span>{t.practice}</span>
              </div>
              <div className="sidebar-item" onClick={() => navigate('/games')}>
                <GamepadIcon />
                <span>{t.games}</span>
              </div>
              <div className="sidebar-item" onClick={() => navigate('/storybook')}>
                <BookIcon />
                <span>{t.storybook}</span>
              </div>
            </div>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-title">
              <span>Aktiviteler</span>
            </div>
            <div className="sidebar-items">
              <div className="sidebar-item" onClick={() => navigate('/progress')}>
                <ChartIcon />
                <span>{t.progress}</span>
              </div>
              <div className="sidebar-item" onClick={() => navigate('/world-map')}>
                <MapIcon />
                <span>{t.worldmap}</span>
              </div>
              <div className="sidebar-item" onClick={() => navigate('/profil-avatar')}>
                <AvatarIcon />
                <span>{t.profileAvatar}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="modern-header">
        <div className="header-left">
          <h1 className="header-logo">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            {t.title}
          </h1>
          <p className="header-subtitle">{t.subtitle}</p>
        </div>
        <div className="header-right">
          <ModeSwitch />
          <button className="header-btn" onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </button>
          <button className="header-btn" onClick={() => navigate('/register')}>
            {t.register}
          </button>
          <button className="header-btn primary" onClick={() => navigate('/login')}>
            {t.login}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="modern-main">
        <div className="content-wrapper">
          {/* Greeting */}
          <section className="greeting-section">
            <h2 className="greeting-title">
              <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" style={{verticalAlign: 'middle', marginRight: '12px'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {t.greeting.replace('👋', '')}
            </h2>
            <p className="greeting-text">{t.quickStart}</p>
          </section>

          {/* Main Activities - Large Cards */}
          <section className="main-activities">
            {mainActivities.map((activity, index) => (
              <div
                key={index}
                className="activity-card-large"
                style={{ background: activity.color }}
                onClick={() => {
                  playSfx('click');
                  navigate(activity.route);
                }}
              >
                <div className="activity-icon-large">{activity.icon}</div>
                <div className="activity-info">
                  <h3 className="activity-title-large">{activity.title}</h3>
                  <p className="activity-desc">{activity.desc}</p>
                </div>
                <div className="activity-arrow">→</div>
              </div>
            ))}
          </section>

          {/* All Activities Section */}
          <section className="all-activities-section">
            <h2 className="section-title">{t.allActivities}</h2>
            <div className="activities-grid">
              {secondaryActivities.map((activity, index) => (
                <div
                  key={index}
                  className="activity-card-small"
                  onClick={() => {
                    playSfx('click');
                    navigate(activity.route);
                  }}
                  onMouseEnter={() => playSfx('hover')}
                >
                  <div className="activity-icon-small">{activity.icon}</div>
                  <h3 className="activity-title-small">{activity.title}</h3>
                  <p className="activity-desc-small">{activity.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePageModern;
