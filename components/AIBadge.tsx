import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AIBadgeProps = {
  soundType?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

export default function AIBadge({ 
  soundType = 'R sesi', 
  position = 'top-right' 
}: AIBadgeProps) {
  const positionStyles = {
    'top-left': { top: 12, left: 12 },
    'top-right': { top: 12, right: 12 },
    'bottom-left': { bottom: 12, left: 12 },
    'bottom-right': { bottom: 12, right: 12 },
  };

  return (
    <View
      style={[
        styles.badge,
        positionStyles[position],
      ]}
      data-badge="ai-suggestion"
    >
      <View style={styles.badgeContent}>
        <Text style={styles.robotEmoji}>🤖</Text>
        <View style={styles.badgeText}>
          <Text style={styles.badgeTitle}>AI Önerisi</Text>
          <Text style={styles.badgeSubtitle}>
            Bugün "{soundType}" öneriliyor
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    zIndex: 10,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    backdropFilter: 'blur(10px)',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  robotEmoji: {
    fontSize: 18,
  },
  badgeText: {
    gap: 2,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgeSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
