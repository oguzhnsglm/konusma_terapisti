import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './SesCarkiPage.css';

const SesCarkiPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [rotation, setRotation] = useState(0);

  const texts = {
    tr: {
      title: 'Ses Çarkı (Spin Wheel Challenge)',
      description: 'Çarkı çevir, gelen harf veya görev için ses çalış!',
      spinButton: '🎡 Çarkı Çevir',
      spinning: 'Çark Dönüyor...',
      back: '← Ana Sayfa',
      taskPrefix: 'Görev:',
    },
    en: {
      title: 'Sound Wheel (Spin Wheel Challenge)',
      description: 'Spin the wheel, practice the sound for the letter or task!',
      spinButton: '🎡 Spin the Wheel',
      spinning: 'Spinning...',
      back: '← Home',
      taskPrefix: 'Task:',
    },
  };

  const t = texts[language] || texts.tr;

  const tasks = [
    { letter: 'R', task: 'R sesiyle başlayan 3 kelime söyle!' },
    { letter: 'S', task: 'S sesiyle başlayan 3 kelime söyle!' },
    { letter: 'K', task: 'K sesiyle başlayan 3 kelime söyle!' },
    { letter: 'T', task: 'T sesiyle başlayan 3 kelime söyle!' },
    { letter: 'M', task: 'M sesiyle başlayan 3 kelime söyle!' },
    { letter: 'L', task: 'L sesiyle başlayan 3 kelime söyle!' },
    { letter: 'N', task: 'N sesiyle başlayan 3 kelime söyle!' },
    { letter: 'D', task: 'D sesiyle başlayan 3 kelime söyle!' },
  ];

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setCurrentTask(null);

    // Random rotation between 3-5 full spins plus random offset
    const extraRotation = 360 * (3 + Math.floor(Math.random() * 3));
    const randomOffset = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraRotation + randomOffset;
    
    setRotation(newRotation);

    setTimeout(() => {
      const selectedIndex = Math.floor(Math.random() * tasks.length);
      setCurrentTask(tasks[selectedIndex]);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="ses-carki-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        {t.back}
      </button>

      <div className="game-container">
        <h1 className="game-title">{t.title}</h1>
        <p className="game-description">{t.description}</p>

        {/* Wheel Container */}
        <div className="wheel-container">
          <div className="wheel-pointer">▼</div>
          <div 
            className={`wheel ${spinning ? 'spinning' : ''}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {tasks.map((task, index) => {
              const angle = (360 / tasks.length) * index;
              return (
                <div
                  key={index}
                  className="wheel-segment"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span className="segment-letter">{task.letter}</span>
                </div>
              );
            })}
            <div className="wheel-center">
              <span>🎡</span>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button 
          className={`spin-btn ${spinning ? 'disabled' : ''}`}
          onClick={handleSpin}
          disabled={spinning}
        >
          {spinning ? t.spinning : t.spinButton}
        </button>

        {/* Task Display */}
        {currentTask && !spinning && (
          <div className="task-display">
            <div className="task-letter">{currentTask.letter}</div>
            <div className="task-text">
              <span className="task-prefix">{t.taskPrefix}</span>
              <p>{currentTask.task}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SesCarkiPage;
