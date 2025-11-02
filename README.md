# Konuşma Terapisi Uygulaması

Bu Expo + React Native projesi, çocukların telaffuz pratiği yapmasına yardımcı olmak için hazırlanmış eğlenceli bir mobil uygulamadır. Uygulama yalnızca destekleyici bir araçtır; herhangi bir teşhis koymaz veya profesyonel terapi hizmetinin yerini almaz.

## Çalıştırma

Projeyi yerel ortamınızda başlatmak için:

```bash
npm install
npx expo start

### Konuşmayı Metne Çevirme (STT)
- Native (Android/iOS) için konuşmayı metne çevirme `@react-native-voice/voice` ile yapılır ve Expo Go yerine Development Build gerektirir:
  1) Android izinleri eklendi (RECORD_AUDIO). Development build oluşturun:
     - `npx expo prebuild -p android`
     - `npx expo run:android`
  2) Metro’yu dev client ile başlatın: `npx expo start --dev-client`
- Web için tarayıcıların Web Speech API’si kullanılır. `npx expo start --web` ile çalışır; tarayıcı mikrofon iznini onaylayın.
```

Expo Metro sunucusu açıldıktan sonra, mobil cihazınızdaki Expo Go uygulamasıyla QR kodu okutarak veya emülatör/simülatör üzerinden uygulamayı deneyebilirsiniz.
