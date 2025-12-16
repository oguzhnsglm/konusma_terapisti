import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

const { width } = Dimensions.get('window');

type MagicItem = {
  emoji: string;
  name: string;
  spellOptions: string[];
  correctSpell: string;
};

const ITEMS: MagicItem[] = [
  { emoji: '🐸', name: 'Kurbağa', spellOptions: ['kurbağa', 'tavşan', 'kuş'], correctSpell: 'kurbağa' },
  { emoji: '🌟', name: 'Yıldız', spellOptions: ['yıldız', 'ay', 'güneş'], correctSpell: 'yıldız' },
  { emoji: '🎩', name: 'Şapka', spellOptions: ['şapka', 'taç', 'baş'], correctSpell: 'şapka' },
  { emoji: '🔮', name: 'Kristal', spellOptions: ['kristal', 'taş', 'elmas'], correctSpell: 'kristal' },
  { emoji: '🦄', name: 'Tek Boynuzlu At', spellOptions: ['tek boynuzlu at', 'at', 'zebra'], correctSpell: 'tek boynuzlu at' },
];

export default function WizardMagicGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [magicState, setMagicState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const itemScale = useRef(new Animated.Value(1)).current;
  const itemRotate = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const wizardAnim = useRef(new Animated.Value(0)).current;

  const currentItem = ITEMS[currentItemIndex];

  const animateCorrectMagic = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(itemScale, {
          toValue: 1.3,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(itemScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(itemRotate, {
        toValue: 360,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(wizardAnim, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(wizardAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      itemRotate.setValue(0);
    });
  };

  const animateWrongMagic = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(itemScale, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(itemScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(itemRotate, {
          toValue: -30,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemRotate, {
          toValue: 30,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemRotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleSpell = (spell: string) => {
    if (magicState !== 'idle') return;
    
    const correct = spell === currentItem.correctSpell;
    setMagicState(correct ? 'correct' : 'wrong');
    
    if (correct) {
      playSfx('correct');
      setScore(score + 15);
      animateCorrectMagic();
      
      setTimeout(() => {
        if (currentItemIndex < ITEMS.length - 1) {
          setCurrentItemIndex(currentItemIndex + 1);
          setMagicState('idle');
        }
      }, 1500);
    } else {
      playSfx('incorrect');
      animateWrongMagic();
      
      setTimeout(() => {
        setMagicState('idle');
      }, 800);
    }
  };

  const resetGame = () => {
    setCurrentItemIndex(0);
    setScore(0);
    setMagicState('idle');
    itemScale.setValue(1);
    itemRotate.setValue(0);
  };

  const sparkleOpacity = sparkleAnim;
  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  const gameCompleted = currentItemIndex >= ITEMS.length - 1 && magicState === 'correct';

  return (
    <LinearGradient colors={['#2C0E37', '#4A1F5C', '#6B2F82']} style={styles.container}>
      <View style={styles.magicParticles}>
        {[...Array(10)].map((_, i) => (
          <Text key={i} style={[styles.particle, { 
            left: Math.random() * width, 
            top: Math.random() * 600,
            fontSize: Math.random() * 20 + 15 
          }]}>
            ✨
          </Text>
        ))}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>🧙‍♂️ Büyücü Oyunu</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      {!gameCompleted ? (
        <>
          <Animated.View 
            style={[
              styles.wizardContainer,
              { transform: [{ translateY: wizardAnim }] }
            ]}
          >
            <Text style={styles.wizardEmoji}>🧙‍♂️</Text>
            <Text style={styles.wizardText}>Büyü yap!</Text>
          </Animated.View>

          <View style={styles.itemContainer}>
            <Animated.View
              style={[
                styles.item,
                {
                  transform: [
                    { scale: itemScale },
                    { rotate: itemRotate.interpolate({
                      inputRange: [-30, 0, 30, 360],
                      outputRange: ['-30deg', '0deg', '30deg', '360deg'],
                    })},
                  ],
                },
              ]}
            >
              <Text style={styles.itemEmoji}>{currentItem.emoji}</Text>
            </Animated.View>

            {magicState === 'correct' && (
              <View style={styles.sparkles}>
                {[...Array(8)].map((_, i) => (
                  <Animated.Text
                    key={i}
                    style={[
                      styles.sparkle,
                      {
                        transform: [
                          { scale: sparkleScale },
                          { rotate: `${i * 45}deg` },
                          { translateX: sparkleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 50],
                          })},
                        ],
                        opacity: sparkleOpacity,
                      },
                    ]}
                  >
                    ✨
                  </Animated.Text>
                ))}
              </View>
            )}

            <Text style={styles.itemName}>{currentItem.name}</Text>
          </View>

          <View style={styles.spellsContainer}>
            <Text style={styles.spellsTitle}>Büyü Seç:</Text>
            {currentItem.spellOptions.map((spell, index) => (
              <Pressable
                key={index}
                onPress={() => handleSpell(spell)}
                style={({ pressed }) => [
                  styles.spellButton,
                  pressed && styles.spellButtonPressed,
                  magicState === 'correct' && spell === currentItem.correctSpell && styles.correctSpell,
                  magicState === 'wrong' && spell !== currentItem.correctSpell && styles.wrongSpell,
                ]}
                disabled={magicState !== 'idle'}
              >
                <Text style={styles.spellEmoji}>✨</Text>
                <Text style={styles.spellText}>{spell}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryEmoji}>🎭</Text>
          <Text style={styles.victoryTitle}>Muhteşem Büyücü!</Text>
          <Text style={styles.victoryScore}>Toplam Puan: {score}</Text>
          <Text style={styles.victoryMessage}>Tüm büyüleri başardın! 🌟</Text>
          <Pressable onPress={resetGame} style={styles.playAgainButton}>
            <Text style={styles.playAgainText}>🔄 Tekrar Oyna</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>🏠 Ana Sayfa</Text>
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  magicParticles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  wizardContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  wizardEmoji: {
    fontSize: 60,
  },
  wizardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 40,
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 100,
  },
  sparkles: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 30,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  spellsContainer: {
    gap: 12,
  },
  spellsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  spellButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  spellButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  correctSpell: {
    backgroundColor: '#A8E6CF',
    borderColor: '#4CAF50',
  },
  wrongSpell: {
    backgroundColor: '#FFB3B3',
    borderColor: '#F44336',
  },
  spellEmoji: {
    fontSize: 24,
  },
  spellText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C0E37',
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  victoryEmoji: {
    fontSize: 80,
  },
  victoryTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  victoryScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  victoryMessage: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  playAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  homeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
