# Konuşma Terapisi - Web Uygulaması

Çocuklar için tasarlanmış eğlenceli konuşma terapisi web uygulaması.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Supabase Ayarları

`.env` dosyasını düzenle ve Supabase bilgilerini ekle:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Supabase'de Auth tablosunu aktif etmeyi unutma!**

### 3. Uygulamayı Başlat
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacak.

## 📁 Proje Yapısı

```
konusma-terapisi-web/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Korumalı route bileşeni
│   ├── context/
│   │   └── AuthContext.jsx       # Auth durumu yönetimi
│   ├── lib/
│   │   └── supabaseClient.js     # Supabase bağlantısı
│   ├── pages/
│   │   ├── HomePage.jsx          # Ana sayfa
│   │   ├── LoginPage.jsx         # Giriş sayfası
│   │   ├── RegisterPage.jsx      # Kayıt sayfası
│   │   ├── PracticePage.jsx      # Konuşma pratiği
│   │   ├── MiniGamesPage.jsx     # Mini oyunlar
│   │   ├── PuzzlePage.jsx        # Bulmacalar
│   │   └── DashboardPage.jsx     # Kullanıcı paneli
│   ├── App.jsx                   # Ana uygulama ve routing
│   ├── main.jsx                  # Giriş noktası
│   └── index.css                 # Global stiller
├── .env                          # Environment variables
├── package.json
├── vite.config.js
└── index.html
```

## ✨ Özellikler

### 🏠 Ana Sayfa
- Tüm bölümlere yönlendiren butonlar
- Çocuk dostu renkli tasarım

### 🔐 Authentication
- Email/Password ile kayıt
- Email/Password ile giriş
- Korumalı route'lar
- Otomatik session yönetimi

### 🗣️ Konuşma Pratiği
- Harf seçimi (R, S, K, T, L)
- Her harf için örnek kelimeler
- Pratik başlatma butonu
- Mikrofon butonu (UI)

### 🎮 Mini Oyunlar
- "Eksik harfi bul" oyunu
- Doğru/yanlış geri bildirimi
- Tekrar deneme özelliği

### 🧩 Bulmacalar
- Aynı harfle başlayan kelimeleri eşleştirme
- Renkli görsel geri bildirim
- Tamamlama mesajı

### 👤 Dashboard (Kullanıcı Paneli)
- Hoş geldin mesajı
- Günlük öneri
- Hızlı erişim butonları
- Çıkış yapma

## 🎨 Tasarım

- **Renkli gradyanlar** - Her sayfa farklı renk teması
- **Yuvarlatılmış köşeler** - Çocuk dostu görünüm
- **Büyük butonlar** - Kolay tıklama
- **Emoji kullanımı** - Eğlenceli ve anlaşılır
- **Responsive** - Mobil ve masaüstü uyumlu

## 🛠️ Teknolojiler

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Routing
- **Supabase** - Backend + Authentication
- **CSS3** - Stil ve animasyonlar

## 📝 Kullanım

1. Ana sayfadan istediğin bölümü seç
2. Kayıt ol veya giriş yap
3. Dashboard'dan aktivitelere eriş
4. Konuşma pratiği yap, oyun oyna veya bulmaca çöz!

## 🔒 Güvenlik

- Protected routes ile korumalı sayfalar
- Supabase Row Level Security (RLS) kullan
- Environment variables ile gizli bilgileri sakla

## 📦 Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşacak.

## 📄 Lisans

MIT
