import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StorybookPage.css';

// Static story data
const STORIES = [
  {
    id: 'story_1',
    title: 'Küçük Kedi Mavi',
    description: 'Maceracı bir kedinin hikayesi',
    emoji: '🐱',
    pages: [
      'Bir varmış bir yokmuş, Mavi adında küçük bir kedi varmış.',
      'Mavi her gün bahçede oynar, kelebeklerle koşardı.',
      'Bir gün Mavi, büyük bir ağacın arkasında parlak bir şey gördü.',
      'Merak etti ve yaklaştı. Bu parlak şey güzel bir kelebek miydi?',
      'Hayır! Bu, gökkuşağı renklerinde küçük bir taştı. Mavi çok mutlu oldu!'
    ]
  },
  {
    id: 'story_2',
    title: 'Bulut ve Güneş',
    description: 'Gökyüzünde arkadaşlık',
    emoji: '☁️',
    pages: [
      'Gökyüzünde Bulut ve Güneş yan yana yaşarlardı.',
      'Güneş her sabah ışıklarını saçar, dünyayı aydınlatırdı.',
      'Bulut ise yağmur damlalarıyla çiçekleri sulardı.',
      'Bazen Bulut, Güneşin önüne geçerdi. "Pardon!" derdi.',
      'Güneş gülümserdi: "Sorun değil, beraber daha güzeliz!"'
    ]
  },
  {
    id: 'story_3',
    title: 'Renkli Balon',
    description: 'Gökyüzüne yolculuk',
    emoji: '🎈',
    pages: [
      'Küçük bir çocuk parkta kırmızı bir balon buldu.',
      'Balonu havaya bıraktı, balon yükselmeye başladı.',
      'Balon gökyüzünde kuşlarla dans etti.',
      'Bulutların arasından geçti, gökkuşağını gördü.',
      'Sonunda yavaşça yere indi ve başka bir çocuğu mutlu etti!'
    ]
  }
];

const StorybookPage = () => {
  const navigate = useNavigate();
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [showReadFeedback, setShowReadFeedback] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const saved = localStorage.getItem('speech_storybook_progress_v1');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  };

  const saveProgress = (newProgress) => {
    localStorage.setItem('speech_storybook_progress_v1', JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const selectedStory = STORIES.find(s => s.id === selectedStoryId);

  const handleSelectStory = (storyId) => {
    setSelectedStoryId(storyId);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleListen = () => {
    setIsListening(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsListening(false);
    }, 2000);
  };

  const handleMarkAsRead = () => {
    const storyProgress = progress[selectedStoryId] || {};
    const pagesRead = storyProgress.pagesRead || [];
    
    if (!pagesRead.includes(currentPage)) {
      pagesRead.push(currentPage);
      const newProgress = {
        ...progress,
        [selectedStoryId]: {
          pagesRead,
          lastRead: new Date().toISOString()
        }
      };
      saveProgress(newProgress);
      
      setShowReadFeedback(true);
      setTimeout(() => setShowReadFeedback(false), 2000);

      // Optional mascot integration
      try {
        // If useMascot hook exists, try to use it
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('mascotCelebrate', {
            detail: { type: 'default' }
          }));
        }
      } catch (e) {
        // Mascot not available, skip silently
      }
    }
  };

  const getStoryProgress = (storyId) => {
    const storyData = STORIES.find(s => s.id === storyId);
    if (!storyData) return 0;
    
    const storyProgress = progress[storyId] || {};
    const pagesRead = storyProgress.pagesRead || [];
    const totalPages = storyData.pages.length;
    
    return Math.round((pagesRead.length / totalPages) * 100);
  };

  return (
    <div className="storybook-page">
      <div className="storybook-header">
        <button className="back-btn-story" onClick={() => navigate('/')}>
          ← Geri
        </button>
        <h1 className="storybook-title">📚 Sesli Hikaye Kitabı</h1>
      </div>

      <div className="storybook-container">
        {/* Story Selection */}
        <div className="story-list">
          <h2>Hikaye Seç</h2>
          {STORIES.map(story => (
            <div
              key={story.id}
              className={`story-card ${selectedStoryId === story.id ? 'selected' : ''}`}
              onClick={() => handleSelectStory(story.id)}
            >
              <div className="story-emoji">{story.emoji}</div>
              <div className="story-info">
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <div className="story-progress-bar">
                  <div 
                    className="story-progress-fill"
                    style={{ width: `${getStoryProgress(story.id)}%` }}
                  ></div>
                </div>
                <span className="story-progress-text">
                  %{getStoryProgress(story.id)} okundu
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Story Reader */}
        <div className="story-reader">
          {!selectedStory ? (
            <div className="no-story-selected">
              <p className="select-prompt">👈 Bir hikaye seç ve okumaya başla!</p>
            </div>
          ) : (
            <>
              <div className="story-header-info">
                <h2>{selectedStory.emoji} {selectedStory.title}</h2>
                <span className="page-indicator">
                  Sayfa {currentPage + 1} / {selectedStory.pages.length}
                </span>
              </div>

              <div className="story-content">
                <div className="story-text-card">
                  <p className="story-text">{selectedStory.pages[currentPage]}</p>
                </div>

                <div className="story-controls">
                  <button
                    className="story-btn listen-btn"
                    onClick={handleListen}
                    disabled={isListening}
                  >
                    {isListening ? '🔊 Dinleniyor...' : '🔊 Dinle'}
                  </button>
                  <button
                    className="story-btn read-btn"
                    onClick={handleMarkAsRead}
                  >
                    ✓ Ben Okudum
                  </button>
                </div>

                {showReadFeedback && (
                  <div className="read-feedback">
                    Harika, bu sayfayı okudun! 🎉
                  </div>
                )}

                <div className="story-navigation">
                  <button
                    className="nav-btn prev-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                  >
                    ← Önceki Sayfa
                  </button>
                  <button
                    className="nav-btn next-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === selectedStory.pages.length - 1}
                  >
                    Sonraki Sayfa →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorybookPage;
