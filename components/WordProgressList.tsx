import React from 'react';
import { View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

type ProgressItem = {
  word: string;
  status?: 'success' | 'fail' | 'pending';
};

type Props = {
  progress: ProgressItem[];
  currentIndex: number;
  style?: StyleProp<ViewStyle>;
};

type Palette = {
  backgroundGradient: readonly [string, string];
  cardBg: string;
  cardBorder: string;
  cardSuccessBg: string;
  cardSuccessBorder: string;
  cardFailBg: string;
  cardFailBorder: string;
  cardActiveBorder: string;
  indicatorSuccess: string;
  indicatorFail: string;
  indicatorPending: string;
  textPrimary: string;
  textAccent: string;
  shadow: string;
};

const darkPalette: Palette = {
  backgroundGradient: ['#1a1230', '#2a1f4d'] as const,
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  cardSuccessBg: 'rgba(123, 220, 150, 0.15)',
  cardSuccessBorder: 'rgba(123, 220, 150, 0.35)',
  cardFailBg: 'rgba(255, 159, 211, 0.15)',
  cardFailBorder: 'rgba(255, 159, 211, 0.35)',
  cardActiveBorder: '#ff9fd3',
  indicatorSuccess: '#7bdc96',
  indicatorFail: '#ff9fd3',
  indicatorPending: '#9bb7ff',
  textPrimary: '#ffffff',
  textAccent: '#ff9fd3',
  shadow: '#000000',
};

const lightPalette: Palette = {
  backgroundGradient: ['#fef5ff', '#f1f6ff'] as const,
  cardBg: 'rgba(255, 255, 255, 0.75)',
  cardBorder: 'rgba(0, 0, 0, 0.05)',
  cardSuccessBg: 'rgba(123, 220, 150, 0.18)',
  cardSuccessBorder: 'rgba(123, 220, 150, 0.5)',
  cardFailBg: 'rgba(255, 159, 211, 0.2)',
  cardFailBorder: 'rgba(255, 159, 211, 0.5)',
  cardActiveBorder: '#d9468f',
  indicatorSuccess: '#7bdc96',
  indicatorFail: '#ff9fd3',
  indicatorPending: '#9bb7ff',
  textPrimary: '#1f1b3a',
  textAccent: '#d9468f',
  shadow: '#c1d5ff',
};

const STATUS_INDICATOR: Record<string, { label: string }> = {
  success: { label: '✓' },
  fail: { label: '!' },
  pending: { label: '•' },
};

export default function WordProgressList({ progress, currentIndex, style }: Props) {
  const { theme } = useTheme();
  const palette = theme === 'dark' ? darkPalette : lightPalette;
  const itemCount = progress.length || 0;
  const computedCurrent = itemCount > 0 ? currentIndex % itemCount : 0;

  return (
    <LinearGradient
      colors={palette.backgroundGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.wrapper, style]}
    >
      <Text style={[styles.title, { color: palette.textPrimary }]}>Kelime Yolculuğu</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {progress.map((item, index) => {
          const status = item.status ?? 'pending';
          const isCurrent = index === computedCurrent;
          const indicator = STATUS_INDICATOR[status] ?? STATUS_INDICATOR.pending;

          const indicatorColor =
            status === 'success'
              ? palette.indicatorSuccess
              : status === 'fail'
              ? palette.indicatorFail
              : palette.indicatorPending;

          const cardBg =
            status === 'success'
              ? palette.cardSuccessBg
              : status === 'fail'
              ? palette.cardFailBg
              : palette.cardBg;

          const cardBorder =
            status === 'success'
              ? palette.cardSuccessBorder
              : status === 'fail'
              ? palette.cardFailBorder
              : palette.cardBorder;

          return (
            <View
              key={`${item.word}-${index}`}
              style={[
                styles.wordItem,
                { backgroundColor: cardBg, borderColor: cardBorder },
                isCurrent && {
                  borderWidth: 2.5,
                  borderColor: palette.cardActiveBorder,
                  transform: [{ scale: 1.03 }],
                },
              ]}
            >
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: indicatorColor },
                  isCurrent && styles.indicatorActive,
                ]}
              >
                <Text style={styles.indicatorLabel}>{indicator.label}</Text>
              </View>
              <Text
                style={[
                  styles.wordLabel,
                  { color: palette.textPrimary },
                  isCurrent && { color: palette.textAccent, fontWeight: '900' },
                ]}
              >
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
    borderRadius: 32,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    width: '100%',
    maxHeight: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 8,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  indicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  indicatorActive: {
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    transform: [{ scale: 1.08 }],
  },
  indicatorLabel: {
    color: '#1f1b3a',
    fontSize: 18,
    fontWeight: '900',
  },
  wordLabel: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.4,
    flex: 1,
  },
});
