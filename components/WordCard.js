import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WordCard({ word, subText, subTextStyle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{word}</Text>
      {subText ? <Text style={[styles.subText, subTextStyle]}>{subText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FBE6A2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F3C969',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    fontSize: 48,
    fontWeight: '700',
    color: '#3D315B',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subText: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#3D315B',
  },
});
