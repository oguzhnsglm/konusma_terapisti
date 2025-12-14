import React from 'react';
import { View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ProgressItem = {
  word: string;
  status?: 'success' | 'fail' | 'pending';
};

type Props = {
  progress: ProgressItem[];
  currentIndex: number;
  style?: StyleProp<ViewStyle>;
};

const STATUS_INDICATOR: Record<string, { color: string; label: string }> = {
  success: { color: '#7bdc96', label: '✓' },
  fail: { color: '#ff9fd3', label: '!' },
  pending: { color: '#9bb7ff', label: '•' },
};

export default function WordProgressList({ progress, currentIndex, style }: Props) {
  const itemCount = progress.length || 0;
  const computedCurrent = itemCount > 0 ? currentIndex % itemCount : 0;

  return (
    <LinearGradient
      colors={['#fef5ff', '#f1f6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.wrapper, style]}
    >
      <Text style={styles.title}>Kelime Yolculuğu</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {progress.map((item, index) => {
          const status = item.status ?? 'pending';
          const isCurrent = index === computedCurrent;
          const indicator = STATUS_INDICATOR[status] ?? STATUS_INDICATOR.pending;

          return (
            <View
              key={`${item.word}-${index}`}
              style={[
                styles.wordItem,
                status === 'success' && styles.wordSuccess,
                status === 'fail' && styles.wordFail,
                status === 'pending' && styles.wordPending,
                isCurrent && styles.wordActive,
              ]}
            >
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: indicator.color },
                  isCurrent && styles.indicatorActive,
                ]}
              >
                <Text style={styles.indicatorLabel}>{indicator.label}</Text>
              </View>
              <Text style={[styles.wordLabel, isCurrent && styles.wordLabelActive]}>
                {item.word}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    paddingVertical: 26,
    paddingHorizontal: 20,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    width: '100%',
    maxHeight: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f1b3a',
    marginBottom: 18,
    letterSpacing: 0.4,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 8,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    gap: 12,
  },
  wordPending: {
    borderColor: 'rgba(155, 183, 255, 0.45)',
  },
  wordSuccess: {
    borderColor: 'rgba(123, 220, 150, 0.5)',
    backgroundColor: 'rgba(123, 220, 150, 0.18)',
  },
  wordFail: {
    borderColor: 'rgba(255, 159, 211, 0.5)',
    backgroundColor: 'rgba(255, 159, 211, 0.2)',
  },
  wordActive: {
    borderWidth: 2,
    borderColor: '#d9468f',
    transform: [{ scale: 1.02 }],
    shadowColor: '#d9468f',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2e9ff',
  },
  indicatorActive: {
    shadowColor: '#d9468f',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  indicatorLabel: {
    color: '#1f1b3a',
    fontSize: 16,
    fontWeight: '800',
  },
  wordLabel: {
    fontSize: 18,
    color: '#1f1b3a',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  wordLabelActive: {
    color: '#d9468f',
    fontWeight: '800',
  },
});
