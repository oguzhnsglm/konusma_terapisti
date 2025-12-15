import React, { useState } from 'react';
import {
  LinearGradient,
} from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getPIN, setPIN, verifyPin } from '../../utils/storage';

type Palette = {
  backgroundGradient: readonly [string, string, ...string[]];
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  panelBg: string;
  panelBorder: string;
  cardBorder: string;
  accent: string;
  accentSecondary: string;
};

const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    backgroundGradient: ['#05070f', '#070d19', '#091328'],
    textPrimary: '#f5f7ff',
    textSecondary: '#d5dbff',
    textMuted: '#8f95c9',
    panelBg: 'rgba(14, 20, 33, 0.6)',
    panelBorder: 'rgba(255,255,255,0.14)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#69ff9c',
    accentSecondary: '#7c3aed',
  },
  light: {
    backgroundGradient: ['#fefefe', '#f7f9ff', '#eef4ff'],
    textPrimary: '#111323',
    textSecondary: '#1f2440',
    textMuted: '#606481',
    panelBg: 'rgba(255,255,255,0.7)',
    panelBorder: 'rgba(15,23,42,0.12)',
    cardBorder: 'rgba(15,23,42,0.12)',
    accent: '#22c55e',
    accentSecondary: '#7c3aed',
  },
};

export default function ChangePinScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const palette = palettes[theme];

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'verify' | 'new'>('verify');

  const handleVerifyOldPin = async () => {
    if (oldPin.length !== 4) {
      setError('PIN 4 haneli olmalıdır');
      return;
    }

    setIsLoading(true);
    const isValid = await verifyPin(oldPin);

    if (!isValid) {
      setError('Mevcut PIN hatalı');
      setOldPin('');
    } else {
      setStep('new');
      setError('');
    }

    setIsLoading(false);
  };

  const handleChangePin = async () => {
    if (newPin.length !== 4) {
      setError('Yeni PIN 4 haneli olmalıdır');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PIN eşleşmiyor');
      return;
    }

    if (newPin === oldPin) {
      setError('Yeni PIN eski PIN ile aynı olamaz');
      return;
    }

    setIsLoading(true);

    try {
      await setPIN(newPin);
      setSuccess('PIN başarıyla değiştirildi');
      setError('');

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError('PIN değiştirme başarısız');
      console.error('Error changing PIN:', err);
    }

    setIsLoading(false);
  };

  const handlePinInput = (value: string) => {
    return value.replace(/[^0-9]/g, '').slice(0, 4);
  };

  return (
    <LinearGradient colors={palette.backgroundGradient} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                { borderColor: palette.cardBorder },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="arrow-back" size={20} color={palette.accent} />
            </Pressable>
            <View>
              <Text style={[styles.pageTitle, { color: palette.textPrimary }]}>
                PIN'i Değiştir
              </Text>
              <Text style={[styles.pageSubtitle, { color: palette.textMuted }]}>
                Yeni PIN belirleyin
              </Text>
            </View>
          </View>

          {/* Success Message */}
          {success && (
            <View style={[styles.card, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={[styles.successText]}>
                {success}
              </Text>
            </View>
          )}

          {/* Step 1: Verify Old PIN */}
          {step === 'verify' && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: palette.panelBg,
                  borderColor: palette.cardBorder,
                },
              ]}
            >
              <Text style={[styles.stepTitle, { color: palette.textPrimary }]}>
                Adım 1: Mevcut PIN'i Doğrula
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: palette.textMuted }]}>
                  Mevcut PIN
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor:
                        error && oldPin.length === 4
                          ? '#ef4444'
                          : palette.cardBorder,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.pinInput, { color: palette.textPrimary }]}
                    value={oldPin}
                    onChangeText={(val) => setOldPin(handlePinInput(val))}
                    placeholder="••••"
                    placeholderTextColor={palette.textMuted}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: palette.accentSecondary },
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleVerifyOldPin}
                disabled={isLoading || oldPin.length !== 4}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Doğrulanıyor...' : 'Devam Et'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Step 2: Set New PIN */}
          {step === 'new' && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: palette.panelBg,
                  borderColor: palette.cardBorder,
                },
              ]}
            >
              <Text style={[styles.stepTitle, { color: palette.textPrimary }]}>
                Adım 2: Yeni PIN'i Belirle
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: palette.textMuted }]}>
                  Yeni PIN
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: palette.cardBorder },
                  ]}
                >
                  <TextInput
                    style={[styles.pinInput, { color: palette.textPrimary }]}
                    value={newPin}
                    onChangeText={(val) => setNewPin(handlePinInput(val))}
                    placeholder="••••"
                    placeholderTextColor={palette.textMuted}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: palette.textMuted }]}>
                  PIN'i Tekrarla
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor:
                        error && confirmPin.length === 4
                          ? '#ef4444'
                          : palette.cardBorder,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.pinInput, { color: palette.textPrimary }]}
                    value={confirmPin}
                    onChangeText={(val) => setConfirmPin(handlePinInput(val))}
                    placeholder="••••"
                    placeholderTextColor={palette.textMuted}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: palette.accentSecondary },
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleChangePin}
                disabled={
                  isLoading || newPin.length !== 4 || confirmPin.length !== 4
                }
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Kaydediliyor...' : 'PIN i Kaydet'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: palette.cardBorder,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => {
                  setStep('verify');
                  setNewPin('');
                  setConfirmPin('');
                  setError('');
                }}
              >
                <Text style={[styles.secondaryButtonText, { color: palette.textSecondary }]}>
                  Geri Dön
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pinInput: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    padding: 0,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
