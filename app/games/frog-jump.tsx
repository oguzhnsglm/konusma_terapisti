import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

const { width } = Dimensions.get('window');

type Stone = {
  id: number;
  word: string;
  options: string[];
  correctAnswer: string;
};

const STONES: Stone[] = [
  { id: 1, word: '🌸', options: ['çiçek', 'yaprak', 'dal'], correctAnswer: 'çiçek' },
  { id: 2, word: '🦆', options: ['ördek', 'kaz', 'kuğu'], correctAnswer: 'ördek' },
  { id: 3, word: '🍄', options: ['mantar', 'ağaç', 'çimen'], correctAnswer: 'mantar' },
  { id: 4, word: '🐝', options: ['arı', 'sinek', 'böcek'], correctAnswer: 'arı' },
  { id: 5, word: '🌿', options: ['yaprak', 'çimen', 'dal'], correctAnswer: 'yaprak' },
];

export default function FrogJumpGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentStone, setCurrentStone] = useState(0);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  
  const frogAnim = useRef(new Animated.Value(0)).current;
  const splashAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = STONES[currentStone];

  const animateFrogJump = () => {
    setIsJumping(true);
    
    Animated.sequence([
      Animated.timing(frogAnim, {
        toValue: -120,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(frogAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(celebrateAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(celebrateAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsJumping(false);
    });
  };

  const animateFrogFall = () => {
    setIsFalling(true);
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(frogAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(splashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.parallel([
        Animated.spring(frogAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(splashAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsFalling(false);
    });
  };

  const handleAnswer = (answer: string) => {
    if (isJumping || isFalling) return;
    
    const correct = answer === currentQuestion.correctAnswer;
    
    if (correct) {
      playSfx('correct');
      setScore(score + 10);
      animateFrogJump();
      
      setTimeout(() => {
        if (currentStone < STONES.length - 1) {
          setCurrentStone(currentStone + 1);
        }
      }, 1200);
    } else {
      playSfx('incorrect');
      animateFrogFall();
    }
  };

  const resetGame = () => {
    setCurrentStone(0);
    setScore(0);
    frogAnim.setValue(0);
  };

  const splashScale = splashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2],
  });

  const celebrateScale = celebrateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const gameCompleted = currentStone >= STONES.length - 1 && !isJumping && score > 0;

  return (
    <LinearGradient colors={['#87CEEB', '#B0E0E6', '#ADD8E6']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.title}>🐸 Kurbağa Zıpla</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      {!gameCompleted ? (
        <>
          <View style={styles.questionSection}>
            <Text style={styles.questionEmoji}>{currentQuestion.word}</Text>
            <Text style={styles.questionText}>Bu nedir?</Text>
          </View>

          <View style={styles.gameArea}>
            <View style={styles.stonesPath}>
              {STONES.map((stone, index) => (
                <View
                  key={stone.id}
                  style={[
                    styles.stone,
                    index === currentStone && styles.activeStone,
                    index < currentStone && styles.passedStone,
                  ]}
                >
                  <Text style={styles.stoneNumber}>{index + 1}</Text>
                </View>
              ))}
            </View>

            <View style={styles.frogArea}>
              <Animated.View
                style={[
                  styles.frog,
                  {
                    transform: [
                      { translateY: frogAnim },
                      { scale: celebrateScale },
                    ],
                  },
                ]}
              >
                <Text style={styles.frogEmoji}>
                  {isFalling ? '😵' : isJumping ? '😄' : '🐸'}
                </Text>
              </Animated.View>

              {isFalling && (
                <Animated.View
                  style={[
                    styles.splash,
                    {
                      transform: [{ scale: splashScale }],
                      opacity: splashAnim,
                    },
                  ]}
                >
                  <Text style={styles.splashText}>💧💦💧</Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.water}>
              <Text style={styles.waterWaves}>〰️〰️〰️〰️〰️</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleAnswer(option)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.optionButtonPressed,
                ]}
                disabled={isJumping || isFalling}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryEmoji}>🎉</Text>
          <Text style={styles.victoryTitle}>Karşıya Geçtin!</Text>
          <Text style={styles.victoryScore}>Toplam Puan: {score}</Text>
          <Text style={styles.victoryMessage}>Kurbağa mutlu! 🐸</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  stonesPath: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  stone: {
    width: 50,
    height: 50,
    backgroundColor: '#8B7355',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#654321',
  },
  activeStone: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
    transform: [{ scale: 1.1 }],
  },
  passedStone: {
    backgroundColor: '#A8E6CF',
    borderColor: '#4CAF50',
  },
  stoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  frogArea: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frog: {
    alignItems: 'center',
  },
  frogEmoji: {
    fontSize: 60,
  },
  splash: {
    position: 'absolute',
    bottom: -20,
  },
  splashText: {
    fontSize: 40,
  },
  water: {
    width: '100%',
    height: 60,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  waterWaves: {
    fontSize: 20,
    color: '#5BA3F5',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  optionButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
  },
  victoryScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  victoryMessage: {
    fontSize: 20,
    color: '#666',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#2196F3',
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
