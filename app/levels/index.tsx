import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';

const WORLDS = [
  {
    id: 1,
    name: 'Meyveler Dünyası',
    emoji: '🍎',
    description: 'Tatlı meyvelerle kelime öğren',
    requiredStars: 0,
    rewards: 'Melon etiketleri',
  },
  {
    id: 2,
    name: 'Hayvanlar Dünyası',
    emoji: '🐱',
    description: 'Sevimli hayvanları tanı',
    requiredStars: 5,
    rewards: 'Paw sticker\'ları',
  },
  {
    id: 3,
    name: 'Doğa Dünyası',
    emoji: '🌳',
    description: 'Ağaçlar ve çiçeklerle gezin',
    requiredStars: 15,
    rewards: 'Yaprak kartları',
  },
  {
    id: 4,
    name: 'Araçlar Dünyası',
    emoji: '🚗',
    description: 'Farklı araçları keşfet',
    requiredStars: 30,
    rewards: 'Araç emojileri',
  },
  {
    id: 5,
    name: 'Gök Dünyası',
    emoji: '🌙',
    description: 'Yıldızlar ve gökyüzü',
    requiredStars: 50,
    rewards: 'Gök görselleri',
  },
  {
    id: 6,
    name: 'Oyuncaklar Dünyası',
    emoji: '🎮',
    description: 'Eğlenceli oyuncakları bul',
    requiredStars: 75,
    rewards: 'Oyuncak etiketleri',
  },
];

export default function LevelsScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? '#05070f' : '#fefefe';
  const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
  const textSecondary = theme === 'dark' ? '#d5dbff' : '#606481';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';
  const unlockColor = '#a78bfa';
  const lockedColor = theme === 'dark' ? '#4a4a6a' : '#d4d4d4';

  const totalStars = progress.achievements.reduce((sum, a) => sum + a.starsEarned, 0);

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={unlockColor} />
          </Pressable>
          <View>
            <Text style={[styles.title, { color: textPrimary }]}>Dünyalar Haritası</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              Yıldız topla ve yeni dünyaların kilidini aç! 🌟
            </Text>
          </View>
        </View>

        {/* Star Counter */}
        <View style={[styles.starCard, { backgroundColor: cardColor, borderColor }]}>
          <Ionicons name="star" size={28} color="#fbbf24" />
          <View>
            <Text style={[styles.starLabel, { color: textSecondary }]}>Toplam Yıldız</Text>
            <Text style={[styles.starValue, { color: '#fbbf24' }]}>{totalStars}</Text>
          </View>
        </View>

        {/* Worlds Grid */}
        <View style={styles.worldsGrid}>
          {WORLDS.map((world) => {
            const isUnlocked = totalStars >= world.requiredStars;
            const isCurrentWorld = progress.currentWorld === world.id;

            return (
              <Pressable
                key={world.id}
                onPress={() => isUnlocked && router.push(`/practice/${world.id}`)}
                style={({ pressed }) => [
                  styles.worldCard,
                  {
                    backgroundColor: cardColor,
                    borderColor: isCurrentWorld ? unlockColor : borderColor,
                    opacity: pressed && isUnlocked ? 0.9 : 1,
                  },
                  isCurrentWorld && styles.activeWorld,
                ]}
              >
                {/* Locked Overlay */}
                {!isUnlocked && (
                  <View style={[styles.lockedOverlay, { backgroundColor: `${lockedColor}60` }]}>
                    <Ionicons name="lock-closed" size={32} color={lockedColor} />
                    <Text style={[styles.lockedText, { color: lockedColor }]}>
                      {world.requiredStars}⭐ gerek
                    </Text>
                  </View>
                )}

                {/* World Content */}
                <Text style={styles.worldEmoji}>{world.emoji}</Text>
                <Text style={[styles.worldName, { color: textPrimary }]}>{world.name}</Text>
                <Text style={[styles.worldDesc, { color: textSecondary }]}>{world.description}</Text>

                {isCurrentWorld && (
                  <View style={[styles.badge, { backgroundColor: unlockColor }]}>
                    <Text style={styles.badgeText}>Aktif</Text>
                  </View>
                )}

                {isUnlocked && (
                  <Text style={[styles.reward, { color: unlockColor }]}>🎁 {world.rewards}</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Info Section */}
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor }]}>
          <Ionicons name="information-circle" size={24} color={unlockColor} />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: textPrimary }]}>İpucu</Text>
            <Text style={[styles.infoDesc, { color: textSecondary }]}>
              Her oyunu oynayarak yıldız kazanın. Yeni dünyaları keşfetmek için gerekli yıldız sayısını kontrol edin!
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 16 },
  header: { gap: 12, marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 12, fontWeight: '600' },
  starCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  starLabel: { fontSize: 12, fontWeight: '600' },
  starValue: { fontSize: 24, fontWeight: '800' },
  worldsGrid: { gap: 12 },
  worldCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    position: 'relative',
  },
  activeWorld: { shadowColor: '#a78bfa', shadowOpacity: 0.3, shadowRadius: 8 },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  lockedText: { fontSize: 12, fontWeight: '700' },
  worldEmoji: { fontSize: 40 },
  worldName: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  worldDesc: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  reward: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 14, fontWeight: '700' },
  infoDesc: { fontSize: 12, fontWeight: '600' },
});
