import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './ProfileAvatarPage.css';

const ProfileAvatarPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [childName, setChildName] = useState('');
  const [message, setMessage] = useState('');

  const texts = {
    tr: {
      title: 'Profil & Avatar',
      subtitle: 'Avatarını seç ve kendine özel profil oluştur.',
      nameLabel: 'Adın:',
      namePlaceholder: 'Adını yaz...',
      selectAvatar: 'Bir avatar seç:',
      saveButton: 'Kaydet',
      back: '← Ana Sayfa',
      successMessage: 'Profilin güncellendi, harikasın! ✨',
    },
    en: {
      title: 'Profile & Avatar',
      subtitle: 'Choose your avatar and create your special profile.',
      nameLabel: 'Your name:',
      namePlaceholder: 'Type your name...',
      selectAvatar: 'Choose an avatar:',
      saveButton: 'Save',
      back: '← Home',
      successMessage: 'Profile updated, you\'re awesome! ✨',
    },
  };

  const t = texts[language] || texts.tr;

  const avatars = [
    { id: 'dino', emoji: '🦖', name: 'Dinozor' },
    { id: 'cat', emoji: '🐱', name: 'Kedi' },
    { id: 'alien', emoji: '👽', name: 'Uzaylı' },
    { id: 'robot', emoji: '🤖', name: 'Robot' },
    { id: 'superhero', emoji: '🦸', name: 'Süper Kahraman' },
    { id: 'monster', emoji: '👾', name: 'Canavar' },
  ];

  useEffect(() => {
    // Load saved profile
    const savedProfile = localStorage.getItem('speech_child_profile_v1');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setSelectedAvatar(profile.avatarId);
        setChildName(profile.name || '');
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!selectedAvatar) {
      setMessage('Lütfen bir avatar seç! 🎨');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);
    const profile = {
      name: childName || 'Çocuk',
      avatarId: selectedAvatar,
      avatarEmoji: selectedAvatarData.emoji,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('speech_child_profile_v1', JSON.stringify(profile));
    setMessage(t.successMessage);
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <div className="profile-avatar-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        {t.back}
      </button>

      <div className="profile-container">
        <h1 className="profile-title">{t.title}</h1>
        <p className="profile-subtitle">{t.subtitle}</p>

        {/* Name Input */}
        <div className="name-section">
          <label className="name-label">{t.nameLabel}</label>
          <input
            type="text"
            className="name-input"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder={t.namePlaceholder}
            maxLength={20}
          />
        </div>

        {/* Avatar Selection */}
        <div className="avatar-section">
          <h3 className="avatar-section-title">{t.selectAvatar}</h3>
          <div className="avatar-grid">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`avatar-card ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="avatar-emoji">{avatar.emoji}</div>
                <div className="avatar-name">{avatar.name}</div>
                {selectedAvatar === avatar.id && (
                  <div className="avatar-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave}>
          {t.saveButton}
        </button>

        {/* Success Message */}
        {message && (
          <div className={`message-box ${message.includes('Lütfen') ? 'warning' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatarPage;
