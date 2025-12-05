import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, language, toggleTheme, changeLanguage, isDark } = useTheme();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    voiceSpeed: 'normal',
    difficulty: 'easy',
    autoRecord: false,
    notifications: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSelect = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('✅ Ayarlar kaydedildi!');
  };

  const texts = {
    tr: {
      title: '⚙️ Ayarlar',
      sound: 'Ses Ayarları',
      soundToggle: 'Sesler',
      soundDesc: 'Oyun seslerini aç/kapat',
      voiceSpeed: 'Ses Hızı',
      voiceSpeedDesc: 'Konuşma hızını ayarla',
      game: 'Oyun Ayarları',
      difficulty: 'Zorluk Seviyesi',
      difficultyDesc: 'Oyun zorluğunu seç',
      autoRecord: 'Otomatik Kayıt',
      autoRecordDesc: 'Pratikleri otomatik kaydet',
      appearance: 'Görünüm',
      theme: 'Tema',
      themeDesc: 'Aydınlık veya karanlık tema',
      language: 'Dil',
      languageDesc: 'Uygulama dilini seç',
      notifications: 'Bildirimler',
      notificationsToggle: 'Bildirimler',
      notificationsDesc: 'Hatırlatıcıları aç/kapat',
      save: '💾 Ayarları Kaydet',
      back: '← Dashboard\'a Dön',
      home: '🏠 Ana Menüye Dön',
      slow: 'Yavaş',
      normal: 'Normal',
      fast: 'Hızlı',
      easy: 'Kolay',
      medium: 'Orta',
      hard: 'Zor',
      light: 'Aydınlık',
      dark: 'Karanlık',
    },
    en: {
      title: '⚙️ Settings',
      sound: 'Sound Settings',
      soundToggle: 'Sounds',
      soundDesc: 'Turn game sounds on/off',
      voiceSpeed: 'Voice Speed',
      voiceSpeedDesc: 'Adjust speech speed',
      game: 'Game Settings',
      difficulty: 'Difficulty Level',
      difficultyDesc: 'Select game difficulty',
      autoRecord: 'Auto Record',
      autoRecordDesc: 'Auto save practices',
      appearance: 'Appearance',
      theme: 'Theme',
      themeDesc: 'Light or dark theme',
      language: 'Language',
      languageDesc: 'Select app language',
      notifications: 'Notifications',
      notificationsToggle: 'Notifications',
      notificationsDesc: 'Turn reminders on/off',
      save: '💾 Save Settings',
      back: '← Back to Dashboard',
      home: '🏠 Back to Home',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      light: 'Light',
      dark: 'Dark',
    },
  };

  const t = texts[language] || texts.tr;

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-nav">
          <button className="back-home-btn" onClick={() => navigate('/dashboard')}>
            {t.back}
          </button>
          <button className="back-home-btn home-btn" onClick={() => navigate('/')}>
            {t.home}
          </button>
        </div>

        <h1 className="settings-title">{t.title}</h1>

        <div className="settings-box">
          <div className="setting-section">
            <h2 className="section-heading">🔊 {t.sound}</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.soundToggle}</span>
                <span className="setting-desc">{t.soundDesc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.voiceSpeed}</span>
                <span className="setting-desc">{t.voiceSpeedDesc}</span>
              </div>
              <select 
                className="setting-select"
                value={settings.voiceSpeed}
                onChange={(e) => handleSelect('voiceSpeed', e.target.value)}
              >
                <option value="slow">{t.slow}</option>
                <option value="normal">{t.normal}</option>
                <option value="fast">{t.fast}</option>
              </select>
            </div>
          </div>

          <div className="setting-section">
            <h2 className="section-heading">🎮 {t.game}</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.difficulty}</span>
                <span className="setting-desc">{t.difficultyDesc}</span>
              </div>
              <select 
                className="setting-select"
                value={settings.difficulty}
                onChange={(e) => handleSelect('difficulty', e.target.value)}
              >
                <option value="easy">{t.easy}</option>
                <option value="medium">{t.medium}</option>
                <option value="hard">{t.hard}</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.autoRecord}</span>
                <span className="setting-desc">{t.autoRecordDesc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoRecord}
                  onChange={() => handleToggle('autoRecord')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-section">
            <h2 className="section-heading">🎨 {t.appearance}</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.theme}</span>
                <span className="setting-desc">{t.themeDesc}</span>
              </div>
              <select 
                className="setting-select"
                value={theme}
                onChange={(e) => {
                  if ((e.target.value === 'dark' && !isDark) || (e.target.value === 'light' && isDark)) {
                    toggleTheme();
                  }
                }}
              >
                <option value="light">{t.light}</option>
                <option value="dark">{t.dark}</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.language}</span>
                <span className="setting-desc">{t.languageDesc}</span>
              </div>
              <select 
                className="setting-select"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
          </div>

          <div className="setting-section">
            <h2 className="section-heading">🔔 {t.notifications}</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t.notificationsToggle}</span>
                <span className="setting-desc">{t.notificationsDesc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <button className="save-btn" onClick={saveSettings}>
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
