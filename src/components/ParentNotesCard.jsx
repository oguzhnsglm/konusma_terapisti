import { useState, useEffect } from 'react';
import './ParentNotesCard.css';

const NOTES_KEY = 'speech_parent_notes_v1';

const ParentNotesCard = () => {
  const [notes, setNotes] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    // Load notes from localStorage
    const storedNotes = localStorage.getItem(NOTES_KEY);
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(NOTES_KEY, notes);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="parent-notes-card">
      <h2 className="notes-title">📝 Veli / Terapist Notları</h2>
      <p className="notes-subtitle">
        Çocuğunuzun ilerlemesi hakkında notlar alın
      </p>
      
      {showSaved && (
        <div className="notes-saved-message">
          ✅ Notlarınız kaydedildi!
        </div>
      )}
      
      <textarea
        className="notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Örneğin:&#10;- Bugün 'R' harfinde ilerleme var&#10;- Araba kelimesini daha net söylüyor&#10;- Oyunlara daha fazla odaklanıyor"
        rows="8"
      />
      
      <button 
        className="notes-save-btn"
        onClick={handleSave}
      >
        💾 Kaydet
      </button>
      
      <p className="notes-hint">
        💡 İpucu: Bu notlar sadece sizin cihazınızda saklanır
      </p>
    </div>
  );
};

export default ParentNotesCard;
