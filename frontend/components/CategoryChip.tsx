import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Radius, Typography } from '../constants/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, active = false, onPress }: CategoryChipProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      style={[
        styles.container,
        active ? styles.activeContainer : styles.inactiveContainer,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeContainer: {
    backgroundColor: Colors.primary,
  },
  inactiveContainer: {
    backgroundColor: Colors.gray100,
  },
  label: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
  },
  activeLabel: {
    color: Colors.white,
  },
  inactiveLabel: {
    color: Colors.gray700,
  },
});
