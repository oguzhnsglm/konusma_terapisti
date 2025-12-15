import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MiniStatCardsProps {
  theme: 'dark' | 'light';
}

export default function MiniStatCards({ theme }: MiniStatCardsProps) {
  const isDark = theme === 'dark';

  const palette = isDark ? {
    cardBg: 'rgba(18, 25, 42, 0.7)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#f0f4ff',
    textSecondary: '#cbd5f0',
    textMuted: '#8f95c9',
  } : {
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(15, 23, 42, 0.1)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
  };

  const stats = [
    {
      icon: 'volume-high' as const,
      label: 'En çok çalışılan',
      value: 'R sesi',
      color: '#a78bfa',
      bgColor: 'rgba(167, 139, 250, 0.15)',
    },
    {
      icon: 'trending-up' as const,
      label: 'Haftalık ilerleme',
      value: '%72',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      icon: 'happy' as const,
      label: 'Bugünkü ruh hali',
      value: '😊 Mutlu',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.15)',
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: palette.cardBg,
              borderColor: palette.cardBorder,
            },
          ]}
        >
          <View style={[styles.iconBadge, { backgroundColor: stat.bgColor }]}>
            <Ionicons name={stat.icon} size={20} color={stat.color} />
          </View>
          <Text style={[styles.label, { color: palette.textMuted }]}>{stat.label}</Text>
          <Text style={[styles.value, { color: palette.textPrimary }]}>{stat.value}</Text>
          
          {/* Fake mini progress ring */}
          {index === 1 && (
            <View style={styles.miniProgressRing}>
              <View style={[styles.progressSegment, { borderColor: stat.color }]} />
              <View style={[styles.progressSegment, { borderColor: stat.color, opacity: 0.3 }]} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  miniProgressRing: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    transform: [{ rotate: '-45deg' }],
  },
  progressSegment: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
