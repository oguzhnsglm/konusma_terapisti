import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { playSuccess, playWrong, playClick, playCelebration } from '../../lib/soundUtils';

interface Word {
  id: number;
  word: string;
  emoji: string;
}

interface Card {
  id: number;
  pairId: number;
  word: string;
  isEmoji: boolean;
  emoji?: string;
}

const DIFFICULTY_WORDS: Record<string, Word[]> = {
  easy: [
    { id: 1, word: 'Elma', emoji: '🍎' },
    { id: 2, word: 'Muz', emoji: '🍌' },
    { id: 3, word: 'Portakal', emoji: '🍊' },
    { id: 4, word: 'Çilek', emoji: '🍓' },
  ],
  medium: [
    { id: 1, word: 'Çiçek', emoji: '🌸' },
    { id: 2, word: 'Güneş', emoji: '☀️' },
    { id: 3, word: 'Bulut', emoji: '☁️' },
    { id: 4, word: 'Yağmur', emoji: '🌧️' },
    { id: 5, word: 'Ağaç', emoji: '🌳' },
    { id: 6, word: 'Bal', emoji: '🍯' },
  ],
  hard: [
    { id: 1, word: 'Uçak', emoji: '✈️' },
    { id: 2, word: 'Gemi', emoji: '🚢' },
    { id: 3, word: 'Tren', emoji: '🚂' },
    { id: 4, word: 'Araba', emoji: '🚗' },
    { id: 5, word: 'Bisiklet', emoji: '🚴' },
    { id: 6, word: 'Helikopter', emoji: '🚁' },
    { id: 7, word: 'Yelken', emoji: '⛵' },
    { id: 8, word: 'Motor', emoji: '🏍️' },
  ],
};

export default function MemoryGame() {
  const router = useRouter();
  const { progress, addStarsToday, addWordToday, addSessionToday, addMinutesToday, addAchievement } = useProgress();
  const { theme } = useTheme();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const bgColor = theme === 'dark' ? '#05070f' : '#fefefe';
  const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
  const textSecondary = theme === 'dark' ? '#d5dbff' : '#606481';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';

  const startGame = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    const words = DIFFICULTY_WORDS[level];
    const shuffled = [...words, ...words].sort(() => Math.random() - 0.5);
    const newCards = shuffled.map((w, idx) => ({
      id: idx,
      pairId: w.id,
      word: w.word,
      isEmoji: idx % 2 === 0,
      emoji: w.emoji,
    }));
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
    setStartTime(Date.now());
    playClick();
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const card1 = cards[flipped[0]];
      const card2 = cards[flipped[1]];

      if (card1.pairId === card2.pairId) {
        playSuccess();
        setMatched([...matched, card1.pairId]);
        setFlipped([]);
      } else {
        playWrong();
        setTimeout(() => setFlipped([]), 800);
      }
      setMoves((m) => m + 1);
    }
  }, [flipped]);

  useEffect(() => {
    if (gameStarted && matched.length === DIFFICULTY_WORDS[difficulty].length) {
      setGameWon(true);
      playCelebration();
      const duration = Math.round((Date.now() - startTime) / 60000);
      const wordCount = DIFFICULTY_WORDS[difficulty].length;
      const stars = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      
      addMinutesToday(Math.max(1, duration));
      addWordToday(wordCount);
      addSessionToday(1);
      addStarsToday(stars);
      addAchievement('puzzles', difficulty, stars);
    }
  }, [matched, gameStarted]);

  const handleCardPress = (idx: number) => {
    if (!gameStarted || gameWon || flipped.length === 2 || matched.includes(cards[idx].pairId) || flipped.includes(idx)) return;
    playClick();
    setFlipped([...flipped, idx]);
  };

  if (!gameStarted) {
    return (
      <LinearGradient
        colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
        style={styles.screen}
      >
        <View style={styles.difficultyScreen}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#a78bfa" />
          </Pressable>
          <Text style={[styles.gameTitle, { color: textPrimary }]}>Bulmacalar 🧩</Text>
          <Text style={[styles.description, { color: textSecondary }]}>
            Eşleşen çiftleri bulun ve kelimeleri öğrenin!
          </Text>
          <View style={styles.difficultyOptions}>
            <DifficultyBtn
              level="easy"
              label="Kolay (4 çift)"
              onPress={() => startGame('easy')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
            />
            <DifficultyBtn
              level="medium"
              label="Orta (6 çift)"
              onPress={() => startGame('medium')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
            />
            <DifficultyBtn
              level="hard"
              label="Zor (8 çift)"
              onPress={() => startGame('hard')}
              bgColor={cardColor}
              textColor={textPrimary}
              borderColor={borderColor}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#05070f', '#070d19'] : ['#fefefe', '#f7f9ff']}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setGameStarted(false)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#a78bfa" />
          </Pressable>
          <View>
            <Text style={[styles.gameTitle, { color: textPrimary }]}>Bulmacalar</Text>
            <Text style={[styles.diffLabel, { color: textSecondary }]}>
              {difficulty === 'easy' && 'Kolay'} {difficulty === 'medium' && 'Orta'} {difficulty === 'hard' && 'Zor'}
            </Text>
          </View>
          <View style={styles.stats}>
            <Text style={[styles.statText, { color: textSecondary }]}>Hamle: {moves}</Text>
          </View>
        </View>

        {/* Grid */}
        <View style={[styles.gridContainer, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.grid}>
            {cards.map((card, idx) => (
              <MemoryCard
                key={idx}
                index={idx}
                card={card}
                isFlipped={flipped.includes(idx) || matched.includes(card.pairId)}
                onPress={() => handleCardPress(idx)}
                textColor={textPrimary}
                bgColor={cardColor}
                borderColor={borderColor}
              />
            ))}
          </View>
        </View>

        {/* Game Won */}
        {gameWon && (
          <View style={[styles.winCard, { backgroundColor: cardColor, borderColor }]}>
            <Ionicons name="star" size={48} color="#fbbf24" />
            <Text style={[styles.winTitle, { color: textPrimary }]}>Tebrikler! 🎉</Text>
            <Text style={[styles.winText, { color: textSecondary }]}>
              {DIFFICULTY_WORDS[difficulty].length} kelimeyi başarıyla öğrendin!
            </Text>
            <Pressable style={styles.playAgainBtn} onPress={() => startGame(difficulty)}>
              <Text style={styles.playAgainText}>Tekrar Oyna</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function DifficultyBtn({
  level,
  label,
  onPress,
  bgColor,
  textColor,
  borderColor,
}: {
  level: string;
  label: string;
  onPress: () => void;
  bgColor: string;
  textColor: string;
  borderColor: string;
}) {
  const icons = { easy: '🟢', medium: '🟡', hard: '🔴' };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.diffBtn,
        { backgroundColor: bgColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.diffBtnIcon}>{icons[level as keyof typeof icons]}</Text>
      <Text style={[styles.diffBtnLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

function MemoryCard({
  index,
  card,
  isFlipped,
  onPress,
  textColor,
  bgColor,
  borderColor,
}: {
  index: number;
  card: Card;
  isFlipped: boolean;
  onPress: () => void;
  textColor: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgColor, borderColor, opacity: pressed ? 0.8 : 1 },
        isFlipped && styles.cardFlipped,
      ]}
      onPress={onPress}
    >
      <Text style={styles.cardContent}>
        {isFlipped ? (card.isEmoji ? card.emoji : card.word) : '?'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 16 },
  difficultyScreen: { flex: 1, paddingHorizontal: 16, paddingTop: 20, justifyContent: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontSize: 28, fontWeight: '800' },
  description: { fontSize: 14, fontWeight: '600', marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  diffLabel: { fontSize: 12, fontWeight: '600' },
  stats: { marginLeft: 'auto' },
  statText: { fontSize: 12, fontWeight: '700' },
  difficultyOptions: { gap: 12 },
  diffBtn: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  diffBtnIcon: { fontSize: 32 },
  diffBtnLabel: { fontWeight: '700', fontSize: 16 },
  gridContainer: { borderRadius: 20, padding: 12, borderWidth: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a78bfa20',
  },
  cardFlipped: { backgroundColor: '#a78bfa20' },
  cardContent: { fontSize: 24, fontWeight: '700' },
  winCard: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 12, borderWidth: 1 },
  winTitle: { fontSize: 22, fontWeight: '800' },
  winText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  playAgainBtn: {
    backgroundColor: '#a78bfa',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  playAgainText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
