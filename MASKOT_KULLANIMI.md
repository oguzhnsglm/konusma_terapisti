# 🎭 Yeni Maskot Sistemi - Kullanım Kılavuzu

## 📋 Özet

Eski yıldız maskotu kaldırıldı ve yerine **sevimli blob karakteri** eklendi!
- Yuvarlak, yumuşak karakter
- Mor gradyan renk
- Pembe yanaklar
- Sevimli gülümseme
- Küçük anten/saç tufu

---

## 🎨 Maskot Özellikleri

### Görsel
- **Boyut**: 70x70px
- **Konum**: Sağ alt köşe (fixed)
- **Renk**: Mor gradyan (#A78BFA → #818CF8)
- **Stil**: SVG bazlı, yuvarlak blob

### Animasyonlar
1. **Idle (Varsayılan)**:
   - Yumuşak yukarı-aşağı hareket (3 saniye)
   - Nefes alma efekti (4 saniye)
   - Göz kırpma (5 saniyede bir)
   - Anten hoppama

2. **Kutlama**:
   - Ölçekleme (scale 1 → 1.15)
   - Hafif dönme (-5° ↔ 5°)
   - 5 renkli konfeti patlaması
   - Konuşma balonu

---

## 🚀 Nasıl Kullanılır?

### 1. Context Provider (Zaten yapıldı ✅)

`App.jsx` içinde `MascotProvider` ile sarmalanmış:

```jsx
<MascotProvider>
  <BrowserRouter>
    <Mascot />
    {/* routes */}
  </BrowserRouter>
</MascotProvider>
```

### 2. Component İçinde Kullanım

#### Örnek 1: Doğru Cevap Verince

```jsx
import { useMascot } from '../context/MascotContext';

const QuizComponent = () => {
  const { celebrate } = useMascot();
  
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      celebrate('correctAnswer');
      // "Doğru! 🎯" gibi mesajlar gösterir
    }
  };
  
  return <button onClick={() => handleAnswer(true)}>Cevapla</button>;
};
```

#### Örnek 2: Quest Tamamlandığında

```jsx
const QuestPanel = () => {
  const { celebrate } = useMascot();
  
  const completeQuest = () => {
    // Quest logic...
    celebrate('questCompleted');
    // "Görev tamamlandı! 🏆"
  };
};
```

#### Örnek 3: Pratik Bitince

```jsx
const PracticeSession = () => {
  const { celebrate } = useMascot();
  
  const finishPractice = () => {
    // Save progress...
    celebrate('practiceDone');
    // "Pratik tamamlandı! 📝"
  };
};
```

#### Örnek 4: Kelime Öğrenince

```jsx
const WordCard = () => {
  const { celebrate } = useMascot();
  
  const learnWord = () => {
    celebrate('wordCompleted');
    // "Kelimeyi öğrendin! 📚"
  };
};
```

#### Örnek 5: Genel Kutlama

```jsx
const AnyComponent = () => {
  const { celebrate } = useMascot();
  
  const doSomethingGood = () => {
    celebrate(); // veya celebrate('default')
    // "Bravo! 👏", "Tebrikler! 🎉" gibi mesajlar
  };
};
```

---

## 🎯 Event Tipleri ve Mesajlar

### `default` (veya boş)
- "Bravo! 👏"
- "Tebrikler! 🎉"
- "Harikasın! ✨"
- "Süpersin! 💫"
- "Aferin! 🌟"
- "Çok iyi! 👍"
- "Mükemmel! 🎊"
- "Devam et! 💪"

### `correctAnswer`
- "Doğru! 🎯"
- "Bildin! 🧠"
- "Harika cevap! ⭐"
- "Süper! 🌈"

### `questCompleted`
- "Görev tamamlandı! 🏆"
- "Harika iş! 🎖️"
- "Hepsini bitirdin! 🎉"
- "Müthişsin! 💎"

### `practiceDone`
- "Pratik tamamlandı! 📝"
- "Çok çalıştın! 💪"
- "Süper pratik! ⭐"
- "Bravo! 🎵"

### `wordCompleted`
- "Kelimeyi öğrendin! 📚"
- "Mükemmel telaffuz! 🗣️"
- "Harika konuşma! 🎤"
- "Çok net söyledin! 👏"

---

## 🔧 Window Event Sistemi

Context kullanamadığınız yerlerden (örnek: hooks, utility functions) maskotu tetiklemek için:

```javascript
// Herhangi bir yerden
window.dispatchEvent(new CustomEvent('mascotCelebrate', {
  detail: { type: 'questCompleted' }
}));
```

**Mevcut Entegrasyonlar** (Zaten yapıldı ✅):
- ✅ `PracticePage.jsx` - Kelime tamamlama
- ✅ `ProgressPage.jsx` - İlerleme ekleme
- ✅ `useDailyQuests.js` - Tüm görevler tamamlandığında

---

## 📂 Dosya Yapısı

### Yeni Dosyalar
```
src/
├── context/
│   └── MascotContext.jsx    # Provider + Hook
├── components/
│   ├── Mascot.jsx            # Görsel component
│   ├── Mascot.css            # Animasyonlar
│   ├── MascotOld.jsx         # Eski yıldız (yedek)
│   └── MascotOld.css         # Eski stil (yedek)
```

### Güncellenen Dosyalar
```
src/
├── App.jsx                   # MascotProvider eklendi
├── pages/
│   ├── PracticePage.jsx      # celebrate() entegrasyonu
│   └── ProgressPage.jsx      # celebrate() entegrasyonu
└── hooks/
    └── useDailyQuests.js     # Event dispatch eklendi
```

---

## 🎨 CSS Yapısı

### Ana Class'lar
- `.mascot-wrapper` - Fixed container
- `.mascot-character` - SVG wrapper (idle animasyon)
- `.mascot-character.celebrating` - Kutlama animasyonu
- `.mascot-bubble` - Konuşma balonu
- `.confetti-container` - Konfeti particles
- `.confetti` - Tek konfeti (5 adet)

### Önemli Animasyonlar
```css
@keyframes mascot-idle         /* Yumuşak yüzme */
@keyframes body-breathe       /* Nefes alma */
@keyframes eye-blink          /* Göz kırpma */
@keyframes antenna-bounce     /* Anten hoppama */
@keyframes mascot-celebrate   /* Kutlama */
@keyframes bubble-appear      /* Balon giriş */
@keyframes confetti-burst     /* Konfeti patlaması */
```

---

## 🔄 Eski Maskot ile Karşılaştırma

| Özellik | Eski (Star) | Yeni (Blob) |
|---------|------------|-------------|
| Şekil | ⭐ Yıldız | 🎭 Blob/Balon |
| Renk | Sarı (#FFE066) | Mor (#A78BFA) |
| Boyut | 70x70px | 70x70px |
| Animasyon | Basit float | Çoklu (idle + celebrate) |
| Konfeti | ❌ Yok | ✅ 5 parçacık |
| Mesaj Sistemi | ❌ Rastgele | ✅ Event bazlı |
| Event Dinleme | ❌ Yok | ✅ Var |

---

## 🧪 Test Senaryoları

### Manuel Test
1. **Ana Sayfa**: Maskot sağ altta görünmeli, yavaşça hareket etmeli
2. **Pratik Sayfa**: Kelime tamamlandığında maskot kutlamalı
3. **İlerleme Sayfa**: Form gönderildiğinde maskot mesaj göstermeli
4. **Quest Tamamlama**: Tüm görevler bitince özel kutlama

### Console Test
```javascript
// Browser console'da test et:
window.dispatchEvent(new CustomEvent('mascotCelebrate', {
  detail: { type: 'questCompleted' }
}));
```

---

## 📱 Responsive Tasarım

### Mobile (< 768px)
- Maskot: 60x60px
- Position: bottom: 20px, right: 20px
- Konuşma balonu: bottom: 75px
- Font size: 0.9rem

### Desktop
- Maskot: 70x70px
- Position: bottom: 30px, right: 30px
- Konuşma balonu: bottom: 85px
- Font size: 1rem

---

## ⚡ Performans

- **Pure CSS Animations**: JavaScript animasyonu yok
- **SVG**: Hafif ve ölçeklenebilir
- **Event-driven**: Sadece gerektiğinde çalışır
- **No External Libraries**: Sıfır bağımlılık

---

## 🐛 Sorun Giderme

### Maskot görünmüyor
✅ `App.jsx` içinde `<MascotProvider>` var mı?
✅ `<Mascot />` component render ediliyor mu?
✅ Console'da hata var mı?

### Kutlama çalışmıyor
✅ `useMascot()` hook'u import edilmiş mi?
✅ `celebrate()` fonksiyonu çağrılıyor mu?
✅ Event type doğru mu? ('default', 'questCompleted', vb.)

### Animasyon takılıyor
✅ Browser CSS animasyonlarını destekliyor mu?
✅ GPU acceleration açık mı?
✅ Z-index çakışması var mı?

---

## 🎯 Gelecek İyileştirmeler (Opsiyonel)

- [ ] Farklı karakter seçenekleri
- [ ] Ses efektleri
- [ ] Daha fazla animasyon varyasyonu
- [ ] Gece/gündüz modu renk değişimi
- [ ] Kullanıcı etkileşimi (tıklanabilir)
- [ ] Başarı streak'i gösterimi
- [ ] Özel günler için özel kostümler

---

## 📞 Destek

Sorularınız için dosyalara bakın:
- `src/context/MascotContext.jsx` - Ana context
- `src/components/Mascot.jsx` - Görsel component
- `src/components/Mascot.css` - Tüm animasyonlar

**Başarılar! 🎉**
