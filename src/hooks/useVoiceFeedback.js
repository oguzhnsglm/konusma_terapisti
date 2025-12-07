import { useState, useEffect } from 'react';

const ENCOURAGEMENT_MESSAGES = {
  tr: [
    { id: 'bravo', text: 'Bravo!' },
    { id: 'harika', text: 'Harika söyledin!' },
    { id: 'super', text: 'Süpersin!' },
    { id: 'aferin', text: 'Aferin, böyle devam et!' },
    { id: 'mukemmel', text: 'Mükemmel!' },
    { id: 'cok-iyi', text: 'Çok iyi!' },
  ],
  en: [
    { id: 'bravo', text: 'Bravo!' },
    { id: 'great', text: 'Great job!' },
    { id: 'super', text: "You're super!" },
    { id: 'well-done', text: 'Well done, keep it up!' },
    { id: 'excellent', text: 'Excellent!' },
    { id: 'very-good', text: 'Very good!' },
  ],
};

export const useVoiceFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [style, setStyle] = useState('default'); // 'default', 'short', 'enthusiastic'

  useEffect(() => {
    // Load settings from localStorage
    const enabled = localStorage.getItem('speech_voice_feedback_enabled_v1');
    const savedStyle = localStorage.getItem('speech_voice_feedback_style_v1');
    
    if (enabled !== null) {
      setIsEnabled(enabled === 'true');
    }
    if (savedStyle) {
      setStyle(savedStyle);
    }
  }, []);

  const saveSettings = (enabled, feedbackStyle) => {
    localStorage.setItem('speech_voice_feedback_enabled_v1', enabled.toString());
    localStorage.setItem('speech_voice_feedback_style_v1', feedbackStyle);
    setIsEnabled(enabled);
    setStyle(feedbackStyle);
  };

  const playEncouragement = (type = 'random', language = 'tr') => {
    if (!isEnabled) {
      console.log('Voice feedback is disabled');
      return null;
    }

    const messages = ENCOURAGEMENT_MESSAGES[language] || ENCOURAGEMENT_MESSAGES.tr;
    let selectedMessage;

    if (type === 'random') {
      selectedMessage = messages[Math.floor(Math.random() * messages.length)];
    } else {
      selectedMessage = messages.find(m => m.id === type) || messages[0];
    }

    // Log for demo purposes (in production, this would play actual audio)
    console.log(`🔊 Playing: ${selectedMessage.text}`);

    // In production, you would do something like:
    // const audio = new Audio(`/sounds/${selectedMessage.id}.mp3`);
    // audio.play();

    return selectedMessage;
  };

  const getMessages = (language = 'tr') => {
    return ENCOURAGEMENT_MESSAGES[language] || ENCOURAGEMENT_MESSAGES.tr;
  };

  return {
    isEnabled,
    style,
    playEncouragement,
    saveSettings,
    getMessages,
  };
};

export default useVoiceFeedback;
