import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Mode = 'child' | 'parent';

export default function ModeSwitch() {
  const [mode, setMode] = useState<Mode>('child');
  const { isDark } = useTheme();

  const toggle = () => {
    setMode((prev) => (prev === 'child' ? 'parent' : 'child'));
  };

  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(9, 13, 23, 0.85)' : 'rgba(255,255,255,0.9)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: isDark ? '#f2f6ff' : '#1f1b3a' }]}>
        {mode === 'child' ? 'Çocuk Modu' : 'Veli Modu'}
      </Text>
      <View
        style={[
          styles.switchShell,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f2e9ff',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
          mode === 'parent' && {
            backgroundColor: isDark ? 'rgba(104,255,155,0.25)' : '#ffcee8',
            borderColor: isDark ? 'rgba(104,255,155,0.8)' : 'rgba(255, 159, 211, 0.6)',
          },
        ]}
      >
        <View
          style={[
            styles.knob,
            {
              backgroundColor: isDark ? '#0b111d' : '#ffffff',
              shadowColor: isDark ? '#00000099' : '#c1d5ff',
            },
            mode === 'parent' && [
              styles.knobOn,
              {
                backgroundColor: isDark ? '#69ff9c' : '#ff9fd3',
              },
            ],
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  label: {
    fontWeight: '800',
  },
  switchShell: {
    width: 48,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    padding: 3,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
