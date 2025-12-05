import { useState } from 'react';
import { useUserMode } from '../hooks/useUserMode';
import './ModeSwitch.css';

const ModeSwitch = () => {
  const { mode, switchMode, verifyPin, hasPin } = useUserMode();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleToggle = () => {
    if (mode === 'child') {
      // Switching to parent mode - need PIN
      setShowPinModal(true);
      setPinInput('');
      setPinError('');
    } else {
      // Switching back to child mode - no PIN needed
      switchMode('child');
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    
    if (pinInput.length !== 4) {
      setPinError('PIN 4 haneli olmalı');
      return;
    }

    if (verifyPin(pinInput)) {
      switchMode('parent');
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Yanlış PIN!');
      setPinInput('');
    }
  };

  return (
    <>
      <div className="mode-switch-container">
        <div className="mode-label">
          {mode === 'child' ? '👶 Çocuk' : '👨‍👩‍👧 Veli'}
        </div>
        <label className="mode-switch">
          <input
            type="checkbox"
            checked={mode === 'parent'}
            onChange={handleToggle}
          />
          <span className="mode-slider"></span>
        </label>
        {mode === 'parent' && <span className="lock-icon">🔒</span>}
      </div>

      {showPinModal && (
        <div className="pin-modal-overlay" onClick={() => setShowPinModal(false)}>
          <div className="pin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {hasPin() ? '🔒 PIN Girin' : '🔐 PIN Oluşturun'}
            </h3>
            <p>
              {hasPin() 
                ? 'Veli moduna geçmek için PIN\'inizi girin' 
                : 'İlk kez veli moduna geçiyorsunuz. 4 haneli bir PIN belirleyin'}
            </p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                inputMode="numeric"
                maxLength="4"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''));
                  setPinError('');
                }}
                placeholder="••••"
                className="pin-input"
                autoFocus
              />
              {pinError && <div className="pin-error">{pinError}</div>}
              <div className="pin-buttons">
                <button type="button" onClick={() => setShowPinModal(false)} className="pin-cancel">
                  İptal
                </button>
                <button type="submit" className="pin-submit">
                  {hasPin() ? 'Giriş' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeSwitch;
