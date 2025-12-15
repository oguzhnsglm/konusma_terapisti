import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChildMode } from '../context/ChildModeContext';
import { getRemainingLockTime } from '../utils/storage';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PinModal({ visible, onClose }: PinModalProps) {
  const {
    pinModalMode,
    isPinModalLocked,
    verifyPinAndToggle,
  } = useChildMode();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Lock countdown
  useEffect(() => {
    if (!isPinModalLocked) {
      setRemainingTime(0);
      return;
    }

    const updateTimer = async () => {
      const remaining = await getRemainingLockTime();
      setRemainingTime(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isPinModalLocked]);

  useEffect(() => {
    if (visible) {
      setPin('');
      setError('');
    }
  }, [visible]);

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setPin(numericValue);
      setError('');
    }
  };

  const handleVerify = async () => {
    if (pin.length !== 4) {
      setError('PIN 4 haneli olmalıdır');
      return;
    }

    setIsLoading(true);
    const isValid = await verifyPinAndToggle(pin);

    if (!isValid) {
      setError('PIN hatalı');
      setPin('');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
    Keyboard.dismiss();
  };

  const title =
    pinModalMode === 'enable'
      ? 'Çocuk Modunu Aç'
      : 'Çocuk Modunu Kapat';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
        />

        <View style={styles.modal}>
          <View style={styles.header}>
            <Ionicons name="lock-closed" size={28} color="#7c3aed" />
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#8f95c9" />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            {isPinModalLocked
              ? 'Çok fazla yanlış PIN. Lütfen biraz bekleyin.'
              : 'Ebeveyn doğrulaması gerekli'}
          </Text>

          {isPinModalLocked ? (
            <View style={styles.lockedContainer}>
              <Ionicons name="time-outline" size={48} color="#f59e0b" />
              <Text style={styles.lockedText}>
                {remainingTime} saniye sonra tekrar deneyin
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.pinInputContainer}>
                <TextInput
                  style={styles.hiddenInput}
                  value={pin}
                  onChangeText={handlePinChange}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus
                  editable={!isLoading}
                />

                <View style={styles.pinDots}>
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.pinDot,
                        {
                          backgroundColor:
                            index < pin.length ? '#7c3aed' : '#e0e0e0',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.verifyBtn,
                  pressed && styles.verifyBtnPressed,
                  isLoading && styles.verifyBtnDisabled,
                ]}
                onPress={handleVerify}
                disabled={isLoading || pin.length !== 4}
              >
                <Text style={styles.verifyBtnText}>
                  {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111323',
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#606481',
    textAlign: 'center',
    marginBottom: 8,
  },
  pinInputContainer: {
    gap: 20,
    marginVertical: 12,
  },
  hiddenInput: {
    height: 0,
    opacity: 0,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  pinDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  errorContainer: {
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
  },
  lockedContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  lockedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f59e0b',
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  verifyBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
