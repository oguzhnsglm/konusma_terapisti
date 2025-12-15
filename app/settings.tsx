import { View, Text, Pressable, ScrollView, StyleSheet, TextInput, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { useState } from 'react';

const AVATARS = ['👦', '👧', '🧒', '👶', '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯'];

const ACCESSORIES = [
  { id: 'hat', emoji: '🎩', name: 'Şapka', price: 50 },
  { id: 'glasses', emoji: '🕶️', name: 'Gözlük', price: 30 },
  { id: 'crown', emoji: '👑', name: 'Taç', price: 100 },
  { id: 'mask', emoji: '🎭', name: 'Maske', price: 40 },
  { id: 'bow', emoji: '🎀', name: 'Fiyonk', price: 25 },
  { id: 'star', emoji: '⭐', name: 'Yıldız', price: 60 },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { progress, setAvatarId, setAvatarName, addAccessory } = useProgress();
  const [editingName, setEditingName] = useState(progress.avatar.name || 'İsim Yok');
  const [tempName, setTempName] = useState(editingName);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(false);

  const palette = theme === 'dark' ? {
    bg: ['#05070f', '#070d19'],
    card: '#0d1424',
    cardBorder: '#1a2235',
    textPrimary: '#f0f4ff',
    textSecondary: '#cbd5f0',
    textMuted: '#6b7ba0',
    accent: '#7c3aed',
    accentSecondary: '#f97316',
  } : {
    bg: ['#fefefe', '#f7f9ff'],
    card: '#ffffff',
    cardBorder: '#e4e8f5',
    textPrimary: '#0a1028',
    textSecondary: '#334155',
    textMuted: '#64748b',
    accent: '#7c3aed',
    accentSecondary: '#f97316',
  };

  const handleSaveName = () => {
    setAvatarName(tempName);
    setEditingName(tempName);
  };

  const totalStars = progress.achievements.reduce((sum, a) => sum + a.starsEarned, 0);

  return (
    <LinearGradient colors={palette.bg} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <Pressable 
            onPress={() => router.push('/')} 
            style={[styles.modernBackBtn, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
          >
            <Ionicons name="arrow-back" size={22} color={palette.accent} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: palette.textPrimary }]}>Ayarlar</Text>
            <Text style={[styles.headerSubtitle, { color: palette.textMuted }]}>Profil & Tercihler</Text>
          </View>
        </View>

        {/* Profile Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { borderColor: palette.accent }]}>
              <Text style={styles.heroAvatar}>{progress.avatar.avatarId}</Text>
              {progress.avatar.accessories.length > 0 && (
                <View style={styles.heroAccessories}>
                  {progress.avatar.accessories.slice(0, 2).map((acc) => (
                    <Text key={acc} style={styles.heroAccessoryIcon}>
                      {ACCESSORIES.find((a) => a.id === acc)?.emoji || ''}
                    </Text>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.heroInfo}>
              {editingName === tempName ? (
                <>
                  <Text style={[styles.heroName, { color: palette.textPrimary }]}>{editingName}</Text>
                  <Pressable 
                    onPress={() => setTempName(editingName)}
                    style={[styles.editNameBtn, { backgroundColor: palette.accent + '20' }]}
                  >
                    <Ionicons name="pencil" size={14} color={palette.accent} />
                    <Text style={[styles.editNameText, { color: palette.accent }]}>Düzenle</Text>
                  </Pressable>
                </>
              ) : (
                <View style={[styles.nameEditContainer, { backgroundColor: palette.cardBorder }]}>
                  <TextInput
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Adını gir..."
                    placeholderTextColor={palette.textMuted}
                    style={[styles.nameInput, { color: palette.textPrimary }]}
                  />
                  <Pressable 
                    onPress={handleSaveName}
                    style={[styles.saveNameBtn, { backgroundColor: palette.accent }]}
                  >
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </Pressable>
                </View>
              )}
              <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                  <Text style={styles.statEmoji}>⭐</Text>
                  <Text style={[styles.statText, { color: palette.textSecondary }]}>{totalStars}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statEmoji}>🎮</Text>
                  <Text style={[styles.statText, { color: palette.textSecondary }]}>{progress.achievements.length}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statEmoji}>🔥</Text>
                  <Text style={[styles.statText, { color: palette.textSecondary }]}>{progress.dailyStats.length}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Avatar Selection */}
        <View style={[styles.settingsSection, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={22} color={palette.accent} />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Avatar Seç</Text>
          </View>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <Pressable
                key={avatar}
                onPress={() => setAvatarId(avatar)}
                style={({ pressed }) => [
                  styles.avatarOption,
                  { 
                    backgroundColor: progress.avatar.avatarId === avatar ? palette.accent + '30' : palette.cardBorder,
                    borderColor: progress.avatar.avatarId === avatar ? palette.accent : 'transparent',
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.avatarOptionEmoji}>{avatar}</Text>
                {progress.avatar.avatarId === avatar && (
                  <View style={[styles.selectedBadge, { backgroundColor: palette.accent }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accessories Shop */}
        <View style={[styles.settingsSection, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={22} color={palette.accentSecondary} />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Aksesuar Mağazası</Text>
            <View style={[styles.starBadge, { backgroundColor: '#fbbf24' + '20' }]}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={[styles.starCount, { color: '#fbbf24' }]}>{totalStars}</Text>
            </View>
          </View>
          <View style={styles.accessoriesGrid}>
            {ACCESSORIES.map((acc) => {
              const isOwned = progress.avatar.accessories.includes(acc.id);
              const canAfford = totalStars >= acc.price;

              return (
                <Pressable
                  key={acc.id}
                  onPress={() => !isOwned && canAfford && addAccessory(acc.id)}
                  disabled={isOwned || !canAfford}
                  style={({ pressed }) => [
                    styles.accessoryCard,
                    { 
                      backgroundColor: isOwned ? palette.accent + '20' : palette.cardBorder,
                      borderColor: isOwned ? palette.accent : 'transparent',
                      opacity: !isOwned && !canAfford ? 0.4 : 1,
                    },
                    pressed && !isOwned && canAfford && styles.pressed,
                  ]}
                >
                  <Text style={styles.accessoryIcon}>{acc.emoji}</Text>
                  <Text style={[styles.accessoryName, { color: palette.textPrimary }]} numberOfLines={1}>
                    {acc.name}
                  </Text>
                  <View style={[styles.accessoryPriceTag, { 
                    backgroundColor: isOwned ? palette.accent : '#fbbf24' + '20' 
                  }]}>
                    {isOwned ? (
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.priceIcon}>⭐</Text>
                        <Text style={[styles.priceText, { color: '#fbbf24' }]}>{acc.price}</Text>
                      </>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Appearance Settings */}
        <View style={[styles.settingsSection, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={22} color={palette.accent} />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Görünüm</Text>
          </View>
          <View style={styles.themeOptions}>
            <Pressable
              onPress={() => setTheme('light')}
              style={({ pressed }) => [
                styles.themeOption,
                { 
                  backgroundColor: theme === 'light' ? palette.accent + '30' : palette.cardBorder,
                  borderColor: theme === 'light' ? palette.accent : 'transparent',
                },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="sunny" size={24} color={theme === 'light' ? palette.accent : palette.textMuted} />
              <Text style={[styles.themeLabel, { color: theme === 'light' ? palette.textPrimary : palette.textMuted }]}>
                Aydınlık
              </Text>
              {theme === 'light' && (
                <Ionicons name="checkmark-circle" size={20} color={palette.accent} style={styles.themeCheck} />
              )}
            </Pressable>

            <Pressable
              onPress={() => setTheme('dark')}
              style={({ pressed }) => [
                styles.themeOption,
                { 
                  backgroundColor: theme === 'dark' ? palette.accent + '30' : palette.cardBorder,
                  borderColor: theme === 'dark' ? palette.accent : 'transparent',
                },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="moon" size={24} color={theme === 'dark' ? palette.accent : palette.textMuted} />
              <Text style={[styles.themeLabel, { color: theme === 'dark' ? palette.textPrimary : palette.textMuted }]}>
                Karanlık
              </Text>
              {theme === 'dark' && (
                <Ionicons name="checkmark-circle" size={20} color={palette.accent} style={styles.themeCheck} />
              )}
            </Pressable>
          </View>
        </View>

        {/* App Preferences */}
        <View style={[styles.settingsSection, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={22} color={palette.accent} />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Uygulama Tercihleri</Text>
          </View>
          
          <View style={styles.preferencesContainer}>
            <View style={[styles.preferenceItem, { borderBottomColor: palette.cardBorder }]}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="notifications-outline" size={20} color={palette.textSecondary} />
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: palette.textPrimary }]}>Bildirimler</Text>
                  <Text style={[styles.preferenceDesc, { color: palette.textMuted }]}>Günlük hatırlatıcılar al</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: palette.cardBorder, true: palette.accent + '60' }}
                thumbColor={notifications ? palette.accent : palette.textMuted}
              />
            </View>

            <View style={[styles.preferenceItem, { borderBottomColor: palette.cardBorder }]}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="volume-high-outline" size={20} color={palette.textSecondary} />
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: palette.textPrimary }]}>Ses Efektleri</Text>
                  <Text style={[styles.preferenceDesc, { color: palette.textMuted }]}>Oyun seslerini aç/kapat</Text>
                </View>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: palette.cardBorder, true: palette.accent + '60' }}
                thumbColor={soundEffects ? palette.accent : palette.textMuted}
              />
            </View>

            <View style={[styles.preferenceItem, { borderBottomColor: palette.cardBorder }]}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="cloud-upload-outline" size={20} color={palette.textSecondary} />
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: palette.textPrimary }]}>Otomatik Kayıt</Text>
                  <Text style={[styles.preferenceDesc, { color: palette.textMuted }]}>İlerlemeni otomatik kaydet</Text>
                </View>
              </View>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: palette.cardBorder, true: palette.accent + '60' }}
                thumbColor={autoSave ? palette.accent : palette.textMuted}
              />
            </View>

            <View style={[styles.preferenceItem, { borderBottomWidth: 0 }]}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="phone-portrait-outline" size={20} color={palette.textSecondary} />
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: palette.textPrimary }]}>Dokunsal Geri Bildirim</Text>
                  <Text style={[styles.preferenceDesc, { color: palette.textMuted }]}>Titreşim ile geri bildirim</Text>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: palette.cardBorder, true: palette.accent + '60' }}
                thumbColor={hapticFeedback ? palette.accent : palette.textMuted}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.settingsSection, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={22} color={palette.textSecondary} />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Hakkında</Text>
          </View>
          <View style={styles.aboutContainer}>
            <Pressable style={[styles.aboutItem, { borderBottomColor: palette.cardBorder }]}>
              <Text style={[styles.aboutLabel, { color: palette.textSecondary }]}>Versiyon</Text>
              <Text style={[styles.aboutValue, { color: palette.textPrimary }]}>1.0.0</Text>
            </Pressable>
            <Pressable style={[styles.aboutItem, { borderBottomColor: palette.cardBorder }]}>
              <Text style={[styles.aboutLabel, { color: palette.textSecondary }]}>Gizlilik Politikası</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
            </Pressable>
            <Pressable style={[styles.aboutItem, { borderBottomWidth: 0 }]}>
              <Text style={[styles.aboutLabel, { color: palette.textSecondary }]}>Kullanım Koşulları</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  modernBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  heroAvatar: {
    fontSize: 52,
  },
  heroAccessories: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -8,
    gap: 4,
  },
  heroAccessoryIcon: {
    fontSize: 20,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  editNameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  editNameText: {
    fontSize: 13,
    fontWeight: '600',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 4,
    gap: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveNameBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statEmoji: {
    fontSize: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  starIcon: {
    fontSize: 14,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  avatarOptionEmoji: {
    fontSize: 38,
  },
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  accessoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accessoryCard: {
    width: 106,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  accessoryIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  accessoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  accessoryPriceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  priceIcon: {
    fontSize: 11,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 2,
    position: 'relative',
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  preferencesContainer: {
    gap: 0,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  preferenceDesc: {
    fontSize: 12,
  },
  aboutContainer: {
    gap: 0,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
