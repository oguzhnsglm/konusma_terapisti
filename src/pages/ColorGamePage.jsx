import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useMascot } from '../context/MascotContext';
import './ColorGamePage.css';

const ColorGamePage = () => {
  const navigate = useNavigate();
  const { incrementGames } = useProgress();
  const { celebrate } = useMascot();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      color: '#FF0000',
      options: ['Kırmızı', 'Mavi', 'Yeşil'],
      correct: 'Kırmızı',
    },
    {
      color: '#0000FF',
      options: ['Sarı', 'Mavi', 'Turuncu'],
      correct: 'Mavi',
    },
    {
      color: '#00FF00',
      options: ['Yeşil', 'Mor', 'Pembe'],
      correct: 'Yeşil',
    },
    {
      color: '#FFFF00',
      options: ['Sarı', 'Kahverengi', 'Gri'],
      correct: 'Sarı',
    },
    {
      color: '#FFA500',
      options: ['Turuncu', 'Kırmızı', 'Sarı'],
      correct: 'Turuncu',
    },
  ];

  const currentQuestion = levels[currentLevel];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correct) {
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

  const isCorrect = selectedAnswer === currentQuestion.correct;

  return (
    <div className="color-game-container">
      <div className="color-game-content">
        <button className="back-home-btn" onClick={() => navigate('/games')}>
          ← Oyunlara Dön
        </button>
        <button className="back-home-btn home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="game-title">🎨 Renk Oyunu</h1>
        <p className="game-subtitle">Renkleri öğren ve eşleştir!</p>

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

        <div className="color-game-box">
          <div className="color-display" style={{ backgroundColor: currentQuestion.color }}>
            <span className="color-question">Bu hangi renk?</span>
          </div>

          <div className="color-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`color-option ${
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
                  ? 'Harika! Doğru cevap!'
                  : `Doğru cevap: ${currentQuestion.correct}`}
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

export default ColorGamePage;
