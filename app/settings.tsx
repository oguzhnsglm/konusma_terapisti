import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

const AVATARS = ['🧒', '👧', '👦', '🧑', '👨', '👩', '🤖', '👽'];

const ACCESSORIES = [
  { id: 'hat1', emoji: '🎩', name: 'Silindir Şapka', price: 10 },
  { id: 'hat2', emoji: '🧢', name: 'Beyzbol Şapkası', price: 10 },
  { id: 'glasses', emoji: '😎', name: 'Güneş Gözlüğü', price: 15 },
  { id: 'crown', emoji: '👑', name: 'Taç', price: 25 },
  { id: 'ribbon', emoji: '🎀', name: 'Kurdele', price: 15 },
  { id: 'bowtie', emoji: '🎗️', name: 'Papyon', price: 20 },
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { progress, setAvatarId, setAvatarName, addAccessory } = useProgress();
  const [editingName, setEditingName] = useState(progress.avatar.name);
  const [tempName, setTempName] = useState(editingName);

  const bgColor = theme === 'dark' ? '#05070f' : '#fefefe';
  const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
  const textSecondary = theme === 'dark' ? '#d5dbff' : '#606481';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';
  const accentColor = '#a78bfa';

  const handleSaveName = () => {
    setAvatarName(tempName);
    setEditingName(tempName);
  };

  const totalStars = progress.achievements.reduce((sum, a) => sum + a.starsEarned, 0);

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={accentColor} />
          </Pressable>
          <Text style={[styles.title, { color: textPrimary }]}>Profil & Ayarlar</Text>
        </View>

        {/* Avatar Card */}
        <View style={[styles.avatarCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Senin Avatar</Text>

          <View style={styles.avatarDisplay}>
            <Text style={styles.avatarEmoji}>{progress.avatar.avatarId}</Text>
            {progress.avatar.accessories.length > 0 && (
              <View style={styles.accessoriesDisplay}>
                {progress.avatar.accessories.map((acc) => (
                  <Text key={acc} style={styles.accessoryEmoji}>
                    {ACCESSORIES.find((a) => a.id === acc)?.emoji || ''}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Name Editor */}
          <View style={styles.nameSection}>
            <Text style={[styles.label, { color: textSecondary }]}>Senin Adın</Text>
            {editingName === tempName ? (
              <View style={styles.nameDisplay}>
                <Text style={[styles.nameText, { color: textPrimary }]}>{editingName}</Text>
                <Pressable onPress={() => setTempName(editingName)} style={styles.editBtn}>
                  <Ionicons name="pencil" size={16} color={accentColor} />
                </Pressable>
              </View>
            ) : (
              <View style={[styles.nameInput, { backgroundColor: borderColor, borderColor }]}>
                <TextInput
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Adını gir..."
                  placeholderTextColor={textSecondary}
                  style={[styles.input, { color: textPrimary }]}
                />
                <Pressable onPress={handleSaveName} style={styles.checkBtn}>
                  <Ionicons name="checkmark" size={18} color={accentColor} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Avatar Selection */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor, borderWidth: 1, padding: 16, borderRadius: 16 }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Avatar Seç</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <Pressable
                key={avatar}
                onPress={() => setAvatarId(avatar)}
                style={({ pressed }) => [
                  styles.avatarOption,
                  { backgroundColor: progress.avatar.avatarId === avatar ? accentColor + '40' : borderColor },
                  progress.avatar.avatarId === avatar && { borderColor: accentColor, borderWidth: 2 },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.avatarOptionEmoji}>{avatar}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accessories */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor, borderWidth: 1, padding: 16, borderRadius: 16 }]}>
          <View style={styles.accessoryHeader}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Aksesuarlar</Text>
            <Text style={[styles.starCount, { color: '#fbbf24' }]}>⭐ {totalStars}</Text>
          </View>
          <View style={styles.accessoriesGrid}>
            {ACCESSORIES.map((acc) => {
              const isOwned = progress.avatar.accessories.includes(acc.id);
              const isEquipped = progress.avatar.accessories.includes(acc.id);

              return (
                <Pressable
                  key={acc.id}
                  onPress={() => !isOwned && totalStars >= acc.price && addAccessory(acc.id)}
                  style={({ pressed }) => [
                    styles.accessoryCard,
                    { backgroundColor: cardColor, borderColor },
                    isOwned && { borderColor: accentColor, borderWidth: 2 },
                    !isOwned && totalStars < acc.price && { opacity: 0.5 },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.accessoryEmoji}>{acc.emoji}</Text>
                  <Text style={[styles.accessoryName, { color: textPrimary }]}>{acc.name}</Text>
                  <Text style={[styles.accessoryPrice, { color: textSecondary }]}>
                    {isOwned ? '✓ Sahip' : `⭐ ${acc.price}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Theme Settings */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor, borderWidth: 1, padding: 16, borderRadius: 16 }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Tema</Text>
          <View style={styles.themeOptions}>
            <Pressable
              onPress={() => setTheme('dark')}
              style={({ pressed }) => [
                styles.themeBtn,
                { backgroundColor: theme === 'dark' ? accentColor + '40' : borderColor },
                theme === 'dark' && { borderColor: accentColor, borderWidth: 2 },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="moon" size={20} color={accentColor} />
              <Text style={[styles.themeBtnText, { color: textPrimary }]}>Karanlık</Text>
            </Pressable>

            <Pressable
              onPress={() => setTheme('light')}
              style={({ pressed }) => [
                styles.themeBtn,
                { backgroundColor: theme === 'light' ? accentColor + '40' : borderColor },
                theme === 'light' && { borderColor: accentColor, borderWidth: 2 },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="sunny" size={20} color={accentColor} />
              <Text style={[styles.themeBtnText, { color: textPrimary }]}>Aydınlık</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Oynanan Oyunlar</Text>
            <Text style={[styles.statValue, { color: '#a78bfa' }]}>{progress.achievements.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Öğrenilen Kelimeler</Text>
            <Text style={[styles.statValue, { color: '#fbbf24' }]}>{progress.dailyStats.reduce((s, d) => s + d.wordsLearned, 0)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Toplam Dakika</Text>
            <Text style={[styles.statValue, { color: '#34d399' }]}>{progress.dailyStats.reduce((s, d) => s + d.minutesPracticed, 0)}</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', flex: 1 },
  avatarCard: { borderRadius: 20, padding: 20, gap: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  avatarDisplay: { alignItems: 'center', gap: 8 },
  avatarEmoji: { fontSize: 64 },
  accessoriesDisplay: { flexDirection: 'row', gap: 4 },
  accessoryEmoji: { fontSize: 20 },
  nameSection: { gap: 8 },
  label: { fontSize: 12, fontWeight: '600' },
  nameDisplay: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameText: { fontSize: 18, fontWeight: '700', flex: 1 },
  editBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nameInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', paddingVertical: 10 },
  checkBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  section: { gap: 12 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarOption: { width: '23%', aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarOptionEmoji: { fontSize: 32 },
  accessoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  starCount: { fontSize: 14, fontWeight: '700' },
  accessoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  accessoryCard: { width: '31%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1 },
  accessoryName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  accessoryPrice: { fontSize: 10, fontWeight: '600' },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeBtn: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 8, borderWidth: 1 },
  themeBtnText: { fontSize: 12, fontWeight: '700' },
  statsCard: { borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12, borderWidth: 1, marginTop: 8 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800' },
  screen: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  heroLeft: {
    flex: 1,
    gap: 8,
  },
  heroLabel: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  heroBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    flexBasis: '48%',
    minWidth: 220,
    borderRadius: 18,
    borderWidth: 1,
  },
  themePreview: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  themeText: {
    flex: 1,
    gap: 4,
  },
  themeTitle: {
    fontWeight: '700',
  },
  themeSubtitle: {
    fontSize: 12,
  },
  themeCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  langChipLabel: {
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  toggleTextBlock: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  toggleTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
  toggleSubtitle: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
