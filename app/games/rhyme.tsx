import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { playSuccess, playWrong, playClick, playCelebration } from '../../lib/soundUtils';

interface RhymeQuestion {
  word: string;
  emoji: string;
  options: Array<{ text: string; emoji: string }>;
  correct: string;
}

const QUESTIONS: Record<string, RhymeQuestion[]> = {
  easy: [
    {
      word: 'Kedi',
      emoji: '🐱',
      options: [
        { text: 'Dede', emoji: '👴' },
        { text: 'Araba', emoji: '🚗' },
        { text: 'Sesi', emoji: '🔊' },
      ],
      correct: 'Dede',
    },
    {
      word: 'Top',
      emoji: '⚽',
      options: [
        { text: 'Kop', emoji: '💨' },
        { text: 'Balon', emoji: '🎈' },
        { text: 'Oyun', emoji: '🎮' },
      ],
      correct: 'Kop',
    },
    {
      word: 'Ay',
      emoji: '🌙',
      options: [
        { text: 'Kay', emoji: '🖊️' },
        { text: 'Güneş', emoji: '☀️' },
        { text: 'Yıldız', emoji: '⭐' },
      ],
      correct: 'Kay',
    },
  ],
  medium: [
    {
      word: 'Çiçek',
      emoji: '🌸',
      options: [
        { text: 'Belek', emoji: '🎁' },
        { text: 'Arı', emoji: '🐝' },
        { text: 'Bahçe', emoji: '🌿' },
      ],
      correct: 'Belek',
    },
    {
      word: 'Balık',
      emoji: '🐟',
      options: [
        { text: 'Kaymak', emoji: '🥄' },
        { text: 'Deniz', emoji: '🌊' },
        { text: 'Kalpak', emoji: '🧢' },
      ],
      correct: 'Kalpak',
    },
    {
      word: 'Tavuk',
      emoji: '🐔',
      options: [
        { text: 'Çayık', emoji: '🚤' },
        { text: 'Kavuk', emoji: '🎩' },
        { text: 'Ev', emoji: '🏠' },
      ],
      correct: 'Kavuk',
    },
  ],
  hard: [
    {
      word: 'Papatya',
      emoji: '🌼',
      options: [
        { text: 'Matya', emoji: '👸' },
        { text: 'Yaprak', emoji: '🍃' },
        { text: 'Çiçek', emoji: '🌸' },
      ],
      correct: 'Matya',
    },
    {
      word: 'Kelebek',
      emoji: '🦋',
      options: [
        { text: 'Perek', emoji: '🎸' },
        { text: 'Çiçek', emoji: '🌸' },
        { text: 'Uçan', emoji: '✈️' },
      ],
      correct: 'Perek',
    },
    {
      word: 'Eğrelti',
      emoji: '🌿',
      options: [
        { text: 'Havaelti', emoji: '☁️' },
        { text: 'Yaprak', emoji: '🍃' },
        { text: 'Taşlı', emoji: '🪨' },
      ],
      correct: 'Taşlı',
    },
  ],
};

export default function RhymeGame() {
  const router = useRouter();
  const { addStarsToday, addWordToday, addSessionToday, addMinutesToday, addAchievement } = useProgress();
  const { theme } = useTheme();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const questions = QUESTIONS[difficulty];
  const currentQuestion = questions[currentIndex];

  const bgColor = theme === 'dark' ? '#05070f' : '#fefefe';
  const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
  const textSecondary = theme === 'dark' ? '#d5dbff' : '#606481';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';

  const startGame = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameStarted(true);
    setStartTime(Date.now());
    playClick();
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correct) {
      setScore(score + 1);
      playSuccess();
    } else {
      playWrong();
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      playClick();
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    playCelebration();
    const duration = Math.round((Date.now() - startTime) / 60000);
    const stars = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;

    addMinutesToday(Math.max(1, duration));
    addWordToday(questions.length);
    addSessionToday(1);
    addStarsToday(stars);
    addAchievement('rhyme', difficulty, stars);

    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <LinearGradient
        colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
        style={styles.screen}
      >
        <View style={styles.difficultyScreen}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#a78bfa" />
          </Pressable>
          <Text style={[styles.gameTitle, { color: textPrimary }]}>Ses Çarkı 🎡</Text>
          <Text style={[styles.description, { color: textSecondary }]}>
            Ses birimine göre eşleşen kelimeleri bul!
          </Text>
          <View style={styles.difficultyOptions}>
            <DifficultyBtn
              label="Kolay"
              onPress={() => startGame('easy')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
              icon="🟢"
            />
            <DifficultyBtn
              label="Orta"
              onPress={() => startGame('medium')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
              icon="🟡"
            />
            <DifficultyBtn
              label="Zor"
              onPress={() => startGame('hard')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
              icon="🔴"
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setGameStarted(false)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#a78bfa" />
          </Pressable>
          <Text style={[styles.gameTitle, { color: textPrimary }]}>Ses Çarkı</Text>
          <Text style={[styles.progress, { color: textSecondary }]}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </View>

        {/* Word Display */}
        <View style={[styles.wordCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={styles.wordEmoji}>{currentQuestion.emoji}</Text>
          <Text style={[styles.word, { color: textPrimary }]}>{currentQuestion.word}</Text>
          <Text style={[styles.instruction, { color: textSecondary }]}>Sesine göre eşleşen kelimeyi bul</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => (
            <OptionBtn
              key={idx}
              option={option}
              isSelected={selectedAnswer === option.text}
              isCorrect={option.text === currentQuestion.correct}
              showResult={showResult}
              onPress={() => handleAnswer(option.text)}
              disabled={selectedAnswer !== null}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
            />
          ))}
        </View>

        {/* Result */}
        {showResult && (
          <View
            style={[
              styles.resultCard,
              { backgroundColor: cardColor, borderColor },
              selectedAnswer === currentQuestion.correct && styles.resultSuccess,
              selectedAnswer !== currentQuestion.correct && styles.resultError,
            ]}
          >
            <Ionicons
              name={selectedAnswer === currentQuestion.correct ? 'checkmark-circle' : 'close-circle'}
              size={40}
              color={selectedAnswer === currentQuestion.correct ? '#34d399' : '#f87171'}
            />
            <Text style={[styles.resultText, { color: textPrimary }]}>
              {selectedAnswer === currentQuestion.correct ? 'Doğru!' : 'Tekrar dene!'}
            </Text>
            <Text style={[styles.resultDetail, { color: textSecondary }]}>
              Doğru cevap: <Text style={[styles.bold, { color: textPrimary }]}>{currentQuestion.correct}</Text>
            </Text>
            <Pressable
              style={styles.nextBtn}
              onPress={nextQuestion}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex === questions.length - 1 ? 'Bitir' : 'Devam'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Score */}
        <View style={[styles.scoreCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.scoreLabel, { color: textSecondary }]}>Doğru Cevaplar</Text>
          <Text style={[styles.scoreValue, { color: '#fbbf24' }]}>{score}/{questions.length}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function DifficultyBtn({
  label,
  onPress,
  bgColor,
  textColor,
  borderColor,
  icon,
}: {
  label: string;
  onPress: () => void;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.diffBtn,
        { backgroundColor: bgColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.diffIcon}>{icon}</Text>
      <Text style={[styles.diffLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

function OptionBtn({
  option,
  isSelected,
  isCorrect,
  showResult,
  onPress,
  disabled,
  bgColor,
  textColor,
  borderColor,
}: {
  option: { text: string; emoji: string };
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onPress: () => void;
  disabled: boolean;
  bgColor: string;
  textColor: string;
  borderColor: string;
}) {
  const getBgColor = () => {
    if (showResult && isSelected) {
      return isCorrect ? '#d4f5d8' : '#ffe4e8';
    }
    if (showResult && isCorrect) {
      return '#d4f5d8';
    }
    return bgColor;
  };

  const getBorderColor = () => {
    if (showResult && isSelected) {
      return isCorrect ? '#9be6a7' : '#ffc3cc';
    }
    if (showResult && isCorrect) {
      return '#9be6a7';
    }
    return borderColor;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
    >
      <Text style={styles.optionEmoji}>{option.emoji}</Text>
      <Text style={[styles.optionText, { color: textColor }]}>{option.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 16 },
  difficultyScreen: { flex: 1, paddingHorizontal: 16, paddingTop: 20, justifyContent: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontSize: 28, fontWeight: '800', flex: 1 },
  description: { fontSize: 14, fontWeight: '600', marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progress: { fontSize: 12, fontWeight: '700' },
  difficultyOptions: { gap: 12 },
  diffBtn: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  diffIcon: { fontSize: 32 },
  diffLabel: { fontWeight: '700', fontSize: 16 },
  wordCard: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 8, borderWidth: 1 },
  wordEmoji: { fontSize: 60 },
  word: { fontSize: 36, fontWeight: '800' },
  instruction: { fontSize: 12, fontWeight: '600' },
  optionsContainer: { gap: 10 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    borderWidth: 2,
  },
  optionEmoji: { fontSize: 24 },
  optionText: { fontSize: 16, fontWeight: '700', flex: 1 },
  resultCard: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 12, borderWidth: 1 },
  resultSuccess: { borderColor: '#9be6a7' },
  resultError: { borderColor: '#ffc3cc' },
  resultText: { fontSize: 18, fontWeight: '800' },
  resultDetail: { fontSize: 12, fontWeight: '600' },
  bold: { fontWeight: '800' },
  nextBtn: {
    backgroundColor: '#a78bfa',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  scoreCard: { borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1 },
  scoreLabel: { fontSize: 12, fontWeight: '600' },
  scoreValue: { fontSize: 32, fontWeight: '800' },
});
