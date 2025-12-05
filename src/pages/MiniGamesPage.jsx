import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './MiniGamesPage.css';

const MiniGamesPage = () => {
  const navigate = useNavigate();
  const { incrementGames } = useProgress();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const game = {
    word: '_araba',
    correctAnswer: 'K',
    options: ['K', 'G', 'P'],
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === game.correctAnswer) {
      incrementGames();
    }
  };

  const resetGame = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === game.correctAnswer;

  return (
    <div className="mini-games-container">
      <div className="mini-games-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="games-title">🎮 Mini Oyunlar</h1>
        <p className="games-subtitle">Eğlenceli oyunlarla öğren!</p>

        <div className="games-menu">
          <button 
            className="game-menu-btn game-1"
            onClick={() => navigate('/games/word-fill')}
          >
            📝 Kelime Tamamlama
          </button>
          <button 
            className="game-menu-btn game-2"
            onClick={() => navigate('/games/memory')}
          >
            🧠 Hafıza Oyunu
          </button>
          <button 
            className="game-menu-btn game-3"
            onClick={() => navigate('/games/rhyme')}
          >
            🎵 Kafiye Oyunu
          </button>
          <button 
            className="game-menu-btn game-4"
            onClick={() => navigate('/games/colors')}
          >
            🎨 Renk Oyunu
          </button>
          <button 
            className="game-menu-btn game-5"
            onClick={() => navigate('/games/counting')}
          >
            🔢 Sayma Oyunu
          </button>
        </div>

        <h2 className="section-title">📝 Kelime Tamamlama</h2>

        <div className="game-box">
          <div className="word-display">
            <h2 className="incomplete-word">{game.word}</h2>
            <p className="game-instruction">Eksik harfi bul!</p>
          </div>

          <div className="options-grid">
            {game.options.map((option) => (
              <button
                key={option}
                className={`option-btn ${
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
            <div className={`result-message ${isCorrect ? 'success' : 'error'}`}>
              {isCorrect ? (
                <>
                  <span className="result-emoji">🎉</span>
                  <p>Harika! Doğru cevap: <strong>Karaba</strong></p>
                </>
              ) : (
                <>
                  <span className="result-emoji">😢</span>
                  <p>Tekrar dene! Doğru cevap: <strong>K</strong></p>
                </>
              )}
              <button className="retry-btn" onClick={resetGame}>
                🔄 Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGamesPage;
