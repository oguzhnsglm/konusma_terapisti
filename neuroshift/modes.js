/**
 * MODE SYSTEM
 * Oyuncu modları: Focus, Echo, Surge (Chaos)
 * Her modun özel yetenekleri ve cooldown'ları var
 */

class ModeManager {
  constructor() {
    this.modes = {
      focus: {
        name: 'Focus Mode',
        active: false,
        cooldown: 0,
        cooldownTime: 20000, // 20 saniye
        duration: 5000,       // 5 saniye aktif
        effect: 'Slow down time'
      },
      echo: {
        name: 'Echo Mode',
        active: false,
        cooldown: 0,
        cooldownTime: 15000,
        duration: 8000,
        effect: 'Repeat task hints'
      },
      chaos: {
        name: 'Surge Mode',
        active: false,
        cooldown: 0,
        cooldownTime: 25000,
        duration: 6000,
        effect: 'High risk, high reward'
      }
    };

    this.activeMode = null;
    this.modeTimeout = null;
    
    this.setupEventListeners();
    this.startCooldownUpdates();
  }

  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    document.getElementById('focus-mode-btn').addEventListener('click', () => {
      this.activateMode('focus');
    });

    document.getElementById('echo-mode-btn').addEventListener('click', () => {
      this.activateMode('echo');
    });

    document.getElementById('chaos-mode-btn').addEventListener('click', () => {
      this.activateMode('chaos');
    });
  }

  /**
   * Modu aktifleştir
   */
  activateMode(modeKey) {
    const mode = this.modes[modeKey];
    
    // Cooldown kontrolü
    if (mode.cooldown > 0) {
      console.log(`${mode.name} is on cooldown`);
      return;
    }

    // Başka bir mod aktifse çık
    if (this.activeMode && this.activeMode !== modeKey) {
      console.log('Another mode is already active');
      return;
    }

    // Modu aktifleştir
    mode.active = true;
    this.activeMode = modeKey;
    
    // UI'ı güncelle
    const btn = document.querySelector(`[data-mode="${modeKey}"]`);
    btn.classList.add('active');
    
    // Mode event'ini fırlat
    const event = new CustomEvent('modeActivated', {
      detail: { mode: modeKey, duration: mode.duration }
    });
    document.dispatchEvent(event);
    
    // Mod süresini başlat
    if (this.modeTimeout) clearTimeout(this.modeTimeout);
    this.modeTimeout = setTimeout(() => {
      this.deactivateMode(modeKey);
    }, mode.duration);
  }

  /**
   * Modu devre dışı bırak
   */
  deactivateMode(modeKey) {
    const mode = this.modes[modeKey];
    
    mode.active = false;
    this.activeMode = null;
    
    // Cooldown başlat
    mode.cooldown = mode.cooldownTime;
    
    // UI'ı güncelle
    const btn = document.querySelector(`[data-mode="${modeKey}"]`);
    btn.classList.remove('active');
    btn.classList.add('cooldown');
    
    // Cooldown overlay animasyonu
    const overlay = btn.querySelector('.cooldown-overlay');
    overlay.style.setProperty('--cooldown-time', `${mode.cooldownTime}ms`);
    
    // Mode event'ini fırlat
    const event = new CustomEvent('modeDeactivated', {
      detail: { mode: modeKey }
    });
    document.dispatchEvent(event);
  }

  /**
   * Cooldown güncellemelerini başlat
   */
  startCooldownUpdates() {
    setInterval(() => {
      Object.keys(this.modes).forEach(key => {
        const mode = this.modes[key];
        
        if (mode.cooldown > 0) {
          mode.cooldown = Math.max(0, mode.cooldown - 100);
          
          // Cooldown bitti
          if (mode.cooldown === 0) {
            const btn = document.querySelector(`[data-mode="${key}"]`);
            btn.classList.remove('cooldown');
          }
        }
      });
    }, 100);
  }

  /**
   * Aktif mod var mı kontrol et
   */
  isAnyModeActive() {
    return this.activeMode !== null;
  }

  /**
   * Belirli bir mod aktif mi
   */
  isModeActive(modeKey) {
    return this.modes[modeKey] && this.modes[modeKey].active;
  }

  /**
   * Aktif mod bilgisini döndür
   */
  getActiveMode() {
    if (!this.activeMode) return null;
    return {
      key: this.activeMode,
      ...this.modes[this.activeMode]
    };
  }

  /**
   * Tüm modları sıfırla
   */
  reset() {
    Object.keys(this.modes).forEach(key => {
      this.modes[key].active = false;
      this.modes[key].cooldown = 0;
      
      const btn = document.querySelector(`[data-mode="${key}"]`);
      btn.classList.remove('active', 'cooldown');
    });
    
    this.activeMode = null;
    if (this.modeTimeout) {
      clearTimeout(this.modeTimeout);
      this.modeTimeout = null;
    }
  }
}

/**
 * Mode efektlerini uygula
 */
class ModeEffects {
  constructor(gameInstance) {
    this.game = gameInstance;
    
    // Mode event'lerini dinle
    document.addEventListener('modeActivated', (e) => {
      this.applyModeEffect(e.detail.mode);
    });
    
    document.addEventListener('modeDeactivated', (e) => {
      this.removeModeEffect(e.detail.mode);
    });
  }

  /**
   * Mod efektini uygula
   */
  applyModeEffect(mode) {
    switch(mode) {
      case 'focus':
        this.applyFocusMode();
        break;
      case 'echo':
        this.applyEchoMode();
        break;
      case 'chaos':
        this.applySurgeMode();
        break;
    }
  }

  /**
   * Focus Mode: Zamanı yavaşlat
   */
  applyFocusMode() {
    // Görev süresini uzat
    this.game.taskSpeedMultiplier = 0.5;
    
    // Kaos efektlerini azalt
    this.game.chaos.setChaosLevel(this.game.chaosLevel * 0.5);
    
    console.log('Focus Mode: Time slowed down');
  }

  /**
   * Echo Mode: Görev ipuçlarını tekrarla
   */
  applyEchoMode() {
    // Görevleri vurgula
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
      card.style.borderColor = '#00ffcc';
      card.style.boxShadow = '0 0 30px rgba(0, 255, 204, 0.6)';
    });
    
    console.log('Echo Mode: Tasks highlighted');
  }

  /**
   * Surge Mode: Yüksek risk, yüksek ödül
   */
  applySurgeMode() {
    // Kaos seviyesini artır
    this.game.chaos.setChaosLevel(this.game.chaosLevel * 1.5);
    
    // Stabilite kazancını artır
    this.game.stabilityReward = 15; // Normal: 10
    
    console.log('Surge Mode: High stakes activated');
  }

  /**
   * Mod efektini kaldır
   */
  removeModeEffect(mode) {
    switch(mode) {
      case 'focus':
        this.game.taskSpeedMultiplier = 1.0;
        break;
      case 'echo':
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        });
        break;
      case 'chaos':
        this.game.stabilityReward = 10;
        break;
    }
  }
}
