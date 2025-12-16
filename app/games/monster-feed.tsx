import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

const { width, height } = Dimensions.get('window');

type Word = {
  text: string;
  image: string;
  correctAnswer: string;
  options: string[];
};

const WORDS: Word[] = [
  { text: '🍎', image: 'Elma', correctAnswer: 'elma', options: ['elma', 'armut', 'muz'] },
  { text: '🐶', image: 'Köpek', correctAnswer: 'köpek', options: ['köpek', 'kedi', 'kuş'] },
  { text: '🌞', image: 'Güneş', correctAnswer: 'güneş', options: ['güneş', 'ay', 'yıldız'] },
  { text: '🚗', image: 'Araba', correctAnswer: 'araba', options: ['araba', 'otobüs', 'bisiklet'] },
  { text: '⚽', image: 'Top', correctAnswer: 'top', options: ['top', 'tahta', 'kalem'] },
];

export default function MonsterFeedGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  
  const monsterScale = useRef(new Animated.Value(1)).current;
  const monsterRotate = useRef(new Animated.Value(0)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const foodAnim = useRef(new Animated.Value(0)).current;

  const currentWord = WORDS[currentWordIndex];

  const animateMonsterHappy = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(monsterScale, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(mouthAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(foodAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(monsterScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      mouthAnim.setValue(0);
      foodAnim.setValue(0);
    }, 1500);
  };

  const animateMonsterSad = () => {
    Animated.sequence([
      Animated.timing(monsterRotate, {
        toValue: -15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(monsterRotate, {
        toValue: 15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(monsterRotate, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (answer: string) => {
    const correct = answer.toLowerCase() === currentWord.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      playSfx('correct');
      setScore(score + 10);
      animateMonsterHappy();
      
      setTimeout(() => {
        if (currentWordIndex < WORDS.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setIsCorrect(null);
        } else {
          setGameOver(true);
        }
      }, 1500);
    } else {
      playSfx('incorrect');
      animateMonsterSad();
      
      setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setIsCorrect(null);
    setGameOver(false);
  };

  const mouthScale = mouthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const foodTranslateY = foodAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });

  const foodOpacity = foodAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <LinearGradient colors={['#FFE5F0', '#E5F0FF', '#F0FFE5']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.title}>🍔 Canavar Besle</Text>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      {!gameOver ? (
        <>
          <View style={styles.wordSection}>
            <Text style={styles.wordEmoji}>{currentWord.text}</Text>
            <Text style={styles.wordText}>{currentWord.image}</Text>
            <Text style={styles.instruction}>Bu kelimeyi söyle!</Text>
          </View>

          <View style={styles.monsterContainer}>
            <Animated.View
              style={[
                styles.monster,
                {
                  transform: [
                    { scale: monsterScale },
                    { rotate: monsterRotate.interpolate({
                      inputRange: [-15, 15],
                      outputRange: ['-15deg', '15deg'],
                    })},
                  ],
                },
              ]}
            >
              <View style={styles.monsterBody}>
                <View style={styles.eyes}>
                  <View style={styles.eye} />
                  <View style={styles.eye} />
                </View>
                <Animated.View style={[styles.mouth, { transform: [{ scaleY: mouthScale }] }]}>
                  <Text style={styles.mouthText}>
                    {isCorrect === null ? '😊' : isCorrect ? '😋' : '😢'}
                  </Text>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.Text
              style={[
                styles.fallingFood,
                {
                  transform: [{ translateY: foodTranslateY }],
                  opacity: foodOpacity,
                },
              ]}
            >
              🍔
            </Animated.Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentWord.options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleAnswer(option)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.optionButtonPressed,
                  isCorrect === true && option === currentWord.correctAnswer && styles.correctButton,
                  isCorrect === false && option !== currentWord.correctAnswer && styles.incorrectButton,
                ]}
                disabled={isCorrect !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>🎉 Tebrikler!</Text>
          <Text style={styles.gameOverScore}>Toplam Puan: {score}</Text>
          <Text style={styles.gameOverMessage}>Canavar çok mutlu! 🎈</Text>
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
    color: '#FF6B6B',
  },
  wordSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  wordEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 18,
    color: '#666',
  },
  monsterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 40,
    position: 'relative',
  },
  monster: {
    alignItems: 'center',
  },
  monsterBody: {
    width: 180,
    height: 180,
    backgroundColor: '#9B59B6',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#8E44AD',
  },
  eyes: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
  },
  eye: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#333',
  },
  mouth: {
    fontSize: 40,
  },
  mouthText: {
    fontSize: 40,
  },
  fallingFood: {
    position: 'absolute',
    top: -100,
    fontSize: 50,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  optionButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  correctButton: {
    backgroundColor: '#A8E6CF',
    borderColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#FFB3B3',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  gameOverScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  gameOverMessage: {
    fontSize: 24,
    color: '#666',
  },
  playAgainButton: {
    backgroundColor: '#4ECDC4',
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
    backgroundColor: '#FF6B6B',
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
