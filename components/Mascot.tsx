import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, LinearGradient, Stop, Path, Circle, Defs, Line } from 'react-native-svg';
import { useMascot } from '../context/MascotContext';

export default function Mascot() {
  const { isVisible, message, isCelebrating } = useMascot();
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCelebrating) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.08, duration: 220, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true }),
        ]),
        { iterations: 3 },
      );
      const glowAnim = Animated.timing(glow, { toValue: 1, duration: 200, useNativeDriver: false });
      pulse.start();
      glowAnim.start(() => glow.setValue(0));
    }
  }, [isCelebrating, scale, glow]);

  return (
    <View style={styles.container} pointerEvents="none">
      {isVisible && (
        <View style={styles.bubble}>
          <Text style={styles.message}>{message || 'Harika gidiyorsun!'}</Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.avatar,
          { transform: [{ scale }], shadowOpacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.35] }) },
        ]}
      >
        <MascotShape />
      </Animated.View>
    </View>
  );
}

function MascotShape() {
  return (
    <Svg width={120} height={120} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="blobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
          <Stop offset="50%" stopColor="#A78BFA" stopOpacity={1} />
          <Stop offset="100%" stopColor="#F472B6" stopOpacity={1} />
        </LinearGradient>
        <LinearGradient id="cheekGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FCA5A5" stopOpacity={0.8} />
          <Stop offset="100%" stopColor="#FBBF24" stopOpacity={0.6} />
        </LinearGradient>
      </Defs>

      <Ellipse cx="50" cy="55" rx="35" ry="38" fill="url(#blobGradient)" />
      <Ellipse cx="32" cy="58" rx="9" ry="7" fill="url(#cheekGradient)" opacity={0.8} />
      <Ellipse cx="68" cy="58" rx="9" ry="7" fill="url(#cheekGradient)" opacity={0.8} />

      <Ellipse cx="40" cy="48" rx="6" ry="7" fill="#1F2937" />
      <Ellipse cx="60" cy="48" rx="6" ry="7" fill="#1F2937" />
      <Circle cx="42" cy="46" r="2.5" fill="#fff" opacity={0.95} />
      <Circle cx="62" cy="46" r="2.5" fill="#fff" opacity={0.95} />
      <Circle cx="38" cy="49" r="1.5" fill="#fff" opacity={0.6} />
      <Circle cx="58" cy="49" r="1.5" fill="#fff" opacity={0.6} />

      <Path d="M 35 63 Q 50 73 65 63" fill="none" stroke="#1F2937" strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M 38 64 Q 50 71 62 64" fill="none" stroke="#FCA5A5" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />

      <Circle cx="50" cy="18" r="5" fill="#F472B6" opacity={0.9} />
      <Circle cx="50" cy="18" r="3" fill="#FBBF24" opacity={0.7} />
      <Line x1="50" y1="23" x2="50" y2="18" stroke="#A78BFA" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx="45" cy="15" r="1.5" fill="#FBBF24" opacity={0.8} />
      <Circle cx="55" cy="15" r="1.5" fill="#60A5FA" opacity={0.8} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
    gap: 10,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#6a5acd',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    maxWidth: 220,
  },
  message: {
    color: '#2f1b4e',
    fontWeight: '700',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#f1eafe',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7f6bff',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
