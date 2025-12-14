import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('audio_music_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isSfxEnabled, setIsSfxEnabled] = useState(() => {
    const saved = localStorage.getItem('audio_sfx_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('audio_music_volume');
    return saved !== null ? parseFloat(saved) : 0.3;
  });

  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('audio_sfx_volume');
    return saved !== null ? parseFloat(saved) : 0.5;
  });

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicRef = useRef(null);
  const sfxRefs = useRef({});

  // Background music tracks (placeholder URLs - replace with actual music)
  const tracks = [
    { name: 'Ana Tema', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4a3f3f7c8f.mp3' },
    { name: 'Oyun Müziği', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { name: 'Rahatlatıcı', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3' }
  ];

  // Sound effects (placeholder URLs)
  const soundEffects = {
    click: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c0be2b8fc8.mp3',
    success: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_d1718ab41b.mp3',
    error: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_f545d3b49f.mp3',
    celebration: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c2a2b00b38.mp3',
    hover: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_e35475e8a6.mp3'
  };

  // Initialize audio elements
  useEffect(() => {
    if (!musicRef.current) {
      musicRef.current = new Audio();
      musicRef.current.loop = false;
      musicRef.current.addEventListener('ended', handleTrackEnd);
    }

    // Preload sound effects
    Object.keys(soundEffects).forEach(key => {
      if (!sfxRefs.current[key]) {
        sfxRefs.current[key] = new Audio(soundEffects[key]);
        sfxRefs.current[key].volume = sfxVolume;
      }
    });

    return () => {
      if (musicRef.current) {
        musicRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('audio_music_enabled', JSON.stringify(isMusicEnabled));
  }, [isMusicEnabled]);

  useEffect(() => {
    localStorage.setItem('audio_sfx_enabled', JSON.stringify(isSfxEnabled));
  }, [isSfxEnabled]);

  useEffect(() => {
    localStorage.setItem('audio_music_volume', musicVolume.toString());
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem('audio_sfx_volume', sfxVolume.toString());
    Object.values(sfxRefs.current).forEach(audio => {
      audio.volume = sfxVolume;
    });
  }, [sfxVolume]);

  const handleTrackEnd = () => {
    if (isMusicEnabled) {
      const nextTrack = (currentTrack + 1) % tracks.length;
      setCurrentTrack(nextTrack);
      playMusic(nextTrack);
    }
  };

  const playMusic = (trackIndex = currentTrack) => {
    if (!isMusicEnabled || !musicRef.current) return;

    musicRef.current.src = tracks[trackIndex].url;
    musicRef.current.volume = musicVolume;
    musicRef.current.play().catch(err => console.log('Audio play failed:', err));
    setIsPlaying(true);
    setCurrentTrack(trackIndex);
  };

  const pauseMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    playMusic(next);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length;
    playMusic(prev);
  };

  const playSfx = (effect) => {
    if (!isSfxEnabled || !sfxRefs.current[effect]) return;

    const audio = sfxRefs.current[effect];
    audio.currentTime = 0;
    audio.volume = sfxVolume;
    audio.play().catch(err => console.log('SFX play failed:', err));
  };

  const toggleMusicEnabled = (enabled) => {
    setIsMusicEnabled(enabled);
    if (!enabled) {
      pauseMusic();
    }
  };

  const toggleSfxEnabled = (enabled) => {
    setIsSfxEnabled(enabled);
  };

  const value = {
    // Music
    isMusicEnabled,
    toggleMusicEnabled,
    musicVolume,
    setMusicVolume,
    isPlaying,
    playMusic,
    pauseMusic,
    toggleMusic,
    nextTrack,
    prevTrack,
    currentTrack,
    tracks,
    
    // Sound effects
    isSfxEnabled,
    toggleSfxEnabled,
    sfxVolume,
    setSfxVolume,
    playSfx
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
