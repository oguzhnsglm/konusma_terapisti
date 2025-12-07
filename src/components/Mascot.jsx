import React from 'react';
import { useMascot } from '../context/MascotContext';
import './Mascot.css';

const Mascot = () => {
  const { message, isVisible, isCelebrating, position } = useMascot();

  return (
    <div className={`mascot-wrapper ${position}`}>
      {/* Speech Bubble */}
      {isVisible && (
        <div className="mascot-bubble">
          {message}
        </div>
      )}

      {/* Confetti particles for celebration */}
      {isCelebrating && (
        <div className="confetti-container">
          <span className="confetti confetti-1"></span>
          <span className="confetti confetti-2"></span>
          <span className="confetti confetti-3"></span>
          <span className="confetti confetti-4"></span>
          <span className="confetti confetti-5"></span>
          <span className="confetti confetti-6"></span>
          <span className="confetti confetti-7"></span>
          <span className="confetti confetti-8"></span>
        </div>
      )}

      {/* Mascot Character */}
      <div className={`mascot-character ${isCelebrating ? 'celebrating' : ''}`}>
        <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Body - Rounded blob shape */}
          <ellipse 
            cx="50" 
            cy="55" 
            rx="35" 
            ry="38" 
            fill="url(#blobGradient)"
            className="mascot-body"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="blobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#F472B6', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="cheekGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FCA5A5', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#FBBF24', stopOpacity: 0.6 }} />
            </linearGradient>
            <radialGradient id="eyeShine">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          
          {/* Cheeks */}
          <ellipse cx="32" cy="58" rx="9" ry="7" fill="url(#cheekGradient)" opacity="0.8" />
          <ellipse cx="68" cy="58" rx="9" ry="7" fill="url(#cheekGradient)" opacity="0.8" />
          
          {/* Eyes */}
          <ellipse cx="40" cy="48" rx="6" ry="7" fill="#1F2937" className="mascot-eye-left" />
          <ellipse cx="60" cy="48" rx="6" ry="7" fill="#1F2937" className="mascot-eye-right" />
          
          {/* Eye highlights */}
          <circle cx="42" cy="46" r="2.5" fill="white" opacity="0.95" />
          <circle cx="62" cy="46" r="2.5" fill="white" opacity="0.95" />
          <circle cx="38" cy="49" r="1.5" fill="white" opacity="0.6" />
          <circle cx="58" cy="49" r="1.5" fill="white" opacity="0.6" />
          
          {/* Smile */}
          <path
            d="M 35 63 Q 50 73 65 63"
            fill="none"
            stroke="#1F2937"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="mascot-smile"
          />
          
          {/* Smile inner glow */}
          <path
            d="M 38 64 Q 50 71 62 64"
            fill="none"
            stroke="#FCA5A5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          
          {/* Small antenna/hair tuft */}
          <circle cx="50" cy="18" r="5" fill="#F472B6" opacity="0.9" className="mascot-antenna" />
          <circle cx="50" cy="18" r="3" fill="#FBBF24" opacity="0.7" />
          <line x1="50" y1="23" x2="50" y2="18" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Sparkles around antenna */}
          <circle cx="45" cy="15" r="1.5" fill="#FBBF24" opacity="0.8" className="sparkle sparkle-1" />
          <circle cx="55" cy="15" r="1.5" fill="#60A5FA" opacity="0.8" className="sparkle sparkle-2" />
        </svg>
      </div>
    </div>
  );
};

export default Mascot;
