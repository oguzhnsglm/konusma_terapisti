import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useMascot } from '../context/MascotContext';
import './MemoryGamePage.css';

const MemoryGamePage = () => {
  const navigate = useNavigate();
  const { incrementGames } = useProgress();
  const { celebrate } = useMascot();
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  const cards = [
    { id: 1, emoji: '🐱', pair: 'Kedi' },
    { id: 2, emoji: '🐱', pair: 'Kedi' },
    { id: 3, emoji: '🚗', pair: 'Araba' },
    { id: 4, emoji: '🚗', pair: 'Araba' },
    { id: 5, emoji: '🍎', pair: 'Elma' },
    { id: 6, emoji: '🍎', pair: 'Elma' },
    { id: 7, emoji: '⚽', pair: 'Top' },
    { id: 8, emoji: '⚽', pair: 'Top' },
    { id: 9, emoji: '🌸', pair: 'Çiçek' },
    { id: 10, emoji: '🌸', pair: 'Çiçek' },
    { id: 11, emoji: '🎈', pair: 'Balon' },
    { id: 12, emoji: '🎈', pair: 'Balon' },
  ].sort(() => Math.random() - 0.5);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].pair === cards[second].pair) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        
        // Celebrate match
        celebrate('correctAnswer');
        
        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            incrementGames();
            celebrate('questCompleted');
            alert(`🎉 Tebrikler! ${moves + 1} hamlede tamamladın!`);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  return (
    <div className="memory-game-container">
      <div className="memory-game-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>
        <button className="back-btn" onClick={() => navigate('/games')}>
          ← Oyunlara Dön
        </button>

        <h1 className="game-title">🧠 Hafıza Oyunu</h1>
        <p className="game-subtitle">Eşleşen kartları bul!</p>

        <div className="game-stats">
          <span className="stat">Hamle: {moves}</span>
          <span className="stat">Bulunan: {solved.length / 2} / {cards.length / 2}</span>
        </div>

        <div className="memory-cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`memory-card ${
                flipped.includes(index) || solved.includes(index) ? 'flipped' : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              {(flipped.includes(index) || solved.includes(index)) && (
                <span className="card-content">{card.emoji}</span>
              )}
            </div>
          ))}
        </div>

        <button className="reset-game-btn" onClick={resetGame}>
          🔄 Yeniden Başla
        </button>
      </div>
    </div>
  );
};

export default MemoryGamePage;
