import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';

// Expo web'de tarayıcı URL mevcut, native'de polyfill kur.
if (Platform.OS !== 'web') {
  setupURLPolyfill();
}
