import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './HarfCanavariBeslemePage.css';

const HarfCanavariBeslemePage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [monsterMood, setMonsterMood] = useState('hungry'); // hungry, happy, full
  const [message, setMessage] = useState('');
  const [correctLetter, setCorrectLetter] = useState('R');
  const [feedCount, setFeedCount] = useState(0);

  const texts = {
    tr: {
      title: 'Harf Canavarı Besleme Oyunu',
      description: 'Doğru harfi seçtikçe harf canavarı beslenir ve mutlu olur!',
      instruction: `Canavar "${correctLetter}" harfini istiyor. Doğru harfi seç!`,
      back: '← Ana Sayfa',
      feedSuccess: `Aferin! Canavar doydu. 🍎 (${feedCount + 1}/5)`,
      wrongLetter: 'Hmmm, bu harf değil. Tekrar dene! 🤔',
      gameComplete: 'Tebrikler! Canavarı doyurdun! 🎉',
    },
    en: {
      title: 'Letter Monster Feeding Game',
      description: 'Feed the letter monster by choosing the correct letter!',
      instruction: `The monster wants the letter "${correctLetter}". Choose the right one!`,
      back: '← Home',
      feedSuccess: `Great! Monster is fed. 🍎 (${feedCount + 1}/5)`,
      wrongLetter: 'Hmmm, not that letter. Try again! 🤔',
      gameComplete: 'Congratulations! You fed the monster! 🎉',
    },
  };

  const t = texts[language] || texts.tr;

  const letters = ['R', 'S', 'K', 'M', 'T', 'L'];
  
  const handleLetterClick = (letter) => {
    if (letter === correctLetter) {
      setMessage(t.feedSuccess);
      setMonsterMood('happy');
      const newCount = feedCount + 1;
      setFeedCount(newCount);
      
      if (newCount >= 5) {
        setMessage(t.gameComplete);
        setMonsterMood('full');
        setTimeout(() => {
          resetGame();
        }, 3000);
      } else {
        setTimeout(() => {
          const newLetter = letters[Math.floor(Math.random() * letters.length)];
          setCorrectLetter(newLetter);
          setMonsterMood('hungry');
          setMessage('');
        }, 2000);
      }
    } else {
      setMessage(t.wrongLetter);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const resetGame = () => {
    setFeedCount(0);
    setMonsterMood('hungry');
    setMessage('');
    setCorrectLetter(letters[Math.floor(Math.random() * letters.length)]);
  };

  const getMonsterFace = () => {
    switch (monsterMood) {
      case 'hungry':
        return '😟';
      case 'happy':
        return '😊';
      case 'full':
        return '😄';
      default:
        return '😟';
    }
  };

  return (
    <div className="harf-canavari-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        {t.back}
      </button>

      <div className="game-container">
        <h1 className="game-title">{t.title}</h1>
        <p className="game-description">{t.description}</p>

        {/* Monster */}
        <div className="monster-container">
          <div className={`monster monster-${monsterMood}`}>
            <div className="monster-face">{getMonsterFace()}</div>
            <div className="monster-body">👾</div>
          </div>
        </div>

        {/* Instruction */}
        {feedCount < 5 && (
          <div className="instruction-box">
            <p className="instruction-text">{t.instruction}</p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`message-box ${message.includes('Hmmm') || message.includes('not that') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Letter Buttons */}
        {feedCount < 5 && (
          <div className="letter-buttons">
            {letters.map((letter) => (
              <button
                key={letter}
                className="letter-btn"
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(feedCount / 5) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">{feedCount}/5 beslenme</p>
        </div>
      </div>
    </div>
  );
};

export default HarfCanavariBeslemePage;
