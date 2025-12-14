import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Mode = 'child' | 'parent';

export default function ModeSwitch() {
  const [mode, setMode] = useState<Mode>('child');

  const toggle = () => {
    setMode((prev) => (prev === 'child' ? 'parent' : 'child'));
  };

  return (
    <Pressable onPress={toggle} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Text style={styles.label}>{mode === 'child' ? 'Çocuk Modu' : 'Veli Modu'}</Text>
      <View style={[styles.switchShell, mode === 'parent' && styles.switchOn]}>
        <View style={[styles.knob, mode === 'parent' && styles.knobOn]} />
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
    backgroundColor: 'rgba(255,255,255,0.86)',
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '800',
    color: '#1f1b3a',
  },
  switchShell: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f2e9ff',
    justifyContent: 'center',
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  switchOn: {
    backgroundColor: '#ffcee8',
    borderColor: 'rgba(255, 159, 211, 0.6)',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    shadowColor: '#c1d5ff',
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
