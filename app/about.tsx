import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import ModeSwitch from '../components/ModeSwitch';
import { useTheme } from '../context/ThemeContext';

type Palette = {
  backgroundGradient: readonly [string, string, ...string[]];
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  panelBg: string;
  panelBorder: string;
  cardBorder: string;
  accent: string;
  accentSecondary: string;
  sectionLink: string;
};

const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    backgroundGradient: ['#05070f', '#070d19', '#091328'],
    textPrimary: '#f5f7ff',
    textSecondary: '#d5dbff',
    textMuted: '#8f95c9',
    panelBg: 'rgba(14, 20, 33, 0.6)',
    panelBorder: 'rgba(255,255,255,0.14)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#69ff9c',
    accentSecondary: '#7c3aed',
    sectionLink: '#7effb4',
  },
  light: {
    backgroundGradient: ['#fefefe', '#f7f9ff', '#eef4ff'],
    textPrimary: '#111323',
    textSecondary: '#1f2440',
    textMuted: '#606481',
    panelBg: 'rgba(255,255,255,0.7)',
    panelBorder: 'rgba(15,23,42,0.12)',
    cardBorder: 'rgba(15,23,42,0.12)',
    accent: '#22c55e',
    accentSecondary: '#7c3aed',
    sectionLink: '#2563eb',
  },
};

export default function AboutPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const palette = palettes[theme];

  const handleBack = () => {
    router.push('/');
  };

  return (
    <LinearGradient colors={palette.backgroundGradient} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable 
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backBtn,
              { borderColor: palette.cardBorder },
              pressed && { opacity: 0.7 }
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={palette.accent} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.pageTitle, { color: palette.textPrimary }]}>Daha Fazla Bilgi</Text>
            <Text style={[styles.pageSubtitle, { color: palette.textMuted }]}>
              Bilimsel temeller ve metodoloji
            </Text>
          </View>
          <ModeSwitch />
        </View>

        {/* Scientific Basis Card */}
        <ScientificBasisCard palette={palette} />

        {/* Progress Measurement Card */}
        <ProgressMeasurementCard palette={palette} />

        {/* Interactive Chart Card */}
        <InteractiveChartCard palette={palette} />

        {/* Case Study Card */}
        <CaseStudyCard palette={palette} />

        {/* Ethics Card */}
        <EthicsCard palette={palette} />

        <View style={styles.footer} />
      </ScrollView>
    </LinearGradient>
  );
}

function ScientificBasisCard({ palette }: { palette: Palette }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const basis = [
    { icon: 'volume-high-outline' as const, label: 'Artikülasyon Terapisi', desc: 'Ses telaffuzu doğru yapılması' },
    { icon: 'book-outline' as const, label: 'Fonolojik Farkındalık', desc: 'Ses sisteminin öğrenilmesi' },
    { icon: 'repeat-outline' as const, label: 'Tekrarlı Pratik', desc: 'Spaced Repetition metodu' },
    { icon: 'game-controller-outline' as const, label: 'Oyunlaştırma', desc: 'Eğlenceli öğrenme ortamı' },
  ];

  return (
    <Animated.View
      style={[
        styles.infoCard,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.cardBorder,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
      data-animate="fade-in"
    >
      <View style={styles.cardHeader}>
        <Ionicons name="flask-outline" size={24} color={palette.accentSecondary} />
        <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>Bilimsel Temel</Text>
      </View>

      <View style={styles.basisGrid}>
        {basis.map((item, index) => (
          <BasisItem key={index} item={item} palette={palette} index={index} />
        ))}
      </View>

      <View style={[styles.disclaimer, { borderTopColor: palette.cardBorder }]}>
        <Ionicons name="checkmark-circle" size={14} color={palette.accentSecondary} />
        <Text style={[styles.disclaimerText, { color: palette.textMuted }]}>
          Akademik çalışmalara ve uluslararası standartlara dayalıdır
        </Text>
      </View>
    </Animated.View>
  );
}

function BasisItem({
  item,
  palette,
  index,
}: {
  item: { icon: any; label: string; desc: string };
  palette: Palette;
  index: number;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.basisItem,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={({ pressed }) => [
          styles.basisItemContent,
          {
            backgroundColor: isHovered ? palette.cardBorder : 'transparent',
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[styles.basisIcon, { backgroundColor: palette.accentSecondary + '25' }]}>
          <Ionicons name={item.icon} size={20} color={palette.accentSecondary} />
        </View>
        <Text style={[styles.basisLabel, { color: palette.textPrimary }]}>{item.label}</Text>
        <Text style={[styles.basisDesc, { color: palette.textMuted }]}>{item.desc}</Text>
      </Pressable>
    </Animated.View>
  );
}

function ProgressMeasurementCard({ palette }: { palette: Palette }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  const measurements = [
    {
      label: 'Doğru Telaffuz Oranı',
      value: '85%',
      icon: 'checkmark-circle-outline' as const,
      color: '#10b981',
    },
    {
      label: 'Hata Türü Analizi',
      value: '3/7',
      icon: 'alert-circle-outline' as const,
      color: '#f59e0b',
    },
    {
      label: 'Tepki Süresi',
      value: '1.2s',
      icon: 'timer-outline' as const,
      color: '#3b82f6',
    },
  ];

  return (
    <Animated.View
      style={[
        styles.infoCard,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.cardBorder,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
      data-animate="fade-in"
    >
      <View style={styles.cardHeader}>
        <Ionicons name="stats-chart-outline" size={24} color={palette.accentSecondary} />
        <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>İlerleme Nasıl Ölçülür?</Text>
      </View>

      <View style={styles.measurementGrid}>
        {measurements.map((item, index) => (
          <MeasurementItem key={index} item={item} palette={palette} index={index} />
        ))}
      </View>

      <View style={[styles.disclaimer, { borderTopColor: palette.cardBorder }]}>
        <Ionicons name="information-circle" size={14} color={palette.accentSecondary} />
        <Text style={[styles.disclaimerText, { color: palette.textMuted }]}>
          Gösterilen veriler örnek/simülasyon amaçlıdır
        </Text>
      </View>
    </Animated.View>
  );
}

function MeasurementItem({
  item,
  palette,
  index,
}: {
  item: { label: string; value: string; icon: any; color: string };
  palette: Palette;
  index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      delay: 200 + index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.measurementItem,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <View style={[styles.measurementIcon, { backgroundColor: item.color + '25' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={[styles.measurementLabel, { color: palette.textMuted }]}>{item.label}</Text>
      <Text style={[styles.measurementValue, { color: item.color }]}>{item.value}</Text>
    </Animated.View>
  );
}

function InteractiveChartCard({ palette }: { palette: Palette }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const preTestScore = 42;
  const postTestScore = 87;
  const improvement = postTestScore - preTestScore;

  return (
    <Animated.View
      style={[
        styles.infoCard,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.cardBorder,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
      data-animate="fade-in"
    >
      <View style={styles.cardHeader}>
        <Ionicons name="trending-up-outline" size={24} color={palette.accentSecondary} />
        <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>Gelişim Grafiği</Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {[
            { label: 'Ön Test', value: preTestScore, color: '#f59e0b' },
            { label: 'Son Test', value: postTestScore, color: '#10b981' },
          ].map((bar, index) => (
            <View key={index} style={styles.barGroup}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: bar.color,
                    height: `${animatedValue * bar.value}%`,
                  },
                ]}
              />
              <Text style={[styles.barLabel, { color: palette.textMuted }]}>{bar.label}</Text>
              <Text style={[styles.barValue, { color: bar.color }]}>{bar.value}%</Text>
            </View>
          ))}
        </View>

        <View style={[styles.improvement, { backgroundColor: palette.cardBorder }]}>
          <Ionicons name="star" size={16} color={palette.accentSecondary} />
          <Text style={[styles.improvementText, { color: palette.textPrimary }]}>
            {improvement}% İyileşme
          </Text>
        </View>
      </View>

      <View style={[styles.disclaimer, { borderTopColor: palette.cardBorder }]}>
        <Ionicons name="information-circle" size={14} color={palette.accentSecondary} />
        <Text style={[styles.disclaimerText, { color: palette.textMuted }]}>
          Animasyonlu grafik örneği
        </Text>
      </View>
    </Animated.View>
  );
}

function CaseStudyCard({ palette }: { palette: Palette }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.infoCard,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.cardBorder,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
      data-animate="fade-in"
    >
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={24} color={palette.accentSecondary} />
        <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>Örnek Terapi Senaryosu</Text>
      </View>

      <View style={styles.caseStudyContent}>
        <View style={styles.caseStudyItem}>
          <Text style={[styles.caseStudyLabel, { color: palette.textMuted }]}>Yaş Grubu</Text>
          <Text style={[styles.caseStudyValue, { color: palette.textPrimary }]}>6–8 yaş</Text>
        </View>

        <View style={styles.caseStudyItem}>
          <Text style={[styles.caseStudyLabel, { color: palette.textMuted }]}>Çalışma Süresi</Text>
          <Text style={[styles.caseStudyValue, { color: palette.textPrimary }]}>8 hafta, haftada 3 gün</Text>
        </View>

        <View style={styles.caseStudyItem}>
          <Text style={[styles.caseStudyLabel, { color: palette.textMuted }]}>Başlangıç Seviyesi</Text>
          <Text style={[styles.caseStudyValue, { color: palette.textPrimary }]}>%32 doğru telaffuz</Text>
        </View>

        <View style={styles.caseStudyItem}>
          <Text style={[styles.caseStudyLabel, { color: palette.textMuted }]}>Sonuç</Text>
          <Text style={[styles.caseStudyValue, { color: '#10b981' }]}>%89 doğru telaffuz ✓</Text>
        </View>

        <View style={[styles.progressBarContainer, { backgroundColor: palette.cardBorder }]}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: palette.accentSecondary, width: '89%' },
            ]}
          />
        </View>
      </View>

      <View style={[styles.disclaimer, { borderTopColor: palette.cardBorder }]}>
        <Ionicons name="information-circle" size={14} color={palette.accentSecondary} />
        <Text style={[styles.disclaimerText, { color: palette.textMuted }]}>
          Gerçek kullanıcı verileri örneğidir
        </Text>
      </View>
    </Animated.View>
  );
}

function EthicsCard({ palette }: { palette: Palette }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ethicsCard,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.accentSecondary,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
      data-animate="fade-in"
    >
      <View style={[styles.ethicsHeader, { borderBottomColor: palette.cardBorder }]}>
        <Ionicons name="shield-checkmark-outline" size={28} color={palette.accentSecondary} />
        <Text style={[styles.ethicsTitle, { color: palette.textPrimary }]}>
          Etik & Bilimsel Sorumluluk
        </Text>
      </View>

      <View style={styles.ethicsContent}>
        <Text style={[styles.ethicsText, { color: palette.textPrimary }]}>
          Bu uygulama klinik tanı koymaz.
        </Text>
        <Text style={[styles.ethicsText, { color: palette.textPrimary }]}>
          Konuşma terapistlerini destekleyici,
        </Text>
        <Text style={[styles.ethicsText, { color: palette.textPrimary }]}>
          eğitsel bir dijital araçtır.
        </Text>

        <View style={[styles.ethicsNote, { backgroundColor: palette.cardBorder }]}>
          <Ionicons name="alert-circle-outline" size={16} color={palette.accentSecondary} />
          <Text style={[styles.ethicsNoteText, { color: palette.textSecondary }]}>
            Profesyonel danışmanlık için uzman hekime başvurunuz
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ethicsCard: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  basisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  basisItem: {
    width: '48%',
  },
  basisItemContent: {
    borderRadius: 16,
    padding: 12,
  },
  basisIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  basisLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  basisDesc: {
    fontSize: 12,
  },
  measurementGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  measurementItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  measurementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartContainer: {
    gap: 16,
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 32,
    height: 180,
  },
  barGroup: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bar: {
    width: 50,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  improvement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  improvementText: {
    fontSize: 14,
    fontWeight: '700',
  },
  caseStudyContent: {
    gap: 12,
    marginBottom: 16,
  },
  caseStudyItem: {
    gap: 4,
  },
  caseStudyLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  caseStudyValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  disclaimerText: {
    fontSize: 12,
    flex: 1,
  },
  ethicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
  },
  ethicsTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  ethicsContent: {
    padding: 20,
    gap: 12,
  },
  ethicsText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  ethicsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  ethicsNoteText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    height: 40,
  },
});
