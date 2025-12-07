import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ModeSwitch from '../components/ModeSwitch';
import './HomePageModern.css';

const HomePageModern = () => {
  const navigate = useNavigate();
  const { language } = useTheme();

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
      icon: '🗣️',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/practice',
    },
    {
      title: t.games,
      desc: t.gamesDesc,
      icon: '🎮',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/games',
    },
    {
      title: t.storybook,
      desc: t.storybookDesc,
      icon: '📚',
      color: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
      route: '/storybook',
    },
  ];

  const secondaryActivities = [
    {
      title: t.puzzles,
      desc: t.puzzlesDesc,
      icon: '🧩',
      route: '/puzzles',
    },
    {
      title: t.worldmap,
      desc: t.worldmapDesc,
      icon: '🗺️',
      route: '/world-map',
    },
    {
      title: t.progress,
      desc: t.progressDesc,
      icon: '📊',
      route: '/progress',
    },
    {
      title: t.letterMonster,
      desc: t.letterMonsterDesc,
      icon: '👾',
      route: '/harf-canavari-besleme',
    },
    {
      title: t.soundWheel,
      desc: t.soundWheelDesc,
      icon: '🎡',
      route: '/ses-carki',
    },
    {
      title: t.emotionMatch,
      desc: t.emotionMatchDesc,
      icon: '🙂',
      route: '/duygu-eslestirme',
    },
    {
      title: t.profileAvatar,
      desc: t.profileAvatarDesc,
      icon: '🧒',
      route: '/profil-avatar',
    },
    {
      title: t.voiceEncouragement,
      desc: t.voiceEncouragementDesc,
      icon: '🔊',
      route: '/sesli-guclendirme',
    },
  ];

  return (
    <div className="modern-home">
      {/* Header */}
      <header className="modern-header">
        <div className="header-left">
          <h1 className="header-logo">🎤 {t.title}</h1>
          <p className="header-subtitle">{t.subtitle}</p>
        </div>
        <div className="header-right">
          <ModeSwitch />
          <button className="header-btn" onClick={() => navigate('/settings')}>
            ⚙️
          </button>
          <button className="header-btn" onClick={() => navigate('/register')}>
            ✨ {t.register}
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
            <h2 className="greeting-title">{t.greeting}</h2>
            <p className="greeting-text">{t.quickStart}</p>
          </section>

          {/* Main Activities - Large Cards */}
          <section className="main-activities">
            {mainActivities.map((activity, index) => (
              <div
                key={index}
                className="activity-card-large"
                style={{ background: activity.color }}
                onClick={() => navigate(activity.route)}
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
                  onClick={() => navigate(activity.route)}
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
