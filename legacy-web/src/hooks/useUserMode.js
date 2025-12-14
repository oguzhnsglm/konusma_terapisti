import { useState, useEffect } from 'react';

export const useUserMode = () => {
  const [mode, setMode] = useState('child'); // 'child' or 'parent'
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Load saved mode
    const savedMode = localStorage.getItem('speech_user_mode_v1');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('speech_user_mode_v1', newMode);
  };

  const getPin = () => {
    return localStorage.getItem('speech_parent_pin_v1');
  };

  const savePin = (pin) => {
    localStorage.setItem('speech_parent_pin_v1', pin);
  };

  const verifyPin = (enteredPin) => {
    const savedPin = getPin();
    if (!savedPin) {
      // First time - save the pin
      savePin(enteredPin);
      return true;
    }
    return enteredPin === savedPin;
  };

  const hasPin = () => {
    return !!getPin();
  };

  return {
    mode,
    switchMode,
    verifyPin,
    savePin,
    hasPin,
    isChildMode: mode === 'child',
    isParentMode: mode === 'parent'
  };
};
