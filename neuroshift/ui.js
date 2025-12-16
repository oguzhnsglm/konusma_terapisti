/**
 * UI MANAGER
 * Kullanıcı arayüzü güncellemelerini yönetir
 */

class UIManager {
  constructor() {
    this.elements = {
      stabilityBar: document.getElementById('stability-bar'),
      stabilityValue: document.getElementById('stability-value'),
      momentumDots: document.getElementById('momentum-dots'),
      chaosValue: document.getElementById('chaos-value'),
      chaosIndicator: document.getElementById('chaos-indicator'),
      overloadWarning: document.getElementById('overload-warning'),
      levelComplete: document.getElementById('level-complete')
    };
    
    // Momentum dots oluştur
    this.createMomentumDots();
  }

  /**
   * Momentum noktalarını oluştur
   */
  createMomentumDots() {
    this.elements.momentumDots.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'momentum-dot';
      this.elements.momentumDots.appendChild(dot);
    }
  }

  /**
   * Stabilite barını güncelle
   */
  updateStability(value) {
    value = Math.max(0, Math.min(100, value));
    
    this.elements.stabilityBar.style.width = `${value}%`;
    this.elements.stabilityValue.textContent = Math.floor(value);
    
    // Renk değişimi
    if (value < 30) {
      this.elements.stabilityBar.style.background = 'linear-gradient(90deg, #ff3366, #ff6666)';
    } else if (value < 60) {
      this.elements.stabilityBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc00)';
    } else {
      this.elements.stabilityBar.style.background = 'linear-gradient(90deg, #00cc88, #00ffcc)';
    }
  }

  /**
   * Momentum göstergesini güncelle
   */
  updateMomentum(value) {
    const dots = this.elements.momentumDots.querySelectorAll('.momentum-dot');
    dots.forEach((dot, index) => {
      if (index < value) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  /**
   * Kaos seviyesini güncelle
   */
  updateChaos(value) {
    this.elements.chaosValue.textContent = Math.floor(value);
    
    // Yüksek kaos uyarısı
    if (value > 70) {
      this.elements.chaosIndicator.classList.add('high');
    } else {
      this.elements.chaosIndicator.classList.remove('high');
    }
  }

  /**
   * Overload uyarısını göster/gizle
   */
  showOverloadWarning(show) {
    if (show) {
      this.elements.overloadWarning.classList.remove('hidden');
    } else {
      this.elements.overloadWarning.classList.add('hidden');
    }
  }

  /**
   * Level tamamlama ekranını göster
   */
  showLevelComplete(stats) {
    document.getElementById('final-stability').textContent = Math.floor(stats.stability);
    document.getElementById('tasks-completed').textContent = stats.tasksCompleted;
    
    this.elements.levelComplete.classList.remove('hidden');
  }

  /**
   * Level tamamlama ekranını gizle
   */
  hideLevelComplete() {
    this.elements.levelComplete.classList.add('hidden');
  }

  /**
   * Geri bildirim animasyonu göster
   */
  showFeedback(type, message) {
    // Geçici bildirim oluştur
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 40px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid ${type === 'success' ? '#00ffcc' : '#ff3366'};
      border-radius: 10px;
      color: ${type === 'success' ? '#00ffcc' : '#ff3366'};
      font-size: 1.5rem;
      font-weight: bold;
      z-index: 1000;
      animation: feedback-anim 1s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 1000);
  }

  /**
   * Stabilite değişikliği animasyonu
   */
  animateStabilityChange(amount) {
    const indicator = document.createElement('div');
    indicator.textContent = amount > 0 ? `+${amount}` : amount;
    indicator.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      font-weight: bold;
      color: ${amount > 0 ? '#00ffcc' : '#ff3366'};
      z-index: 1000;
      pointer-events: none;
      animation: float-up 1s ease forwards;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 1000);
  }
}

// CSS animasyonlarını ekle
const style = document.createElement('style');
style.textContent = `
  @keyframes feedback-anim {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
  }
  
  @keyframes float-up {
    0% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-50px);
    }
  }
`;
document.head.appendChild(style);
