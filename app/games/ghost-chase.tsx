import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

const { width, height } = Dimensions.get('window');

type GhostQuestion = {
  question: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
};

const QUESTIONS: GhostQuestion[] = [
  { question: 'Hangi renk?', emoji: '🔴', options: ['kırmızı', 'mavi', 'yeşil'], correctAnswer: 'kırmızı' },
  { question: 'Hangi hayvan?', emoji: '🐱', options: ['kedi', 'köpek', 'kuş'], correctAnswer: 'kedi' },
  { question: 'Hangi meyve?', emoji: '🍌', options: ['muz', 'elma', 'üzüm'], correctAnswer: 'muz' },
  { question: 'Hangi araç?', emoji: '✈️', options: ['uçak', 'araba', 'gemi'], correctAnswer: 'uçak' },
  { question: 'Hangi şekil?', emoji: '⭐', options: ['yıldız', 'daire', 'kare'], correctAnswer: 'yıldız' },
];

export default function GhostChaseGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [ghostDistance, setGhostDistance] = useState(5);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  
  const ghostAnim = useRef(new Animated.Value(width)).current;
  const playerAnim = useRef(new Animated.Value(0)).current;
  const scareAnim = useRef(new Animated.Value(0)).current;

  const question = QUESTIONS[currentQuestion];

  useEffect(() => {
    // Initialize ghost position
    const initialDistance = width * 0.7;
    ghostAnim.setValue(initialDistance);
  }, []);

  const animateGhostAway = () => {
    const newDistance = ghostDistance + 1;
    setGhostDistance(newDistance);
    
    Animated.spring(ghostAnim, {
      toValue: width * 0.7 + (newDistance * 30),
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const animateGhostCloser = () => {
    const newDistance = Math.max(0, ghostDistance - 1);
    setGhostDistance(newDistance);
    
    Animated.parallel([
      Animated.spring(ghostAnim, {
        toValue: width * 0.7 - ((5 - newDistance) * 30),
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scareAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scareAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (newDistance === 0) {
      setTimeout(() => setGameState('lost'), 500);
    }
  };

  const handleAnswer = (answer: string) => {
    const correct = answer === question.correctAnswer;
    
    if (correct) {
      playSfx('correct');
      setScore(score + 15);
      animateGhostAway();
      
      if (currentQuestion < QUESTIONS.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 800);
      } else {
        setTimeout(() => setGameState('won'), 800);
      }
    } else {
      playSfx('incorrect');
      animateGhostCloser();
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGhostDistance(5);
    setGameState('playing');
    ghostAnim.setValue(width * 0.7);
    scareAnim.setValue(0);
  };

  const scareScale = scareAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>👻 Hayalet Kaçır</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <View style={styles.distanceIndicator}>
        <Text style={styles.distanceText}>Mesafe:</Text>
        <View style={styles.distanceBar}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.distanceBlock,
                i < ghostDistance && styles.distanceBlockActive,
                i < 3 && styles.distanceBlockDanger,
              ]}
            />
          ))}
        </View>
      </View>

      {gameState === 'playing' ? (
        <>
          <View style={styles.questionSection}>
            <Text style={styles.questionText}>{question.question}</Text>
            <Text style={styles.questionEmoji}>{question.emoji}</Text>
          </View>

          <View style={styles.gameScene}>
            <Animated.View
              style={[
                styles.player,
                {
                  transform: [{ translateX: playerAnim }, { scale: scareScale }],
                },
              ]}
            >
              <Text style={styles.playerEmoji}>🧑</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.ghost,
                {
                  transform: [{ translateX: ghostAnim }],
                },
              ]}
            >
              <Text style={styles.ghostEmoji}>
                {ghostDistance < 3 ? '😈' : '👻'}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleAnswer(option)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.optionButtonPressed,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : gameState === 'won' ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultTitle}>Hayaleti Korkuttun!</Text>
          <Text style={styles.resultScore}>Toplam Puan: {score}</Text>
          <Text style={styles.resultMessage}>Hayalet kaçtı! 👻💨</Text>
          <Pressable onPress={resetGame} style={styles.playAgainButton}>
            <Text style={styles.playAgainText}>🔄 Tekrar Oyna</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>🏠 Ana Sayfa</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>👻</Text>
          <Text style={styles.resultTitle}>Hayalet Yakaladı!</Text>
          <Text style={styles.resultScore}>Puan: {score}</Text>
          <Text style={styles.resultMessage}>Tekrar dene! 💪</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  distanceIndicator: {
    marginBottom: 20,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  distanceBar: {
    flexDirection: 'row',
    gap: 5,
  },
  distanceBlock: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  distanceBlockActive: {
    backgroundColor: '#4CAF50',
  },
  distanceBlockDanger: {
    backgroundColor: '#F44336',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  questionEmoji: {
    fontSize: 60,
  },
  gameScene: {
    height: 200,
    marginBottom: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  player: {
    position: 'absolute',
    left: 20,
  },
  playerEmoji: {
    fontSize: 50,
  },
  ghost: {
    position: 'absolute',
  },
  ghostEmoji: {
    fontSize: 50,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  optionButtonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  resultEmoji: {
    fontSize: 80,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  resultMessage: {
    fontSize: 20,
    color: 'white',
  },
  playAgainButton: {
    backgroundColor: '#9C27B0',
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
