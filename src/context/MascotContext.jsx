import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const MascotContext = createContext(null);

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascot must be used within MascotProvider');
  }
  return context;
};

const praiseMessages = {
  default: [
    'Bravo! 👏',
    'Tebrikler! 🎉',
    'Harikasın! ✨',
    'Süpersin! 💫',
    'Aferin! 🌟',
    'Çok iyi! 👍',
    'Mükemmel! 🎊',
    'Devam et! 💪'
  ],
  correctAnswer: [
    'Doğru! 🎯',
    'Bildin! 🧠',
    'Harika cevap! ⭐',
    'Süper! 🌈'
  ],
  questCompleted: [
    'Görev tamamlandı! 🏆',
    'Harika iş! 🎖️',
    'Hepsini bitirdin! 🎉',
    'Müthişsin! 💎'
  ],
  practiceDone: [
    'Pratik tamamlandı! 📝',
    'Çok çalıştın! 💪',
    'Süper pratik! ⭐',
    'Bravo! 🎵'
  ],
  wordCompleted: [
    'Kelimeyi öğrendin! 📚',
    'Mükemmel telaffuz! 🗣️',
    'Harika konuşma! 🎤',
    'Çok net söyledin! 👏'
  ]
};

export const MascotProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [position, setPosition] = useState('bottom-right');

  const positions = ['center', 'top-center', 'bottom-right', 'bottom-left', 'top-right'];

  useEffect(() => {
    // Listen for mascot celebration events from anywhere in the app
    const handleMascotEvent = (event) => {
      const eventType = event.detail?.type || 'default';
      celebrate(eventType);
    };

    window.addEventListener('mascotCelebrate', handleMascotEvent);
    
    return () => {
      window.removeEventListener('mascotCelebrate', handleMascotEvent);
    };
  }, []);

  const celebrate = useCallback((eventType = 'default') => {
    // Get random message based on event type
    const messages = praiseMessages[eventType] || praiseMessages.default;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Get random position
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    
    setMessage(randomMessage);
    setPosition(randomPosition);
    setIsVisible(true);
    setIsCelebrating(true);

    // Hide message after 2.5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Remove celebration animation and reset position after animation completes
    setTimeout(() => {
      setIsCelebrating(false);
      // Return to bottom-right after celebration
      setTimeout(() => {
        setPosition('bottom-right');
      }, 300);
    }, 800);
  }, []);

  const value = {
    message,
    isVisible,
    isCelebrating,
    position,
    celebrate
  };

  return (
    <MascotContext.Provider value={value}>
      {children}
    </MascotContext.Provider>
  );
};
