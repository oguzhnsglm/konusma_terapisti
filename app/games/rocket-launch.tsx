import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

const { height } = Dimensions.get('window');

type Question = {
  word: string;
  options: string[];
  correctAnswer: string;
};

const QUESTIONS: Question[] = [
  { word: '🌈', options: ['gökkuşağı', 'bulut', 'yağmur'], correctAnswer: 'gökkuşağı' },
  { word: '🦋', options: ['kelebek', 'arı', 'böcek'], correctAnswer: 'kelebek' },
  { word: '🎈', options: ['balon', 'top', 'bulut'], correctAnswer: 'balon' },
  { word: '🌺', options: ['çiçek', 'ağaç', 'yaprak'], correctAnswer: 'çiçek' },
  { word: '🚀', options: ['roket', 'uçak', 'araba'], correctAnswer: 'roket' },
];

export default function RocketLaunchGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [rocketHeight, setRocketHeight] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  
  const rocketAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fireAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const animateRocketUp = () => {
    const newHeight = rocketHeight + 1;
    setRocketHeight(newHeight);
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rocketAnim, {
          toValue: -newHeight * (height * 0.1),
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(fireAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fireAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 4 }
        ),
      ]),
    ]).start();
  };

  const animateRocketShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (answer: string) => {
    if (isAnswering) return;
    setIsAnswering(true);
    
    const correct = answer === currentQuestion.correctAnswer;
    
    if (correct) {
      playSfx('correct');
      setScore(score + 20);
      animateRocketUp();
      
      setTimeout(() => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setIsAnswering(false);
        } else {
          // Game completed
          setIsAnswering(false);
        }
      }, 1000);
    } else {
      playSfx('incorrect');
      animateRocketShake();
      setTimeout(() => {
        setIsAnswering(false);
      }, 500);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setRocketHeight(0);
    rocketAnim.setValue(0);
    shakeAnim.setValue(0);
  };

  const fireScale = fireAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const gameCompleted = currentQuestionIndex >= QUESTIONS.length - 1 && rocketHeight > 0;

  return (
    <LinearGradient colors={['#1A237E', '#283593', '#3949AB']} style={styles.container}>
      <View style={styles.stars}>
        <Text style={styles.star}>⭐</Text>
        <Text style={[styles.star, { top: 100, left: 50 }]}>✨</Text>
        <Text style={[styles.star, { top: 200, right: 30 }]}>⭐</Text>
        <Text style={[styles.star, { top: 300, left: 80 }]}>✨</Text>
        <Text style={[styles.star, { top: 400, right: 60 }]}>⭐</Text>
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>🚀 Roket Fırlat</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {!gameCompleted ? (
        <>
          <View style={styles.questionSection}>
            <Text style={styles.questionEmoji}>{currentQuestion.word}</Text>
            <Text style={styles.questionText}>Bu nedir?</Text>
          </View>

          <View style={styles.rocketContainer}>
            <Animated.View
              style={[
                styles.rocket,
                {
                  transform: [
                    { translateY: rocketAnim },
                    { translateX: shakeAnim },
                  ],
                },
              ]}
            >
              <Text style={styles.rocketEmoji}>🚀</Text>
              <Animated.Text
                style={[
                  styles.fire,
                  {
                    transform: [{ scaleY: fireScale }],
                  },
                ]}
              >
                🔥
              </Animated.Text>
            </Animated.View>
            <View style={styles.ground} />
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
                disabled={isAnswering}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryEmoji}>🎉</Text>
          <Text style={styles.victoryTitle}>Uzaya Ulaştın!</Text>
          <Text style={styles.victoryScore}>Toplam Puan: {score}</Text>
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
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    fontSize: 30,
    top: 50,
    right: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
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
    color: 'white',
  },
  rocketContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  rocket: {
    alignItems: 'center',
    marginBottom: 10,
  },
  rocketEmoji: {
    fontSize: 60,
  },
  fire: {
    fontSize: 30,
    marginTop: -10,
  },
  ground: {
    width: '100%',
    height: 40,
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
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
    color: '#1A237E',
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
