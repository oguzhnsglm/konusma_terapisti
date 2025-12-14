import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { usePractice } from '../../context/PracticeContext';
import { useTheme } from '../../context/ThemeContext';
import WordProgressList from '../../components/WordProgressList';

type Palette = {
  backgroundGradient: readonly [string, string, string];
  buttonGradient: readonly [string, string];
  textPrimary: string;
  textSecondary: string;
  accentText: string;
};

const darkPalette: Palette = {
  backgroundGradient: ['#0f0a1f', '#1a1230', '#1f1640'] as const,
  buttonGradient: ['#d9468f', '#ff7bb3'] as const,
  textPrimary: '#ffffff',
  textSecondary: '#b8b4d4',
  accentText: '#ff9fd3',
};

const lightPalette: Palette = {
  backgroundGradient: ['#fdf5ff', '#f3f7ff', '#e8fbff'] as const,
  buttonGradient: ['#ff9fd3', '#ffd4e9'] as const,
  textPrimary: '#1f1b3a',
  textSecondary: '#4b4c7a',
  accentText: '#d9468f',
};

export default function LevelDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId?: string }>();
  const levelId = Number(params.levelId) || 1;
  const { levels } = usePractice();
  const { theme } = useTheme();
  const palette = theme === 'dark' ? darkPalette : lightPalette;

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
      colors={palette.backgroundGradient}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ title: `Bölüm ${level.id}` }} />
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.levelNumber, { color: palette.textSecondary }]}>
            Bölüm {level.id}
          </Text>
          <Text style={[styles.title, { color: palette.textPrimary }]}>{level.title}</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            {level.description}
          </Text>
        </View>
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
            colors={palette.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={[styles.buttonLabel, { color: palette.textPrimary }]}>
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
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 400,
    opacity: 0.9,
  },
  content: {
    marginTop: 40,
    gap: 28,
    alignItems: 'center',
  },
  list: {
    width: '100%',
    maxWidth: 420,
  },
  buttonShell: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 24,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  buttonLabel: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
