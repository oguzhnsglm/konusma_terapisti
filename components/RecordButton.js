import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function RecordButton({ isRecording, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isRecording ? styles.recording : styles.idle,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Kaydı durdur' : 'Kaydı başlat'}
    >
      <View style={styles.innerCircle}>
        <Text style={styles.icon}>{isRecording ? '■' : '🎤'}</Text>
      </View>
      <Text style={styles.label}>{isRecording ? 'Durdur' : 'Konuşmaya Başla'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 32,
    backgroundColor: '#A3CEF1',
    borderWidth: 2,
    borderColor: '#6096BA',
    minWidth: 200,
    gap: 12,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  idle: {
    backgroundColor: '#A3CEF1',
    borderColor: '#6096BA',
  },
  recording: {
    backgroundColor: '#FF928B',
    borderColor: '#F85E75',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  innerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    color: '#3D315B',
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3D315B',
  },
});
