import React from 'react';
import { View, Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  word: string;
  subText?: string;
  subTextStyle?: StyleProp<TextStyle>;
};

export default function WordCard({ word, subText, subTextStyle }: Props) {
  return (
    <LinearGradient
      colors={['#ffe9f4', '#f1f6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{word}</Text>
        {subText ? <Text style={[styles.subText, subTextStyle]}>{subText}</Text> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 36,
    paddingHorizontal: 36,
    borderRadius: 32,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 159, 211, 0.25)',
  },
  text: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1f1b3a',
    letterSpacing: 1.5,
  },
  subText: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '700',
    color: '#4b4c7a',
  },
});
