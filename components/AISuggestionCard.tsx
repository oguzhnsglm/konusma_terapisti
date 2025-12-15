import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AISuggestionCardProps {
  theme: 'dark' | 'light';
}

export default function AISuggestionCard({ theme }: AISuggestionCardProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isDark = theme === 'dark';

  useEffect(() => {
    // Glow animasyonu
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    );

    // Pulse animasyonu
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    glow.start();
    pulse.start();

    return () => {
      glow.stop();
      pulse.stop();
    };
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const palette = isDark ? {
    gradient: ['#4338ca', '#7c3aed', '#a855f7'] as const,
    textPrimary: '#f0f4ff',
    textSecondary: '#e0e7ff',
    textMuted: '#c7d2fe',
    chipBg: 'rgba(255, 255, 255, 0.15)',
    chipText: '#e0e7ff',
    iconColor: '#fbbf24',
  } : {
    gradient: ['#6366f1', '#8b5cf6', '#a78bfa'] as const,
    textPrimary: '#1e1b4b',
    textSecondary: '#312e81',
    textMuted: '#4c1d95',
    chipBg: 'rgba(255, 255, 255, 0.4)',
    chipText: '#312e81',
    iconColor: '#f59e0b',
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
            shadowColor: '#7c3aed',
          },
        ]}
      />
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="sparkles" size={24} color={palette.iconColor} />
          </View>
          <View style={styles.aiLabel}>
            <Text style={styles.aiText}>AI</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: palette.textPrimary }]}>Kişisel Öneri</Text>
        <Text style={[styles.message, { color: palette.textSecondary }]}>
          Son aktivitelerine göre bugün <Text style={styles.highlight}>"R" sesi</Text> üzerinde çalışmanı öneriyoruz.
        </Text>

        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: palette.chipBg }]}>
            <Ionicons name="analytics-outline" size={12} color={palette.chipText} />
            <Text style={[styles.chipText, { color: palette.chipText }]}>Ses Analizi</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: palette.chipBg }]}>
            <Ionicons name="person-outline" size={12} color={palette.chipText} />
            <Text style={[styles.chipText, { color: palette.chipText }]}>Kişiselleştirilmiş</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: palette.chipBg }]}>
            <Ionicons name="happy-outline" size={12} color={palette.chipText} />
            <Text style={[styles.chipText, { color: palette.chipText }]}>Yaşa Uygun</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: palette.textMuted }]}>
            🎯 Başarı oranını %18 artırabilirsin
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 24,
    shadowRadius: 40,
    shadowOpacity: 0.6,
  },
  gradient: {
    padding: 24,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  highlight: {
    fontWeight: '700',
    color: '#fbbf24',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
