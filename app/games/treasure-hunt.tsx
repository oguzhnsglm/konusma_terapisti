import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../context/AudioContext';

type Chest = {
  id: number;
  question: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
  opened: boolean;
  treasure: string;
};

const INITIAL_CHESTS: Chest[] = [
  { 
    id: 1, 
    question: 'Hangi şekil?', 
    emoji: '⭐', 
    options: ['yıldız', 'ay', 'güneş'], 
    correctAnswer: 'yıldız',
    opened: false,
    treasure: '💰'
  },
  { 
    id: 2, 
    question: 'Hangi renk?', 
    emoji: '🔵', 
    options: ['mavi', 'kırmızı', 'yeşil'], 
    correctAnswer: 'mavi',
    opened: false,
    treasure: '💎'
  },
  { 
    id: 3, 
    question: 'Hangi hayvan?', 
    emoji: '🦁', 
    options: ['aslan', 'kaplan', 'leopar'], 
    correctAnswer: 'aslan',
    opened: false,
    treasure: '👑'
  },
  { 
    id: 4, 
    question: 'Hangi meyve?', 
    emoji: '🍊', 
    options: ['portakal', 'limon', 'mandalina'], 
    correctAnswer: 'portakal',
    opened: false,
    treasure: '⭐'
  },
  { 
    id: 5, 
    question: 'Hangi araç?', 
    emoji: '🚢', 
    options: ['gemi', 'tekne', 'sal'], 
    correctAnswer: 'gemi',
    opened: false,
    treasure: '🏆'
  },
];

export default function TreasureHuntGame() {
  const router = useRouter();
  const { playSfx } = useAudio();
  
  const [chests, setChests] = useState<Chest[]>(INITIAL_CHESTS);
  const [currentChest, setCurrentChest] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const chestAnims = useRef(chests.map(() => new Animated.Value(0))).current;
  const treasureAnims = useRef(chests.map(() => new Animated.Value(0))).current;

  const openedCount = chests.filter(c => c.opened).length;
  const gameCompleted = openedCount === chests.length;

  const animateChestOpen = (index: number) => {
    Animated.parallel([
      Animated.spring(chestAnims[index], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(treasureAnims[index], {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleChestClick = (chestId: number) => {
    const chest = chests.find(c => c.id === chestId);
    if (!chest || chest.opened) return;
    
    setCurrentChest(chestId);
    setShowHint(false);
  };

  const handleAnswer = (answer: string) => {
    if (currentChest === null) return;
    
    const chestIndex = chests.findIndex(c => c.id === currentChest);
    const chest = chests[chestIndex];
    const correct = answer === chest.correctAnswer;
    
    if (correct) {
      playSfx('correct');
      setScore(score + 20);
      
      const updatedChests = [...chests];
      updatedChests[chestIndex].opened = true;
      setChests(updatedChests);
      
      animateChestOpen(chestIndex);
      
      setTimeout(() => {
        setCurrentChest(null);
      }, 1500);
    } else {
      playSfx('incorrect');
      setShowHint(true);
    }
  };

  const resetGame = () => {
    setChests(INITIAL_CHESTS);
    setCurrentChest(null);
    setScore(0);
    setShowHint(false);
    chestAnims.forEach(anim => anim.setValue(0));
    treasureAnims.forEach(anim => anim.setValue(0));
  };

  const activeChest = currentChest ? chests.find(c => c.id === currentChest) : null;

  return (
    <LinearGradient colors={['#8B4513', '#A0522D', '#CD853F']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>🗺️ Define Avcısı</Text>
        <Text style={styles.score}>💰 {score}</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Açılan Sandıklar: {openedCount}/{chests.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(openedCount / chests.length) * 100}%` }]} />
        </View>
      </View>

      {!gameCompleted ? (
        <>
          <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.chestsGrid}>
              {chests.map((chest, index) => {
                const lidRotate = chestAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-90deg'],
                });

                const treasureTranslateY = treasureAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, -20],
                });

                return (
                  <Pressable
                    key={chest.id}
                    onPress={() => handleChestClick(chest.id)}
                    style={[
                      styles.chestContainer,
                      currentChest === chest.id && styles.selectedChest,
                      chest.opened && styles.openedChest,
                    ]}
                    disabled={chest.opened}
                  >
                    <View style={styles.chest}>
                      {!chest.opened ? (
                        <Text style={styles.chestEmoji}>🎁</Text>
                      ) : (
                        <View style={styles.openChestContainer}>
                          <Animated.View style={{ transform: [{ rotateX: lidRotate }] }}>
                            <Text style={styles.chestLid}>📦</Text>
                          </Animated.View>
                          <Animated.Text 
                            style={[
                              styles.treasure,
                              { transform: [{ translateY: treasureTranslateY }] }
                            ]}
                          >
                            {chest.treasure}
                          </Animated.Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.chestNumber}>#{chest.id}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {activeChest && (
            <View style={styles.questionPanel}>
              <Text style={styles.questionTitle}>{activeChest.question}</Text>
              <Text style={styles.questionEmoji}>{activeChest.emoji}</Text>
              
              {showHint && (
                <Text style={styles.hint}>💡 İpucu: Tekrar dene!</Text>
              )}

              <View style={styles.answerButtons}>
                {activeChest.options.map((option, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleAnswer(option)}
                    style={({ pressed }) => [
                      styles.answerButton,
                      pressed && styles.answerButtonPressed,
                    ]}
                  >
                    <Text style={styles.answerText}>{option}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => setCurrentChest(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✖️ Kapat</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryEmoji}>🎉</Text>
          <Text style={styles.victoryTitle}>Tüm Hazineler Bulundu!</Text>
          <Text style={styles.victoryScore}>Toplam Altın: {score}</Text>
          <View style={styles.treasuresDisplay}>
            {chests.map(chest => (
              <Text key={chest.id} style={styles.collectedTreasure}>
                {chest.treasure}
              </Text>
            ))}
          </View>
          <Pressable onPress={resetGame} style={styles.playAgainButton}>
            <Text style={styles.playAgainText}>🔄 Yeni Macera</Text>
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
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  mapContainer: {
    flex: 1,
  },
  chestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  chestContainer: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.5)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedChest: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  openedChest: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  chest: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chestEmoji: {
    fontSize: 50,
  },
  openChestContainer: {
    alignItems: 'center',
  },
  chestLid: {
    fontSize: 40,
  },
  treasure: {
    fontSize: 35,
    position: 'absolute',
    top: 20,
  },
  chestNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  questionPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionEmoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 15,
  },
  hint: {
    fontSize: 16,
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 10,
  },
  answerButtons: {
    gap: 10,
    marginBottom: 15,
  },
  answerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  answerButtonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#45a049',
  },
  answerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  victoryEmoji: {
    fontSize: 80,
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  victoryScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  treasuresDisplay: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 15,
  },
  collectedTreasure: {
    fontSize: 40,
  },
  playAgainButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  playAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
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
