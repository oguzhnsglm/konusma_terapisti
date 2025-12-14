# Konusma Terapisti (Expo + Web)

Tek codebase ile web, iOS ve Android için konuşma terapisi deneyimi. `expo-router` tabanlı, RN bileşenleriyle mobil uyumlu arayüz sunar. Web tarafı 3000 portundan reverse-proxy ile erişilir.

## Çalıştırma
- Bağımlılıklar: `npm install`
- Web (3000): `npm run dev` → Expo web + proxy, tarayıcı otomatik açılır.
- Native: `npm run dev:native` (Expo Go/simulator), gerekirse `npm run android` veya `npm run ios`.

## Yapı
- `app/` – sayfalar/rotalar (`index`, `login`, `register`, `levels`, `practice`, `result`).
- `components/` – RN uyumlu ortak bileşenler.
- `context/PracticeContext.tsx` – seviye & kelime ilerleme durumu.
- `logic/` – kelime listeleri ve telaffuz değerlendirme yardımcıları.
- `scripts/proxy-web-3000.mjs` – Expo web için 3000 portu proxy’si.
- `legacy-web/` – eski Vite uygulaması (korundu).

Detaylar ve geçiş notları için `MIGRATION.md` dosyasına bakın.
