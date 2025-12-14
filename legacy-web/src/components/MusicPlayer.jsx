import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const {
    isMusicEnabled,
    isPlaying,
    toggleMusic,
    nextTrack,
    prevTrack,
    currentTrack,
    tracks,
    musicVolume,
    setMusicVolume
  } = useAudio();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(musicVolume);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = percent * duration;
    }
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setMusicVolume(percent);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setMusicVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(musicVolume);
      setMusicVolume(0);
      setIsMuted(true);
    }
  };

  if (!isMusicEnabled) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = musicVolume * 100;

  return (
    <div className="music-player">
      {/* Track Info */}
      <div className="track-info">
        <div className="track-album-art">
          🎵
        </div>
        <div className="track-details">
          <h4 className="track-name">{tracks[currentTrack]?.name || 'Müzik'}</h4>
          <p className="track-artist">Konuşma Terapisti</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-btn" onClick={prevTrack} title="Önceki">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button className="control-btn play-pause" onClick={toggleMusic} title={isPlaying ? 'Duraklat' : 'Oynat'}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button className="control-btn" onClick={nextTrack} title="Sonraki">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
            </svg>
          </button>
        </div>

        <div className="progress-bar-wrapper">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar-track" 
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
              <div className="progress-bar-thumb"></div>
            </div>
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="volume-control">
        <button className="volume-btn" onClick={toggleMute}>
          {isMuted || musicVolume === 0 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : musicVolume < 0.5 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
        <div 
          className="volume-slider" 
          ref={volumeRef}
          onClick={handleVolumeClick}
        >
          <div className="volume-fill" style={{ width: `${volumePercent}%` }}>
            <div className="volume-thumb"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
