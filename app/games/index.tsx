import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { useAudio } from '../../context/AudioContext';

const quickGames = [
  { title: 'Kelime Tamamlama', route: '/games/word-fill', color: '#7f6bff' },
  { title: 'Hafıza Oyunu', route: '/games/memory', color: '#ff8fa3' },
  { title: 'Kafiye Oyunu', route: '/games/rhyme', color: '#5ac8fa' },
  { title: 'Renk Oyunu', route: '/games/colors', color: '#34c759' },
  { title: 'Sayma Oyunu', route: '/games/counting', color: '#ffb347' },
];

export default function MiniGamesPage() {
  const router = useRouter();
  const { incrementGames } = useProgress();
  const { playSfx } = useAudio();

  const handleNav = (route: string) => {
    playSfx('click');
    incrementGames();
    router.push(route);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backLabel}>Ana Menü</Text>
        </Pressable>
        <Text style={styles.title}>Mini Oyunlar</Text>
        <Text style={styles.subtitle}>Eğlenceli oyunlarla öğren!</Text>
      </View>

      <View style={styles.menu}>
        {quickGames.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => handleNav(item.route)}
            style={({ pressed }) => [
              styles.gameCard,
              { backgroundColor: item.color },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>Başlat</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.wordFillCard}>
        <Text style={styles.sectionTitle}>Kelime Tamamlama</Text>
        <Text style={styles.sectionDesc}>Eksik harfi bul, kelimeyi tamamla.</Text>
        <Pressable onPress={() => handleNav('/games/word-fill')} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
          <Text style={styles.primaryLabel}>Oyna</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    backgroundColor: '#f6f1ff',
  },
  headerRow: {
    gap: 6,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#efe9ff',
  },
  backLabel: {
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
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameCard: {
    flexBasis: '48%',
    borderRadius: 16,
    padding: 14,
    minHeight: 100,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  wordFillCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#7f6bff',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  sectionDesc: {
    color: '#4a3274',
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#7f6bff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
