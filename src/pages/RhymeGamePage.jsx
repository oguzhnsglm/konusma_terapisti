import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './RhymeGamePage.css';

const RhymeGamePage = () => {
  const navigate = useNavigate();
  const { incrementGames } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      word: 'Kedi',
      options: ['Dede', 'Araba', 'Masa'],
      correct: 'Dede',
      hint: '"Kedi" ile kafiyeli kelime',
    },
    {
      word: 'Masa',
      options: ['Kasa', 'Sandalye', 'Kitap'],
      correct: 'Kasa',
      hint: '"Masa" ile kafiyeli kelime',
    },
    {
      word: 'Top',
      options: ['Kop', 'Balon', 'Oyun'],
      correct: 'Kop',
      hint: '"Top" ile kafiyeli kelime',
    },
    {
      word: 'Ay',
      options: ['Kay', 'Güneş', 'Yıldız'],
      correct: 'Kay',
      hint: '"Ay" ile kafiyeli kelime',
    },
    {
      word: 'Bal',
      options: ['Kal', 'Şeker', 'Yemek'],
      correct: 'Kal',
      hint: '"Bal" ile kafiyeli kelime',
    },
  ];

  const currentQuestion = levels[currentLevel];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correct) {
      setScore(score + 1);
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
    <div className="rhyme-game-container">
      <div className="rhyme-game-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>
        <button className="back-btn" onClick={() => navigate('/games')}>
          ← Oyunlara Dön
        </button>

        <h1 className="game-title">🎵 Kafiye Oyunu</h1>
        <p className="game-subtitle">Kafiyeli kelimeleri bul!</p>

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

        <div className="rhyme-game-box">
          <div className="main-word">
            <h2>{currentQuestion.word}</h2>
            <p className="hint">{currentQuestion.hint}</p>
          </div>

          <div className="rhyme-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`rhyme-option ${
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

export default RhymeGamePage;
