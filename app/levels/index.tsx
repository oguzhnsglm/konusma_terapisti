import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePractice } from '../../context/PracticeContext';

const { width } = Dimensions.get('window');

export default function LevelSelectScreen() {
  const router = useRouter();
  const { levels } = usePractice();

  return (
    <LinearGradient
      colors={['#fdf5ff', '#f3f7ff', '#e8fbff']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.header}>Konuşma Yolculuğu</Text>
      <Text style={styles.subtitle}>
        Bölümleri sırayla tamamla, kilitleri aç ve telaffuzunu güçlendir. Baloncuk gibi yumuşak ödüller seni bekliyor.
      </Text>

      <View style={styles.grid}>
        {levels.map((level) => {
          const locked = !level.unlocked;
          const completed = level.completed;

          return (
            <Pressable
              key={level.id}
              onPress={() => {
                if (!locked) {
                  router.push(`/levels/${level.id}`);
                }
              }}
              style={({ pressed }) => [
                styles.cardShell,
                pressed && !locked ? styles.cardPressed : null,
              ]}
            >
              <LinearGradient
                colors={
                  completed
                    ? ['#e6fff1', '#d5ffe7']
                    : locked
                    ? ['#f0e8ff', '#e5f0ff']
                    : ['#ffe8f4', '#f3f0ff']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.levelNumber}>Bölüm {level.id}</Text>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                </View>
                <Text style={styles.levelDescription} numberOfLines={2}>
                  {level.description}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{level.words.length} kelime</Text>
                  </View>
                  {completed ? (
                    <View style={[styles.badge, styles.successBadge]}>
                      <Text style={[styles.badgeText, styles.successBadgeText]}>Tamamlandı</Text>
                    </View>
                  ) : null}
                </View>
                {locked ? (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>Kilitli</Text>
                    <Text style={styles.lockText}>Önceki bölümü tamamla</Text>
                  </View>
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 12,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f1b3a',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b4c7a',
    lineHeight: 22,
    maxWidth: 540,
  },
  grid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardShell: {
    width: width > 720 ? (width - 24 * 2 - 16 * 2) / 2 : '100%',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardTop: {
    gap: 4,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4b4c7a',
    letterSpacing: 0.5,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f1b3a',
  },
  levelDescription: {
    color: '#4b4c7a',
    lineHeight: 20,
    opacity: 0.95,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  badgeText: {
    color: '#1f1b3a',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  successBadge: {
    backgroundColor: 'rgba(255, 183, 219, 0.26)',
  },
  successBadgeText: {
    color: '#1f1b3a',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4b4c7a',
    marginBottom: 6,
  },
  lockText: {
    color: '#4b4c7a',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 12,
  },
});
