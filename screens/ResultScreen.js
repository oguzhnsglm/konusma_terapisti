import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import wordList from '../logic/wordList';

export default function ResultScreen({ navigation, route }) {
  const { word, heard, success, score, wordIndex = 0 } = route.params ?? {};

  const roundedScore = Math.round((score ?? 0) * 100);
  const message = success ? 'Harika söyledin! 🎉' : 'Neredeyse oldu, tekrar deneyelim 💪';

  const handleRetry = () => {
    navigation.navigate('Practice', { wordIndex });
  };

  const handleNext = () => {
    const nextIndex = (wordIndex + 1) % wordList.length;
    navigation.navigate('Practice', { wordIndex: nextIndex });
  };

  const handleRepeat = () => {
    navigation.navigate('Practice', { wordIndex });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sonuç</Text>
      <View style={styles.card}>
        <Text style={styles.wordLabel}>Kelime</Text>
        <Text style={styles.word}>{word}</Text>
        <Text style={[styles.message, success ? styles.good : styles.bad]}>{message}</Text>
        {heard ? (
          <Text style={[styles.heard, success ? styles.good : styles.bad]}>Duyulan: "{heard}"</Text>
        ) : null}
        <Text style={styles.score}>Skor: %{roundedScore}</Text>
      </View>

      <View style={styles.buttons}>
        {success ? (
          <>
            <ActionButton label="Tekrarla" onPress={handleRepeat} variant="secondary" />
            <ActionButton label="Sonraki Kelime" onPress={handleNext} variant="primary" />
          </>
        ) : (
          <>
            <ActionButton label="Yeniden Dene" onPress={handleRetry} variant="secondary" />
            <ActionButton label="Sonraki Kelime" onPress={handleNext} variant="primary" />
          </>
        )}
      </View>
    </View>
  );
}

function ActionButton({ label, onPress, variant }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D315B',
  },
  card: {
    backgroundColor: '#FBE6A2',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F3C969',
    alignItems: 'center',
    gap: 12,
    minWidth: '80%',
  },
  wordLabel: {
    fontSize: 18,
    color: '#3D315B',
    opacity: 0.7,
  },
  word: {
    fontSize: 40,
    fontWeight: '700',
    color: '#3D315B',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 24,
    color: '#3D315B',
    textAlign: 'center',
  },
  score: {
    fontSize: 20,
    color: '#3D315B',
  },
  heard: {
    fontSize: 18,
    color: '#3D315B',
    opacity: 0.85,
  },
  good: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  bad: {
    color: '#C62828',
    fontWeight: '700',
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#A3CEF1',
    borderColor: '#6096BA',
  },
  secondary: {
    backgroundColor: '#E8E4F2',
    borderColor: '#C2BBF0',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3D315B',
  },
});
