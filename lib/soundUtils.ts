/**
 * Ses efektleri - Web Audio API kullanarak oluşturulan tonlar
 * Çocuk dostu, yumuşak sesler
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Başarı sesi - ding ding (iki kısa bip)
 */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // İlk nota
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 523.25; // C5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.start(now);
    osc1.stop(now + 0.15);
    
    // İkinci nota
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 659.25; // E5
    gain2.gain.setValueAtTime(0.3, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.error('Ses çalma hatası:', e);
  }
}

/**
 * Yanlış sesi - üzgün tını
 */
export function playWrong() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Frekans düşer
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.error('Ses çalma hatası:', e);
  }
}

/**
 * Kutlama sesi - neşeli melodi
 */
export function playCelebration() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.5, time: 0.45 },  // C6
    ];
    
    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + time);
      gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.2);
      
      osc.start(now + time);
      osc.stop(now + time + 0.2);
    });
  } catch (e) {
    console.error('Ses çalma hatası:', e);
  }
}

/**
 * Tıklama sesi - kısa, hafif
 */
export function playClick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.error('Ses çalma hatası:', e);
  }
}

/**
 * Star kazanma sesi - parlak tını
 */
export function playStar() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Yüksek nota
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = 1046.5; // C6
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.error('Ses çalma hatası:', e);
  }
}
