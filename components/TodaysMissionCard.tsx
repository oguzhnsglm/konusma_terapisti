import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TodaysMissionCardProps {
  theme: 'dark' | 'light';
  onComplete?: () => void;
}

export default function TodaysMissionCard({ theme, onComplete }: TodaysMissionCardProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;

  const isDark = theme === 'dark';
  const targetProgress = 75; // %75 tamamlanmış görev
  const streakDays = 7;

  useEffect(() => {
    // Progress bar animasyonu
    const timer = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: targetProgress,
        duration: 1800,
        useNativeDriver: false,
      }).start();
      setProgress(targetProgress);
    }, 300);

    // Glow animasyonu (loop)
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowLoop.start();

    // Streak animasyonu (zıplama)
    const streakBounce = Animated.loop(
      Animated.sequence([
        Animated.timing(streakScale, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(streakScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    streakBounce.start();

    return () => {
      clearTimeout(timer);
      glowLoop.stop();
      streakBounce.stop();
    };
  }, []);

  const handleComplete = () => {
    if (isComplete) return;
    
    setIsComplete(true);
    setShowConfetti(true);
    
    // Confetti animasyonu
    Animated.sequence([
      Animated.timing(confettiOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(confettiOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setShowConfetti(false));

    onComplete?.();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const palette = isDark ? {
    cardBg: 'rgba(18, 25, 42, 0.8)',
    cardBorder: 'rgba(124, 58, 237, 0.3)',
    textPrimary: '#f0f4ff',
    textSecondary: '#cbd5f0',
    textMuted: '#8f95c9',
    accent: '#7c3aed',
    accentLight: '#a78bfa',
    progressBg: 'rgba(124, 58, 237, 0.15)',
    progressFill: ['#7c3aed', '#a78bfa'] as const,
  } : {
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(124, 58, 237, 0.25)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#7c3aed',
    accentLight: '#a78bfa',
    progressBg: 'rgba(124, 58, 237, 0.1)',
    progressFill: ['#7c3aed', '#a78bfa'] as const,
  };

  return (
    <Pressable
      onPress={handleComplete}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
            shadowColor: palette.accent,
          },
        ]}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBadge, { backgroundColor: palette.accent }]}>
            <Ionicons name="trophy" size={20} color="#fff" />
          </View>
          <View>
            <Text style={[styles.title, { color: palette.textPrimary }]}>Bugünün Görevi</Text>
            <Text style={[styles.subtitle, { color: palette.textMuted }]}>
              'R' sesini 5 kez tekrar et
            </Text>
          </View>
        </View>
        
        <Animated.View style={{ transform: [{ scale: streakScale }] }}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakText, { color: palette.accent }]}>{streakDays} gün</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: palette.textSecondary }]}>İlerleme</Text>
          <Text style={[styles.progressValue, { color: palette.accent }]}>{progress}%</Text>
        </View>
        
        <View style={[styles.progressTrack, { backgroundColor: palette.progressBg }]}>
          <Animated.View style={{ width: progressWidth, height: '100%' }}>
            <LinearGradient
              colors={palette.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardEmoji}>⭐</Text>
            <Text style={[styles.rewardText, { color: palette.textMuted }]}>+50 Puan</Text>
          </View>
          {!isComplete && (
            <Text style={[styles.tapHint, { color: palette.textMuted }]}>
              Dokunarak tamamla
            </Text>
          )}
          {isComplete && (
            <View style={styles.completeBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={[styles.completeText, { color: '#10b981' }]}>Tamamlandı!</Text>
            </View>
          )}
        </View>
      </View>

      {showConfetti && (
        <Animated.View style={[styles.confettiContainer, { opacity: confettiOpacity }]}>
          {[...Array(12)].map((_, i) => (
            <Text
              key={i}
              style={[
                styles.confetti,
                {
                  left: `${(i * 8) + 10}%`,
                  animationDelay: `${i * 50}ms`,
                },
              ]}
            >
              {['⭐', '🎉', '✨', '🌟'][i % 4]}
            </Text>
          ))}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    marginBottom: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 28,
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressSection: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardEmoji: {
    fontSize: 16,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    top: -20,
    fontSize: 24,
  },
});
