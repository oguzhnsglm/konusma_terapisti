import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '../../context/ProgressContext';
import { useMascot } from '../../context/MascotContext';

type Card = { id: number; emoji: string; pair: string };

function buildCards(): Card[] {
  const base: Card[] = [
    { id: 1, emoji: '🐱', pair: 'Kedi' },
    { id: 2, emoji: '🐱', pair: 'Kedi' },
    { id: 3, emoji: '🚗', pair: 'Araba' },
    { id: 4, emoji: '🚗', pair: 'Araba' },
    { id: 5, emoji: '🍎', pair: 'Elma' },
    { id: 6, emoji: '🍎', pair: 'Elma' },
    { id: 7, emoji: '⚽', pair: 'Top' },
    { id: 8, emoji: '⚽', pair: 'Top' },
    { id: 9, emoji: '🌸', pair: 'Çiçek' },
    { id: 10, emoji: '🌸', pair: 'Çiçek' },
    { id: 11, emoji: '🎈', pair: 'Balon' },
    { id: 12, emoji: '🎈', pair: 'Balon' },
  ];
  return [...base].sort(() => Math.random() - 0.5);
}

export default function MemoryGamePage() {
  const router = useRouter();
  const { incrementGames } = useProgress();
  const { celebrate } = useMascot();

  const initialCards = useMemo(() => buildCards(), []);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) {
      return;
    }

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = nextFlipped;

      if (cards[first].pair === cards[second].pair) {
        setSolved((s) => [...s, first, second]);
        setFlipped([]);
        celebrate('correctAnswer');

        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            incrementGames();
            celebrate('questCompleted');
            Alert.alert('Tebrikler!', `Oyunu ${moves + 1} hamlede tamamladın!`);
          }, 300);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const resetGame = () => {
    setCards(buildCards());
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Ana Menü</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/games')} style={({ pressed }) => [styles.backBtn, styles.homeBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>Oyunlara Dön</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Hafıza Oyunu</Text>
      <Text style={styles.subtitle}>Eşleşen kartları bul!</Text>

      <View style={styles.stats}>
        <Text style={styles.stat}>Hamle: {moves}</Text>
        <Text style={styles.stat}>Bulunan: {solved.length / 2} / {cards.length / 2}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card, index) => {
          const isOpen = flipped.includes(index) || solved.includes(index);
          return (
            <Pressable
              key={card.id + index}
              onPress={() => handleCardClick(index)}
              style={({ pressed }) => [
                styles.card,
                isOpen && styles.cardOpen,
                pressed && styles.pressed,
              ]}
            >
              {isOpen ? <Text style={styles.cardEmoji}>{card.emoji}</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={resetGame} style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}>
        <Text style={styles.resetLabel}>Yeniden Başla</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f1ff',
    padding: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#efe9ff',
  },
  homeBtn: {
    backgroundColor: '#ffe9f0',
  },
  backText: {
    color: '#6a5acd',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  subtitle: {
    color: '#4a3274',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    color: '#4a3274',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f2f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dcd6ff',
  },
  cardOpen: {
    backgroundColor: '#d4f5d8',
    borderColor: '#9be6a7',
  },
  cardEmoji: {
    fontSize: 26,
  },
  resetBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#7f6bff',
  },
  resetLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
