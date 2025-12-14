import React, { createContext, useContext, useMemo, useState } from 'react';

type MascotContextValue = {
  message: string;
  isVisible: boolean;
  isCelebrating: boolean;
  celebrate: (reason?: string) => void;
};

const praiseMessages: Record<string, string[]> = {
  default: [
    'Bravo!', 'Süper!', 'Harikasın!', 'Mükemmel!', 'Aferin sana!',
    'Çok iyi!', 'Tebrikler!', 'Harika iş!', 'Müthişsin!', 'Kusursuz!'
  ],
  correctAnswer: [
    'Doğru!', 'Bildin!', 'Harika cevap!', 'Süper!', 'Çok doğru!',
    'Tam isabet!', 'Bravo sana!', 'Mükemmel!', 'Kesinlikle!', 'Aynen öyle!'
  ],
  questCompleted: [
    'Görev tamamlandı!', 'Hepsini bitirdin!', 'Müthişsin!', 'Başardın!',
    'İnanılmaz!', 'Süpersin!', 'Tebrikler!', 'Harika gidiyorsun!'
  ],
};

const MascotContext = createContext<MascotContextValue | undefined>(undefined);

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const celebrate = (reason = 'default') => {
    const list = praiseMessages[reason] ?? praiseMessages.default;
    const next = list[Math.floor(Math.random() * list.length)];
    setMessage(next);
    setIsVisible(true);
    setIsCelebrating(true);

    setTimeout(() => setIsVisible(false), 2200);
    setTimeout(() => setIsCelebrating(false), 1800);
  };

  const value = useMemo<MascotContextValue>(
    () => ({
      message,
      isVisible,
      isCelebrating,
      celebrate,
    }),
    [message, isVisible, isCelebrating],
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error('useMascot must be used within MascotProvider');
  }
  return ctx;
}
