import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type SearchCategory = 'games' | 'exercises' | 'stories' | 'info';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  route: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

export const searchData: SearchResult[] = [
  // Games
  {
    id: 'memory-game',
    title: 'Bellek Oyunu',
    description: 'Resim eşleştirme',
    category: 'games',
    route: '/games/memory',
    icon: 'grid-outline',
  },
  {
    id: 'rhyme-game',
    title: 'Uyak Oyunu',
    description: 'Uyaklı kelimeleri bul',
    category: 'games',
    route: '/games/rhyme',
    icon: 'musical-notes-outline',
  },
  {
    id: 'counting-game',
    title: 'Sayma Oyunu',
    description: 'Nesneleri say ve telaffuz et',
    category: 'games',
    route: '/games/counting',
    icon: 'calculator-outline',
  },
  {
    id: 'colors-game',
    title: 'Renkler Oyunu',
    description: 'Duygu ve renkleri eşleştir',
    category: 'games',
    route: '/games/colors',
    icon: 'flower-outline',
  },
  {
    id: 'word-fill-game',
    title: 'Kelime Doldur',
    description: 'Eksik harfleri tamamla',
    category: 'games',
    route: '/games/word-fill',
    icon: 'text-outline',
  },

  // Exercises
  {
    id: 'speech-practice',
    title: 'Konuşma Pratiği',
    description: 'Kelime ve cümle uygulamaları',
    category: 'exercises',
    route: '/levels',
    icon: 'mic-outline',
  },
  {
    id: 'pronunciation',
    title: 'Telaffuz Egzersizi',
    description: 'Doğru telaffuzu öğren',
    category: 'exercises',
    route: '/levels',
    icon: 'volume-high-outline',
  },
  {
    id: 'listening-practice',
    title: 'Dinleme Pratiği',
    description: 'Sesleri tanı ve uygulamaları',
    category: 'exercises',
    route: '/levels',
    icon: 'megaphone-outline',
  },

  // Stories
  {
    id: 'story-library',
    title: 'Hikâye Kitaplığı',
    description: 'Sesli hikayeler ve metinler',
    category: 'stories',
    route: '/progress',
    icon: 'book-outline',
  },
  {
    id: 'read-aloud',
    title: 'Sesli Okuma',
    description: 'Metinleri yüksek sesle oku',
    category: 'stories',
    route: '/progress',
    icon: 'reader-outline',
  },

  // Info
  {
    id: 'scientific-basis',
    title: 'Bilimsel Temel',
    description: 'Metodoloji ve araştırma',
    category: 'info',
    route: '/about',
    icon: 'flask-outline',
  },
  {
    id: 'progress-measurement',
    title: 'İlerleme Ölçümü',
    description: 'Nasıl ölçülür, göstergeler',
    category: 'info',
    route: '/about',
    icon: 'stats-chart-outline',
  },
  {
    id: 'case-studies',
    title: 'Örnek Vakaları',
    description: 'Terapi senaryoları',
    category: 'info',
    route: '/about',
    icon: 'person-circle-outline',
  },
  {
    id: 'ethics',
    title: 'Etik & Sorumluluk',
    description: 'Uygulama hakkında bilgiler',
    category: 'info',
    route: '/about',
    icon: 'shield-checkmark-outline',
  },
];

export function filterSearchResults(query: string): {
  games: SearchResult[];
  exercises: SearchResult[];
  stories: SearchResult[];
  info: SearchResult[];
} {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return { games: [], exercises: [], stories: [], info: [] };
  }

  const filtered = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );

  return {
    games: filtered.filter((item) => item.category === 'games'),
    exercises: filtered.filter((item) => item.category === 'exercises'),
    stories: filtered.filter((item) => item.category === 'stories'),
    info: filtered.filter((item) => item.category === 'info'),
  };
}
