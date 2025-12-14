import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '../../context/ProgressContext';
import { useMascot } from '../../context/MascotContext';

type Level = { word: string; options: string[]; correct: string; hint: string };

const levels: Level[] = [
  { word: 'Kedi', options: ['Dede', 'Araba', 'Masa'], correct: 'Dede', hint: '"Kedi" ile kafiyeli kelime' },
  { word: 'Masa', options: ['Kasa', 'Sandalye', 'Kitap'], correct: 'Kasa', hint: '"Masa" ile kafiyeli kelime' },
  { word: 'Top', options: ['Kop', 'Balon', 'Oyun'], correct: 'Kop', hint: '"Top" ile kafiyeli kelime' },
  { word: 'Ay', options: ['Kay', 'Güneş', 'Yıldız'], correct: 'Kay', hint: '"Ay" ile kafiyeli kelime' },
  { word: 'Bal', options: ['Kal', 'Şeker', 'Yemek'], correct: 'Kal', hint: '"Bal" ile kafiyeli kelime' },
];

export default function RhymeGamePage() {
  const router = useRouter();
  const { incrementGames } = useProgress();
  const { celebrate } = useMascot();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = levels[currentLevel];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === currentQuestion.correct) {
      setScore((s) => s + 1);
      celebrate('correctAnswer');
    }
  };

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((l) => l + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      incrementGames();
      Alert.alert('Oyun bitti', `Skorun: ${score + 1}/${levels.length}`);
      resetGame();
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Ana Menü</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/games')} style={({ pressed }) => [styles.backBtn, styles.homeBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Oyunlara Dön</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Kafiye Oyunu</Text>
      <Text style={styles.subtitle}>Kafiyeli kelimeleri bul!</Text>

      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentLevel + 1) / levels.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Soru {currentLevel + 1} / {levels.length} — Skor: {score}
        </Text>
      </View>

      <View style={styles.gameBox}>
        <View style={styles.mainWord}>
          <Text style={styles.word}>{currentQuestion.word}</Text>
          <Text style={styles.hint}>{currentQuestion.hint}</Text>
        </View>

        <View style={styles.options}>
          {currentQuestion.options.map((option) => (
            <Pressable
              key={option}
              onPress={() => handleAnswer(option)}
              disabled={showResult}
              style={({ pressed }) => [
                styles.option,
                showResult && selectedAnswer === option
                  ? isCorrect
                    ? styles.correct
                    : styles.incorrect
                  : null,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.optionLabel}>{option}</Text>
            </Pressable>
          ))}
        </View>

        {showResult && (
          <View style={[styles.resultBox, isCorrect ? styles.resultSuccess : styles.resultError]}>
            <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '🧐'}</Text>
            <Text style={styles.resultText}>
              {isCorrect ? 'Harika! Doğru cevap!' : `Doğru cevap: ${currentQuestion.correct}`}
            </Text>
            <Pressable onPress={handleNext} style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}>
              <Text style={styles.nextLabel}>
                {currentLevel < levels.length - 1 ? 'Sonraki' : 'Bitir'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f1ff',
    padding: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#efe9ff',
  },
  homeBtn: {
    backgroundColor: '#ffe9f0',
  },
  backText: {
    color: '#6a5acd',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  subtitle: {
    color: '#4a3274',
  },
  progress: {
    gap: 6,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#ede8ff',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#7f6bff',
  },
  progressText: {
    color: '#4a3274',
    fontWeight: '600',
  },
  gameBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#7f6bff',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mainWord: {
    alignItems: 'center',
    gap: 6,
  },
  word: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  hint: {
    color: '#4a3274',
  },
  options: {
    gap: 10,
  },
  option: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f2f0ff',
    borderWidth: 1,
    borderColor: '#dcd6ff',
    alignItems: 'center',
  },
  optionLabel: {
    fontWeight: '800',
    color: '#2f1b4e',
  },
  correct: {
    backgroundColor: '#d4f5d8',
    borderColor: '#9be6a7',
  },
  incorrect: {
    backgroundColor: '#ffe4e8',
    borderColor: '#ffc3cc',
  },
  resultBox: {
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 12,
  },
  resultSuccess: {
    backgroundColor: '#d4f5d8',
  },
  resultError: {
    backgroundColor: '#ffe4e8',
  },
  resultEmoji: {
    fontSize: 20,
  },
  resultText: {
    color: '#2f1b4e',
    fontWeight: '700',
    textAlign: 'center',
  },
  nextBtn: {
    marginTop: 4,
    backgroundColor: '#7f6bff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  nextLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
