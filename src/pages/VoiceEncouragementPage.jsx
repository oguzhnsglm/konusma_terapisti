import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import './VoiceEncouragementPage.css';

const VoiceEncouragementPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const { isEnabled, style, playEncouragement, saveSettings, getMessages } = useVoiceFeedback();
  const [playingMessage, setPlayingMessage] = useState(null);

  const texts = {
    tr: {
      title: 'Sesli Güçlendirme',
      subtitle: 'Bravo, Harika söyledin, Süpersin gibi sesleri dene.',
      back: '← Ana Sayfa',
      enableToggle: 'Sesli geri bildirim',
      enabled: 'Açık',
      disabled: 'Kapalı',
      styleLabel: 'Geri Bildirim Stili:',
      styleDefault: 'Varsayılan',
      styleShort: 'Kısa',
      styleEnthusiastic: 'Coşkulu',
      testSection: 'Ses Paketlerini Dene:',
      playButton: 'Çal',
      testAllButton: '🎵 Hepsini Test Et',
      description: 'Bu sesler oyunlarda ve pratiklerde başarılı olduğunda çalacak!',
    },
    en: {
      title: 'Voice Encouragement',
      subtitle: 'Try sounds like Bravo, Great job, You\'re super.',
      back: '← Home',
      enableToggle: 'Voice feedback',
      enabled: 'On',
      disabled: 'Off',
      styleLabel: 'Feedback Style:',
      styleDefault: 'Default',
      styleShort: 'Short',
      styleEnthusiastic: 'Enthusiastic',
      testSection: 'Test Sound Packs:',
      playButton: 'Play',
      testAllButton: '🎵 Test All',
      description: 'These sounds will play when you succeed in games and practice!',
    },
  };

  const t = texts[language] || texts.tr;
  const messages = getMessages(language);

  const handleToggle = () => {
    saveSettings(!isEnabled, style);
  };

  const handleStyleChange = (newStyle) => {
    saveSettings(isEnabled, newStyle);
  };

  const handlePlay = (messageId) => {
    const message = playEncouragement(messageId, language);
    if (message) {
      setPlayingMessage(message.text);
      setTimeout(() => setPlayingMessage(null), 2000);
    }
  };

  const handleTestAll = () => {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        handlePlay(msg.id);
      }, index * 1500);
    });
  };

  return (
    <div className="voice-encouragement-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        {t.back}
      </button>

      <div className="voice-container">
        <h1 className="voice-title">{t.title}</h1>
        <p className="voice-subtitle">{t.subtitle}</p>

        {/* Enable/Disable Toggle */}
        <div className="settings-panel">
          <div className="toggle-section">
            <span className="toggle-label">{t.enableToggle}</span>
            <button
              className={`toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
              onClick={handleToggle}
            >
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {isEnabled ? t.enabled : t.disabled}
              </span>
            </button>
          </div>

          {/* Style Selection */}
          <div className="style-section">
            <label className="style-label">{t.styleLabel}</label>
            <div className="style-buttons">
              <button
                className={`style-btn ${style === 'default' ? 'active' : ''}`}
                onClick={() => handleStyleChange('default')}
              >
                {t.styleDefault}
              </button>
              <button
                className={`style-btn ${style === 'short' ? 'active' : ''}`}
                onClick={() => handleStyleChange('short')}
              >
                {t.styleShort}
              </button>
              <button
                className={`style-btn ${style === 'enthusiastic' ? 'active' : ''}`}
                onClick={() => handleStyleChange('enthusiastic')}
              >
                {t.styleEnthusiastic}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="voice-description">{t.description}</p>

        {/* Test Section */}
        <div className="test-section">
          <h3 className="test-title">{t.testSection}</h3>
          <div className="messages-grid">
            {messages.map((msg) => (
              <div key={msg.id} className="message-card">
                <div className="message-icon">🔊</div>
                <div className="message-text">{msg.text}</div>
                <button
                  className="play-btn"
                  onClick={() => handlePlay(msg.id)}
                  disabled={!isEnabled}
                >
                  ▶️ {t.playButton}
                </button>
              </div>
            ))}
          </div>

          <button
            className="test-all-btn"
            onClick={handleTestAll}
            disabled={!isEnabled}
          >
            {t.testAllButton}
          </button>
        </div>

        {/* Playing Message Display */}
        {playingMessage && (
          <div className="playing-display">
            <div className="playing-icon">🔊</div>
            <div className="playing-text">{playingMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceEncouragementPage;
