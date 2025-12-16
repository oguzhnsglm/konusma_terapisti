/**
 * NEUROSHIFT - Main Game Loop
 * Ana oyun döngüsü ve durum yönetimi
 */

class NeuroShiftGame {
  constructor() {
    // Oyun durumu
    this.state = {
      stability: 50,        // 0-100
      momentum: 2,          // 0-5
      chaos: 0,             // 0-100
      tasksCompleted: 0,
      level: 1,
      isPlaying: false,
      isOverload: false
    };

    // Oyun ayarları
    this.config = {
      stabilityTarget: 100,
      momentumDecayRate: 0.1,
      chaosIncreaseRate: 0.5,
      baseTaskInterval: 5000,
      stabilityDecayRate: 0.5
    };

    // Reward/Penalty değerleri
    this.stabilityReward = 10;
    this.stabilityPenalty = 5;
    this.taskSpeedMultiplier = 1.0;

    // Sistemleri başlat
    this.ui = new UIManager();
    this.taskManager = new TaskManager();
    this.difficultyManager = new DifficultyManager();
    this.chaos = new ChaosManager('game-canvas');
    this.modeManager = new ModeManager();
    this.modeEffects = new ModeEffects(this);

    // Event listener'ları kur
    this.setupEventListeners();
    
    // Oyun döngülerini başlat
    this.lastTaskSpawn = 0;
    this.lastUpdate = Date.now();
  }

  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
      this.startGame();
    });

    // Continue button
    document.getElementById('continue-btn').addEventListener('click', () => {
      this.nextLevel();
    });

    // Task tamamlama event'i
    document.addEventListener('taskCompleted', (e) => {
      this.handleTaskCompletion(e.detail);
    });
  }

  /**
   * Oyunu başlat
   */
  startGame() {
    // Intro'yu gizle, oyun ekranını göster
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    // Oyun durumunu sıfırla
    this.state.stability = 50;
    this.state.momentum = 2;
    this.state.chaos = 0;
    this.state.tasksCompleted = 0;
    this.state.isPlaying = true;
    this.state.isOverload = false;

    // UI'ı güncelle
    this.ui.updateStability(this.state.stability);
    this.ui.updateMomentum(this.state.momentum);
    this.ui.updateChaos(this.state.chaos);

    // Chaos efektlerini başlat
    this.chaos.start();

    // Oyun döngüsünü başlat
    this.gameLoop();
    
    // İlk görevi oluştur
    setTimeout(() => {
      this.spawnTask();
    }, 2000);
  }

  /**
   * Ana oyun döngüsü
   */
  gameLoop() {
    if (!this.state.isPlaying) return;

    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // Saniye cinsinden
    this.lastUpdate = now;

    // Stabilite yavaşça azalır
    this.state.stability -= this.config.stabilityDecayRate * deltaTime;
    this.state.stability = Math.max(0, this.state.stability);

    // Kaos yavaşça artar
    this.state.chaos += this.config.chaosIncreaseRate * deltaTime * this.difficultyManager.getDifficulty().chaosIntensity;
    this.state.chaos = Math.min(100, this.state.chaos);

    // Momentum yavaşça azalır
    if (Math.random() < 0.01) { // %1 şans her frame'de
      this.state.momentum = Math.max(0, this.state.momentum - 1);
      this.ui.updateMomentum(this.state.momentum);
    }

    // UI güncellemeleri
    this.ui.updateStability(this.state.stability);
    this.ui.updateChaos(this.state.chaos);
    this.chaos.setChaosLevel(this.state.chaos);

    // Overload kontrolü
    if (this.state.chaos > 80 && !this.state.isOverload) {
      this.enterOverloadMode();
    } else if (this.state.chaos < 60 && this.state.isOverload) {
      this.exitOverloadMode();
    }

    // Stabilite doldu mu?
    if (this.state.stability >= this.config.stabilityTarget) {
      this.levelComplete();
      return;
    }

    // Görev spawn zamanı
    const difficulty = this.difficultyManager.getDifficulty();
    const spawnInterval = this.config.baseTaskInterval / (difficulty.taskSpeed * this.taskSpeedMultiplier);
    
    if (now - this.lastTaskSpawn > spawnInterval) {
      this.spawnTask();
      this.lastTaskSpawn = now;
    }

    // Döngüyü devam ettir
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Yeni görev oluştur
   */
  spawnTask() {
    const difficulty = this.difficultyManager.getDifficulty();
    const taskCount = difficulty.taskCount;
    
    for (let i = 0; i < taskCount; i++) {
      setTimeout(() => {
        this.taskManager.createTask(null, difficulty.taskDuration);
      }, i * 500); // Her görev arasında 500ms gecikme
    }
  }

  /**
   * Görev tamamlama
   */
  handleTaskCompletion(detail) {
    const { correct, responseTime, timeout } = detail;

    // Timeout oldu mu?
    if (timeout) {
      this.state.stability -= this.stabilityPenalty * 2;
      this.state.chaos += 10;
      this.difficultyManager.recordTask(false, 0);
      this.ui.animateStabilityChange(-this.stabilityPenalty * 2);
      return;
    }

    // Doğru cevap
    if (correct) {
      const reward = this.stabilityReward;
      this.state.stability += reward;
      this.state.stability = Math.min(100, this.state.stability);
      this.state.chaos = Math.max(0, this.state.chaos - 5);
      this.state.momentum = Math.min(5, this.state.momentum + 1);
      this.state.tasksCompleted++;
      
      this.ui.updateMomentum(this.state.momentum);
      this.ui.animateStabilityChange(reward);
      
      this.difficultyManager.recordTask(true, responseTime);
    } 
    // Yanlış cevap
    else {
      const penalty = this.stabilityPenalty;
      this.state.stability -= penalty;
      this.state.chaos += 8;
      this.state.momentum = Math.max(0, this.state.momentum - 1);
      
      this.ui.updateMomentum(this.state.momentum);
      this.ui.animateStabilityChange(-penalty);
      
      this.difficultyManager.recordTask(false, responseTime);
    }
  }

  /**
   * Overload moduna gir
   */
  enterOverloadMode() {
    this.state.isOverload = true;
    this.ui.showOverloadWarning(true);
    
    // Bonus stabilite kazanma fırsatı
    this.stabilityReward = 15;
    
    console.log('OVERLOAD MODE ACTIVATED');
  }

  /**
   * Overload modundan çık
   */
  exitOverloadMode() {
    this.state.isOverload = false;
    this.ui.showOverloadWarning(false);
    
    // Normal ödüle dön
    this.stabilityReward = 10;
    
    console.log('OVERLOAD MODE DEACTIVATED');
  }

  /**
   * Level tamamlandı
   */
  levelComplete() {
    this.state.isPlaying = false;
    
    // Görevleri temizle
    this.taskManager.clearAll();
    
    // Chaos efektlerini durdur
    this.chaos.stop();
    
    // Level tamamlama ekranını göster
    this.ui.showLevelComplete({
      stability: this.state.stability,
      tasksCompleted: this.state.tasksCompleted
    });
  }

  /**
   * Sonraki levele geç
   */
  nextLevel() {
    this.state.level++;
    
    // Level complete ekranını gizle
    this.ui.hideLevelComplete();
    
    // Zorluk seviyesini sıfırlama (progress devam eder)
    // this.difficultyManager.reset(); // İsterseniz açabilirsiniz
    
    // Mod sistemini sıfırla
    this.modeManager.reset();
    
    // Oyunu yeniden başlat
    this.startGame();
  }

  /**
   * Oyunu durdur
   */
  pauseGame() {
    this.state.isPlaying = false;
    this.chaos.stop();
  }

  /**
   * Oyunu devam ettir
   */
  resumeGame() {
    this.state.isPlaying = true;
    this.chaos.start();
    this.lastUpdate = Date.now();
    this.gameLoop();
  }
}

// Oyunu başlat
let game;
window.addEventListener('DOMContentLoaded', () => {
  game = new NeuroShiftGame();
});

// Performance monitoring (opsiyonel)
let fps = 0;
let lastTime = performance.now();
function measureFPS() {
  const now = performance.now();
  fps = 1000 / (now - lastTime);
  lastTime = now;
  
  // Her 60 frame'de bir konsola yazdır
  if (Math.random() < 0.016) {
    console.log(`FPS: ${Math.round(fps)}`);
  }
  
  requestAnimationFrame(measureFPS);
}
measureFPS();
