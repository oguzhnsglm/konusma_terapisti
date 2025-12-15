import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type Palette = {
  backgroundGradient: readonly [string, string, ...string[]];
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  panelBg: string;
  panelBorder: string;
};

type DailyTaskCardProps = {
  progress?: number;
  onPress?: () => void;
};

const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    backgroundGradient: ['#05070f', '#070d19', '#091328'],
    textPrimary: '#f5f7ff',
    textSecondary: '#d5dbff',
    textMuted: '#8f95c9',
    panelBg: 'rgba(14, 20, 33, 0.6)',
    panelBorder: 'rgba(255,255,255,0.14)',
  },
  light: {
    backgroundGradient: ['#fefefe', '#f7f9ff', '#eef4ff'],
    textPrimary: '#111323',
    textSecondary: '#1f2440',
    textMuted: '#606481',
    panelBg: 'rgba(255,255,255,0.7)',
    panelBorder: 'rgba(15,23,42,0.12)',
  },
};

export default function DailyTaskCard({ progress = 60, onPress }: DailyTaskCardProps) {
  const { theme } = useTheme();
  const palette = palettes[theme];
  const progressRef = useRef<View>(null);

  useEffect(() => {
    // Trigger CSS animation when component mounts
    if (progressRef.current) {
      const element = progressRef.current as any;
      if (element.style) {
        element.style.setProperty('--progress-value', `${progress}%`);
      }
    }
  }, [progress]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.panelBg,
          borderColor: palette.panelBorder,
        },
      ]}
      data-animate="fade-in"
      data-card="daily-task"
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.emoji, { fontSize: 24 }]}>🎯</Text>
          <View style={styles.titleContent}>
            <Text style={[styles.title, { color: palette.textPrimary }]}>
              Bugünün Görevi
            </Text>
            <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
              3 kelimeyi doğru telaffuz et
            </Text>
          </View>
        </View>
        <Ionicons 
          name="arrow-forward" 
          size={20} 
          color={palette.textMuted}
          style={{ opacity: 0.6 }}
          data-icon-motion="true"
        />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            ref={progressRef}
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: '#10b981',
              },
            ]}
            data-progress-bar="true"
          />
        </View>
        <Text style={[styles.progressText, { color: palette.textMuted }]}>
          {progress}% tamamlandı
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardEmoji}>⭐</Text>
          <Text style={[styles.rewardText, { color: palette.textSecondary }]}>
            +50 Puan
          </Text>
        </View>
        <Text style={[styles.timeLeft, { color: palette.textMuted }]}>
          14s içinde bitti
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  emoji: {
    marginTop: 4,
  },
  titleContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 12,
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  rewardEmoji: {
    fontSize: 14,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeLeft: {
    fontSize: 11,
    fontWeight: '500',
  },
});
