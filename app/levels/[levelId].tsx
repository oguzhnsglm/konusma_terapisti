import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { usePractice } from '../../context/PracticeContext';
import WordProgressList from '../../components/WordProgressList';

export default function LevelDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId?: string }>();
  const levelId = Number(params.levelId) || 1;
  const { levels } = usePractice();

  const level = levels.find((item) => item.id === levelId) ?? levels[0];

  const progressData = useMemo(
    () =>
      level.words.map((word, index) => ({
        word,
        status: level.progress[index] ?? 'pending',
      })),
    [level],
  );

  return (
    <LinearGradient
      colors={['#fdf5ff', '#f3f7ff', '#e8fbff']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ title: `Bölüm ${level.id}` }} />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.levelNumber}>Bölüm {level.id}</Text>
          <Text style={styles.title}>{level.title}</Text>
          <Text style={styles.subtitle}>{level.description}</Text>
        </View>
        <Pressable onPress={() => router.push('/levels')}>
          <Text style={styles.backLink}>Bölümlere dön</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <WordProgressList progress={progressData} currentIndex={0} style={styles.list} />

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/practice/[levelId]',
              params: { levelId: String(level.id) },
            })
          }
          style={({ pressed }) => [styles.buttonShell, pressed && styles.buttonPressed]}
        >
          <LinearGradient
            colors={['#ff9fd3', '#ffd4e9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>
              {level.completed ? 'Bölümü Yeniden Çalıştır' : 'Pratiğe Başla'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4b4c7a',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f1b3a',
    letterSpacing: 0.7,
    marginTop: 4,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#4b4c7a',
    lineHeight: 22,
    maxWidth: 360,
  },
  backLink: {
    color: '#d9468f',
    fontWeight: '700',
  },
  content: {
    marginTop: 36,
    gap: 24,
    alignItems: 'center',
  },
  list: {
    width: '100%',
    maxWidth: 360,
  },
  buttonShell: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#ffb0d7',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  buttonLabel: {
    color: '#1f1b3a',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
