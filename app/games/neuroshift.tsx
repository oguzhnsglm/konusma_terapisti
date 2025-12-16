import { useState, useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface Task {
  id: number;
  question: string;
  options: string[];
  correct: number;
  answered: boolean;
}

export default function NeuroShiftGame() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [stability, setStability] = useState(50);
  const [chaos, setChaos] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Oyun başlat
  const startGame = () => {
    setGameStarted(true);
    setStability(50);
    setChaos(0);
    setTasks([]);
    setCompletedTasks(0);
    setLevelComplete(false);
    spawnTask();
  };

  // Görev oluştur
  const spawnTask = () => {
    const allTasks = [
      { q: 'Hangi kelime "ev" ile kafiyeli?', options: ['dev', 'top', 'kek'], correct: 0 },
      { q: 'Hangi renk soğuk renktir?', options: ['kırmızı', 'mavi', 'turuncu'], correct: 1 },
      { q: 'Hangisi meyvedir?', options: ['patates', 'elma', 'soğan'], correct: 1 },
      { q: '"Kedi" kelimesinde kaç harf var?', options: ['3', '4', '5'], correct: 1 },
      { q: 'Hangisi hayvandır?', options: ['masa', 'kedi', 'kalem'], correct: 1 },
      { q: 'Hangi kelime "dal" ile kafiyeli?', options: ['kal', 'top', 'ses'], correct: 0 },
      { q: 'Hangisi taşıttır?', options: ['ev', 'araba', 'masa'], correct: 1 },
    ];
    
    const task = allTasks[Math.floor(Math.random() * allTasks.length)];
    const newTask: Task = {
      id: Date.now(),
      question: task.q,
      options: task.options,
      correct: task.correct,
      answered: false,
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  // Cevap ver
  const answerTask = (taskId: number, selectedIndex: number, correctIndex: number) => {
    const isCorrect = selectedIndex === correctIndex;
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, answered: true } : t));
    
    if (isCorrect) {
      setStability(s => Math.min(100, s + 10));
      setChaos(c => Math.max(0, c - 5));
      setCompletedTasks(c => c + 1);
      
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      setStability(s => Math.max(0, s - 5));
      setChaos(c => Math.min(100, c + 8));
      
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
    
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }, 1000);
  };

  // Otomatik bozulma
  useEffect(() => {
    if (!gameStarted || levelComplete) return;
    
    const interval = setInterval(() => {
      setStability(s => {
        const newStability = s - 0.5;
        if (newStability <= 0) {
          setGameStarted(false);
          alert('Oyun Bitti! Tekrar dene.');
          return 50;
        }
        if (newStability >= 100) {
          setLevelComplete(true);
          return 100;
        }
        return newStability;
      });
      
      setChaos(c => Math.min(100, c + 0.3));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameStarted, levelComplete]);

  // Görev spawn
  useEffect(() => {
    if (!gameStarted || levelComplete) return;
    
    const interval = setInterval(() => {
      if (tasks.length < 3) {
        spawnTask();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [gameStarted, tasks.length, levelComplete]);

  if (!gameStarted) {
    return (
      <LinearGradient colors={['#0a0e27', '#1a1f3a']} style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.title}>NEUROSHIFT</Text>
          <Text style={styles.subtitle}>Kaosu yönet, dengeyi koru</Text>
          <Pressable onPress={startGame} style={styles.startButton}>
            <LinearGradient colors={['#00d9ff', '#7b2fff']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Başla</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  if (levelComplete) {
    return (
      <LinearGradient colors={['#0a0e27', '#1a1f3a']} style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.title}>Seviye Tamamlandı!</Text>
          <Text style={styles.subtitle}>{completedTasks} görev tamamlandı</Text>
          <Pressable onPress={startGame} style={styles.startButton}>
            <LinearGradient colors={['#00d9ff', '#7b2fff']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Devam Et</Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={() => router.back()} style={[styles.startButton, { marginTop: 10 }]}>
            <View style={[styles.buttonGradient, { backgroundColor: '#333' }]}>
              <Text style={styles.buttonText}>Geri Dön</Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0e27', '#1a1f3a']} style={styles.container}>
      <Animated.View style={[styles.gameContent, { transform: [{ translateX: shakeAnim }] }]}>
        <View style={styles.header}>
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>Stabilite</Text>
            <View style={styles.barBg}>
              <LinearGradient 
                colors={['#00d9ff', '#7b2fff']} 
                style={[styles.bar, { width: `${stability}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
          
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>Kaos: {Math.round(chaos)}%</Text>
            <View style={styles.barBg}>
              <LinearGradient 
                colors={['#ff0055', '#ff8800']} 
                style={[styles.bar, { width: `${chaos}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        </View>

        <ScrollView style={styles.tasksContainer}>
          {tasks.map(task => (
            <Animated.View 
              key={task.id} 
              style={[styles.task, { transform: [{ scale: pulseAnim }] }]}
            >
              <Text style={styles.taskQuestion}>{task.question}</Text>
              <View style={styles.taskOptions}>
                {task.options.map((option, index) => (
                  <Pressable
                    key={index}
                    onPress={() => !task.answered && answerTask(task.id, index, task.correct)}
                    disabled={task.answered}
                    style={({ pressed }) => [
                      styles.optionBtn,
                      pressed && styles.optionBtnPressed,
                      task.answered && index === task.correct && styles.optionCorrect,
                      task.answered && index !== task.correct && styles.optionIncorrect,
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  intro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00d9ff',
    marginBottom: 10,
    textShadowColor: '#7b2fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 40,
  },
  startButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    gap: 10,
    marginBottom: 20,
  },
  barContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
  },
  barLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  barBg: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  tasksContainer: {
    flex: 1,
  },
  task: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  taskQuestion: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  taskOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  optionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  optionBtnPressed: {
    opacity: 0.7,
  },
  optionCorrect: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
  },
  optionIncorrect: {
    backgroundColor: '#ff0055',
    borderColor: '#ff0055',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
