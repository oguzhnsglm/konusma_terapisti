// Legacy screen now renders the runner to avoid stale UI.
import React from 'react';
import { SafeAreaView } from 'react-native';
import SpeakToPassRunner from '../components/SpeakToPassRunner';

export default function SpeakToPassGameScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SpeakToPassRunner />
    </SafeAreaView>
  );
}
