/**
 * CHAOS EFFECTS MANAGER
 * Görsel ve işitsel kaos efektlerini yönetir
 * Canvas API kullanarak dinamik efektler oluşturur
 */

class ChaosManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.chaosLevel = 0; // 0-100
    this.effects = [];
    this.animationFrame = null;
    
    // Canvas boyutunu ayarla
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Görsel efekt tipleri
    this.effectTypes = ['glitch', 'particles', 'wave', 'static'];
  }

  /**
   * Canvas boyutunu ekrana uygun ayarla
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Kaos seviyesini ayarla (0-100)
   */
  setChaosLevel(level) {
    this.chaosLevel = Math.max(0, Math.min(100, level));
    
    // Kaos seviyesine göre efekt sayısını ayarla
    const targetEffectCount = Math.floor(this.chaosLevel / 25);
    
    while (this.effects.length < targetEffectCount) {
      this.addRandomEffect();
    }
    
    while (this.effects.length > targetEffectCount) {
      this.effects.pop();
    }

    // DOM efektlerini uygula
    this.applyDOMEffects();
  }

  /**
   * Rastgele bir efekt ekle
   */
  addRandomEffect() {
    const type = this.effectTypes[Math.floor(Math.random() * this.effectTypes.length)];
    const effect = this.createEffect(type);
    this.effects.push(effect);
  }

  /**
   * Efekt oluştur
   */
  createEffect(type) {
    switch(type) {
      case 'glitch':
        return new GlitchEffect(this.canvas.width, this.canvas.height);
      case 'particles':
        return new ParticleEffect(this.canvas.width, this.canvas.height);
      case 'wave':
        return new WaveEffect(this.canvas.width, this.canvas.height);
      case 'static':
        return new StaticEffect(this.canvas.width, this.canvas.height);
      default:
        return new GlitchEffect(this.canvas.width, this.canvas.height);
    }
  }

  /**
   * DOM efektlerini uygula (CSS filter, shake, vb.)
   */
  applyDOMEffects() {
    const gameScreen = document.getElementById('game-screen');
    
    // Kaos seviyesine göre CSS sınıflarını uygula
    gameScreen.classList.remove('chaos-effect-1', 'chaos-effect-2', 'chaos-effect-3', 'chaos-effect-4');
    
    if (this.chaosLevel > 75) {
      gameScreen.classList.add('chaos-effect-3'); // Shake
      gameScreen.classList.add('chaos-effect-4'); // Contrast
    } else if (this.chaosLevel > 50) {
      gameScreen.classList.add('chaos-effect-2'); // Blur
    } else if (this.chaosLevel > 25) {
      gameScreen.classList.add('chaos-effect-1'); // Hue rotate
    }
  }

  /**
   * Ana render döngüsü
   */
  render() {
    // Canvas'ı temizle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Tüm efektleri render et
    this.effects.forEach(effect => {
      effect.update();
      effect.render(this.ctx);
    });
    
    // Döngüyü devam ettir
    this.animationFrame = requestAnimationFrame(() => this.render());
  }

  /**
   * Kaos efektlerini başlat
   */
  start() {
    if (!this.animationFrame) {
      this.render();
    }
  }

  /**
   * Kaos efektlerini durdur
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Efektleri temizle
   */
  clear() {
    this.effects = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/**
 * GLITCH EFFECT
 * Ekranda glitch çizgileri oluşturur
 */
class GlitchEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.lines = [];
    this.maxLines = 5;
    this.spawnLine();
  }

  spawnLine() {
    if (this.lines.length < this.maxLines && Math.random() < 0.1) {
      this.lines.push({
        y: Math.random() * this.height,
        height: Math.random() * 20 + 5,
        offset: (Math.random() - 0.5) * 20,
        life: 30
      });
    }
  }

  update() {
    this.spawnLine();
    this.lines = this.lines.filter(line => {
      line.life--;
      return line.life > 0;
    });
  }

  render(ctx) {
    this.lines.forEach(line => {
      ctx.fillStyle = `rgba(0, 255, 204, ${line.life / 30 * 0.3})`;
      ctx.fillRect(0, line.y, this.width, line.height);
      
      ctx.fillStyle = `rgba(255, 0, 255, ${line.life / 30 * 0.2})`;
      ctx.fillRect(line.offset, line.y, this.width, line.height);
    });
  }
}

/**
 * PARTICLE EFFECT
 * Rastgele parçacıklar oluşturur
 */
class ParticleEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.maxParticles = 30;
  }

  update() {
    // Yeni parçacık ekle
    if (this.particles.length < this.maxParticles && Math.random() < 0.3) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        life: 60,
        color: Math.random() < 0.5 ? '#00ffcc' : '#ff00ff'
      });
    }

    // Parçacıkları güncelle
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      return p.life > 0;
    });
  }

  render(ctx) {
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 60;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
    });
  }
}

/**
 * WAVE EFFECT
 * Dalga efekti oluşturur
 */
class WaveEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.offset = 0;
  }

  update() {
    this.offset += 0.05;
  }

  render(ctx) {
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < this.width; x += 5) {
      const y = this.height / 2 + Math.sin(x * 0.02 + this.offset) * 30;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }
}

/**
 * STATIC EFFECT
 * TV statik efekti
 */
class StaticEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  update() {
    // Her frame'de rastgele konumlar
  }

  render(ctx) {
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = Math.random() * 2 + 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, size, size);
    }
  }
}
