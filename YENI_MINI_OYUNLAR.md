# 📚 Yeni Mini Oyun Sayfaları - Dokümantasyon

Bu dokümantasyon, konuşma terapisi uygulamasına eklenen iki yeni mini oyun sayfasını açıklar.

## 🎯 Genel Bakış

İki yeni bağımsız mini oyun sayfası eklendi:
1. **Sesli Hikâye Kitabı** (`/storybook`)
2. **Dünyalar Haritası** (`/world-map`)

Bu sayfalar mevcut uygulamayı değiştirmez, sadece yeni özellikler ekler.

---

## 📖 ÖZELLIK 1: SESLİ HİKÂYE KİTABI

### Dosyalar
- `src/pages/StorybookPage.jsx` - Ana hikaye bileşeni
- `src/pages/StorybookPage.css` - Stil dosyası

### Özellikler

#### 1. Hikaye Seçimi
- Sol tarafta 3 hazır hikaye kartı:
  - 🐱 Küçük Kedi Mavi (5 sayfa)
  - ☁️ Bulut ve Güneş (5 sayfa)
  - 🎈 Renkli Balon (5 sayfa)
- Her hikaye kartında ilerleme çubuğu
- Tıklanabilir kartlar

#### 2. Hikaye Okuma Arayüzü
- Büyük, okunabilir metin kartı
- Sayfa göstergesi (örn: "Sayfa 2 / 5")
- Navigasyon butonları:
  - "Önceki Sayfa" ←
  - "Sonraki Sayfa" →

#### 3. Sesli Okuma (Simülasyon)
- **🔊 Dinle** butonu:
  - Tıklandığında "Dinleniyor..." gösterir
  - 2 saniye süreyle buton devre dışı kalır
  - Gerçek ses dosyaları eklenebilir (HTML5 `<audio>` desteği var)

#### 4. Okuma Takibi
- **✓ Ben Okudum** butonu:
  - Sayfa okundu olarak işaretlenir
  - localStorage'a kaydedilir
  - "Harika, bu sayfayı okudun! 🎉" feedback gösterilir
  - Maskot kutlaması tetiklenir (varsa)

#### 5. İlerleme Takibi
- Her hikaye için okuma yüzdesi hesaplanır
- Örnek: "Bu hikâyenin %60'ını okudun"
- localStorage key: `speech_storybook_progress_v1`

### localStorage Veri Yapısı
```javascript
{
  "story_1": {
    "pagesRead": [0, 1, 2],  // Okunan sayfa indeksleri
    "lastRead": "2024-01-15T10:30:00.000Z"
  },
  "story_2": {
    "pagesRead": [0],
    "lastRead": "2024-01-15T11:00:00.000Z"
  }
}
```

### Nasıl Kullanılır?
```javascript
// Tarayıcıda aç:
// http://localhost:5175/storybook

// Veya başka sayfadan navigate et:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/storybook');
```

### Yeni Hikaye Ekleme
`StorybookPage.jsx` dosyasında `STORIES` dizisine yeni hikaye ekle:

```javascript
{
  id: 'story_4',
  title: 'Yeni Hikaye',
  description: 'Kısa açıklama',
  emoji: '🦋',
  pages: [
    'Sayfa 1 metni...',
    'Sayfa 2 metni...',
    'Sayfa 3 metni...'
  ]
}
```

---

## 🗺️ ÖZELLIK 2: DÜNYALAR HARİTASI

### Dosyalar
- `src/pages/WorldMapPage.jsx` - Ana harita bileşeni
- `src/pages/WorldMapPage.css` - Stil dosyası

### Özellikler

#### 1. 5 Farklı Dünya
Her dünya bir seviye/aşama temsil eder:

| # | Dünya | Emoji | Açıklama | Kilit Koşulu |
|---|-------|-------|----------|--------------|
| 1 | Ses Ormanı | 🌳 | Sesleri ve harfleri öğren | Her zaman açık |
| 2 | Harf Adası | 🏝️ | Harfleri birleştir | 10 dakika pratik |
| 3 | Kelime Köyü | 🏘️ | Yeni kelimeler öğren | 3 gün seri |
| 4 | Cümle Şehri | 🏙️ | Kelimelerden cümleler kur | 5 hikaye sayfası |
| 5 | Konuşma Kalesi | 🏰 | Akıcı konuşma pratiği | Tüm görevler |

#### 2. İlerleme Bazlı Kilit Açma
Dünyalar otomatik olarak şu kriterlere göre açılır:

**Dünya 2 için:**
- Toplam 10 dakika pratik gerekli
- `konusma_ilerleme_logs` localStorage'dan okur

**Dünya 3 için:**
- 3 gün üst üste pratik gerekli
- Seri (streak) hesaplanır

**Dünya 4 için:**
- 5 hikaye sayfası okunmuş olmalı
- `speech_storybook_progress_v1` localStorage'dan okur

**Dünya 5 için:**
- Tüm günlük görevler tamamlanmış olmalı
- `speech_daily_quests_v1` localStorage'dan okur

#### 3. Görsel Tasarım
- **Kilitli dünyalar:**
  - Gri renk, düşük opaklık
  - 🔒 kilit ikonu
  - Tıklanamaz

- **Açık dünyalar:**
  - Tam renkli, parlak
  - Hover efekti (yukarı kalkma + büyüme)
  - Tıklanabilir

- **Girilmiş dünyalar:**
  - Altın renkli kenarlık
  - ✓ işareti sağ üstte

#### 4. Dünya Detay Paneli
Bir dünyaya tıklandığında modal açılır:
- Dünya başlığı ve emoji
- Açıklama
- Kilit açma koşulu
- Eğer açıksa: "Bu dünyaya girdin! 🎉"
- "Başla (Yakında)" butonu (placeholder)
- Kullanıcı ilerleme özeti:
  - ⏱️ Toplam dakika
  - 🔥 Seri (streak)
  - 📖 Okunan hikaye sayfa sayısı
  - ✅ Görev durumu

#### 5. İlerleme Takibi
localStorage key: `speech_world_map_v1`

```javascript
{
  "world_1": {
    "entered": true,
    "enteredAt": "2024-01-15T10:30:00.000Z"
  },
  "world_3": {
    "entered": true,
    "enteredAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Nasıl Kullanılır?
```javascript
// Tarayıcıda aç:
// http://localhost:5175/world-map

// Veya başka sayfadan navigate et:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/world-map');
```

### Yeni Dünya Ekleme
`WorldMapPage.jsx` dosyasında `WORLDS` dizisine yeni dünya ekle:

```javascript
{
  id: 'world_6',
  name: 'Yeni Dünya',
  emoji: '🌟',
  description: 'Açıklama buraya',
  unlockCondition: 'Koşul açıklaması',
  requiredMinutes: 50,  // veya başka kriterler
  color: '#FF6B6B'
}
```

---

## 🔗 Routing Entegrasyonu

`App.jsx` dosyasına eklenen yeni rotalar:

```javascript
import StorybookPage from './pages/StorybookPage';
import WorldMapPage from './pages/WorldMapPage';

// Routes içinde:
<Route path="/storybook" element={<StorybookPage />} />
<Route path="/world-map" element={<WorldMapPage />} />
```

---

## 🎨 Stil ve Tasarım

Her iki sayfa da çocuk dostu, yumuşak tasarıma sahip:
- Pastel renkler ve yumuşak gradyanlar
- Yuvarlak köşeler (border-radius: 15-30px)
- Smooth animasyonlar ve hover efektleri
- Responsive tasarım (mobil uyumlu)
- Büyük, okunabilir fontlar
- Emoji kullanımı

### Renk Paleti

**Storybook:**
- Arka plan: Sarı-turuncu gradyan (#FEF3C7 → #FED7AA)
- Kartlar: Mor gradyan (#F3E8FF → #E9D5FF)
- Aksiyon: Mavi (#60A5FA), Yeşil (#34D399)

**World Map:**
- Arka plan: Mavi gradyan (#DBEAFE → #BFDBFE)
- Her dünya kendi rengine sahip:
  - Dünya 1: Yeşil (#34D399)
  - Dünya 2: Mavi (#60A5FA)
  - Dünya 3: Mor (#A78BFA)
  - Dünya 4: Sarı (#FBBF24)
  - Dünya 5: Kırmızı (#F87171)

---

## 📱 Responsive Tasarım

### Mobil (< 768px)
- Grid tek sütuna dönüşür
- Butonlar tam genişlik
- Font boyutları küçülür
- Padding azaltılır

### Tablet (768px - 1024px)
- İki sütunlu grid
- Orta boyut fontlar

### Desktop (> 1024px)
- Üç sütunlu grid (World Map)
- İki sütunlu layout (Storybook)
- Tam boyut elementler

---

## 🔌 Maskot Entegrasyonu (Opsiyonel)

Her iki sayfa da maskot hook'u ile entegre olabilir:

```javascript
// Hikaye sayfası okuduktan sonra:
window.dispatchEvent(new CustomEvent('mascotCelebrate', {
  detail: { type: 'default' }
}));

// Dünya açılınca:
window.dispatchEvent(new CustomEvent('mascotCelebrate', {
  detail: { type: 'default' }
}));
```

Eğer maskot mevcut değilse, hata vermez ve sessizce atlanır.

---

## 🧪 Test Senaryoları

### Storybook Test
1. `/storybook` adresine git
2. Bir hikaye seç (örn: Küçük Kedi Mavi)
3. "Sonraki Sayfa" ile ilerle
4. "Dinle" butonuna tıkla → 2 saniye "Dinleniyor..." görmeli
5. "Ben Okudum" tıkla → Yeşil feedback görmeli
6. İlerleme çubuğu güncellendiğini kontrol et
7. Başka hikaye seç → Sayfa 0'dan başlamalı

### World Map Test
1. `/world-map` adresine git
2. Dünya 1 (Ses Ormanı) açık olmalı
3. Dünya 1'e tıkla → Detay paneli açılmalı
4. Kullanıcı ilerleme bilgilerini kontrol et
5. Kapatıp başka dünyalara bak
6. Kilitli dünyalara tıkla → Hiçbir şey olmamalı
7. Pratik yap, dakika biriktir → Dünya 2 açılmalı

---

## 📊 localStorage Keys

### Yeni Eklenen Keys
| Key | Açıklama | Format |
|-----|----------|--------|
| `speech_storybook_progress_v1` | Hikaye okuma ilerlemesi | Object |
| `speech_world_map_v1` | Dünya girişi kayıtları | Object |

### Kullanılan Mevcut Keys
| Key | Kullanım Yeri | Amaç |
|-----|---------------|------|
| `konusma_ilerleme_logs` | World Map | Toplam dakika ve seri hesabı |
| `speech_daily_quests_v1` | World Map | Görev tamamlama kontrolü |

---

## 🚀 HomePage Entegrasyonu

Ana sayfaya buton eklemek için `HomePage.jsx` içinde:

```javascript
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Mevcut butonlar */}
      
      <button onClick={() => navigate('/storybook')}>
        📚 Sesli Hikâye Kitabı
      </button>
      
      <button onClick={() => navigate('/world-map')}>
        🗺️ Dünyalar Haritası
      </button>
    </div>
  );
}
```

---

## 🔧 Gelecekteki İyileştirmeler

### Storybook için:
- [ ] Gerçek TTS (Text-to-Speech) API entegrasyonu
- [ ] Ses dosyası yükleme özelliği
- [ ] Yavaş/hızlı okuma seçenekleri
- [ ] Hikaye favorileme
- [ ] Kullanıcı tarafından hikaye oluşturma

### World Map için:
- [ ] "Başla" butonuna gerçek içerik bağlama
- [ ] Her dünyada mini aktiviteler
- [ ] Dünyalar arası animasyonlu geçişler
- [ ] Yıldız toplama sistemi
- [ ] Başarım rozetleri

---

## ❗ Önemli Notlar

1. **Mevcut Uygulama Etkilenmedi:**
   - Hiçbir route değiştirilmedi
   - Hiçbir component güncellenmedi
   - Hiçbir stil bozulmadı
   - Sadece YENİ dosyalar ve rotalar eklendi

2. **localStorage Bağımsızlığı:**
   - Her özellik kendi key'ini kullanır
   - Mevcut data ile çakışma riski yok
   - Versiyon numaraları ile gelecek uyumluluğu sağlandı

3. **Graceful Degradation:**
   - Eksik data varsa fallback değerler kullanılır
   - Hata fırlatmaz, console.log ile sessizce atlanır
   - Maskot yoksa özellik çalışmaya devam eder

4. **Responsive:**
   - Mobil, tablet, desktop optimize
   - Touch-friendly butonlar
   - Overflow scroll desteği

---

## 📞 Yardım ve Destek

Sorularınız için:
- `StorybookPage.jsx` - Hikaye sistemi
- `WorldMapPage.jsx` - Harita sistemi
- Her iki dosya detaylı yorum satırları içerir

Kolay kullanım için hazır kod örnekleri ve detaylı belgeler sağlanmıştır! 🎉
