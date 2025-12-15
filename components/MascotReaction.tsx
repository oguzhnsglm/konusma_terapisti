import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MascotReactionProps = {
  type?: 'celebrate' | 'happy' | 'idle' | 'sparkle';
  visible?: boolean;
};

export default function MascotReaction({ 
  type = 'idle',
  visible = true 
}: MascotReactionProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    if (type === 'celebrate') {
      // Quick happy bounces
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]).start();

      // Scale with rotate effect
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (type === 'happy') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -12,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (type === 'sparkle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [type, visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: bounceAnim },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      {type === 'sparkle' && (
        <View style={styles.sparkleContainer}>
          <Ionicons name="sparkles" size={24} color="#fbbf24" />
        </View>
      )}
      {type === 'celebrate' && (
        <View style={styles.celebrateContainer}>
          <Ionicons name="happy" size={28} color="#ec4899" />
        </View>
      )}
      {(type === 'happy' || type === 'idle') && (
        <View style={styles.happyContainer}>
          <Ionicons name="happy-outline" size={24} color="#10b981" />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleContainer: {
    alignItems: 'center',
  },
  celebrateContainer: {
    alignItems: 'center',
  },
  happyContainer: {
    alignItems: 'center',
  },
});
