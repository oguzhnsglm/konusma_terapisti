import 'react-native-gesture-handler';
import 'react-native-reanimated';
import './globals.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PracticeProvider } from '../context/PracticeContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { ProgressProvider } from '../context/ProgressContext';
import { MascotProvider } from '../context/MascotContext';
import Mascot from '../components/Mascot';
import ReturnHomeButton from '../components/ReturnHomeButton';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AudioProvider>
            <ProgressProvider>
              <PracticeProvider>
                <MascotProvider>
                  <StatusBar style="dark" />
                  <Stack screenOptions={{ headerShown: false }} />
                  <Mascot />
                  <ReturnHomeButton />
                </MascotProvider>
              </PracticeProvider>
            </ProgressProvider>
          </AudioProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
