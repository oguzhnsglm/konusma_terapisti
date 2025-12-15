import React, { createContext, useContext, useState } from 'react';

type UserMode = 'child' | 'parent';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UserMode>('child');

  const toggleMode = () => {
    setMode((prev) => (prev === 'child' ? 'parent' : 'child'));
  };

  return (
    <UserModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider');
  }
  return context;
}
