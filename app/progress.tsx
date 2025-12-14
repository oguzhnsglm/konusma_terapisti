import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useProgress } from '../context/ProgressContext';

export default function ProgressPage() {
  const { progress } = useProgress();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İlerleme</Text>
      <View style={styles.card}>
        <Row label="Konuşma pratikleri" value={progress.practiceCount} />
        <Row label="Oynanan oyunlar" value={progress.gamesPlayed} />
        <Row label="Çözülen bulmacalar" value={progress.puzzlesSolved} />
        <Row label="Rozetler" value={progress.achievements.length} />
      </View>
      <Pressable onPress={() => router.push('/')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonLabel}>Ana Sayfa</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f1ff',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2f1b4e',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#7f6bff',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: '#4a3274',
    fontWeight: '600',
  },
  rowValue: {
    color: '#2f1b4e',
    fontWeight: '800',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#7f6bff',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
