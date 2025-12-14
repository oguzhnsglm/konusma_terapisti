import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './PuzzlePage.css';

const PuzzlePage = () => {
  const navigate = useNavigate();
  const { incrementPuzzles } = useProgress();
  const [matches, setMatches] = useState({});

  const puzzleGroups = {
    K: ['Kedi', 'Kale', 'Kalem'],
    S: ['Saat', 'Sabun', 'Sosis'],
    M: ['Masa', 'Muz', 'Mavi'],
  };

  const words = [...puzzleGroups.K, ...puzzleGroups.S, ...puzzleGroups.M].sort(
    () => Math.random() - 0.5
  );

  const handleWordClick = (word) => {
    const firstLetter = word.charAt(0);
    setMatches((prev) => ({
      ...prev,
      [word]: firstLetter,
    }));
  };

  const getWordClass = (word) => {
    const matched = matches[word];
    if (!matched) return '';
    return `matched matched-${matched}`;
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="puzzle-title">🧩 Bulmacalar</h1>
        <p className="puzzle-subtitle">Aynı harfle başlayan kelimeleri eşleştir!</p>

        <div className="puzzle-box">
          <div className="letters-row">
            {Object.keys(puzzleGroups).map((letter) => (
              <div key={letter} className={`letter-zone zone-${letter}`}>
                <h2>{letter}</h2>
              </div>
            ))}
          </div>

          <div className="words-grid">
            {words.map((word) => (
              <button
                key={word}
                className={`word-btn ${getWordClass(word)}`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </button>
            ))}
          </div>

          {Object.keys(matches).length === words.length && (
            <div className="completion-message">
              <span className="completion-emoji">🎉</span>
              <p>Tebrikler! Tüm eşleştirmeleri tamamladın!</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setMatches({});
                  incrementPuzzles();
                }}
              >
                🔄 Yeniden Başla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzlePage;
