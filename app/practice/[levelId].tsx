import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import WordCard from '../../components/WordCard';
import RecordButton from '../../components/RecordButton';
import evalPronunciation from '../../logic/evalPronunciation';
import { usePractice } from '../../context/PracticeContext';

type Result = {
  word: string;
  heard: string;
  score: number;
  isSuccessful: boolean;
};

const SIMULATED_DELAY = 900;

export default function PracticeScreen() {
  const params = useLocalSearchParams<{ levelId?: string; wordIndex?: string }>();
  const router = useRouter();
  const levelId = Number(params.levelId) || 1;
  const initialIndex = params.wordIndex ? Number(params.wordIndex) || 0 : 0;
  const { levels, setWordStatus } = usePractice();

  const level = levels.find((item) => item.id === levelId) ?? levels[0];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [manualText, setManualText] = useState('');

  const currentWord = level.words[currentIndex] ?? level.words[0];

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(initialIndex);
      setRecognizedText('');
      setManualText('');
      setLastResult(null);
      setIsRecording(false);
    }, [initialIndex]),
  );

  const finalizeRecognition = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) {
        return;
      }
      const { score, isSuccessful } = evalPronunciation(currentWord, clean);
      const result = { word: currentWord, heard: clean, score, isSuccessful };
      setLastResult(result);
      setRecognizedText(clean);
      setIsRecording(false);
    },
    [currentWord],
  );

  const simulateCapture = useCallback(() => {
    setIsRecording(true);
    setRecognizedText('');
    setLastResult(null);
    const simulated = Platform.OS === 'web' ? currentWord : `${currentWord}`;
    setTimeout(() => finalizeRecognition(simulated), SIMULATED_DELAY);
  }, [currentWord, finalizeRecognition]);

  const handleRecordPress = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    simulateCapture();
  };

  const resetForRetry = () => {
    setRecognizedText('');
    setManualText('');
    setLastResult(null);
    setIsRecording(false);
  };

  const goToNextWord = () => {
    if (lastResult) {
      setWordStatus(levelId, currentIndex, lastResult.isSuccessful ? 'success' : 'fail');
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= level.words.length) {
      router.push({
        pathname: '/result',
        params: { levelId: String(levelId) },
      });
      return;
    }
    setCurrentIndex(nextIndex);
    resetForRetry();
    simulateCapture();
  };

  const liveEval = useMemo(() => {
    if (!recognizedText) {
      return null;
    }
    const { score, isSuccessful } = evalPronunciation(currentWord, recognizedText);
    return { score, isSuccessful };
  }, [recognizedText, currentWord]);

  return (
    <LinearGradient colors={['#fdf5ff', '#f3f7ff', '#e8fbff']} style={styles.container}>
      <Stack.Screen options={{ title: `Bölüm ${level.id}` }} />
      <Text style={styles.header}>Konuşma Pratiği</Text>
      <Text style={styles.progress}>
        Kelime {currentIndex + 1} / {level.words.length}
      </Text>
      <WordCard
        word={currentWord}
        subText={recognizedText}
        subTextStyle={[
          styles.heardText,
          recognizedText
            ? liveEval?.isSuccessful
              ? styles.correct
              : styles.incorrect
            : null,
        ]}
      />
      <Text style={styles.instruction}>Şimdi bu kelimeyi söyle</Text>

      {!recognizedText && (
        <>
          <RecordButton isRecording={isRecording} onPress={handleRecordPress} disabled={false} />
          <Text style={styles.hint}>Kaydı bitirmek için butona tekrar dokun.</Text>
          <View style={styles.manualBox}>
            <Text style={styles.manualTitle}>Metin girerek dene</Text>
            <TextInput
              value={manualText}
              onChangeText={setManualText}
              placeholder="Duyduğun kelimeyi yaz"
              placeholderTextColor="#6c5a92"
              style={styles.manualInput}
              onSubmitEditing={() => finalizeRecognition(manualText)}
              returnKeyType="done"
            />
            <Pressable
              onPress={() => finalizeRecognition(manualText)}
              style={({ pressed }) => [styles.inlineBtn, styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.inlineLabel}>Metni Değerlendir</Text>
            </Pressable>
          </View>
        </>
      )}

      {recognizedText ? (
        <View style={styles.inlineResult}>
          <Text
            style={[
              styles.resultMsg,
              liveEval?.isSuccessful ? styles.correct : styles.incorrect,
            ]}
          >
            {liveEval?.isSuccessful ? 'Harika söyledin! 🎈' : 'Neredeyse oldu, tekrar deneyelim ✨'}
          </Text>
          <View style={styles.inlineButtons}>
            <InlineButton label="Tekrarla" variant="secondary" onPress={resetForRetry} />
            <InlineButton label="Sonraki Kelime" variant="primary" onPress={goToNextWord} />
          </View>
        </View>
      ) : null}
    </LinearGradient>
  );
}

type InlineButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

function InlineButton({ label, onPress, variant = 'primary' }: InlineButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.inlineBtn,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.inlineLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f1b3a',
    letterSpacing: 0.5,
  },
  progress: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d9468f',
    marginTop: -12,
  },
  instruction: {
    fontSize: 20,
    color: '#4b4c7a',
    textAlign: 'center',
  },
  hint: {
    fontSize: 15,
    color: '#4b4c7a',
    opacity: 0.8,
    textAlign: 'center',
  },
  heardText: {},
  correct: {
    color: '#1f8c5c',
    fontWeight: '800',
  },
  incorrect: {
    color: '#d9468f',
    fontWeight: '800',
  },
  inlineResult: {
    alignItems: 'center',
    gap: 12,
  },
  resultMsg: {
    fontSize: 19,
    textAlign: 'center',
    color: '#1f1b3a',
  },
  inlineButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  primary: {
    backgroundColor: '#ff9fd3',
    borderColor: '#ffb0d7',
  },
  secondary: {
    backgroundColor: '#f2e9ff',
    borderColor: '#d8ccff',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  inlineLabel: {
    fontSize: 16,
    color: '#1f1b3a',
    fontWeight: '700',
  },
  manualBox: {
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },
  manualTitle: {
    fontWeight: '800',
    color: '#1f1b3a',
  },
  manualInput: {
    width: 260,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(112, 89, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#1f1b3a',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
