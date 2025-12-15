import React, { ComponentProps, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import ModeSwitch from '../components/ModeSwitch';
import DailyTaskCard from '../components/DailyTaskCard';
import AIBadge from '../components/AIBadge';
import TodaysMissionCard from '../components/TodaysMissionCard';
import AISuggestionCard from '../components/AISuggestionCard';
import MiniStatCards from '../components/MiniStatCards';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';
import { useMascot } from '../context/MascotContext';
import { useProgress } from '../context/ProgressContext';

type IconName = ComponentProps<typeof Ionicons>['name'];

type NavItem = {
  label: string;
  icon: IconName;
  route?: Href;
  active?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

type Gradient = readonly [string, string, ...string[]];

type HeroTile = {
  title: string;
  subtitle: string;
  gradient: Gradient;
  route: Href;
  glow: 'purple' | 'pink' | 'orange';
};

type ActivityCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  route: Href;
  accent: string;
};

type Stat = {
  value: string;
  label: string;
  icon: IconName;
};

type Palette = {
  backgroundGradient: readonly [string, string, ...string[]];
  sidebarBg: string;
  sidebarBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  panelBg: string;
  panelBorder: string;
  translucentPanel: string;
  linkBorder: string;
  cardBorder: string;
  statBg: string;
  statBorder: string;
  activityBg: string;
  activityBorder: string;
  floatingBg: string;
  floatingBorder: string;
  sectionLink: string;
  accent: string;
  accentContrast: string;
  statIconBg: string;
};

const navSections = [
  {
    title: 'Kitaplığın',
    items: [
      { label: 'Ana Sayfa', icon: 'home', active: true },
      { label: 'Konuşma Pratiği', icon: 'mic-outline', route: '/levels' },
      { label: 'Mini Oyunlar', icon: 'game-controller-outline', route: '/games' },
      { label: 'Hikâye Kitabı', icon: 'book-outline', route: '/progress' },
    ],
  },
  {
    title: 'Aktiviteler',
    items: [
      { label: 'İlerleme', icon: 'stats-chart', route: '/progress' },
      { label: 'Dünyalar Haritası', icon: 'planet-outline', route: '/levels' },
      { label: 'Profil & Avatar', icon: 'person-circle-outline', route: '/settings' },
      { label: 'Ses Paketi', icon: 'musical-notes-outline', route: '/result' },
    ],
  },
  {
    title: 'Bilgi',
    items: [
      { label: 'Daha Fazla Bilgi', icon: 'information-circle-outline', route: '/about' },
    ],
  },
] satisfies NavSection[];

const heroTiles = [
  {
    title: 'Konuşma Pratiği',
    subtitle: 'Kelime ve cümle pratiği yap',
    gradient: ['#6b63ff', '#8f6bff'] as const,
    route: '/levels' as const,
    glow: 'purple',
  },
  {
    title: 'Mini Oyunlar',
    subtitle: 'Eğlenceli oyunlarla öğren',
    gradient: ['#ff4d85', '#ff6f52'] as const,
    route: '/games' as const,
    glow: 'pink',
  },
  {
    title: 'Hikâye Kitabı',
    subtitle: 'Sesli hikayeler oku',
    gradient: ['#f4a949', '#f7c352'] as const,
    route: '/progress' as const,
    glow: 'orange',
  },
] satisfies HeroTile[];

const quickStats: Stat[] = [
  { value: '07 gün', label: 'Günlük Seri', icon: 'flame' },
  { value: '24 görev', label: 'Tamamlanan', icon: 'checkmark-done-outline' },
  { value: '05 oyun', label: 'Mini Oyunlar', icon: 'star-outline' },
];

/**
 * Merkezi aktivite yönlendirme haritası
 * Her aktivitenin BENZERSIZ bir ID'si ve DOĞRU route'u vardır
 */
const ACTIVITY_ROUTES = {
  'memory-puzzles': '/games/memory',
  'world-map': '/levels',
  'progress': '/progress',
  'word-fill-game': '/games/word-fill',
  'rhyme-game': '/games/rhyme',
  'emotion-matching': '/games/colors',
  'profile-avatar': '/settings',
  'voice-encouragement': '/result',
} as const;

const activities = [
  {
    id: 'memory-puzzles',
    title: 'Bulmacalar',
    subtitle: 'Zihin geliştirici bulmacalar',
    icon: 'shapes-outline',
    route: '/games/memory',
    accent: '#5fd1a5',
  },
  {
    id: 'world-map',
    title: 'Dünyalar Haritası',
    subtitle: 'Seviyeleri keşfet',
    icon: 'map-outline',
    route: '/levels',
    accent: '#6cd3ff',
  },
  {
    id: 'progress',
    title: 'İlerleme',
    subtitle: 'Gelişimini takip et',
    icon: 'stats-chart',
    route: '/progress',
    accent: '#9f9cff',
  },
  {
    id: 'word-fill-game',
    title: 'Harf Canavarı',
    subtitle: 'Doğru harfi seç, canavarı besle',
    icon: 'leaf-outline',
    route: '/games/word-fill',
    accent: '#ffd76c',
  },
  {
    id: 'rhyme-game',
    title: 'Ses Çarkı',
    subtitle: 'Çarkı çevir, görevleri yap',
    icon: 'sync-outline',
    route: '/games/rhyme',
    accent: '#ff8fba',
  },
  {
    id: 'counting-game',
    title: 'Sayma',
    subtitle: 'Nesneleri say ve sayıları öğren',
    icon: 'calculator-outline',
    route: '/games/counting',
    accent: '#ffb347',
  },
  {
    id: 'emotion-matching',
    title: 'Duygu Eşleştirme',
    subtitle: 'Yüz ifadelerini duygularla eşleştir',
    icon: 'happy-outline',
    route: '/games/colors',
    accent: '#7ae0f5',
  },
  {
    id: 'profile-avatar',
    title: 'Profil & Avatar',
    subtitle: 'Avatarını seç, profilini kişiselleştir',
    icon: 'person-add-outline',
    route: '/settings',
    accent: '#a3ffcd',
  },
  {
    id: 'voice-encouragement',
    title: 'Sesli Güçlendirme',
    subtitle: 'Bravo! ses paketlerini toplama',
    icon: 'volume-high',
    route: '/result',
    accent: '#66c8ff',
  },
] satisfies ActivityCard[];

const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    backgroundGradient: ['#05070f', '#070d19', '#091328'],
    sidebarBg: 'rgba(12, 18, 30, 0.65)',
    sidebarBorder: 'rgba(255,255,255,0.12)',
    textPrimary: '#f5f7ff',
    textSecondary: '#d5dbff',
    textMuted: '#8f95c9',
    panelBg: 'rgba(14, 20, 33, 0.6)',
    panelBorder: 'rgba(255,255,255,0.14)',
    translucentPanel: 'rgba(255, 255, 255, 0.06)',
    linkBorder: 'rgba(255,255,255,0.2)',
    cardBorder: 'rgba(255,255,255,0.12)',
    statBg: 'rgba(255, 255, 255, 0.06)',
    statBorder: 'rgba(255,255,255,0.12)',
    activityBg: 'rgba(10, 15, 24, 0.6)',
    activityBorder: 'rgba(255,255,255,0.1)',
    floatingBg: 'rgba(10, 14, 23, 0.75)',
    floatingBorder: 'rgba(255,255,255,0.14)',
    sectionLink: '#7effb4',
    accent: '#69ff9c',
    accentContrast: '#04100c',
    statIconBg: 'rgba(255,255,255,0.1)',
  },
  light: {
    backgroundGradient: ['#fefefe', '#f7f9ff', '#eef4ff'],
    sidebarBg: 'rgba(255,255,255,0.7)',
    sidebarBorder: 'rgba(15,23,42,0.12)',
    textPrimary: '#111323',
    textSecondary: '#1f2440',
    textMuted: '#606481',
    panelBg: 'rgba(255,255,255,0.7)',
    panelBorder: 'rgba(15,23,42,0.12)',
    translucentPanel: 'rgba(255,255,255,0.5)',
    linkBorder: 'rgba(15,23,42,0.12)',
    cardBorder: 'rgba(15,23,42,0.12)',
    statBg: 'rgba(255,255,255,0.6)',
    statBorder: 'rgba(15,23,42,0.1)',
    activityBg: 'rgba(255,255,255,0.6)',
    activityBorder: 'rgba(15,23,42,0.1)',
    floatingBg: 'rgba(17,24,39,0.9)',
    floatingBorder: 'rgba(255,255,255,0.2)',
    sectionLink: '#2563eb',
    accent: '#22c55e',
    accentContrast: '#04100c',
    statIconBg: 'rgba(15,23,42,0.1)',
  },
} as const;

export default function HomePage() {
  const router = useRouter();
  const { playSfx } = useAudio();
  const { theme } = useTheme();
  const { celebrate } = useMascot();
  const palette = palettes[theme];

  // Sayfa yüklendiğinde maskota hoşgeldin mesajı göster
  useEffect(() => {
    const timer = setTimeout(() => {
      celebrate('default');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = (route?: Href, activityId?: string) => {
    if (!route) {
      console.error('[Navigation Error] Route tanımlanmamış!', { activityId });
      return;
    }
    
    // Route validation: ACTIVITY_ROUTES haritasında tanımlıysa kontrol et
    if (activityId && (ACTIVITY_ROUTES as Record<string, string>)[activityId]) {
      const expectedRoute = (ACTIVITY_ROUTES as Record<string, string>)[activityId];
      if (expectedRoute !== route) {
        console.warn(`[Navigation Warning] ID mismatch: ${activityId}`, {
          expected: expectedRoute,
          provided: route,
        });
      }
    }
    
    console.log(`[Navigation] ${activityId || 'Navigation'} -> ${route}`);
    playSfx('click');
    router.push(route);
  };

  return (
    <LinearGradient colors={palette.backgroundGradient} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View
            style={[
              styles.sidebar,
              { backgroundColor: palette.sidebarBg, borderColor: palette.sidebarBorder },
            ]}
          >
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Ionicons name="mic" size={18} color="#0d141f" />
              </View>
              <View>
                <Text style={[styles.brandTitle, { color: palette.textPrimary }]}>Konuşma Terapisti</Text>
                <Text style={[styles.brandSubtitle, { color: palette.textMuted }]}>
                  Çocuklar için eğlenceli konuşma pratiği
                </Text>
              </View>
            </View>

            {navSections.map((section) => (
              <View key={section.title} style={styles.navSection}>
                <Text style={[styles.navTitle, { color: palette.textMuted }]}>{section.title}</Text>
                {section.items.map((item) => (
                  <SidebarButton
                    key={item.label}
                    item={item}
                    palette={palette}
                    onPress={() => handleNav(item.route)}
                  />
                ))}
              </View>
            ))}

            <View
              style={[
                styles.sidebarCard,
                { backgroundColor: palette.translucentPanel, borderColor: palette.panelBorder },
              ]}
            >
              <Text style={[styles.sidebarCardTitle, { color: palette.textPrimary }]}>Çocuk modu açık</Text>
              <Text style={[styles.sidebarCardSubtitle, { color: palette.textMuted }]}>
                İçerikler yaşa uygun filtrelenir, bildirimler sadeleşir.
              </Text>
              <SidebarCardButton
                label="Tercihleri Düzenle"
                palette={palette}
                onPress={() => handleNav('/settings')}
              />
            </View>
          </View>

          <View style={styles.main}>
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.welcomeLabel, { color: palette.textMuted }]}>Ana Sayfa</Text>
                <Text style={[styles.welcomeTitle, { color: palette.textPrimary }]}>Merhaba!</Text>
                <Text style={[styles.welcomeSubtitle, { color: palette.textSecondary }]}>
                  Hızlı başlangıç kartların hazır.
                </Text>
              </View>

              <View style={styles.headerActions}>
                <ModeSwitch />
                <HeaderButton
                  icon="settings-outline"
                  palette={palette}
                  onPress={() => handleNav('/settings')}
                />
                <HeaderLinkButton
                  label="Giriş Yap"
                  palette={palette}
                  onPress={() => handleNav('/login')}
                />
                <HeaderCtaButton
                  label="Kayıt Ol"
                  palette={palette}
                  onPress={() => handleNav('/register')}
                />
              </View>
            </View>

            <View style={styles.heroRow}>
              {heroTiles.map((tile) => (
                <HeroCard
                  key={tile.title}
                  tile={tile}
                  palette={palette}
                  onPress={() => handleNav(tile.route)}
                />
              ))}
            </View>

            <View style={styles.statsRow}>
              {quickStats.map((stat) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statCard,
                    { backgroundColor: palette.statBg, borderColor: palette.statBorder },
                  ]}
                  data-animate="fade-in"
                >
                  <View style={[styles.statIcon, { backgroundColor: palette.statIconBg }]}>
                    <Ionicons
                      name={stat.icon}
                      size={16}
                      color={theme === 'dark' ? '#ebf3ff' : '#0f172a'}
                    />
                  </View>
                  <Text style={[styles.statValue, { color: palette.textPrimary }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: palette.textMuted }]}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <TodaysMissionCard 
              theme={theme}
              onComplete={() => celebrate('achievement')}
            />

            <AISuggestionCard theme={theme} />

            <MiniStatCards theme={theme} />

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Tüm Aktiviteler</Text>
              <SectionLinkButton 
                label="Hepsini gör"
                palette={palette}
                onPress={() => handleNav('/games')}
              />
            </View>

            <View style={styles.activityGrid}>
              {activities.map((activity) => (
                <ActivityCardView
                  key={activity.id}
                  palette={palette}
                  activity={activity}
                  onPress={() => handleNav(activity.route, activity.id)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function SidebarButton({ item, palette, onPress }: { item: NavItem; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsHovered(false)}
      onPressOut={() => setIsHovered(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.sidebarItem,
        item.active && { backgroundColor: palette.accent, ...styles.shadowSm },
        !item.active && isHovered && { backgroundColor: palette.translucentPanel, transform: [{ translateY: -1 }] },
        pressed && styles.pressedScale,
      ]}
      data-menu-item="true"
      data-menu-item-active={item.active ? 'active' : undefined}
    >
      <Ionicons
        name={item.icon}
        size={18}
        color={item.active ? palette.accentContrast : palette.textMuted}
      />
      <Text
        style={[
          styles.sidebarItemLabel,
          { color: item.active ? palette.accentContrast : palette.textSecondary },
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

function HeaderButton({ icon, palette, onPress }: { icon: IconName; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.iconButton,
        { borderColor: palette.linkBorder },
        isHovered && { borderColor: palette.cardBorder, ...styles.shadowSm },
        pressed && styles.pressedScale,
      ]}
    >
      <Ionicons name={icon} size={20} color={palette.textSecondary} />
    </Pressable>
  );
}

function HeaderLinkButton({ label, palette, onPress }: { label: string; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.linkBtn,
        { borderColor: palette.linkBorder },
        isHovered && { borderColor: palette.cardBorder, ...styles.shadowSm },
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={[styles.linkBtnLabel, { color: palette.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

function HeaderCtaButton({ label, palette, onPress }: { label: string; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.ctaBtn,
        { backgroundColor: palette.accent },
        isHovered && styles.shadowMd,
        !isHovered && styles.shadowSm,
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={[styles.ctaBtnLabel, { color: palette.accentContrast }]}>{label}</Text>
    </Pressable>
  );
}

function SidebarCardButton({ label, palette, onPress }: { label: string; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.sidebarCardBtn,
        { backgroundColor: palette.accent },
        isHovered && styles.shadowSm,
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={[styles.sidebarCardBtnLabel, { color: palette.accentContrast }]}>{label}</Text>
    </Pressable>
  );
}

function SectionLinkButton({ label, palette, onPress }: { label: string; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable 
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <Text 
        style={[
          styles.sectionLink, 
          { color: palette.sectionLink },
          isHovered && { opacity: 0.8, textDecorationLine: 'underline' }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}



function HeroCard({ tile, palette, onPress }: { tile: HeroTile; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Pressable 
      onPress={onPress} 
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.heroCard,
        isHovered && { 
          transform: [{ translateY: -6 }, { scale: 1.04 }],
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        pressed && { transform: [{ translateY: -2 }, { scale: 0.98 }] }
      ]}
      data-animate="fade-in"
      data-glow={tile.glow}
      data-card="hero"
    >
      <LinearGradient
        colors={tile.gradient}
        style={[
          styles.heroGradient, 
          { borderColor: palette.cardBorder },
          isHovered && styles.shadowLg,
          !isHovered && styles.shadowMd,
        ]}
      >
        <Text style={styles.heroCardLabel}>Hızlı Başlangıç</Text>
        <Text style={styles.heroCardTitle}>{tile.title}</Text>
        <Text style={styles.heroCardSubtitle}>{tile.subtitle}</Text>
        <View style={[
          styles.heroCardFooter,
          isHovered && { 
            borderColor: 'rgba(255,255,255,0.8)',
            transform: [{ translateX: 4 }],
          }
        ]}>
          <Ionicons 
            name="arrow-forward" 
            size={18} 
            color="#ffffff"
            style={{
              transform: isHovered ? [{ translateX: 3 }] : [{ translateX: 0 }],
            }}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function ActivityCardView({ activity, palette, onPress }: { activity: ActivityCard; palette: Palette; onPress: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const shouldShowAIBadge = activity.id === 'word-fill-game'; // Add AI badge to letter monster game
  
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.activityCard,
        {
          backgroundColor: palette.activityBg,
          borderColor: isHovered ? palette.cardBorder : palette.activityBorder,
        },
        isHovered && { 
          transform: [{ translateY: -5 }, { scale: 1.05 }],
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
        !isHovered && styles.shadowSm,
        pressed && { transform: [{ translateY: -2 }, { scale: 0.98 }] },
      ]}
      data-animate="fade-in"
      data-card="activity"
    >
      {shouldShowAIBadge && <AIBadge soundType="R sesi" position="top-right" />}
      <View style={[
        styles.activityIcon, 
        { backgroundColor: activity.accent },
        isHovered && { 
          opacity: 1,
          transform: [{ scale: 1.1 }, { rotate: '5deg' }],
        }
      ]}>
        <Ionicons 
          name={activity.icon} 
          size={18} 
          color="#05070f"
          data-icon-motion="true"
        />
      </View>
      <View style={styles.activityText}>
        <Text style={[styles.activityTitle, { color: palette.textPrimary }]}>{activity.title}</Text>
        <Text style={[styles.activitySubtitle, { color: palette.textMuted }]}>
          {activity.subtitle}
        </Text>
      </View>
      <Feather 
        name="chevron-right" 
        size={18} 
        color="#6f7391"
        data-icon-motion="true"
        style={{
          transform: isHovered ? [{ translateX: 4 }] : [{ translateX: 0 }],
        }}
      />
    </Pressable>
  );
}

function SummaryStatBox({
  icon,
  label,
  value,
  unit,
  color,
  palette,
}: {
  icon: IconName;
  label: string;
  value: number;
  unit: string;
  color: string;
  palette: Palette;
}) {
  return (
    <View
      style={[
        styles.summaryBox,
        { backgroundColor: palette.translucentPanel, borderColor: palette.cardBorder },
      ]}
    >
      <View style={[styles.summaryIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.summaryValue, { color: palette.textPrimary }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.summaryUnit, { color: palette.textSecondary }]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 56,
  },
  shell: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  sidebar: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 260,
    maxWidth: 320,
    backgroundColor: 'rgba(12, 18, 30, 0.72)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  brandRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#69ff9c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#69ff9c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  brandTitle: {
    color: '#f7f9ff',
    fontSize: 16,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#9198c4',
    fontSize: 12,
    marginTop: 2,
  },
  navSection: {
    marginBottom: 24,
    gap: 6,
  },
  navTitle: {
    color: '#6e72a5',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  sidebarItemActive: {
    backgroundColor: '#69ff9c',
  },
  sidebarItemLabel: {
    color: '#c3c6ff',
    fontWeight: '600',
  },
  sidebarItemLabelActive: {
    color: '#05070f',
  },
  sidebarCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  sidebarCardTitle: {
    color: '#f7f9ff',
    fontWeight: '700',
  },
  sidebarCardSubtitle: {
    color: '#8d94c8',
    fontSize: 12,
  },
  sidebarCardBtn: {
    marginTop: 8,
    backgroundColor: '#69ff9c',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  sidebarCardBtnLabel: {
    color: '#05070f',
    fontWeight: '700',
  },
  main: {
    flex: 1,
    minWidth: 320,
    maxWidth: 960,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  welcomeLabel: {
    color: '#6e72a5',
    fontSize: 13,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  welcomeSubtitle: {
    color: '#9198c4',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  iconButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  linkBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  linkBtnLabel: {
    color: '#d4d4ff',
    fontWeight: '700',
  },
  ctaBtn: {
    backgroundColor: '#69ff9c',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  ctaBtnLabel: {
    color: '#05070f',
    fontWeight: '800',
  },
  heroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  heroCard: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 200,
    transitionProperty: 'transform',
    transitionDuration: '180ms',
  },
  heroGradient: {
    borderRadius: 24,
    padding: 20,
    gap: 8,
    minHeight: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  heroCardLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroCardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroCardSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  heroCardFooter: {
    marginTop: 12,
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'border-color',
    transitionDuration: '180ms',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flexGrow: 1,
    minWidth: 160,
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8d94c8',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#69ff9c',
    fontWeight: '700',
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  activityCard: {
    flexBasis: '48%',
    minWidth: 220,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(12, 18, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    transitionProperty: 'all',
    transitionDuration: '180ms',
  },
  activityIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'opacity',
    transitionDuration: '180ms',
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: '#ffffff',
    fontWeight: '700',
  },
  activitySubtitle: {
    color: '#9198c4',
    fontSize: 12,
  },
  // Shadow system
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  // Interaction states
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  pressedScale: {
    transform: [{ scale: 0.98 }],
  },
});
