import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

const gradients = {
  dark: ['#8bffc3', '#6df6e3'],
  light: ['#4f46e5', '#2dd4bf'],
} as const;

export default function ReturnHomeButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { playSfx } = useAudio();

  if (!pathname || pathname === '/') {
    return null;
  }

  const handlePress = () => {
    playSfx('click');
    router.push('/');
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable onPress={handlePress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        <LinearGradient colors={gradients[theme]} style={styles.gradient}>
          <Ionicons name="home" size={18} color="#04131a" />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Ana Menü</Text>
            <Text style={styles.subLabel}>Her yerden tek dokunuş</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 24,
    bottom: 28,
    zIndex: 50,
  },
  pressable: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#04131a',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  textBlock: {
    flexDirection: 'column',
  },
  label: {
    color: '#04131a',
    fontWeight: '800',
    fontSize: 14,
  },
  subLabel: {
    color: 'rgba(4, 19, 26, 0.75)',
    fontSize: 11,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
