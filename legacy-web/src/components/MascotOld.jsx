import { useState, useEffect } from 'react';
import './Mascot.css';

const Mascot = () => {
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState('');

  const praises = [
    'Aferin! 🌟',
    'Harika! ⭐',
    'Süpersin! 🎉',
    'Çok iyi! 👏',
    'Bravo! 🏆',
    'Mükemmel! 💫'
  ];

  useEffect(() => {
    // Listen for praise events
    const handlePraise = () => {
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setPraiseText(randomPraise);
      setShowPraise(true);
      
      setTimeout(() => {
        setShowPraise(false);
      }, 2000);
    };

    // Listen for quest completion, practice completion, etc.
    window.addEventListener('mascotPraise', handlePraise);
    window.addEventListener('questProgress', handlePraise);

    return () => {
      window.removeEventListener('mascotPraise', handlePraise);
      window.removeEventListener('questProgress', handlePraise);
    };
  }, []);

  return (
    <div className="mascot-container">
      {showPraise && (
        <div className="mascot-praise">
          {praiseText}
        </div>
      )}
      <div className="mascot">
        <svg
          width="70"
          height="70"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Star body */}
          <path
            d="M50 10 L60 40 L90 40 L66 58 L76 88 L50 70 L24 88 L34 58 L10 40 L40 40 Z"
            fill="url(#starGradient)"
            stroke="#FFD700"
            strokeWidth="2"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFE066', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FFBB33', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Eyes */}
          <circle cx="40" cy="42" r="4" fill="#333" className="mascot-eye" />
          <circle cx="60" cy="42" r="4" fill="#333" className="mascot-eye" />
          
          {/* Smile */}
          <path
            d="M 38 52 Q 50 60 62 52"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Sparkles */}
          <circle cx="20" cy="25" r="2" fill="white" opacity="0.8" className="sparkle sparkle-1" />
          <circle cx="80" cy="30" r="2" fill="white" opacity="0.8" className="sparkle sparkle-2" />
          <circle cx="85" cy="60" r="2" fill="white" opacity="0.8" className="sparkle sparkle-3" />
        </svg>
      </div>
    </div>
  );
};

export default Mascot;
