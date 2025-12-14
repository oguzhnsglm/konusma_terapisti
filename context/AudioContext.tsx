import React, { createContext, useContext, useMemo, useState } from 'react';

type AudioContextValue = {
  isMusicEnabled: boolean;
  isSfxEnabled: boolean;
  toggleMusicEnabled: (enabled: boolean) => void;
  toggleSfxEnabled: (enabled: boolean) => void;
  playSfx: (key: string) => void;
  playMusic: () => void;
  pauseMusic: () => void;
};

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);

  const value = useMemo<AudioContextValue>(
    () => ({
      isMusicEnabled,
      isSfxEnabled,
      toggleMusicEnabled: setIsMusicEnabled,
      toggleSfxEnabled: setIsSfxEnabled,
      playSfx: () => {
        // Stub: mobile/web safe no-op
      },
      playMusic: () => {},
      pauseMusic: () => {},
    }),
    [isMusicEnabled, isSfxEnabled],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return ctx;
}
