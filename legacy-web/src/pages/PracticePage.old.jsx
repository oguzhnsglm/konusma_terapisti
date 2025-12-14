import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyQuests } from '../hooks/useDailyQuests';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import './PracticePage.css';

const PracticePage = () => {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [todayPractice, setTodayPractice] = useState({ words: 0, minutes: 0, letterCounts: {} });
  const { checkQuestProgress } = useDailyQuests();
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isRecording, audioURL, startRecording, stopRecording, clearRecording } = useAudioRecorder();

  const letters = ['R', 'S', 'K', 'T', 'L'];
  
  const words = {
    R: ['Araba', 'Tarak', 'Kırmızı', 'Portakal', 'Kartal'],
    S: ['Simit', 'Masa', 'Susam', 'Sosis', 'Asal'],
    K: ['Kedi', 'Kale', 'Kalem', 'Koltuk', 'Karpuz'],
    T: ['Top', 'Tablo', 'Tatlı', 'Tavan', 'Tablet'],
    L: ['Lale', 'Limon', 'Lamba', 'Halı', 'Elma'],
  };

  useEffect(() => {
    loadTodayProgress();
  }, []);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const loadTodayProgress = () => {
    const today = getTodayString();
    const practiceKey = 'speech_practice_today_v1';
    const stored = localStorage.getItem(practiceKey);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setTodayPractice(parsed.data);
      } else {
        // New day, reset
        const newData = { words: 0, minutes: 0, letterCounts: {} };
        setTodayPractice(newData);
        localStorage.setItem(practiceKey, JSON.stringify({ date: today, data: newData }));
      }
    }
  };

  const saveTodayProgress = (newData) => {
    const today = getTodayString();
    const practiceKey = 'speech_practice_today_v1';
    localStorage.setItem(practiceKey, JSON.stringify({ date: today, data: newData }));
    setTodayPractice(newData);
  };

  const handleWordPractice = (word) => {
    const newData = {
      words: todayPractice.words + 1,
      minutes: todayPractice.minutes + 1,
      letterCounts: {
        ...todayPractice.letterCounts,
        [selectedLetter]: (todayPractice.letterCounts[selectedLetter] || 0) + 1
      }
    };
    
    saveTodayProgress(newData);

    // Update main progress logs
    updateProgressLogs(1, 1);
    
    // Check quest progress
    checkQuestProgress('words', newData.words);
    checkQuestProgress('minutes', newData.minutes);
  };

  const updateProgressLogs = (minutes, words) => {
    const today = getTodayString();
    const logsKey = 'konusma_ilerleme_logs';
    const stored = localStorage.getItem(logsKey);
    const logs = stored ? JSON.parse(stored) : [];
    
    const todayLogIndex = logs.findIndex(log => log.date === today);
    
    if (todayLogIndex >= 0) {
      logs[todayLogIndex].minutes += minutes;
      logs[todayLogIndex].words += words;
      logs[todayLogIndex].sessions = Math.max(logs[todayLogIndex].sessions, 1);
    } else {
      logs.push({
        date: today,
        minutes,
        words,
        sessions: 1
      });
    }
    
    localStorage.setItem(logsKey, JSON.stringify(logs));
  };

  const handleStartListening = () => {
    resetTranscript();
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
  };

  const handleMicToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearRecording();
      startRecording();
    }
  };

  return (
    <div className="practice-container">
      <div className="practice-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          🏠 Ana Menü
        </button>

        <h1 className="practice-title">🗣️ Konuşma Pratiği</h1>
        <p className="practice-subtitle">Harf seç ve kelimeleri tekrar et!</p>

        {/* Today's Stats */}
        <div className="practice-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{todayPractice.words}</div>
            <div className="stat-label">Bugün Tekrar Edilen</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{todayPractice.minutes}</div>
            <div className="stat-label">Pratik Dakikası</div>
          </div>
          {selectedLetter && (
            <div className="stat-card highlight">
              <div className="stat-icon">{selectedLetter}</div>
              <div className="stat-value">{todayPractice.letterCounts[selectedLetter] || 0}</div>
              <div className="stat-label">{selectedLetter} Harfi</div>
            </div>
          )}
        </div>

        {/* Letter Selection */}
        <div className="letter-selection">
          <h2 className="section-title">🔤 Harf Seç</h2>
          <div className="letter-grid">
            {letters.map(letter => (
              <button
                key={letter}
                className={`letter-btn ${selectedLetter === letter ? 'selected' : ''}`}
                onClick={() => setSelectedLetter(letter)}
              >
                <span className="letter-text">{letter}</span>
                <span className="letter-count">
                  {todayPractice.letterCounts[letter] || 0} tekrar
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Word List */}
        {selectedLetter && (
          <div className="word-practice-section">
            <h2 className="section-title">
              📚 {selectedLetter} Harfi ile Kelimeler
            </h2>
            <p className="section-subtitle">
              Her kelimeyi yüksek sesle söyle ve "Tekrar Ettim" butonuna bas
            </p>
            
            <div className="word-cards">
              {words[selectedLetter].map((word, index) => (
                <div key={index} className="word-card">
                  <div className="word-display">
                    <span className="word-icon">🎤</span>
                    <span className="word-text">{word}</span>
                  </div>
                  <button 
                    className="word-practice-btn"
                    onClick={() => handleWordPractice(word)}
                  >
                    ✅ Tekrar Ettim
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Microphone Feature */}
        <div className="mic-feature">
          <h2 className="section-title">🎙️ Sesli Pratik</h2>
          <p className="section-subtitle">
            Mikrofon ile pratik yap, sesini kaydedebilirsin!
          </p>
          
          {!isSupported && (
            <div className="warning-message">
              ⚠️ Tarayıcınız ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanın.
            </div>
          )}
          
          <div className="mic-controls">
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={!isSupported}
            >
              <span className="mic-icon">{isListening ? '🎤' : '🎤'}</span>
              <span>{isListening ? 'Dinlemeyi Durdur' : 'Mikrofonu Aç'}</span>
            </button>
            
            <button 
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleMicToggle}
            >
              <span className="mic-icon">{isRecording ? '⏹️' : '🎙️'}</span>
              <span>{isRecording ? 'Kaydı Durdur' : 'Ses Kaydı Başlat'}</span>
            </button>
          </div>

          {isListening && (
            <div className="listening-indicator">
              <span className="pulse-icon">🎤</span>
              <span className="listening-text">Dinliyorum...</span>
            </div>
          )}

          {transcript && (
            <div className="transcript-box">
              <h3 className="transcript-title">📝 Söyledikleriniz:</h3>
              <p className="transcript-text">{transcript}</p>
              <button className="clear-transcript-btn" onClick={resetTranscript}>
                🗑️ Temizle
              </button>
            </div>
          )}

          {audioURL && (
            <div className="audio-playback">
              <h3 className="audio-title">🎧 Kaydınızı Dinleyin:</h3>
              <audio controls src={audioURL} className="audio-player" />
              <button className="clear-audio-btn" onClick={clearRecording}>
                🗑️ Kaydı Sil
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="practice-tips">
          <h3 className="tips-title">💡 İpuçları</h3>
          <ul className="tips-list">
            <li>Her kelimeyi en az 3 kez yüksek sesle söyle</li>
            <li>Dudak hareketlerine dikkat et</li>
            <li>Yavaş ve net konuşmaya çalış</li>
            <li>Her gün en az 10 dakika pratik yap</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
