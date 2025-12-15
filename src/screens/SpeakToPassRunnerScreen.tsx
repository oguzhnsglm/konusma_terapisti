import React from 'react';
import { SafeAreaView } from 'react-native';
import SpeakToPassRunner from '../components/SpeakToPassRunner';

export default function SpeakToPassRunnerScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SpeakToPassRunner />
    </SafeAreaView>
  );
}
