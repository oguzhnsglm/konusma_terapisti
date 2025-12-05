import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useMascot } from '../context/MascotContext';
import './PracticePage.css';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const PracticePage = () => {
  const navigate = useNavigate();
  const { addProgress } = useProgress();
  const { celebrate } = useMascot();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sessionStats, setSessionStats] = useState({
    completed: 0,
    total: 0,
    startTime: Date.now()
  });

  const { transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  // Modern kelime bölümleri - Her kelime bir seviye
  const practiceWords = [
    { id: 1, word: 'ARABA', difficulty: 'Kolay', category: 'Ulaşım', tip: 'A-RA-BA şeklinde hecelere ayırarak söyle' },
    { id: 2, word: 'KELEBEK', difficulty: 'Orta', category: 'Hayvanlar', tip: 'KE-LE-BEK, her heceyi net söyle' },
    { id: 3, word: 'KALEM', difficulty: 'Kolay', category: 'Okul', tip: 'KA-LEM, L harfine dikkat et' },
    { id: 4, word: 'PORTAKAL', difficulty: 'Zor', category: 'Meyveler', tip: 'POR-TA-KAL, R ve L harflerine dikkat' },
    { id: 5, word: 'ÇIKOLATA', difficulty: 'Orta', category: 'Yiyecek', tip: 'ÇI-KO-LA-TA, yavaş ve net söyle' },
    { id: 6, word: 'KURBAĞA', difficulty: 'Orta', category: 'Hayvanlar', tip: 'KUR-BA-ĞA, Ğ sesine dikkat' },
    { id: 7, word: 'KARDAN ADAM', difficulty: 'Zor', category: 'Doğa', tip: 'İki kelimeyi birlikte söyle' },
    { id: 8, word: 'TELEVİZYON', difficulty: 'Zor', category: 'Ev', tip: 'TE-LE-VİZ-YON, uzun kelime sakin ol' },
    { id: 9, word: 'GÜNEŞ', difficulty: 'Kolay', category: 'Doğa', tip: 'GÜ-NEŞ, Ş sesini net çıkar' },
    { id: 10, word: 'YATAK', difficulty: 'Kolay', category: 'Ev', tip: 'YA-TAK, basit ve net söyle' },
    { id: 11, word: 'SINCAP', difficulty: 'Orta', category: 'Hayvanlar', tip: 'SIN-CAP, S ve C harflerine dikkat' },
    { id: 12, word: 'TRAKTÖR', difficulty: 'Zor', category: 'Ulaşım', tip: 'TRAK-TÖR, R seslerini güçlü çıkar' },
    { id: 13, word: 'MUZ', difficulty: 'Kolay', category: 'Meyveler', tip: 'Tek hecelik, basit söyle' },
    { id: 14, word: 'SAKSAFON', difficulty: 'Zor', category: 'Müzik', tip: 'SAK-SA-FON, S harflerine dikkat' },
    { id: 15, word: 'KARPUZ', difficulty: 'Orta', category: 'Meyveler', tip: 'KAR-PUZ, R sesini net çıkar' }
  ];

  useEffect(() => {
    loadProgress();
    setSessionStats(prev => ({ ...prev, total: practiceWords.length }));
  }, []);

  useEffect(() => {
    if (transcript && isListening) {
      checkWord(transcript);
    }
  }, [transcript, isListening]);

  const loadProgress = () => {
    const saved = localStorage.getItem('speech_practice_progress_v2');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedSections(data.completed || []);
      setCurrentSection(data.lastSection || 0);
    }
  };

  const saveProgress = (completed, lastSection) => {
    localStorage.setItem('speech_practice_progress_v2', JSON.stringify({
      completed,
      lastSection,
      date: new Date().toISOString()
    }));
  };

  const checkWord = (spokenText) => {
    const currentWord = practiceWords[currentSection].word;
    const normalized = spokenText.toUpperCase().trim();
    
    if (normalized.includes(currentWord)) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    const wordId = practiceWords[currentSection].id;
    
    if (!completedSections.includes(wordId)) {
      const newCompleted = [...completedSections, wordId];
      setCompletedSections(newCompleted);
      saveProgress(newCompleted, currentSection);
      
      setSessionStats(prev => ({ ...prev, completed: prev.completed + 1 }));
      
      // İlerleme kaydet
      addProgress({
        wordsPracticed: 1,
        minutesSpent: 0,
        sessionsCompleted: 0
      });

      // Quest güncelle
      const questEvent = new CustomEvent('questProgress', {
        detail: { type: 'words', value: 1 }
      });
      window.dispatchEvent(questEvent);
      
      // Trigger mascot celebration!
      celebrate('wordCompleted');
    }

    setFeedback('success');
    stopListening();
    setIsListening(false);
    
    setTimeout(() => {
      setFeedback('');
      if (currentSection < practiceWords.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    }, 1500);
  };

  const handleStartPractice = () => {
    resetTranscript();
    startListening();
    setIsListening(true);
    setFeedback('listening');
  };

  const handleSkip = () => {
    stopListening();
    setIsListening(false);
    setFeedback('');
    if (currentSection < practiceWords.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      stopListening();
      setIsListening(false);
      setFeedback('');
      setCurrentSection(currentSection - 1);
    }
  };

  const currentWord = practiceWords[currentSection];
  const progress = ((completedSections.length / practiceWords.length) * 100).toFixed(0);
  const difficultyColors = {
    'Kolay': '#4ade80',
    'Orta': '#fbbf24',
    'Zor': '#f87171'
  };

  return (
    <div className="practice-page-modern">
      <div className="practice-header">
        <button className="back-btn-modern" onClick={() => navigate('/dashboard')}>
          ← Geri
        </button>
        <div className="session-info">
          <div className="timer">
            ⏱️ {Math.floor((Date.now() - sessionStats.startTime) / 60000)} dk
          </div>
          <div className="score">
            🏆 {completedSections.length}/{practiceWords.length}
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>

      <div className="practice-container">
        {/* Ana Kart */}
        <div className={`word-card-main ${feedback}`}>
          <div className="card-header">
            <span className="section-number">Bölüm {currentSection + 1}/{practiceWords.length}</span>
            <span 
              className="difficulty-badge" 
              style={{ background: difficultyColors[currentWord.difficulty] }}
            >
              {currentWord.difficulty}
            </span>
          </div>

          <div className="category-tag">
            📚 {currentWord.category}
          </div>

          <div className="word-display">
            <h1 className="main-word">{currentWord.word}</h1>
          </div>

          <div className="tip-box">
            <span className="tip-icon">💡</span>
            <p className="tip-text">{currentWord.tip}</p>
          </div>

          {/* Feedback Mesajları */}
          {feedback === 'success' && (
            <div className="feedback-message success">
              <span className="feedback-icon">🎉</span>
              <span>Harika! Doğru söyledin!</span>
            </div>
          )}

          {feedback === 'listening' && (
            <div className="feedback-message listening">
              <span className="pulse-animation">🎤</span>
              <span>Dinliyorum... Kelimeyi söyle!</span>
            </div>
          )}

          {/* Mikrofon Kontrolü */}
          <div className="practice-controls-modern">
            {!isListening ? (
              <button 
                className="mic-btn-large"
                onClick={handleStartPractice}
                disabled={!isSupported}
              >
                <span className="mic-icon-large">🎤</span>
                <span>Mikrofona Söyle</span>
              </button>
            ) : (
              <button 
                className="mic-btn-large listening"
                onClick={() => {
                  stopListening();
                  setIsListening(false);
                  setFeedback('');
                }}
              >
                <span className="mic-icon-large pulse-animation">⏹️</span>
                <span>Dur</span>
              </button>
            )}
          </div>

          {!isSupported && (
            <div className="browser-warning">
              ⚠️ Chrome veya Edge kullanın
            </div>
          )}

          {/* Navigasyon */}
          <div className="navigation-controls">
            <button 
              className="nav-btn prev"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              ← Önceki
            </button>
            <button 
              className="nav-btn skip"
              onClick={handleSkip}
            >
              Atla →
            </button>
          </div>
        </div>

        {/* Transkript Kutusu */}
        {transcript && (
          <div className="transcript-box-modern">
            <div className="transcript-header">
              <span>🗣️ Söyledikleriniz:</span>
              <button className="clear-btn-mini" onClick={resetTranscript}>✕</button>
            </div>
            <p className="transcript-content">{transcript}</p>
          </div>
        )}

        {/* Mini Kelime Listesi */}
        <div className="words-grid-mini">
          {practiceWords.map((word, index) => (
            <div 
              key={word.id}
              className={`word-mini ${completedSections.includes(word.id) ? 'completed' : ''} ${index === currentSection ? 'active' : ''}`}
              onClick={() => {
                setCurrentSection(index);
                setFeedback('');
                stopListening();
                setIsListening(false);
              }}
            >
              {completedSections.includes(word.id) && <span className="check">✓</span>}
              <span className="word-mini-text">{word.word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tamamlanma Kutlaması */}
      {completedSections.length === practiceWords.length && (
        <div className="celebration-modal">
          <div className="celebration-content">
            <h2>🎊 Tebrikler!</h2>
            <p>Tüm bölümleri tamamladın!</p>
            <div className="celebration-stats">
              <div className="stat">
                <span className="stat-icon">⏱️</span>
                <span>{Math.floor((Date.now() - sessionStats.startTime) / 60000)} dakika</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🎯</span>
                <span>{practiceWords.length} kelime</span>
              </div>
            </div>
            <button 
              className="restart-btn"
              onClick={() => {
                setCompletedSections([]);
                setCurrentSection(0);
                setSessionStats({
                  completed: 0,
                  total: practiceWords.length,
                  startTime: Date.now()
                });
                saveProgress([], 0);
              }}
            >
              🔄 Yeniden Başla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
