import React from 'react';
import { useMascot } from '../context/MascotContext';
import './Mascot.css';

const Mascot = () => {
  const { message, isVisible, isCelebrating } = useMascot();

  return (
    <div className="mascot-wrapper">
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
        </div>
      )}

      {/* Mascot Character */}
      <div className={`mascot-character ${isCelebrating ? 'celebrating' : ''}`}>
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
              <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#818CF8', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="cheekGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FCA5A5', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#FCA5A5', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          
          {/* Cheeks */}
          <ellipse cx="32" cy="58" rx="8" ry="6" fill="url(#cheekGradient)" opacity="0.7" />
          <ellipse cx="68" cy="58" rx="8" ry="6" fill="url(#cheekGradient)" opacity="0.7" />
          
          {/* Eyes */}
          <circle cx="40" cy="48" r="5" fill="#1F2937" className="mascot-eye-left" />
          <circle cx="60" cy="48" r="5" fill="#1F2937" className="mascot-eye-right" />
          
          {/* Eye highlights */}
          <circle cx="42" cy="46" r="2" fill="white" opacity="0.9" />
          <circle cx="62" cy="46" r="2" fill="white" opacity="0.9" />
          
          {/* Smile */}
          <path
            d="M 38 63 Q 50 70 62 63"
            fill="none"
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
            className="mascot-smile"
          />
          
          {/* Small antenna/hair tuft */}
          <circle cx="50" cy="18" r="4" fill="#A78BFA" opacity="0.8" className="mascot-antenna" />
          <line x1="50" y1="22" x2="50" y2="18" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default Mascot;
