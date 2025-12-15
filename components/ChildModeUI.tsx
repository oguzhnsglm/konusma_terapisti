import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserMode } from '../context/UserModeContext';
import Mascot from './Mascot';

type GameCard = {
  id: string;
  title: string;
  icon: string;
  gradient: [string, string, ...string[]];
  route: string;
};

const GAMES: GameCard[] = [
  {
    id: 'speaking',
    title: 'Konuşma Oyunu',
    icon: 'mic-circle',
    gradient: ['#a78bfa', '#d8b4fe'],
    route: '/levels',
  },
  {
    id: 'word-fill',
    title: 'Harf Canavarı',
    icon: 'document-text',
    gradient: ['#f472b6', '#fbcfe8'],
    route: '/games/word-fill',
  },
  {
    id: 'rhyme',
    title: 'Ses Çarkı',
    icon: 'musical-notes',
    gradient: ['#06b6d4', '#67e8f9'],
    route: '/games/rhyme',
  },
  {
    id: 'stories',
    title: 'Hikâye Kitabı',
    icon: 'book',
    gradient: ['#fbbf24', '#fcd34d'],
    route: '/progress',
  },
  {
    id: 'rewards',
    title: 'Ödüllerim',
    icon: 'star',
    gradient: ['#34d399', '#6ee7b7'],
    route: '/settings',
  },
];

export default function ChildModeUI() {
  const router = useRouter();
  const { theme } = useTheme();
  const { toggleMode } = useUserMode();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [shouldToggleMode, setShouldToggleMode] = useState(false);

  // Mode'u değiştirme işlemini useEffect içinde yap
  useEffect(() => {
    if (shouldToggleMode) {
      const timer = setTimeout(() => {
        toggleMode();
        setShouldToggleMode(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldToggleMode]);

  const PARENT_PIN = '1234'; // Veli şifresi

  const handleGamePress = (route: string) => {
    router.push(route as any);
  };

  const handleParentMode = () => {
    setShowPinModal(true);
    setPinInput('');
    setPinError('');
  };

  const handlePinSubmit = () => {
    if (pinInput === PARENT_PIN) {
      setShowPinModal(false);
      setPinInput('');
      setShouldToggleMode(true); // useEffect'in yapması için flag set et
    } else {
      setPinError('Yanlış PIN! Tekrar deneyin.');
      setPinInput('');
    }
  };

  const quotes = [
    'Bugün oyun oynayalım mı?',
    'Kelime öğrenmeye hazır mısın?',
    'Eğlenerek öğrenelim!',
    'Harika bir gün bizi bekliyor!',
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Parent Mode Button */}
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Merhaba! 👋</Text>
            <Text style={styles.subGreeting}>{randomQuote}</Text>
          </View>
          <Pressable
            onPress={handleParentMode}
            style={({ pressed }) => [
              styles.parentBtn,
              pressed && styles.parentBtnPressed,
            ]}
          >
            <Ionicons name="lock-closed" size={16} color="#ffffff" />
          </Pressable>
        </View>

        {/* Game Grid */}
        <View style={styles.gameGrid}>
          {GAMES.map((game) => (
            <Pressable
              key={game.id}
              onPress={() => handleGamePress(game.route)}
              style={({ pressed }) => [
                styles.gameCard,
                pressed && styles.gameCardPressed,
              ]}
            >
              <LinearGradient
                colors={game.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gameCardGradient}
              >
                <Ionicons name={game.icon as any} size={48} color="#ffffff" />
                <Text style={styles.gameTitle}>{game.title}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Mascot */}
        <View style={styles.mascotArea}>
          <Mascot />
        </View>
      </ScrollView>

      {/* PIN Modal */}
      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme === 'dark' ? '#1a1f2e' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: theme === 'dark' ? '#f5f7ff' : '#111323' }]}>
              Veli PIN'i
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme === 'dark' ? '#d5dbff' : '#606481' }]}>
              Veli moduna girmek için PIN girin
            </Text>

            <TextInput
              style={[
                styles.pinInput,
                {
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
                  borderColor: pinError ? '#ff6b6b' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'),
                  color: theme === 'dark' ? '#f5f7ff' : '#111323',
                },
              ]}
              placeholder="PIN girin..."
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              keyboardType="number-pad"
              secureTextEntry
              value={pinInput}
              onChangeText={(text) => {
                setPinInput(text);
                setPinError('');
              }}
              maxLength={4}
            />

            {pinError && <Text style={styles.errorText}>{pinError}</Text>}

            <View style={styles.modalButtonGroup}>
              <Pressable
                onPress={() => setShowPinModal(false)}
                style={({ pressed }) => [styles.modalButton, styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={[styles.modalButtonText, { color: theme === 'dark' ? '#f5f7ff' : '#111323' }]}>
                  İptal
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePinSubmit}
                style={({ pressed }) => [styles.modalButton, styles.confirmButton, pressed && styles.pressed]}
              >
                <Text style={styles.confirmButtonText}>Giriş Yap</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  header: {
    flex: 1,
    gap: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#a78bfa',
  },
  subGreeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d5dbff',
  },
  parentBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#a78bfa',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  parentBtnPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  gameCard: {
    width: '48%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gameCardPressed: {
    transform: [{ scale: 0.95 }],
  },
  gameCardGradient: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 160,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  mascotArea: {
    alignItems: 'center',
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pinInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#a78bfa',
    backgroundColor: 'transparent',
  },
  confirmButton: {
    backgroundColor: '#a78bfa',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
