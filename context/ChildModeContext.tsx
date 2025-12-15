import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  isChildModeEnabled,
  setChildModeEnabled,
  verifyPin,
  isPinLocked,
} from '../utils/storage';

interface ChildModeContextType {
  isChildMode: boolean;
  showPinModal: boolean;
  pinModalMode: 'enable' | 'disable';
  isLoading: boolean;
  isPinModalLocked: boolean;
  remainingLockTime: number;
  requestEnableChildMode: () => void;
  requestDisableChildMode: () => void;
  closePinModal: () => void;
  verifyPinAndToggle: (pin: string) => Promise<boolean>;
}

const ChildModeContext = createContext<ChildModeContextType | undefined>(
  undefined
);

export function ChildModeProvider({ children }: { children: React.ReactNode }) {
  const [isChildMode, setIsChildMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'enable' | 'disable'>(
    'enable'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPinModalLocked, setIsPinModalLocked] = useState(false);
  const [remainingLockTime, setRemainingLockTime] = useState(0);

  // Load child mode status on mount
  useEffect(() => {
    const loadChildModeStatus = async () => {
      try {
        const enabled = await isChildModeEnabled();
        const locked = await isPinLocked();
        setIsChildMode(enabled);
        setIsPinModalLocked(locked);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading child mode status:', error);
        setIsLoading(false);
      }
    };

    loadChildModeStatus();
  }, []);

  // Countdown timer for pin lock
  useEffect(() => {
    if (!isPinModalLocked) return;

    const interval = setInterval(async () => {
      const locked = await isPinLocked();
      if (!locked) {
        setIsPinModalLocked(false);
        setRemainingLockTime(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPinModalLocked]);

  const requestEnableChildMode = () => {
    setPinModalMode('enable');
    setShowPinModal(true);
  };

  const requestDisableChildMode = () => {
    setPinModalMode('disable');
    setShowPinModal(true);
  };

  const closePinModal = () => {
    setShowPinModal(false);
  };

  const verifyPinAndToggle = async (pin: string): Promise<boolean> => {
    try {
      const isValid = await verifyPin(pin);

      if (!isValid) {
        const locked = await isPinLocked();
        setIsPinModalLocked(locked);
        return false;
      }

      // PIN doğru, child mode'u toggle et
      const newMode = pinModalMode === 'enable';
      await setChildModeEnabled(newMode);
      setIsChildMode(newMode);
      closePinModal();
      return true;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  return (
    <ChildModeContext.Provider
      value={{
        isChildMode,
        showPinModal,
        pinModalMode,
        isLoading,
        isPinModalLocked,
        remainingLockTime,
        requestEnableChildMode,
        requestDisableChildMode,
        closePinModal,
        verifyPinAndToggle,
      }}
    >
      {children}
    </ChildModeContext.Provider>
  );
}

export function useChildMode() {
  const context = useContext(ChildModeContext);
  if (!context) {
    throw new Error('useChildMode must be used within ChildModeProvider');
  }
  return context;
}
