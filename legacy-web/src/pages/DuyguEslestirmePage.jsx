import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './DuyguEslestirmePage.css';

const DuyguEslestirmePage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [selectedFace, setSelectedFace] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const texts = {
    tr: {
      title: 'Duygu Eşleştirme Oyunu',
      description: 'Yüz ifadelerini doğru duygularla eşleştir.',
      instruction: 'Önce bir yüz, sonra duygusunu seç!',
      back: '← Ana Sayfa',
      faces: 'Yüz İfadeleri',
      emotions: 'Duygular',
      correct: 'Doğru! Bu yüz ',
      wrong: 'Hmmm, tekrar dene! 🤔',
      complete: 'Tebrikler! Tüm duyguları eşleştirdin! 🎉',
      score: 'Puan: ',
      reset: 'Yeniden Başla',
    },
    en: {
      title: 'Emotion Matching Game',
      description: 'Match facial expressions with the correct emotions.',
      instruction: 'First pick a face, then pick its emotion!',
      back: '← Home',
      faces: 'Faces',
      emotions: 'Emotions',
      correct: 'Correct! This face is ',
      wrong: 'Hmmm, try again! 🤔',
      complete: 'Congratulations! You matched all emotions! 🎉',
      score: 'Score: ',
      reset: 'Start Over',
    },
  };

  const t = texts[language] || texts.tr;

  const emotionPairs = [
    { face: '🙂', emotion: 'Mutlu', emotionEn: 'Happy' },
    { face: '😢', emotion: 'Üzgün', emotionEn: 'Sad' },
    { face: '😠', emotion: 'Kızgın', emotionEn: 'Angry' },
    { face: '😨', emotion: 'Korkmuş', emotionEn: 'Scared' },
  ];

  const handleFaceClick = (face) => {
    if (matchedPairs.includes(face)) return;
    setSelectedFace(face);
    setSelectedEmotion(null);
    setMessage('');
  };

  const handleEmotionClick = (emotion) => {
    if (!selectedFace) {
      setMessage(t.instruction);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setSelectedEmotion(emotion);

    const selectedPair = emotionPairs.find(pair => pair.face === selectedFace);
    const emotionText = language === 'en' ? selectedPair.emotionEn : selectedPair.emotion;

    if (emotionText === emotion) {
      setMessage(`${t.correct}${emotion.toLowerCase()}! 🎉`);
      setScore(score + 10);
      setMatchedPairs([...matchedPairs, selectedFace]);
      
      setTimeout(() => {
        setMessage('');
        setSelectedFace(null);
        setSelectedEmotion(null);
      }, 2000);
    } else {
      setMessage(t.wrong);
      setTimeout(() => {
        setMessage('');
        setSelectedEmotion(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setSelectedFace(null);
    setSelectedEmotion(null);
    setMessage('');
    setScore(0);
    setMatchedPairs([]);
  };

  const isComplete = matchedPairs.length === emotionPairs.length;

  return (
    <div className="duygu-eslestirme-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        {t.back}
      </button>

      <div className="game-container">
        <h1 className="game-title">{t.title}</h1>
        <p className="game-description">{t.description}</p>

        {/* Score */}
        <div className="score-box">
          <span className="score-label">{t.score}</span>
          <span className="score-value">{score}</span>
        </div>

        {/* Message */}
        {message && (
          <div className={`message-box ${message.includes('Hmmm') || message.includes('try again') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {isComplete ? (
          <div className="complete-message">
            <p className="complete-text">{t.complete}</p>
            <button className="reset-btn" onClick={resetGame}>
              {t.reset}
            </button>
          </div>
        ) : (
          <div className="game-board">
            {/* Faces Column */}
            <div className="faces-column">
              <h3 className="column-title">{t.faces}</h3>
              <div className="items-container">
                {emotionPairs.map((pair) => (
                  <button
                    key={pair.face}
                    className={`face-btn ${selectedFace === pair.face ? 'selected' : ''} ${matchedPairs.includes(pair.face) ? 'matched' : ''}`}
                    onClick={() => handleFaceClick(pair.face)}
                    disabled={matchedPairs.includes(pair.face)}
                  >
                    <span className="face-icon">{pair.face}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotions Column */}
            <div className="emotions-column">
              <h3 className="column-title">{t.emotions}</h3>
              <div className="items-container">
                {emotionPairs.map((pair) => {
                  const emotionText = language === 'en' ? pair.emotionEn : pair.emotion;
                  const isMatched = matchedPairs.find(face => {
                    const matchedPair = emotionPairs.find(p => p.face === face);
                    return (language === 'en' ? matchedPair.emotionEn : matchedPair.emotion) === emotionText;
                  });

                  return (
                    <button
                      key={emotionText}
                      className={`emotion-btn ${selectedEmotion === emotionText ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                      onClick={() => handleEmotionClick(emotionText)}
                      disabled={!!isMatched}
                    >
                      {emotionText}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuyguEslestirmePage;
