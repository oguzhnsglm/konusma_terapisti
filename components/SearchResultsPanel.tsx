import React from 'react';
import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchResult } from '../data/searchData';

type Palette = {
  panelBg: string;
  panelBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  cardBorder: string;
  floatingBg: string;
  floatingBorder: string;
  accentContrast: string;
};

interface SearchResultsPanelProps {
  palette: Palette;
  results: {
    games: SearchResult[];
    exercises: SearchResult[];
    stories: SearchResult[];
    info: SearchResult[];
  };
  isVisible: boolean;
  query: string;
}

interface CategorySection {
  category: string;
  icon: string;
  data: SearchResult[];
}

export default function SearchResultsPanel({
  palette,
  results,
  isVisible,
  query,
}: SearchResultsPanelProps) {
  const router = useRouter();

  if (!isVisible) {
    return null;
  }

  const hasResults = Object.values(results).some((arr) => arr.length > 0);

  const sections: CategorySection[] = [
    { category: 'Oyunlar', icon: 'game-controller-outline', data: results.games },
    { category: 'Egzersizler', icon: 'barbell-outline', data: results.exercises },
    { category: 'Hikâyeler', icon: 'book-outline', data: results.stories },
    { category: 'Bilgi', icon: 'information-circle-outline', data: results.info },
  ];

  const flatData = sections.flatMap((section) => [
    { type: 'header', category: section.category, icon: section.icon },
    ...section.data.map((item) => ({ type: 'item', ...item })),
  ]);

  const handleResultPress = (result: SearchResult) => {
    router.push(result.route as any);
  };

  const renderItem: ListRenderItem<any> = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View
          style={[
            styles.categoryHeader,
            { borderTopColor: palette.cardBorder },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={14}
            color={palette.textMuted}
            style={styles.categoryIcon}
          />
          <Text
            style={[
              styles.categoryTitle,
              { color: palette.textMuted },
            ]}
          >
            {item.category}
          </Text>
        </View>
      );
    }

    const result: SearchResult = item;

    return (
      <Pressable
        onPress={() => handleResultPress(result)}
        style={({ pressed }) => [
          styles.resultItem,
          {
            backgroundColor: pressed ? palette.cardBorder : 'transparent',
          },
        ]}
      >
        <View
          style={[
            styles.resultIcon,
            { backgroundColor: palette.cardBorder },
          ]}
        >
          <Ionicons
            name={result.icon}
            size={16}
            color={palette.textSecondary}
          />
        </View>

        <View style={styles.resultContent}>
          <Text
            style={[styles.resultTitle, { color: palette.textPrimary }]}
            numberOfLines={1}
          >
            {result.title}
          </Text>
          <Text
            style={[styles.resultDesc, { color: palette.textMuted }]}
            numberOfLines={1}
          >
            {result.description}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward-outline"
          size={14}
          color={palette.textMuted}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.panelContainer,
        {
          backgroundColor: palette.floatingBg,
          borderColor: palette.floatingBorder,
        },
      ]}
    >
      {hasResults ? (
        <FlatList
          data={flatData}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${item.type}-${idx}`}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={40}
            color={palette.textMuted}
            style={styles.emptyIcon}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: palette.textSecondary },
            ]}
          >
            Sonuç bulunamadı
          </Text>
          <Text
            style={[
              styles.emptyHint,
              { color: palette.textMuted },
            ]}
          >
            Örn: "bellek", "ses" veya "kırmızı"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 400,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  categoryIcon: {
    marginTop: 1,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultContent: {
    flex: 1,
    gap: 2,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultDesc: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    textAlign: 'center',
  },
});
