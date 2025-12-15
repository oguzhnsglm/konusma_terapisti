/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

type GameState = 'IDLE' | 'RUNNING' | 'BOUNCING';
type FeedbackState = 'idle' | 'good' | 'bad';
type MicStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error';

// Minimal Web Speech typings (RN does not ship DOM lib)
interface WebSpeechRecognitionAlternative {
  transcript: string;
}
interface WebSpeechRecognitionResultItem {
  0: WebSpeechRecognitionAlternative;
}
interface WebSpeechRecognitionEvent {
  results: WebSpeechRecognitionResultItem[];
}
interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult?: (event: WebSpeechRecognitionEvent) => void;
  onerror?: (event: { error: string }) => void;
  onstart?: () => void;
  onend?: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognition;
type VoiceModule = typeof import('@react-native-voice/voice').default;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    isSecureContext?: boolean;
  }
}

const words = [
  'ELMA',
  'ARMUT',
  'KAPI',
  'MASA',
  'KALEM',
  'KİTAP',
  'ARABA',
  'GÜNEŞ',
  'BALIK',
  'EKMEK',
  'SU',
  'ÇAY',
  'OKUL',
];

// Lazy native voice import to avoid bundling on web.
let Voice: VoiceModule | null = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (err) {
    Voice = null;
  }
}

export default function SpeakToPassRunner() {
  const isWeb = Platform.OS === 'web';

  // Canvas refs (web)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // Game refs
  const gameStateRef = useRef<GameState>('IDLE');
  const wallDistanceRef = useRef<number>(100);
  const wallWordRef = useRef<string>(words[0]);
  const gateOpenYRef = useRef<number>(0);
  const isGateOpeningRef = useRef<boolean>(false);
  const bounceTimerRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);

  // State
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [micLevel, setMicLevel] = useState(10);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [micStatus, setMicStatus] = useState<MicStatus>('idle');
  const [errorText, setErrorText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentWord, setCurrentWord] = useState(words[0]);

  const cleanupFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctxRef.current = canvas.getContext('2d');
  }, []);

  const resetRound = useCallback(() => {
    wallDistanceRef.current = 100;
    isGateOpeningRef.current = false;
    gateOpenYRef.current = 0;
    const next = words[Math.floor(Math.random() * words.length)];
    wallWordRef.current = next;
    setCurrentWord(next);
    setFeedbackText('');
    setShowFeedback(false);
    setFeedbackState('idle');
  }, []);

  const startBounce = useCallback(() => {
    gameStateRef.current = 'BOUNCING';
    bounceTimerRef.current = 120; // ~2s @60fps
  }, []);

  const updateGameLogic = useCallback(() => {
    if (!ctxRef.current) return;
    if (gameStateRef.current === 'RUNNING') {
      wallDistanceRef.current -= 0.6;

      if (isGateOpeningRef.current) {
        gateOpenYRef.current += 5;
      }

      if (wallDistanceRef.current <= 15) {
        if (isGateOpeningRef.current) {
          if (wallDistanceRef.current <= 0) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            resetRound();
          }
        } else if (wallDistanceRef.current <= 10) {
          startBounce();
        }
      }
    } else if (gameStateRef.current === 'BOUNCING') {
      wallDistanceRef.current += (60 - wallDistanceRef.current) * 0.1;
      bounceTimerRef.current -= 1;
      if (bounceTimerRef.current <= 0) {
        gameStateRef.current = 'RUNNING';
      }
    }
  }, [resetRound, startBounce]);

  const drawScene = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const vanishX = canvas.width * 0.6;
    const vanishY = canvas.height * 0.3;
    const roadWFar = canvas.width * 0.1;
    const roadWNear = canvas.width * 0.8;
    const yFar = vanishY;
    const yNear = canvas.height;

    const xFarL = vanishX - roadWFar / 2;
    const xFarR = vanishX + roadWFar / 2;
    const xNearL = canvas.width / 2 - roadWNear / 2 - 100;
    const xNearR = canvas.width / 2 + roadWNear / 2 - 100;

    // Road
    ctx.fillStyle = '#90A4AE';
    ctx.beginPath();
    ctx.moveTo(xNearL, yNear);
    ctx.lineTo(xFarL, yFar);
    ctx.lineTo(xFarR, yFar);
    ctx.lineTo(xNearR, yNear);
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(xNearL, yNear);
    ctx.lineTo(xFarL, yFar);
    ctx.moveTo(xNearR, yNear);
    ctx.lineTo(xFarR, yFar);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((xNearL + xNearR) / 2, yNear);
    ctx.lineTo(vanishX, vanishY);
    ctx.setLineDash([30, 40]);
    const dashOffset = (100 - wallDistanceRef.current) * 10;
    ctx.lineDashOffset = -dashOffset;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.stroke();
    ctx.setLineDash([]);

    const progress = 1 - wallDistanceRef.current / 100;
    if (progress < 1.1) {
      const currentY = yFar + (yNear - yFar) * progress;
      const currentScale = 0.2 + progress * 0.8;
      const wallW = 300 * 2 * currentScale;
      const wallH = 400 * 2 * currentScale;
      const roadCenterX =
        xFarL +
        (xNearL - xFarL) * progress +
        (roadWFar + (roadWNear - roadWFar) * progress) / 2;
      const wallX = roadCenterX - wallW / 2;
      const wallY = currentY - wallH + 50 * currentScale;

      ctx.beginPath();
      ctx.moveTo(wallX + wallW, wallY);
      ctx.lineTo(wallX + wallW + 20 * currentScale, wallY - 20 * currentScale);
      ctx.lineTo(
        wallX + wallW + 20 * currentScale,
        wallY + wallH - 20 * currentScale,
      );
      ctx.lineTo(wallX + wallW, wallY + wallH);
      ctx.fillStyle = '#8D6E63';
      ctx.fill();

      ctx.fillStyle = '#EFEBE9';
      ctx.fillRect(wallX, wallY, wallW, wallH);

      ctx.strokeStyle = '#D7CCC8';
      ctx.lineWidth = 4 * currentScale;
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        ctx.moveTo(wallX + (wallW / 5) * i, wallY);
        ctx.lineTo(wallX + (wallW / 5) * i, wallY + wallH);
      }
      ctx.stroke();

      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 5 * currentScale;
      ctx.strokeRect(wallX, wallY, wallW, wallH);

      const gateW = wallW * 0.6;
      const gateH = wallH * 0.5;
      const gateX = wallX + (wallW - gateW) / 2;
      const gateY = wallY + wallH - gateH;

      ctx.fillStyle = '#455A64';
      ctx.fillRect(gateX, gateY, gateW, gateH);

      const slideY = gateOpenYRef.current * currentScale * 3;
      ctx.fillStyle = '#A1887F';
      if (gateH - slideY > 0) {
        ctx.fillRect(gateX, gateY - slideY, gateW, gateH);
        ctx.strokeRect(gateX, gateY - slideY, gateW, gateH);

        const fontSize = 40 * currentScale;
        ctx.font = `bold ${fontSize}px 'Fredoka One'`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3 * currentScale;
        const textY = gateY - slideY + gateH / 2;
        ctx.strokeText(wallWordRef.current, gateX + gateW / 2, textY);
        ctx.fillText(wallWordRef.current, gateX + gateW / 2, textY);
      }
    }

    const ballX = canvas.width / 2 - 50;
    const ballY = canvas.height - 100;
    const ballRadius = 30;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(
      ballX,
      ballY + ballRadius - 5,
      ballRadius,
      ballRadius / 3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    const grad = ctx.createRadialGradient(
      ballX - 10,
      ballY - 10,
      5,
      ballX,
      ballY,
      ballRadius,
    );
    grad.addColorStop(0, '#FFCC80');
    grad.addColorStop(1, '#EF6C00');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(ballX - 10, ballY - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ballX + 10, ballY - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    if (gameStateRef.current === 'BOUNCING') {
      ctx.arc(ballX, ballY + 15, 8, Math.PI, 0);
    } else if (isGateOpeningRef.current) {
      ctx.arc(ballX, ballY + 10, 8, 0, Math.PI * 2);
    } else {
      ctx.ellipse(ballX, ballY + 10, 6, 3, 0, 0, Math.PI * 2);
    }
    ctx.fill();
  }, []);

  const loop = useCallback(() => {
    updateGameLogic();
    drawScene();
    animationRef.current = requestAnimationFrame(loop);
  }, [drawScene, updateGameLogic]);

  const normalizeText = (text: string) =>
    text.trim().toUpperCase().replace(/İ/g, 'I').replace(/[^A-ZÇĞÖŞÜ ]/g, '');

  const checkWordWeb = useCallback(
    (spoken: string) => {
      const normalized = normalizeText(spoken);
      if (!normalized) return;
      setFeedbackText(normalized);
      setShowFeedback(true);
      const target = normalizeText(wallWordRef.current);

      if (gameStateRef.current === 'RUNNING' && !isGateOpeningRef.current) {
        if (normalized.includes(target)) {
          isGateOpeningRef.current = true;
          setFeedbackState('good');
          cleanupFeedbackTimeout();
          feedbackTimeoutRef.current = window.setTimeout(() => {
            setShowFeedback(false);
          }, 1000);
        } else {
          setFeedbackState('bad');
        }
      }
    },
    [cleanupFeedbackTimeout],
  );

  const checkWordMobile = useCallback(
    (spoken: string) => {
      const normalized = normalizeText(spoken);
      if (!normalized) return;
      setFeedbackText(normalized);
      setShowFeedback(true);
      const target = normalizeText(wallWordRef.current);
      if (normalized.includes(target)) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setFeedbackState('good');
        resetRound();
        cleanupFeedbackTimeout();
        feedbackTimeoutRef.current = window.setTimeout(() => {
          setShowFeedback(false);
        }, 1000);
      } else {
        setFeedbackState('bad');
      }
    },
    [cleanupFeedbackTimeout, resetRound],
  );

  const ensureSecureContext = () => {
    if (typeof window === 'undefined') return true;
    const host = window.location.hostname;
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    return Boolean(window.isSecureContext) || isLocalhost;
  };

  const initSpeechWeb = useCallback(() => {
    setErrorText('');
    const SpeechRecognition =
      (window.SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor })
          .webkitSpeechRecognition) as SpeechRecognitionCtor | undefined;

    if (!SpeechRecognition) {
      setMicStatus('unavailable');
      setErrorText(
        'Tarayıcınızda konuşma tanıma desteği yok. Lütfen Chrome/Edge (desktop) ile deneyin.',
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: WebSpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const text = result?.[0]?.transcript ?? '';
      setMicLevel(Math.random() * 50 + 50);
      window.setTimeout(() => setMicLevel(10), 200);
      checkWordWeb(text);
    };

    recognition.onerror = (err) => {
      if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
        setMicStatus('denied');
        setErrorText('Mikrofon izni reddedildi. Lütfen izin verip tekrar dene.');
      } else if (err.error === 'network') {
        setMicStatus('error');
        setErrorText('Tarayıcı konuşma servisine ulaşamadı (network hatası).');
      } else {
        setMicStatus('error');
        setErrorText('Mikrofon algılanamadı veya erişim reddedildi.');
      }
    };

    recognition.onstart = () => {
      setMicStatus('granted');
    };

    recognition.onend = () => {
      if (gameStateRef.current !== 'IDLE') {
        try {
          recognition.start();
        } catch (err) {
          console.warn('Speech recognition restart failed', err);
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setMicStatus('error');
      setErrorText('Konuşma tanıma başlatılamadı.');
    }
  }, [checkWordWeb]);

  const startMobileListening = useCallback(async () => {
    if (!Voice) {
      setErrorText('Ses tanıma modülü yüklenemedi.');
      return;
    }
    setErrorText('');
    try {
      setMicStatus('requesting');
      await Voice.start('tr-TR');
      setIsListening(true);
    } catch (err) {
      setMicStatus('error');
      setErrorText('Dinleme başlatılamadı.');
      setIsListening(false);
    }
  }, []);

  const stopMobileListening = useCallback(async () => {
    if (!Voice) return;
    try {
      await Voice.stop();
    } catch (err) {
      // ignore
    }
    setIsListening(false);
  }, []);

  const setupVoiceHandlers = useCallback(() => {
    if (!Voice) return;
    Voice.onSpeechResults = (e) => {
      const spoken = (e.value?.[0] || '').trim();
      setMicLevel(Math.random() * 50 + 50);
      setTimeout(() => setMicLevel(10), 200);
      checkWordMobile(spoken);
    };
    Voice.onSpeechError = (e) => {
      setErrorText(e.error?.message || 'Dinleme hatası.');
      setMicStatus('error');
      setIsListening(false);
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };
    Voice.onSpeechStart = () => {
      setMicStatus('granted');
      setIsListening(true);
    };
  }, [checkWordMobile]);

  const ensureMicPermission = useCallback(async () => {
    if (!isWeb) {
      if (!Voice) {
        setMicStatus('unavailable');
        setErrorText('Ses tanıma modülü bulunamadı.');
        return false;
      }
      if (typeof Voice.requestPermissions === 'function') {
        try {
          await Voice.requestPermissions();
        } catch {
          // ignore
        }
      }
      setMicStatus('granted');
      return true;
    }

    if (!ensureSecureContext()) {
      setMicStatus('unavailable');
      setErrorText('Mikrofon için https veya localhost bağlantısı gerekir.');
      return false;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unavailable');
      setErrorText('Mikrofon erişimi desteklenmiyor.');
      return false;
    }
    try {
      setMicStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicStatus('granted');
      return true;
    } catch {
      setMicStatus('denied');
      setErrorText('Mikrofon izni verilmedi. Lütfen izin verip tekrar deneyin.');
      return false;
    }
  }, [isWeb]);

  const startGame = useCallback(() => {
    setIsStarted(true);
    scoreRef.current = 0;
    setScore(0);
    gameStateRef.current = 'RUNNING';
    resetRound();
    ensureMicPermission().then((ok) => {
      if (!ok) return;
      if (isWeb) {
        initSpeechWeb();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        loop();
      } else {
        startMobileListening();
      }
    });
    if (isWeb) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      loop();
    }
  }, [ensureMicPermission, initSpeechWeb, isWeb, loop, resetRound, startMobileListening]);

  // Web lifecycle
  useEffect(() => {
    if (!isWeb) return undefined;
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);

    const fontId =
      'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap';
    if (!document.querySelector(`link[href="${fontId}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontId;
      document.head.appendChild(link);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      cleanupFeedbackTimeout();
      recognitionRef.current?.stop();
    };
  }, [cleanupFeedbackTimeout, isWeb, resizeCanvas]);

  // Mobile lifecycle
  useEffect(() => {
    if (isWeb) return;
    setupVoiceHandlers();
    return () => {
      if (!Voice) return;
      Voice.destroy().then(() => Voice?.removeAllListeners());
    };
  }, [isWeb, setupVoiceHandlers]);

  const feedbackColor =
    feedbackState === 'good'
      ? 'green'
      : feedbackState === 'bad'
        ? 'red'
        : '#333';
  const feedbackBorder =
    feedbackState === 'good'
      ? 'green'
      : feedbackState === 'bad'
        ? 'red'
        : '#FFD180';

  // Mobile UI (no canvas)
  if (!isWeb) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '#e0e0e0',
          padding: 16,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#E65100' }}>
            Kelime Ustası (Mobil)
          </Text>
          <Text style={{ marginTop: 8, color: '#555' }}>
            Kelimeyi söyle, doğruysa yeni kelime gelir ve puan alırsın.
          </Text>
          <Text style={{ marginTop: 12, fontSize: 18, color: '#333' }}>
            Hedef Kelime: <Text style={{ fontWeight: '700' }}>{currentWord}</Text>
          </Text>
          <Text style={{ marginTop: 8, fontSize: 16, color: '#333' }}>
            Skor: <Text style={{ fontWeight: '700' }}>{score}</Text>
          </Text>
          <Text style={{ marginTop: 8, fontSize: 16, color: '#333' }}>
            Duyulan: <Text style={{ fontWeight: '700' }}>{feedbackText || '-'}</Text>
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              color:
                feedbackState === 'good'
                  ? 'green'
                  : feedbackState === 'bad'
                    ? 'red'
                    : '#666',
            }}
          >
            {feedbackState === 'good'
              ? 'Doğru!'
              : feedbackState === 'bad'
                ? 'Yanlış, tekrar dene.'
                : micStatus === 'requesting'
                  ? 'Mikrofon izni isteniyor...'
                  : micStatus === 'granted'
                    ? isListening
                      ? 'Dinleniyor...'
                      : 'Dinlemeye hazır.'
                    : micStatus === 'denied'
                      ? 'Mikrofon izni gerekiyor.'
                      : ''}
          </Text>

          {errorText ? (
            <Text style={{ marginTop: 8, color: '#c62828', fontWeight: '600' }}>
              {errorText}
            </Text>
          ) : null}

          <Pressable
            onPress={startGame}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: '#FF6F00',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
              {isListening ? 'Dinleniyor...' : isStarted ? 'Yeniden Başlat' : 'Başla'}
            </Text>
          </Pressable>

          {isListening ? (
            <Pressable
              onPress={stopMobileListening}
              style={{
                marginTop: 10,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: '#455A64',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Dinlemeyi Durdur
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  // Web UI with canvas
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 30% 30%, #ffffff 0%, #cfd8dc 100%)',
          filter: 'blur(5px)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            height: 300,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 10,
            border: '2px solid rgba(255,255,255,0.8)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${micLevel}%`,
              background: 'linear-gradient(to top, #4CAF50, #8BC34A)',
              position: 'absolute',
              bottom: 0,
              transition: 'height 0.1s',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 40,
            fontSize: '3rem',
            color: '#333',
            textShadow: '2px 2px 0px white',
          }}
        >
          {score}
        </div>

        {errorText ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 30,
              transform: 'translateX(-50%)',
              background: '#ffe0b2',
              color: '#bf360c',
              padding: '10px 18px',
              borderRadius: 14,
              border: '2px solid #ff9800',
              fontSize: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {errorText}
          </div>
        ) : null}

        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2rem',
            color: feedbackColor,
            background: 'white',
            padding: '10px 30px',
            borderRadius: 20,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: showFeedback ? 'block' : 'none',
            zIndex: 15,
            border: `3px solid ${feedbackBorder}`,
            pointerEvents: 'none',
          }}
        >
          {feedbackText || '...'}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 5,
          width: '100%',
          height: '100%',
        }}
      />

      {!isStarted && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'all',
          }}
        >
          <h1
            style={{
              fontSize: '4rem',
              margin: 0,
              color: '#E65100',
              textShadow: '2px 2px 0 #FFD180',
            }}
          >
            KELİME USTASI
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              color: '#555',
              textAlign: 'center',
              maxWidth: 600,
              marginTop: 10,
              marginBottom: 6,
            }}
          >
            Kapıdaki kelimeyi söyle!
          </p>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#777',
              textAlign: 'center',
              marginTop: 0,
            }}
          >
            Bilemezsen top geri seker ve tekrar denersin.
          </p>
          <button
            type="button"
            onClick={startGame}
            style={{
              padding: '15px 50px',
              fontSize: '2rem',
              fontFamily: "'Fredoka One', cursive",
              background: '#FF6F00',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              cursor: 'pointer',
              boxShadow: '0 5px 0 #E65100',
              transition: '0.1s',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(4px)';
              e.currentTarget.style.boxShadow = '0 1px 0 #E65100';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 5px 0 #E65100';
            }}
          >
            BAŞLA
          </button>
          <p
            style={{
              fontSize: 14,
              color: '#666',
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            {micStatus === 'denied'
              ? 'Mikrofon izni gerekiyor.'
              : 'Chrome / Edge (desktop) ve mikrofon izni gerekir.'}
          </p>
        </div>
      )}
    </div>
  );
}
