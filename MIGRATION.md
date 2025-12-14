## Evrensel (Expo + Web) Yapı Geçişi

- Yeni proje Expo (TypeScript) + `expo-router` kullanıyor. Tek codebase ile web / iOS / Android.
- Eski Vite projesi `legacy-web/` klasörüne taşındı; içindeki `package.json` ile çalışmaya devam edebilir.

### Çalıştırma
- Web (3000 portu): `npm run dev`
  - `npx expo start --web` + `scripts/proxy-web-3000.mjs` aynı anda çalışır, tarayıcı otomatik `http://localhost:3000` açılır.
- Native: `npm run dev:native` (Expo Go / simulator), gerekirse `npm run android` veya `npm run ios`.

### Klasör Yapısı (özet)
- `app/` – Expo Router rotaları (`index`, `login`, `register`, `levels`, `practice`, `result`).
- `components/` – RN uyumlu UI bileşenleri (WordCard, RecordButton, WordProgressList).
- `context/PracticeContext.tsx` – seviye/kelime progres durumu.
- `logic/` – değerlendirme ve seviye tanımları.
- `scripts/proxy-web-3000.mjs` – 3000 portu için web proxy, 19006..19010 arası Expo web portunu otomatik bulur.
- `legacy-web/` – Vite tabanlı eski uygulama (korundu).

### Bilinen Notlar
- Ses kaydı/native voice API’leri universal modda simüle ediliyor; Practice ekranı metin girişi veya otomatik başarı ile ilerliyor. Gerçek native kayıt için `@react-native-voice/voice` veya Expo AV ile ayrı native konfigürasyon eklenmeli.
- Tip denetimi için `tsconfig` `allowJs` açık; `logic` klasörü JS dosyalarıyla aynen kullanılıyor.
- Eski Supabase/AUTH context’leri legacy içinde kaldı; yeni Expo rotaları Practice akışına odaklı.
