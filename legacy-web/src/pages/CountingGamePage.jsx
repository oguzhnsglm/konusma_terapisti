import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useMascot } from '../context/MascotContext';
import './CountingGamePage.css';

const CountingGamePage = () => {
  const navigate = useNavigate();
  const { incrementGames } = useProgress();
  const { celebrate } = useMascot();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      emoji: '🍎',
      count: 3,
      options: [2, 3, 4],
    },
    {
      emoji: '⭐',
      count: 5,
      options: [4, 5, 6],
    },
    {
      emoji: '🎈',
      count: 7,
      options: [6, 7, 8],
    },
    {
      emoji: '🌸',
      count: 4,
      options: [3, 4, 5],
    },
    {
      emoji: '🐶',
      count: 6,
      options: [5, 6, 7],
    },
  ];

  const currentQuestion = levels[currentLevel];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.count) {
      setScore(score + 1);
      celebrate('correctAnswer');
    }
  };

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      incrementGames();
      alert(`🎉 Oyun bitti! Skorun: ${score + 1}/${levels.length}`);
      resetGame();
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === currentQuestion.count;

  return (
    <div className="counting-game-container">
      <div className="counting-game-content">
        <button className="back-home-btn" onClick={() => navigate('/games')}>
          ← Oyunlara Dön
        </button>
        <button className="back-home-btn home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="game-title">🔢 Sayma Oyunu</h1>
        <p className="game-subtitle">Nesneleri say ve doğru sayıyı bul!</p>

        <div className="game-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
            />
          </div>
          <p className="progress-text">Soru {currentLevel + 1} / {levels.length}</p>
          <p className="score-text">Skor: {score}</p>
        </div>

        <div className="counting-game-box">
          <div className="items-display">
            {Array(currentQuestion.count).fill(0).map((_, index) => (
              <span key={index} className="item-emoji">
                {currentQuestion.emoji}
              </span>
            ))}
          </div>
          <p className="counting-question">Kaç tane var?</p>

          <div className="counting-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`counting-option ${
                  showResult && selectedAnswer === option
                    ? isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`result-box ${isCorrect ? 'success' : 'error'}`}>
              <span className="result-emoji">{isCorrect ? '🎉' : '😢'}</span>
              <p>
                {isCorrect
                  ? 'Harika! Doğru saydın!'
                  : `Doğru cevap: ${currentQuestion.count}`}
              </p>
              <button className="next-btn" onClick={handleNext}>
                {currentLevel < levels.length - 1 ? '➡️ Sonraki' : '🏁 Bitir'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountingGamePage;
