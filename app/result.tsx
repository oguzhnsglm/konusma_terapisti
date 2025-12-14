import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePractice } from '../context/PracticeContext';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId?: string; levelTitle?: string }>();
  const levelId = Number(params.levelId) || 1;
  const { levels } = usePractice();

  const level = levels.find((item) => item.id === levelId) ?? levels[0];

  const stats = useMemo(() => {
    const totalWords = level.words.length;
    const correctCount = level.progress.filter((status) => status === 'success').length;
    const incorrectCount = level.progress.filter((status) => status === 'fail').length;
    const successRate = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;

    return {
      correctCount,
      incorrectCount,
      successRate,
      totalWords,
    };
  }, [level]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#fdf5ff', '#f3f7ff', '#e8fbff']} style={styles.backdrop} />
      <Stack.Screen options={{ title: 'Sonuç' }} />
      <Text style={styles.header}>Bölüm Tamamlandı!</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Başarı Oranı</Text>
        <Text style={styles.successRate}>{stats.successRate}%</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.correctCount}</Text>
            <Text style={[styles.statLabel, styles.correct]}>Doğru</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.incorrectCount}</Text>
            <Text style={[styles.statLabel, styles.incorrect]}>Yanlış</Text>
          </View>
        </View>
      </View>

      <View style={styles.wordsListCard}>
        <Text style={styles.wordsListTitle}>Kelime Baloncukları</Text>
        {level.words.map((word, index) => {
          const status = level.progress[index];
          const isSuccessful = status === 'success';
          const isFailed = status === 'fail';

          if (!status || status === 'pending') return null;

          return (
            <View
              key={index}
              style={[
                styles.wordItem,
                isSuccessful ? styles.wordItemSuccess : styles.wordItemFail,
              ]}
            >
              <View style={styles.wordItemLeft}>
                <Text style={styles.wordItemIcon}>{isSuccessful ? '🎈' : '✨'}</Text>
                <Text style={styles.wordItemWord}>{word}</Text>
              </View>
              <Text style={styles.wordItemHeard}>
                {isSuccessful ? 'Başarılı' : isFailed ? 'Tekrar dene' : ''}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={() => router.push('/levels')}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>Bölümler Sayfasına Git</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 32,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1f1b3a',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 159, 211, 0.3)',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4b4c7a',
  },
  successRate: {
    fontSize: 48,
    fontWeight: '800',
    color: '#d9468f',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f1b3a',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  correct: {
    color: '#1f8c5c',
  },
  incorrect: {
    color: '#d9468f',
  },
  wordsListCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 12,
    shadowColor: '#d8e0ff',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  wordsListTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f1b3a',
    marginBottom: 8,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  wordItemSuccess: {
    backgroundColor: 'rgba(123, 220, 150, 0.18)',
    borderColor: 'rgba(123, 220, 150, 0.5)',
  },
  wordItemFail: {
    backgroundColor: 'rgba(255, 159, 211, 0.18)',
    borderColor: 'rgba(255, 159, 211, 0.5)',
  },
  wordItemLeft: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  wordItemIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f1b3a',
  },
  wordItemWord: {
    fontSize: 16,
    color: '#1f1b3a',
    fontWeight: '700',
  },
  wordItemHeard: {
    fontSize: 14,
    color: '#4b4c7a',
    fontWeight: '600',
  },
  button: {
    marginTop: 12,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#ff9fd3',
    alignItems: 'center',
    shadowColor: '#ffb0d7',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonLabel: {
    color: '#1f1b3a',
    fontWeight: '800',
    fontSize: 17,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
