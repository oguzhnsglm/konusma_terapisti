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
  'KITAP',
  'ARABA',
  'GÜNEŞ',
  'BALIK',
  'EKMEK',
  'SU',
  'ÇAY',
  'OKUL',
];

const gateColors = ['#5aa7ff', '#ff6f91', '#9c6bff', '#ff8bd1', '#64f5c4'];

const withAlpha = (hex: string, alpha: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

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
  const starsRef = useRef<{ x: number; y: number; r: number; o: number }[]>([]);
  const usedWordsRef = useRef<string[]>([]);
  const hopTimerRef = useRef<number>(0);
  const gateColorIndexRef = useRef<number>(-1);
  const gateColorRef = useRef<string>(gateColors[0]);
  const autoStartRef = useRef<boolean>(false);
  const passBoostRef = useRef<boolean>(false);

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
  const [isStarted, setIsStarted] = useState(true);
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
    // regen stars for current viewport
    starsRef.current = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.5 + 0.25,
    }));
    ctxRef.current = canvas.getContext('2d');
  }, []);

  const resetRound = useCallback(() => {
    wallDistanceRef.current = 100;
    isGateOpeningRef.current = false;
    passBoostRef.current = false;
    gateOpenYRef.current = 0;
    hopTimerRef.current = 0;
    gateColorIndexRef.current =
      (gateColorIndexRef.current + 1) % gateColors.length;
    gateColorRef.current = gateColors[gateColorIndexRef.current];
    if (usedWordsRef.current.length >= words.length) {
      usedWordsRef.current = [];
    }
    const available = words.filter((w) => !usedWordsRef.current.includes(w));
    const next =
      available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : words[Math.floor(Math.random() * words.length)];
    usedWordsRef.current.push(next);
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
      const approachSpeed = passBoostRef.current ? 0.6 : 0.35;
      wallDistanceRef.current -= approachSpeed;

      if (isGateOpeningRef.current) {
        gateOpenYRef.current = Math.min(gateOpenYRef.current + 10, 180);
      }

      if (hopTimerRef.current > 0) {
        hopTimerRef.current -= 1;
      }

      if (wallDistanceRef.current <= 20) {
        if (isGateOpeningRef.current) {
          if (wallDistanceRef.current <= 0) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            resetRound();
          }
        } else if (wallDistanceRef.current <= 14) {
          startBounce();
        }
      }
    } else if (gameStateRef.current === 'BOUNCING') {
      wallDistanceRef.current += (65 - wallDistanceRef.current) * 0.12;
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
    // Space backdrop
    const bgGrad = ctx.createRadialGradient(
      canvas.width * 0.4,
      canvas.height * 0.35,
      canvas.width * 0.1,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.7,
    );
    bgGrad.addColorStop(0, '#0c1a3a');
    bgGrad.addColorStop(1, '#050913');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.5 + 0.25,
      }));
    }
    starsRef.current.forEach((s) => {
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mascot-family planets
    const isReacting = feedbackState === 'good';

    const drawMascotPlanet = (
      x: number,
      y: number,
      radius: number,
      variant: 'smile' | 'baby' | 'elder' | 'wink',
      reactType?: 'blink' | 'surprise' | 'wink' | 'happy',
    ) => {
      const grad = ctx.createLinearGradient(x, y - radius, x, y + radius);
      if (variant === 'elder') {
        grad.addColorStop(0, '#8da3c2');
        grad.addColorStop(1, '#d0d6e4');
      } else if (variant === 'baby') {
        grad.addColorStop(0, '#a8e8ff');
        grad.addColorStop(1, '#ffbce8');
      } else if (variant === 'wink') {
        grad.addColorStop(0, '#8ef2d2');
        grad.addColorStop(1, '#6d9bff');
      } else {
        grad.addColorStop(0, '#6fa2ff');
        grad.addColorStop(1, '#ff90c8');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // glow halo
      const halo = ctx.createRadialGradient(x, y, radius * 0.6, x, y, radius * 1.4);
      halo.addColorStop(0, 'rgba(255,255,255,0.08)');
      halo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // tuft / crown
      if (variant !== 'elder') {
        ctx.fillStyle = '#ffb347';
        ctx.beginPath();
        ctx.ellipse(x - radius * 0.12, y - radius + 8, radius * 0.16, radius * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6fb1';
        ctx.beginPath();
        ctx.ellipse(x + radius * 0.12, y - radius + 10, radius * 0.15, radius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // eyes
      const eyeOffsetX = radius * 0.3;
      const eyeOffsetY = radius * 0.15;
      ctx.fillStyle = variant === 'elder' ? '#1f283d' : '#152033';
      ctx.beginPath();
      const leftEyeTall = reactType === 'surprise' && isReacting ? radius * 0.22 : radius * 0.18;
      ctx.ellipse(x - eyeOffsetX, y - eyeOffsetY, radius * 0.16, leftEyeTall, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      if (variant === 'wink' || (reactType === 'wink' && isReacting)) {
        ctx.moveTo(x + eyeOffsetX - radius * 0.18, y - eyeOffsetY);
        ctx.quadraticCurveTo(
          x + eyeOffsetX,
          y - eyeOffsetY + radius * 0.08,
          x + eyeOffsetX + radius * 0.18,
          y - eyeOffsetY,
        );
      } else {
        const rightEyeTall = reactType === 'surprise' && isReacting ? radius * 0.22 : radius * 0.18;
        ctx.ellipse(x + eyeOffsetX, y - eyeOffsetY, radius * 0.16, rightEyeTall, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - eyeOffsetX + radius * 0.08, y - eyeOffsetY - radius * 0.05, radius * 0.07, 0, Math.PI * 2);
      if (!(variant === 'wink' || (reactType === 'wink' && isReacting))) {
        ctx.arc(x + eyeOffsetX + radius * 0.08, y - eyeOffsetY - radius * 0.05, radius * 0.07, 0, Math.PI * 2);
      }
      ctx.fill();

      // cheeks
      ctx.fillStyle = variant === 'elder' ? 'rgba(230,180,180,0.7)' : 'rgba(255,180,190,0.8)';
      ctx.beginPath();
      ctx.ellipse(x - radius * 0.28, y + radius * 0.05, radius * 0.2, radius * 0.12, 0, 0, Math.PI * 2);
      ctx.ellipse(x + radius * 0.28, y + radius * 0.05, radius * 0.2, radius * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // mouth / pacifier
      ctx.strokeStyle = '#1f283d';
      ctx.lineWidth = radius * 0.08;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (variant === 'elder') {
        ctx.arc(x, y + radius * 0.18, radius * 0.22, Math.PI * 0.1, Math.PI * 0.9);
        // small mustache
        ctx.moveTo(x - radius * 0.08, y + radius * 0.15);
        ctx.quadraticCurveTo(x, y + radius * 0.1, x + radius * 0.08, y + radius * 0.15);
      } else if (variant === 'baby') {
        if (isReacting && reactType === 'happy') {
          // pacifier
          const pacR = radius * 0.16;
          ctx.closePath();
          ctx.beginPath();
          ctx.fillStyle = '#ffd35a';
          ctx.strokeStyle = '#ff9ac4';
          ctx.lineWidth = radius * 0.05;
          ctx.arc(x, y + radius * 0.18, pacR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = '#5ad6ff';
          ctx.arc(x, y + radius * 0.18, pacR * 0.55, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(x, y + radius * 0.2, radius * 0.18, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
          return;
        }
      } else if (variant === 'wink') {
        ctx.arc(x, y + radius * 0.16, radius * 0.2, Math.PI * 0.15, Math.PI * 0.85);
      } else {
        ctx.arc(x, y + radius * 0.16, radius * 0.24, Math.PI * 0.1, Math.PI * 0.9);
      }
      ctx.stroke();
    };

    drawMascotPlanet(90, 130, 70, 'baby', 'happy');
    drawMascotPlanet(canvas.width - 150, canvas.height * 0.22, 90, 'elder', 'surprise');
    drawMascotPlanet(canvas.width * 0.32, canvas.height * 0.18, 65, 'wink', 'wink');
    drawMascotPlanet(canvas.width * 0.75, canvas.height * 0.28, 60, 'smile', 'blink');

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

      const wallTint = gateColorRef.current || gateColors[0];
      ctx.beginPath();
      ctx.moveTo(wallX + wallW, wallY);
      ctx.lineTo(wallX + wallW + 20 * currentScale, wallY - 20 * currentScale);
      ctx.lineTo(
        wallX + wallW + 20 * currentScale,
        wallY + wallH - 20 * currentScale,
      );
      ctx.lineTo(wallX + wallW, wallY + wallH);
      ctx.fillStyle = withAlpha(wallTint, 0.25);
      ctx.fill();

      ctx.fillStyle = withAlpha(wallTint, 0.18);
      ctx.fillRect(wallX, wallY, wallW, wallH);

      ctx.strokeStyle = withAlpha(wallTint, 0.8);
      ctx.lineWidth = 5 * currentScale;
      ctx.strokeRect(wallX, wallY, wallW, wallH);

      const gateW = wallW * 0.6;
      const gateH = wallH * 0.5;
      const gateX = wallX + (wallW - gateW) / 2;
      const gateY = wallY + wallH - gateH;

      const roadBehindColor = '#90A4AE';
      const gateTint = gateColorRef.current || gateColors[0];
      const slideY = gateOpenYRef.current * currentScale * 3;
      const isOpening = isGateOpeningRef.current && slideY > 0;
      if (!isOpening) {
        const gateBaseColor =
          gateOpenYRef.current > 4 ? roadBehindColor : withAlpha(gateTint, 0.08);
        ctx.fillStyle = gateBaseColor;
        ctx.fillRect(gateX, gateY, gateW, gateH);
        ctx.fillStyle = withAlpha(gateTint, 0.08);
        ctx.fillRect(gateX, gateY - slideY, gateW, gateH);
      }
      ctx.strokeStyle = withAlpha(gateTint, isOpening ? 0.5 : 0.55);
      ctx.lineWidth = 3 * currentScale;
      ctx.strokeRect(gateX, gateY - slideY, gateW, gateH);

      if (!isOpening) {
        const fontSize = 40 * currentScale;
        ctx.font = `bold ${fontSize}px 'Fredoka One'`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textY = gateY - slideY + gateH / 2;
        ctx.strokeText(wallWordRef.current, gateX + gateW / 2, textY);
        ctx.fillText(wallWordRef.current, gateX + gateW / 2, textY);
      }
    }

    const ballX = canvas.width / 2 - 50;
    const baseBallY = canvas.height - 100;
    const ballRadius = 32;
    const hopPhase = hopTimerRef.current > 0 ? (50 - hopTimerRef.current) / 50 : 0;
    const hopOffset =
      hopTimerRef.current > 0
        ? Math.sin(hopPhase * Math.PI) * 28 * (1 - hopPhase * 0.35)
        : 0;
    const ballY = baseBallY - hopOffset;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(
      ballX,
      ballY + ballRadius - 6,
      ballRadius,
      ballRadius / 3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Body gradient (mascot look)
    const bodyGrad = ctx.createLinearGradient(ballX, ballY - ballRadius, ballX, ballY + ballRadius);
    bodyGrad.addColorStop(0, '#5e8bff');
    bodyGrad.addColorStop(0.45, '#7ca7ff');
    bodyGrad.addColorStop(1, '#ff7bb0');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Top tuft
    ctx.fillStyle = '#ffb347';
    ctx.beginPath();
    ctx.ellipse(ballX - 4, ballY - ballRadius + 6, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff6fb1';
    ctx.beginPath();
    ctx.ellipse(ballX + 4, ballY - ballRadius + 8, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7be8ff';
    ctx.beginPath();
    ctx.ellipse(ballX, ballY - ballRadius + 2, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeOffsetX = 10;
    const eyeOffsetY = 6;
    ctx.fillStyle = '#1f283d';
    ctx.beginPath();
    ctx.ellipse(ballX - eyeOffsetX, ballY - eyeOffsetY, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ballX + eyeOffsetX, ballY - eyeOffsetY, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballX - eyeOffsetX + 2, ballY - eyeOffsetY - 2, 2.6, 0, Math.PI * 2);
    ctx.arc(ballX + eyeOffsetX + 2, ballY - eyeOffsetY - 2, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(ballX - eyeOffsetX - 2, ballY - eyeOffsetY + 2, 1.6, 0, Math.PI * 2);
    ctx.arc(ballX + eyeOffsetX - 2, ballY - eyeOffsetY + 2, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks
    ctx.fillStyle = 'rgba(255,170,170,0.75)';
    ctx.beginPath();
    ctx.ellipse(ballX - 12, ballY + 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(ballX + 12, ballY + 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#1f283d';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (gameStateRef.current === 'BOUNCING') {
      ctx.arc(ballX, ballY + 8, 10, Math.PI * 0.1, Math.PI * 0.9);
    } else if (isGateOpeningRef.current) {
      ctx.arc(ballX, ballY + 10, 11, Math.PI * 0.2, Math.PI * 0.8);
    } else {
      ctx.arc(ballX, ballY + 12, 9, Math.PI * 0.2, Math.PI * 0.8);
    }
    ctx.stroke();
  }, []);

  const loop = useCallback(() => {
    updateGameLogic();
    drawScene();
    animationRef.current = requestAnimationFrame(loop);
  }, [drawScene, updateGameLogic]);

  const normalizeText = (text: string) =>
    text.trim().toUpperCase().replace(/İ/g, 'I').replace(/[^A-ZÇĞÖŞÜ ]/g, '');

  const triggerGateOpen = useCallback(() => {
    if (gameStateRef.current !== 'RUNNING') return;
    isGateOpeningRef.current = true;
    passBoostRef.current = true;
    gateOpenYRef.current = Math.max(gateOpenYRef.current, 60);
    if (wallDistanceRef.current > 55) {
      wallDistanceRef.current = 55;
    }
    hopTimerRef.current = 50; // add celebratory hop
  }, []);

  const checkWordWeb = useCallback(
    (spoken: string) => {
      const normalized = normalizeText(spoken);
      if (!normalized) return;
      setFeedbackText(normalized);
      setShowFeedback(true);
      const target = normalizeText(wallWordRef.current);

      if (gameStateRef.current === 'RUNNING' && !isGateOpeningRef.current) {
        if (normalized.includes(target)) {
          triggerGateOpen();
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

  // Auto-start game on mount to skip landing screen
  useEffect(() => {
    if (autoStartRef.current) return;
    autoStartRef.current = true;
    startGame();
  }, [startGame]);

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
      ? '#5dffb6'
      : feedbackState === 'bad'
        ? '#ff6f91'
        : '#b8d4ff';
  const feedbackBorder =
    feedbackState === 'good'
      ? '#5dffb6'
      : feedbackState === 'bad'
        ? '#ff6f91'
        : '#7cc7ff';

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
        background: 'radial-gradient(circle at 20% 20%, #11162b 0%, #0a0f1f 50%, #070912 100%)',
        color: '#e9f5ff',
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(80,150,255,0.3) 0%, rgba(20,30,60,0.8) 45%, rgba(5,8,15,0.95) 100%)',
          filter: 'blur(10px)',
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
            background: 'linear-gradient(180deg, rgba(67,97,238,0.15), rgba(17,24,39,0.6))',
            borderRadius: 12,
            border: '1px solid rgba(99,179,237,0.5)',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(99,179,237,0.35)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${micLevel}%`,
              background: 'linear-gradient(180deg, #26ffd3, #5d5dff)',
              position: 'absolute',
              bottom: 0,
              transition: 'height 0.1s ease-out',
              boxShadow: '0 0 16px rgba(38,255,211,0.6)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 40,
            fontSize: '3rem',
            color: '#8ef4ff',
            textShadow: '0 0 10px rgba(142,244,255,0.8), 0 0 24px rgba(93,248,255,0.6)',
            letterSpacing: 2,
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
              background: 'rgba(30, 40, 70, 0.85)',
              color: '#ff9ac4',
              padding: '12px 20px',
              borderRadius: 14,
              border: '1px solid rgba(255, 154, 196, 0.7)',
              fontSize: 14,
              boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 14px rgba(255,154,196,0.35)',
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
            background: 'rgba(13, 22, 43, 0.8)',
            padding: '12px 34px',
            borderRadius: 24,
            boxShadow: '0 0 18px rgba(93,248,255,0.5), 0 10px 30px rgba(0,0,0,0.35)',
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
