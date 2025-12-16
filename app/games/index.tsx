import { Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { useAudio } from '../../context/AudioContext';

const quickGames = [
  { title: 'Kelime Tamamlama', route: '/games/word-fill', color: '#7f6bff', emoji: '✏️' },
  { title: 'Hafıza Oyunu', route: '/games/memory', color: '#ff8fa3', emoji: '🧠' },
  { title: 'Kafiye Oyunu', route: '/games/rhyme', color: '#5ac8fa', emoji: '🎵' },
  { title: 'Renk Oyunu', route: '/games/colors', color: '#34c759', emoji: '🎨' },
  { title: 'Sayma Oyunu', route: '/games/counting', color: '#ffb347', emoji: '🔢' },
  { title: 'Söyle - Eşleş - Geç', route: '/games/speak-to-pass', color: '#ff9bd5', emoji: '🎤' },
  { title: 'Canavar Besle', route: '/games/monster-feed', color: '#9B59B6', emoji: '🍔' },
  { title: 'Roket Fırlat', route: '/games/rocket-launch', color: '#3498DB', emoji: '🚀' },
  { title: 'Büyücü Oyunu', route: '/games/wizard-magic', color: '#8E44AD', emoji: '🧙‍♂️' },
  { title: 'Kurbağa Zıpla', route: '/games/frog-jump', color: '#27AE60', emoji: '🐸' },
  { title: 'Hayalet Kaçır', route: '/games/ghost-chase', color: '#2C3E50', emoji: '👻' },
  { title: 'Define Avcısı', route: '/games/treasure-hunt', color: '#D4A574', emoji: '🗺️' },
  { title: 'Ejderhayı Uyut', route: '/games/dragon-wake', color: '#E74C3C', emoji: '🐉' },
  { title: 'NEUROSHIFT', route: '/games/neuroshift', color: '#00D9FF', emoji: '⚡' },
] satisfies { title: string; route: Href; color: string; emoji: string }[];

export default function MiniGamesPage() {
  const router = useRouter();
  const { incrementGames } = useProgress();
  const { playSfx } = useAudio();

  const handleNav = (route: Href) => {
    playSfx('click');
    incrementGames();
    router.push(route);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
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
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
            </View>
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
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 4,
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
