import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

type Question = {
  emoji: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

const QUESTIONS: Question[] = [
  { emoji: '🌸', question: 'Bu nedir?', options: ['çiçek', 'yaprak', 'ağaç'], correctAnswer: 'çiçek' },
  { emoji: '🎨', question: 'Bu nedir?', options: ['boya', 'kalem', 'defter'], correctAnswer: 'boya' },
  { emoji: '🎵', question: 'Bu nedir?', options: ['müzik', 'ses', 'gürültü'], correctAnswer: 'müzik' },
  { emoji: '🌙', question: 'Bu nedir?', options: ['ay', 'yıldız', 'güneş'], correctAnswer: 'ay' },
  { emoji: '🎁', question: 'Bu nedir?', options: ['hediye', 'kutu', 'paket'], correctAnswer: 'hediye' },
];

export default function DragonWakeGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showFire, setShowFire] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  
  const dragonScale = useRef(new Animated.Value(1)).current;
  const dragonEyes = useRef(new Animated.Value(0)).current;
  const fireAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  const question = QUESTIONS[currentQuestion];
  const maxWrongAnswers = 3;

  const animateDragonWaking = () => {
    Animated.parallel([
      Animated.spring(dragonScale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(dragonEyes, {
        toValue: wrongAnswers + 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.spring(dragonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });
  };

  const animateDragonFire = () => {
    setShowFire(true);
    Animated.sequence([
      Animated.timing(fireAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fireAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFire(false));
  };

  const animateCelebrate = () => {
    setShowCelebrate(true);
    Animated.sequence([
      Animated.spring(celebrateAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(celebrateAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCelebrate(false));
  };

  const handleAnswer = (answer: string) => {
    const correct = answer === question.correctAnswer;
    
    if (correct) {
      playSfx('correct');
      setScore(score + 10);
      animateCelebrate();
      
      // Dragon goes back to sleep
      Animated.timing(dragonEyes, {
        toValue: Math.max(0, wrongAnswers - 1),
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      if (wrongAnswers > 0) {
        setWrongAnswers(wrongAnswers - 1);
      }
      
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setGameState('won');
        }
      }, 1000);
    } else {
      playSfx('incorrect');
      const newWrongCount = wrongAnswers + 1;
      setWrongAnswers(newWrongCount);
      
      animateDragonWaking();
      
      if (newWrongCount >= maxWrongAnswers) {
        setTimeout(() => {
          animateDragonFire();
          setTimeout(() => {
            setGameState('lost');
          }, 800);
        }, 800);
      }
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setWrongAnswers(0);
    setScore(0);
    setGameState('playing');
    dragonScale.setValue(1);
    dragonEyes.setValue(0);
    fireAnim.setValue(0);
    celebrateAnim.setValue(0);
  };

  const eyeOpacity = dragonEyes.interpolate({
    inputRange: [0, maxWrongAnswers],
    outputRange: [0, 1],
  });

  const fireOpacity = fireAnim;
  const fireScale = fireAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  const celebrateRotate = celebrateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getDragonEmoji = () => {
    if (gameState === 'lost') return '🔥🐲🔥';
    if (wrongAnswers === 0) return '😴';
    if (wrongAnswers === 1) return '😑';
    if (wrongAnswers === 2) return '😠';
    return '😡';
  };

  return (
    <LinearGradient colors={['#4A148C', '#6A1B9A', '#8E24AA']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>🐉 Ejderhayı Uyut</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <View style={styles.dangerMeter}>
        <Text style={styles.dangerText}>Tehlike Seviyesi:</Text>
        <View style={styles.dangerBar}>
          {[...Array(maxWrongAnswers)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dangerBlock,
                i < wrongAnswers && styles.dangerBlockActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.dangerWarning}>
          {wrongAnswers === 0 && '😴 Ejderha uyuyor'}
          {wrongAnswers === 1 && '😑 Ejderha kımıldadı'}
          {wrongAnswers === 2 && '😠 Ejderha uyanıyor!'}
          {wrongAnswers === 3 && '😡 Ejderha uyandı!'}
        </Text>
      </View>

      {gameState === 'playing' ? (
        <>
          <View style={styles.dragonContainer}>
            <Animated.View
              style={[
                styles.dragon,
                {
                  transform: [{ scale: dragonScale }],
                },
              ]}
            >
              <Text style={styles.dragonEmoji}>{getDragonEmoji()}</Text>
              {wrongAnswers > 0 && (
                <Animated.View style={[styles.eyes, { opacity: eyeOpacity }]}>
                  <Text style={styles.eyeText}>👀</Text>
                </Animated.View>
              )}
            </Animated.View>

            {showFire && (
              <Animated.Text
                style={[
                  styles.fire,
                  {
                    opacity: fireOpacity,
                    transform: [{ scale: fireScale }],
                  },
                ]}
              >
                🔥
              </Animated.Text>
            )}

            {showCelebrate && (
              <Animated.Text
                style={[
                  styles.celebrate,
                  {
                    transform: [{ rotate: celebrateRotate }],
                  },
                ]}
              >
                ⭐
              </Animated.Text>
            )}
          </View>

          <View style={styles.questionSection}>
            <Text style={styles.questionEmoji}>{question.emoji}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
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
          <Text style={styles.resultTitle}>Ejderha Uyuyor!</Text>
          <Text style={styles.resultScore}>Toplam Puan: {score}</Text>
          <Text style={styles.resultMessage}>Mükemmel! Ejderhayı uyuttun! 😴</Text>
          <Pressable onPress={resetGame} style={styles.playAgainButton}>
            <Text style={styles.playAgainText}>🔄 Tekrar Oyna</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>🏠 Ana Sayfa</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>🐲</Text>
          <Text style={styles.resultTitle}>Ejderha Uyandı!</Text>
          <Text style={styles.resultScore}>Puan: {score}</Text>
          <Text style={styles.resultMessage}>Tekrar dene, daha dikkatli ol! 💪</Text>
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
    marginBottom: 15,
    paddingTop: 40,
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
  dangerMeter: {
    marginBottom: 20,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  dangerBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dangerBlock: {
    flex: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  dangerBlockActive: {
    backgroundColor: '#FF5252',
  },
  dangerWarning: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  dragonContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  dragon: {
    alignItems: 'center',
    position: 'relative',
  },
  dragonEmoji: {
    fontSize: 120,
  },
  eyes: {
    position: 'absolute',
    top: 30,
  },
  eyeText: {
    fontSize: 30,
  },
  fire: {
    position: 'absolute',
    fontSize: 60,
    bottom: 50,
  },
  celebrate: {
    position: 'absolute',
    top: -20,
    fontSize: 50,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  questionEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
    color: '#4A148C',
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
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#FF6B6B',
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
