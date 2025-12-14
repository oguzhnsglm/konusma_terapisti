# Aktivite Kartları Routing Düzeltmesi

## Sorun
Tüm Aktiviteler bölümündeki bazı kartlara tıklayınca yanlış sayfalar açılıyordu.

## Çözüm

### 1. ActivityCard Tipi Güncellemesi
```typescript
type ActivityCard = {
  id: string;           // ← YENİ: Benzersiz aktivite ID'si
  title: string;
  subtitle: string;
  icon: IconName;
  route: Href;
  accent: string;
};
```

### 2. Merkezi Route Haritası (ACTIVITY_ROUTES)
```typescript
const ACTIVITY_ROUTES = {
  'memory-puzzles': '/games/memory',
  'world-map': '/levels',
  'progress': '/progress',
  'word-fill-game': '/games/word-fill',
  'rhyme-game': '/games/rhyme',
  'emotion-matching': '/games/colors',
  'profile-avatar': '/settings',
  'voice-encouragement': '/result',
} as const;
```

### 3. Aktivite Listesi (activities)
Her aktiviteye **benzersiz ID** eklendi:
```typescript
const activities = [
  {
    id: 'memory-puzzles',          // ← Benzersiz ID
    title: 'Bulmacalar',
    route: '/games/memory',        // ← Doğru route
    ...
  },
  {
    id: 'word-fill-game',          // ← Benzersiz ID
    title: 'Harf Canavarı',
    route: '/games/word-fill',     // ← Doğru route
    ...
  },
  {
    id: 'emotion-matching',        // ← Benzersiz ID
    title: 'Duygu Eşleştirme',
    route: '/games/colors',        // ← Doğru route
    ...
  },
  // ... diğer aktiviteler
];
```

### 4. Navigation Handler Iyileştirilmesi
```typescript
const handleNav = (route?: Href, activityId?: string) => {
  if (!route) {
    console.error('[Navigation Error] Route tanımlanmamış!', { activityId });
    return;
  }
  
  // Route validation: ACTIVITY_ROUTES haritasında tanımlıysa kontrol et
  if (activityId && (ACTIVITY_ROUTES as Record<string, string>)[activityId]) {
    const expectedRoute = (ACTIVITY_ROUTES as Record<string, string>)[activityId];
    if (expectedRoute !== route) {
      console.warn(`[Navigation Warning] ID mismatch: ${activityId}`, {
        expected: expectedRoute,
        provided: route,
      });
    }
  }
  
  console.log(`[Navigation] ${activityId || 'Navigation'} -> ${route}`);
  playSfx('click');
  router.push(route);
};
```

### 5. Aktivite Grid Harita Güncellenmesi
```typescript
{activities.map((activity) => (
  <ActivityCardView
    key={activity.id}                           // ← ID'yi key olarak kullan
    palette={palette}
    activity={activity}
    onPress={() => handleNav(activity.route, activity.id)}  // ← Debug logging
  />
))}
```

## Doğrulama ✓

### Routes ve Dosyalar Eşleşmesi:
- ✓ `/games/memory` → `app/games/memory.tsx`
- ✓ `/games/word-fill` → `app/games/word-fill.tsx`
- ✓ `/games/colors` → `app/games/colors.tsx`
- ✓ `/games/rhyme` → `app/games/rhyme.tsx`
- ✓ `/levels` → `app/levels/index.tsx`
- ✓ `/progress` → `app/progress.tsx`
- ✓ `/settings` → `app/settings.tsx`
- ✓ `/result` → `app/result.tsx`

### Benzersiz ID'ler:
- `memory-puzzles` → Bulmacalar
- `world-map` → Dünyalar Haritası
- `progress` → İlerleme
- `word-fill-game` → Harf Canavarı
- `rhyme-game` → Ses Çarkı
- `emotion-matching` → Duygu Eşleştirme
- `profile-avatar` → Profil & Avatar
- `voice-encouragement` → Sesli Güçlendirme

## Debug Logları

Browser console'da göreceğiniz loglar:

```
[Navigation] memory-puzzles -> /games/memory
[Navigation] emotion-matching -> /games/colors
[Navigation] word-fill-game -> /games/word-fill
```

Yanlış yönlendirme varsa şunu göreceksiniz:
```
[Navigation Error] Route tanımlanmamış!
[Navigation Warning] ID mismatch: some-id
```

## Değiştirilen Dosyalar
- `app/index.tsx` - ActivityCard tipi, ACTIVITY_ROUTES, activities array, handleNav, aktivite grid haritası

## Notlar
- Her kartın unique ID'si var
- Routes merkezi harita ile tanımlı
- Navigation validation ve debug logging ile yapılı
- UI görünümü hiç değişmedi
