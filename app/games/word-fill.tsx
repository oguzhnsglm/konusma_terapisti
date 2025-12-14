import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAudio } from '../../context/AudioContext';
import { useProgress } from '../../context/ProgressContext';
import { useMascot } from '../../context/MascotContext';

const game = {
  word: '_araba',
  correctAnswer: 'K',
  options: ['K', 'G', 'P'],
};

export default function WordFillGame() {
  const router = useRouter();
  const { incrementGames } = useProgress();
  const { playSfx } = useAudio();
  const { celebrate } = useMascot();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === game.correctAnswer) {
      incrementGames();
      playSfx('success');
      celebrate('correctAnswer');
    } else {
      playSfx('error');
    }
  };

  const resetGame = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === game.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.push('/games')} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Oyunlara Dön</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.backBtn, styles.homeBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Ana Menü</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Kelime Tamamlama</Text>
      <Text style={styles.subtitle}>Eksik harfi bul!</Text>

      <View style={styles.gameBox}>
        <View style={styles.wordDisplay}>
          <Text style={styles.wordText}>{game.word}</Text>
          <Text style={styles.instruction}>Eksik harfi seç</Text>
        </View>

        <View style={styles.options}>
          {game.options.map((option) => (
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
            <Text style={styles.resultLabel}>{isCorrect ? 'Doğru cevap!' : 'Tekrar dene'}</Text>
            <Text style={styles.resultDetail}>
              Doğru cevap: <Text style={styles.bold}>K</Text>
            </Text>
            <Pressable onPress={resetGame} style={({ pressed }) => [styles.retryBtn, pressed && styles.pressed]}>
              <Text style={styles.retryLabel}>Tekrar Dene</Text>
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
  gameBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#7f6bff',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  wordDisplay: {
    alignItems: 'center',
    gap: 6,
  },
  wordText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  instruction: {
    color: '#4a3274',
  },
  options: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    backgroundColor: '#f2f0ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcd6ff',
  },
  optionLabel: {
    fontWeight: '800',
    color: '#2f1b4e',
    fontSize: 18,
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
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  resultSuccess: {
    backgroundColor: '#d4f5d8',
  },
  resultError: {
    backgroundColor: '#ffe4e8',
  },
  resultLabel: {
    fontWeight: '800',
    color: '#2f1b4e',
  },
  resultDetail: {
    color: '#4a3274',
  },
  bold: {
    fontWeight: '800',
  },
  retryBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#7f6bff',
  },
  retryLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
