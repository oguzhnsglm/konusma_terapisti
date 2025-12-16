/**
 * DIFFICULTY MANAGER
 * Otomatik zorluk ayarlama sistemi
 * Oyuncunun performansını analiz eder ve zorluk seviyesini dinamik olarak ayarlar
 */

class DifficultyManager {
  constructor() {
    // Performans metrikleri
    this.metrics = {
      responseTimes: [],      // Son 10 görev için tepki süreleri
      successRate: 1.0,       // Başarı oranı (0-1)
      consecutiveSuccesses: 0,
      consecutiveFails: 0,
      totalTasks: 0,
      totalSuccess: 0
    };

    // Zorluk parametreleri
    this.difficulty = {
      taskSpeed: 1.0,         // Görev hızı çarpanı
      taskCount: 1,           // Aynı anda görev sayısı
      chaosIntensity: 1.0,    // Kaos efekti yoğunluğu
      taskDuration: 10000     // Görev süresi (ms)
    };

    // Zorluk eşikleri
    this.thresholds = {
      easyTrigger: 0.8,       // Bu oranın üstünde -> zorlaştır
      hardTrigger: 0.4,       // Bu oranın altında -> kolaylaştır
      minSpeed: 0.5,
      maxSpeed: 2.0,
      minDuration: 5000,
      maxDuration: 15000
    };
  }

  /**
   * Görev tamamlandığında çağrılır
   * @param {boolean} success - Görev başarılı mı
   * @param {number} responseTime - Tepki süresi (ms)
   */
  recordTask(success, responseTime) {
    this.metrics.totalTasks++;
    
    if (success) {
      this.metrics.totalSuccess++;
      this.metrics.consecutiveSuccesses++;
      this.metrics.consecutiveFails = 0;
    } else {
      this.metrics.consecutiveSuccesses = 0;
      this.metrics.consecutiveFails++;
    }

    // Tepki süresini kaydet (son 10 görev)
    this.metrics.responseTimes.push(responseTime);
    if (this.metrics.responseTimes.length > 10) {
      this.metrics.responseTimes.shift();
    }

    // Başarı oranını güncelle
    this.metrics.successRate = this.metrics.totalSuccess / this.metrics.totalTasks;

    // Zorluk seviyesini ayarla
    this.adjustDifficulty();
  }

  /**
   * Zorluk seviyesini otomatik ayarlar
   */
  adjustDifficulty() {
    const { successRate, consecutiveSuccesses, consecutiveFails } = this.metrics;

    // Çok başarılıysa zorlaştır
    if (successRate > this.thresholds.easyTrigger || consecutiveSuccesses >= 5) {
      this.increaseDifficulty();
    }
    // Çok zorlanıyorsa kolaylaştır
    else if (successRate < this.thresholds.hardTrigger || consecutiveFails >= 3) {
      this.decreaseDifficulty();
    }

    // Ortalama tepki süresine göre ayarlama
    const avgResponseTime = this.getAverageResponseTime();
    if (avgResponseTime > 0 && avgResponseTime < 2000) {
      // Çok hızlı cevap veriyor, zorlaştır
      this.difficulty.taskSpeed = Math.min(this.thresholds.maxSpeed, this.difficulty.taskSpeed * 1.05);
    } else if (avgResponseTime > 5000) {
      // Yavaş cevap veriyor, kolaylaştır
      this.difficulty.taskSpeed = Math.max(this.thresholds.minSpeed, this.difficulty.taskSpeed * 0.95);
    }
  }

  /**
   * Zorluğu artır
   */
  increaseDifficulty() {
    // Görev hızını artır
    this.difficulty.taskSpeed = Math.min(
      this.thresholds.maxSpeed,
      this.difficulty.taskSpeed * 1.1
    );

    // Görev süresini azalt
    this.difficulty.taskDuration = Math.max(
      this.thresholds.minDuration,
      this.difficulty.taskDuration * 0.95
    );

    // Kaos yoğunluğunu artır
    this.difficulty.chaosIntensity = Math.min(2.0, this.difficulty.chaosIntensity * 1.05);

    // Bazen görev sayısını artır
    if (Math.random() < 0.3 && this.difficulty.taskCount < 2) {
      this.difficulty.taskCount++;
    }
  }

  /**
   * Zorluğu azalt
   */
  decreaseDifficulty() {
    // Görev hızını azalt
    this.difficulty.taskSpeed = Math.max(
      this.thresholds.minSpeed,
      this.difficulty.taskSpeed * 0.9
    );

    // Görev süresini artır
    this.difficulty.taskDuration = Math.min(
      this.thresholds.maxDuration,
      this.difficulty.taskDuration * 1.05
    );

    // Kaos yoğunluğunu azalt
    this.difficulty.chaosIntensity = Math.max(0.5, this.difficulty.chaosIntensity * 0.95);

    // Görev sayısını azalt
    if (this.difficulty.taskCount > 1) {
      this.difficulty.taskCount--;
    }
  }

  /**
   * Ortalama tepki süresini hesaplar
   */
  getAverageResponseTime() {
    if (this.metrics.responseTimes.length === 0) return 0;
    const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0);
    return sum / this.metrics.responseTimes.length;
  }

  /**
   * Mevcut zorluk parametrelerini döndürür
   */
  getDifficulty() {
    return { ...this.difficulty };
  }

  /**
   * Performans metriklerini döndürür
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Zorluk seviyesini sıfırlar
   */
  reset() {
    this.metrics = {
      responseTimes: [],
      successRate: 1.0,
      consecutiveSuccesses: 0,
      consecutiveFails: 0,
      totalTasks: 0,
      totalSuccess: 0
    };

    this.difficulty = {
      taskSpeed: 1.0,
      taskCount: 1,
      chaosIntensity: 1.0,
      taskDuration: 10000
    };
  }
}
