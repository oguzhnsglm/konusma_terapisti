# Konuşma Terapisti (Expo + Web)

Türkçe konuşan çocuklar için eğitim oyunları ve kelime öğrenme platformu. Expo-Router tabanlı, modern UI ile glassmorphism efektleri, Web Audio API sesler ve localStorage veri saklama.

## 🎮 Özellikler

**8 Eğitim Aktivitesi:**
1. **Bulmacalar (Memory)** - Eşleşen çiftleri bularak kelime öğren
2. **Harf Canavarı (Word-Fill)** - Eksik harfleri tamamla
3. **Ses Çarkı (Rhyme)** - Ses benzerliklerini bul
4. **Duygu Eşleştirme** - Emojileri duygularla eşleştir
5. **Sayma (Counting)** - Nesneleri say, sayıları öğren
6. **Konuşma Pratiği (Levels)** - Seviye tabanlı ilerleme
7. **Profil & Avatar** - Kişiselleştirme ve ödüller
8. **İlerleme Paneli** - Haftalık istatistikler

**Teknik Özellikler:**
- ✨ Glassmorphism & gradient tasarım
- 🎵 Web Audio API sesleri (harici dosya yok)
- 💾 localStorage veri saklama (progress_v2 key)
- 🌍 localStorage-based world unlock sistemi
- ⭐ Yıldız sistemi ve aksesuarlar
- 📊 Haftalık istatistikler ve başarılar
- 🎨 Dark/Light tema desteği
- 📱 Responsive tasarım

## 🚀 Çalıştırma

```bash
# Bağımlılıklar
npm install

# Web Development (3000 portu + Expo)
npm run dev

# Native Development
npm run dev:native

# iOS/Android build
npm run ios    # or android
```

## 📁 Dosya Yapısı

```
app/
├── index.tsx              # Ana sayfa (aktivite grid)
├── games/                 # Oyunlar
│   ├── memory.tsx         # Bulmacalar
│   ├── word-fill.tsx      # Harf Canavarı
│   ├── rhyme.tsx          # Ses Çarkı
│   ├── colors.tsx         # Duygu Eşleştirme
│   ├── counting.tsx       # Sayma
│   └── index.tsx          # Oyunlar listesi
├── levels/                # Dünyalar/Seviyeleri
│   └── index.tsx          # Dünyalar haritası (yıldız kilidi)
├── progress.tsx           # İlerleme & analitik paneli
└── settings.tsx           # Profil, avatar, tema

components/
├── Mascot.tsx             # Kahraman karakteri (animasyonlu)
├── ModeSwitch.tsx         # Tema değiştirme
└── [diğer]

context/
├── ProgressContext.tsx    # Merkezi progress state (localStorage)
├── ThemeContext.tsx       # Dark/Light tema
├── AudioContext.tsx       # Ses yönetimi
└── [diğer]

lib/
├── soundUtils.ts          # Web Audio API ses üretme
└── supabaseClient.ts      # Supabase entegrasyonu (isteğe bağlı)
```

## 🎯 Veri Yapısı

### ProgressContext State

```typescript
type DailyStats = {
  date: string;                    // YYYY-MM-DD
  minutesPracticed: number;
  wordsLearned: number;
  sessionsCompleted: number;
  starsEarned: number;
};

type GameAchievement = {
  gameId: string;                  // 'puzzles', 'word-fill', etc.
  difficulty: 'easy' | 'medium' | 'hard';
  starsEarned: number;             // 1-3
  timestamp: number;
};

type AvatarState = {
  name: string;
  avatarId: string;                // Emoji
  accessories: string[];           // ['hat1', 'crown', ...]
};

type ProgressState = {
  dailyStats: DailyStats[];
  achievements: GameAchievement[];
  avatar: AvatarState;
  unlockedWorlds: number[];
  currentWorld: number;
};
```

### localStorage Persistence
- Key: `progress_v2` (versioned for future migrations)
- Otomatik load/save on app startup

## 🎵 Sesler

Web Audio API ile dinamik olarak üretilen sesler:
- `playSuccess()` - Ding ding melody
- `playWrong()` - Descending sad tone
- `playCelebration()` - 4-note happy melody
- `playClick()` - Sharp click sound
- `playStar()` - Bright note

Dosya yüklemesi yok, tamamıyla JavaScript ile üretilmiş.

## 🔧 Geliştirici Notları

**Oyun Ekleme Prosedürü:**
1. `app/games/[gameName].tsx` oluştur
2. Difficulty seviyeleri ekle (easy/medium/hard)
3. `progress.addAchievement()` çağrısı yap oyun bitişinde
4. `index.tsx` aktivite grid'ine ekle
5. Ses geri bildirimi `soundUtils` ile ekle

**Tema Özelleştirmesi:**
```typescript
const textPrimary = theme === 'dark' ? '#f5f7ff' : '#111323';
const cardColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff';
const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';
```

## 📊 İstatistikler Takibi

`progress.tsx` sayfası otomatik gösterir:
- Haftalık özet (dakika, kelime, seans, yıldız)
- Günlük bar grafikleri (7 gün)
- Son başarılar listesi
- Boş durum mesajları

## 🌍 Dünyalar Sistemi

6 açılabilir dünya vardır, her biri yıldız gereksinimiyle kilitlidir:
- Meyveler Dünyası (0⭐)
- Hayvanlar Dünyası (5⭐)
- Doğa Dünyası (15⭐)
- Araçlar Dünyası (30⭐)
- Gök Dünyası (50⭐)
- Oyuncaklar Dünyası (75⭐)

Kilit açma otomatik, kullanıcı yıldız kazandıkça.

## 📝 Lisans & Katkı

Şu an geliştirme aşamasındadır. Türkçe çocuk eğitimi amaçlı.

---

Detaylı notlar ve geçiş bilgisi için `MIGRATION.md` dosyasına bakın.
