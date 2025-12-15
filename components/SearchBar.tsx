import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Palette = {
  panelBg: string;
  panelBorder: string;
  textPrimary: string;
  textMuted: string;
  cardBorder: string;
  floatingBg: string;
  floatingBorder: string;
  accentContrast: string;
};

interface SearchBarProps {
  palette: Palette;
  onFocus: () => void;
  onBlur: () => void;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  palette,
  onFocus,
  onBlur,
  value,
  onChangeText,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.panelBg,
          borderColor: isFocused ? palette.cardBorder : palette.panelBorder,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={palette.textMuted}
        style={styles.leftIcon}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: palette.textPrimary,
          },
        ]}
        placeholder="Oyun, egzersiz, hikâye ara…"
        placeholderTextColor={palette.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        selectionColor={palette.cardBorder}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={({ pressed }) => [
            styles.clearBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={palette.textMuted}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  leftIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
});
