import React, { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import ModeSwitch from '../components/ModeSwitch';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

type PlaylistCard = {
  title: string;
  subtitle: string;
  route: string;
  colors: string[];
  accent: string;
  image: string;
  category: 'practice' | 'games' | 'videos' | 'all';
};

type Mix = {
  title: string;
  subtitle: string;
  badge: string;
  route: string;
  colors: string[];
};

type Utility = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  route: string;
};

const filters = [
  { key: 'all', label: 'Tümü' },
  { key: 'practice', label: 'Pratik' },
  { key: 'games', label: 'Oyunlar' },
  { key: 'videos', label: 'Videolar' },
];

const playlists: PlaylistCard[] = [
  {
    title: 'Beğenilen Görevler',
    subtitle: 'Hızlı geri bildirim ve favori egzersizler',
    route: '/levels',
    colors: ['#ffe7f6', '#f8efff'],
    accent: '#ff9fd3',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    category: 'practice',
  },
  {
    title: 'Günün Akışı',
    subtitle: '10 dakikalık kelime sprinti',
    route: '/progress',
    colors: ['#e8f6ff', '#f1f6ff'],
    accent: '#7cc5ff',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
    category: 'practice',
  },
  {
    title: 'Ritimli Oyunlar',
    subtitle: 'Ses ve tempo odaklı mini oyunlar',
    route: '/games',
    colors: ['#fff3d9', '#ffe7ba'],
    accent: '#ffb347',
    image:
      'https://images.unsplash.com/photo-1526481280695-3c469c2f88b8?auto=format&fit=crop&w=200&q=80',
    category: 'games',
  },
  {
    title: 'Video Destekli',
    subtitle: 'Ekrandan dudak okuma ve taklit',
    route: '/practice/1',
    colors: ['#e9f7ff', '#e8f0ff'],
    accent: '#7f9bff',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80',
    category: 'videos',
  },
  {
    title: 'Keşif Listesi',
    subtitle: 'Yeni kelimeler ve sesler keşfet',
    route: '/levels',
    colors: ['#f6ffef', '#e6ffe1'],
    accent: '#7adf8a',
    image:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    category: 'all',
  },
];

const mixes: Mix[] = [
  {
    title: 'Günlük Mix 01',
    subtitle: 'Kısa kelime blokları',
    badge: 'Yeni',
    route: '/levels',
    colors: ['#3b2a4c', '#1f1728'],
  },
  {
    title: 'Ses Dalgası',
    subtitle: 'R sesleri üzerine',
    badge: 'Öneri',
    route: '/levels',
    colors: ['#243042', '#141a26'],
  },
  {
    title: 'Mini Oyun Mix',
    subtitle: 'Hızlı refleks',
    badge: 'Popüler',
    route: '/games',
    colors: ['#2f2c3f', '#161420'],
  },
];

const utilities: Utility[] = [
  {
    title: 'İlerlemem',
    subtitle: 'Rozetler ve grafikler',
    icon: <Ionicons name="stats-chart" size={20} color="#c8d5ff" />,
    route: '/progress',
  },
  {
    title: 'Avatar & Profil',
    subtitle: 'Karakterini seç',
    icon: <Ionicons name="person-circle-outline" size={20} color="#c8d5ff" />,
    route: '/settings',
  },
  {
    title: 'Geri Bildirim',
    subtitle: 'Son ses puanların',
    icon: <Feather name="activity" size={20} color="#c8d5ff" />,
    route: '/progress',
  },
  {
    title: 'Ayarlar',
    subtitle: 'Tema ve dil tercihleri',
    icon: <Ionicons name="settings-outline" size={20} color="#c8d5ff" />,
    route: '/settings',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { language } = useTheme();
  const { playSfx } = useAudio();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const t = language === 'en'
    ? {
    headline: 'Speech Therapist',
    sub: 'Soft, playful and immersive practice hub',
    ctaPrimary: 'Start practice',
    ctaGhost: 'Open games',
    mixes: 'Your curated mixes',
    utilities: 'Quick tools',
  }
    : {
        headline: 'Konuşma Terapisti',
        sub: 'Yumuşak, tatlı ve neşeli pratik alanı',
        ctaPrimary: 'Pratiğe başla',
        ctaGhost: 'Oyunları aç',
        mixes: 'Senin için karışımlar',
        utilities: 'Hızlı araçlar',
      };

  const filteredPlaylists = useMemo(
    () =>
      playlists.filter(
        (item) => activeFilter === 'all' || item.category === activeFilter || item.category === 'all',
      ),
    [activeFilter],
  );

  const handleNav = (route: string) => {
    playSfx('click');
    router.push(route);
  };

  return (
    <LinearGradient colors={['#fdf5ff', '#f3f7ff', '#e9fbff']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View>
              <Text style={styles.badge}>Neşeli öğrenme modu</Text>
              <Text style={styles.title}>{t.headline}</Text>
              <Text style={styles.subtitle}>{t.sub}</Text>
            </View>
            <View style={styles.actions}>
              <ModeSwitch />
              <IconButton icon={<Ionicons name="notifications-outline" size={18} color="#d7defe" />} />
              <IconButton icon={<Ionicons name="people-outline" size={18} color="#d7defe" />} />
              <IconButton icon={<Feather name="search" size={18} color="#d7defe" />} />
            </View>
          </View>

        <View style={styles.authRow}>
          <Pressable
            style={({ pressed }) => [styles.authButton, styles.loginBtn, pressed && styles.pressed]}
            onPress={() => handleNav('/login')}
          >
            <Ionicons name="log-in-outline" size={18} color="#1f1b3a" />
            <Text style={styles.authLabel}>Giriş Yap</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.authButton, styles.registerBtn, pressed && styles.pressed]}
            onPress={() => handleNav('/register')}
          >
            <Ionicons name="person-add-outline" size={18} color="#1f1b3a" />
            <Text style={styles.authLabel}>Kayıt Ol</Text>
          </Pressable>
        </View>

        <View style={styles.heroRow}>
          <LinearGradient colors={['#ffe9f2', '#e8f4ff']} style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.pill}>
                <Ionicons name="sparkles-outline" size={14} color="#ff9fd3" />
                <Text style={styles.pillText}>Bugünün Balonu</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={18} color="#9fb3ff" />
            </View>
            <Text style={styles.heroTitle}>Akıcı telaffuz için 3 tatlı kombinasyon</Text>
            <Text style={styles.heroDesc}>
              10 dakikada tamamlanabilen, video destekli pratik. Sesleri yakala, baloncuklardaki geri
              bildirimleri anında gör.
            </Text>
            <View style={styles.heroButtons}>
              <PrimaryButton label={t.ctaPrimary} onPress={() => handleNav('/levels')} />
              <GhostButton label={t.ctaGhost} onPress={() => handleNav('/games')} />
            </View>
            <View style={styles.heroStats}>
              <Stat label="Hedef" value="10 dk" />
              <Stat label="İlerleme" value="03 / 10" />
              <Stat label="Seri" value="7 gün" />
            </View>
          </LinearGradient>

          <View style={styles.nowPlaying}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=300&q=80',
              }}
              style={styles.cover}
            />
            <View style={styles.nowPlayingText}>
              <Text style={styles.nowLabel}>Şimdi devam</Text>
              <Text style={styles.nowTitle}>Baloncuk Sesler</Text>
              <Text style={styles.nowSubtitle}>Geri bildirim akışı</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
            <View style={styles.nowButtons}>
              <IconButton icon={<Ionicons name="play" size={14} color="#0b0d13" />} solid />
              <IconButton icon={<Ionicons name="skip-forward" size={14} color="#d7defe" />} />
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((chip) => (
            <Pressable
              key={chip.key}
              onPress={() => setActiveFilter(chip.key)}
              style={({ pressed }) => [
                styles.filterChip,
                activeFilter === chip.key && styles.filterChipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === chip.key && styles.filterLabelActive,
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.playlistRow}
        >
          {filteredPlaylists.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => handleNav(item.route)}
              style={({ pressed }) => [styles.playlistCard, pressed && styles.pressed]}
            >
              <LinearGradient colors={item.colors} style={styles.playlistGradient}>
                <View style={styles.playlistHeader}>
                  <View style={[styles.dot, { backgroundColor: item.accent }]} />
                  <Text style={styles.playlistBadge}>Hazır</Text>
                </View>
                <Text style={styles.playlistTitle}>{item.title}</Text>
                <Text style={styles.playlistSubtitle}>{item.subtitle}</Text>
                <View style={styles.playlistFooter}>
                  <View style={styles.playlistAvatar}>
                    <Image source={{ uri: item.image }} style={styles.playlistAvatarImg} />
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#c8d5ff" />
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{t.mixes}</Text>
        <View style={styles.mixGrid}>
          {mixes.map((mix) => (
            <Pressable
              key={mix.title}
              onPress={() => handleNav(mix.route)}
              style={({ pressed }) => [styles.mixCard, pressed && styles.pressed]}
            >
              <LinearGradient colors={mix.colors} style={styles.mixGradient}>
                <View style={styles.mixHeader}>
                  <Text style={styles.mixBadge}>{mix.badge}</Text>
                  <Ionicons name="ellipsis-horizontal" size={16} color="#9fb3ff" />
                </View>
                <Text style={styles.mixTitle}>{mix.title}</Text>
                <Text style={styles.mixSubtitle}>{mix.subtitle}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.utilities}</Text>
        <View style={styles.utilityGrid}>
          {utilities.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => handleNav(item.route)}
              style={({ pressed }) => [styles.utilityCard, pressed && styles.pressed]}
            >
              <View style={styles.utilityIcon}>{item.icon}</View>
              <View style={styles.utilityText}>
                <Text style={styles.utilityTitle}>{item.title}</Text>
                <Text style={styles.utilitySubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7a8bb8" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function IconButton({ icon, solid = false }: { icon: React.ReactNode; solid?: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconBtn,
        solid && styles.iconBtnSolid,
        pressed && styles.pressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}>
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  authRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  authLabel: {
    fontWeight: '800',
    color: '#1f1b3a',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#f2f4ff',
  },
  registerBtn: {
    backgroundColor: '#ff9fd3',
  },
  badge: {
    color: '#ff8dc7',
    fontWeight: '800',
    backgroundColor: 'rgba(255, 159, 211, 0.14)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f1b3a',
    marginTop: 8,
  },
  subtitle: {
    color: '#4b4c7a',
    marginTop: 4,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroCard: {
    flex: 1,
    minWidth: 260,
    borderRadius: 22,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 211, 0.2)',
    shadowColor: '#ffb0d7',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 159, 211, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: '#d9468f',
    fontWeight: '800',
    fontSize: 12,
  },
  heroTitle: {
    color: '#231b43',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroDesc: {
    color: '#4a4b7a',
    lineHeight: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 219, 0.25)',
  },
  statValue: {
    color: '#1f1b3a',
    fontWeight: '800',
  },
  statLabel: {
    color: '#6c6fa2',
    fontSize: 12,
  },
  nowPlaying: {
    width: 200,
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(124, 146, 255, 0.2)',
    gap: 10,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  cover: {
    width: '100%',
    height: 110,
    borderRadius: 12,
  },
  nowPlayingText: {
    gap: 2,
  },
  nowLabel: {
    color: '#7582c1',
    fontSize: 12,
    fontWeight: '800',
  },
  nowTitle: {
    color: '#1f1b3a',
    fontSize: 16,
    fontWeight: '800',
  },
  nowSubtitle: {
    color: '#5f6695',
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#e6e9ff',
    marginTop: 6,
  },
  progressFill: {
    width: '45%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#ff9fd3',
  },
  nowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,159,211,0.26)',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  filterChipActive: {
    borderColor: '#ff9fd3',
    backgroundColor: 'rgba(255, 159, 211, 0.16)',
  },
  filterLabel: {
    color: '#4a4b7a',
    fontWeight: '700',
  },
  filterLabelActive: {
    color: '#d9468f',
  },
  playlistRow: {
    gap: 12,
    paddingVertical: 4,
  },
  playlistCard: {
    width: 220,
  },
  playlistGradient: {
    borderRadius: 18,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#d8e0ff',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  playlistBadge: {
    color: '#4a4b7a',
    fontWeight: '700',
    fontSize: 12,
  },
  playlistTitle: {
    color: '#1f1b3a',
    fontSize: 17,
    fontWeight: '800',
  },
  playlistSubtitle: {
    color: '#5f6695',
    fontSize: 13,
    lineHeight: 18,
  },
  playlistFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playlistAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  playlistAvatarImg: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    color: '#1f1b3a',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 8,
  },
  mixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mixCard: {
    flexBasis: '48%',
    minWidth: 160,
  },
  mixGradient: {
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#ffffff',
    shadowColor: '#d8e0ff',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  mixHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mixBadge: {
    color: '#ff9fd3',
    fontWeight: '800',
    fontSize: 12,
    backgroundColor: 'rgba(255,159,211,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mixTitle: {
    color: '#1f1b3a',
    fontWeight: '800',
    fontSize: 16,
  },
  mixSubtitle: {
    color: '#5f6695',
    fontSize: 13,
  },
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  utilityCard: {
    flexBasis: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#d8e0ff',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  utilityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,159,211,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityText: {
    flex: 1,
    gap: 2,
  },
  utilityTitle: {
    color: '#1f1b3a',
    fontWeight: '800',
  },
  utilitySubtitle: {
    color: '#5f6695',
    fontSize: 12,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  iconBtnSolid: {
    backgroundColor: '#ff9fd3',
    borderColor: '#ff9fd3',
  },
  primaryBtn: {
    backgroundColor: '#ff9fd3',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#ffb0d7',
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryLabel: {
    color: '#1f1b3a',
    fontWeight: '800',
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  ghostLabel: {
    color: '#1f1b3a',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
