import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import React, { useState } from 'react';

export default function ProgressPage() {
  const { progress, addMinutesToday, addWordToday } = useProgress();
  const router = useRouter();
  const { theme } = useTheme();
  const { playSfx } = useAudio();
  const [practiceMinutes, setPracticeMinutes] = useState('');
  const [practiceWords, setPracticeWords] = useState('');

  const getLastWeekStats = () => {
    const lastWeek = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const stat = progress.dailyStats.find((s) => s.date === dateStr) || {
        date: dateStr,
        minutesPracticed: 0,
        wordsLearned: 0,
        sessionsCompleted: 0,
        starsEarned: 0,
      };
      lastWeek.push(stat);
    }
    return lastWeek;
  };

  const weekStats = getLastWeekStats();
  const totalMinutesWeek = weekStats.reduce((sum, s) => sum + s.minutesPracticed, 0);
  const totalWordsWeek = weekStats.reduce((sum, s) => sum + s.wordsLearned, 0);
  const totalSessionsWeek = weekStats.reduce((sum, s) => sum + s.sessionsCompleted, 0);
  const totalStarsWeek = weekStats.reduce((sum, s) => sum + s.starsEarned, 0);

  const handleSavePractice = () => {
    const minutes = parseInt(practiceMinutes) || 0;
    const words = parseInt(practiceWords) || 0;

    if (minutes > 0) addMinutesToday(minutes);
    if (words > 0) addWordToday(words);

    playSfx('success');
    setPracticeMinutes('');
    setPracticeWords('');
  };

  const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
  const textSecondary = theme === 'dark' ? '#d5dbff' : '#606481';
  const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';
  const inputBg = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)';

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#a78bfa" />
          </Pressable>
          <Text style={[styles.title, { color: textPrimary }]}>İlerleme</Text>
        </View>

        {/* Haftalık Özet Kartları - Gradient Background */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            {/* Toplam Dakika */}
            <LinearGradient
              colors={['#a78bfa', '#c084fc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="time" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>{totalMinutesWeek}</Text>
              <Text style={styles.summaryLabel}>Toplam Dakika</Text>
            </LinearGradient>

            {/* Öğrenilen Kelime */}
            <LinearGradient
              colors={['#fbbf24', '#fcd34d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="book" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>{totalWordsWeek}</Text>
              <Text style={styles.summaryLabel}>Öğrenilen Kelime</Text>
            </LinearGradient>

            {/* Tamamlanan Seans */}
            <LinearGradient
              colors={['#34d399', '#6ee7b7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>{totalSessionsWeek}</Text>
              <Text style={styles.summaryLabel}>Tamamlanan Seans</Text>
            </LinearGradient>

            {/* Kazanılan Yıldız */}
            <LinearGradient
              colors={['#06b6d4', '#67e8f9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="star" size={24} color="#ffffff" />
              </View>
              <Text style={styles.summaryValue}>{totalStarsWeek}</Text>
              <Text style={styles.summaryLabel}>Kazanılan Yıldız</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Günlük İlerleme */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>📊 Günlük İlerleme</Text>

          {/* Dakika Grafiği */}
          <View style={styles.chartSection}>
            <Text style={[styles.chartLabel, { color: textSecondary }]}>Günlük Dakikalar</Text>
            <View style={styles.barChart}>
              {weekStats.map((stat, idx) => {
                const maxVal = Math.max(30, ...weekStats.map((s) => s.minutesPracticed));
                const height = Math.max(15, (stat.minutesPracticed / maxVal) * 100);
                const dayName = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][idx];
                return (
                  <View key={idx} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${height}%`, backgroundColor: '#a78bfa' },
                      ]}
                    />
                    <Text style={[styles.barLabel, { color: textSecondary }]}>{dayName}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Kelime Grafiği */}
          <View style={styles.chartSection}>
            <Text style={[styles.chartLabel, { color: textSecondary }]}>Öğrenilen Kelimeler</Text>
            <View style={styles.barChart}>
              {weekStats.map((stat, idx) => {
                const maxVal = Math.max(5, ...weekStats.map((s) => s.wordsLearned));
                const height = Math.max(15, (stat.wordsLearned / maxVal) * 100);
                const dayName = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][idx];
                return (
                  <View key={idx} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${height}%`, backgroundColor: '#fbbf24' },
                      ]}
                    />
                    <Text style={[styles.barLabel, { color: textSecondary }]}>{dayName}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Seans Göstergesi */}
          <View style={styles.chartSection}>
            <Text style={[styles.chartLabel, { color: textSecondary }]}>Tamamlanan Seanslar</Text>
            <View style={styles.sessionDots}>
              {weekStats.map((stat, idx) => {
                const dayName = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][idx];
                const hasSession = stat.sessionsCompleted > 0;
                return (
                  <View key={idx} style={styles.sessionDotContainer}>
                    <View
                      style={[
                        styles.sessionDot,
                        {
                          backgroundColor: hasSession ? '#34d399' : 'rgba(52, 211, 153, 0.15)',
                          borderColor: '#34d399',
                        },
                      ]}
                    >
                      {hasSession && (
                        <Text style={styles.sessionCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.sessionLabel, { color: textSecondary }]}>{dayName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Bugünkü Pratik */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>🎮 Bugünkü Pratik</Text>

          {/* Dakika Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textSecondary }]}>Kaç dakika pratik yaptın?</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBg,
                  borderColor,
                  color: textPrimary,
                },
              ]}
              placeholder="Dakika giriniz..."
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              keyboardType="number-pad"
              value={practiceMinutes}
              onChangeText={setPracticeMinutes}
            />
          </View>

          {/* Kelime Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textSecondary }]}>Kaç kelime çalıştın?</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBg,
                  borderColor,
                  color: textPrimary,
                },
              ]}
              placeholder="Kelime sayısı giriniz..."
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              keyboardType="number-pad"
              value={practiceWords}
              onChangeText={setPracticeWords}
            />
          </View>

          {/* Kaydet Butonu */}
          <LinearGradient
            colors={['#a78bfa', '#c084fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            <Pressable
              onPress={handleSavePractice}
              style={({ pressed }) => [
                styles.saveButtonInner,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </Pressable>
          </LinearGradient>
        </View>

        {/* Başarılar */}
        {progress.achievements.length > 0 && (
          <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>⭐ Son Başarılar</Text>
            <View style={styles.achievementsList}>
              {progress.achievements.slice(-5).reverse().map((ach, idx) => (
                <View key={idx} style={styles.achievementItem}>
                  <Ionicons name="star" size={18} color="#fbbf24" />
                  <Text style={[styles.achievementText, { color: textSecondary }]}>
                    {ach.gameId === 'puzzles' && 'Bulmacalar'}
                    {ach.gameId === 'word-fill' && 'Harf Canavarı'}
                    {ach.gameId === 'rhyme' && 'Ses Çarkı'}
                    {ach.gameId === 'colors' && 'Duygu Eşleştirme'} ({ach.difficulty === 'easy' && 'Kolay'}{ach.difficulty === 'medium' && 'Orta'}{ach.difficulty === 'hard' && 'Zor'}) - {ach.starsEarned}⭐
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    flex: 1,
  },
  summarySection: {
    gap: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartSection: {
    gap: 12,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    height: '100%',
  },
  bar: {
    width: '85%',
    borderRadius: 6,
    minHeight: 18,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  sessionDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sessionDotContainer: {
    alignItems: 'center',
    gap: 6,
  },
  sessionDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionCheckmark: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  sessionLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  achievementsList: {
    gap: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
