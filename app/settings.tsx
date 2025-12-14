import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  const { isMusicEnabled, isSfxEnabled, toggleMusicEnabled, toggleSfxEnabled } = useAudio();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Tema</Text>
          <Pressable onPress={toggleTheme} style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
            <Text style={styles.chipLabel}>{theme === 'light' ? 'Açık' : 'Koyu'}</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dil</Text>
          <View style={styles.languageRow}>
            <Pressable onPress={() => changeLanguage('tr')} style={[styles.langBtn, language === 'tr' && styles.langActive]}>
              <Text style={[styles.langLabel, language === 'tr' && styles.langLabelActive]}>TR</Text>
            </Pressable>
            <Pressable onPress={() => changeLanguage('en')} style={[styles.langBtn, language === 'en' && styles.langActive]}>
              <Text style={[styles.langLabel, language === 'en' && styles.langLabelActive]}>EN</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Müzik</Text>
          <Switch value={isMusicEnabled} onValueChange={toggleMusicEnabled} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>SFX</Text>
          <Switch value={isSfxEnabled} onValueChange={toggleSfxEnabled} />
        </View>
      </View>

      <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonLabel}>Ana Sayfa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f1ff',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#7f6bff',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '700',
    color: '#2f1b4e',
  },
  chip: {
    backgroundColor: '#f1edff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipLabel: {
    fontWeight: '700',
    color: '#6a5acd',
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcd6ff',
  },
  langActive: {
    backgroundColor: '#7f6bff',
    borderColor: '#7f6bff',
  },
  langLabel: {
    color: '#6a5acd',
    fontWeight: '700',
  },
  langLabelActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#7f6bff',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
