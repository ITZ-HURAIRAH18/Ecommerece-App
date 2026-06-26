import React from 'react';
import { StyleSheet, ActivityIndicator, PressableProps, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, Radius, Shadow, Typography } from '../constants/tokens';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  style,
  textStyle,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: [styles.primaryContainer, Shadow.button],
          text: styles.primaryText,
          loaderColor: Colors.white,
        };
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          loaderColor: Colors.primary,
        };
      case 'ghost':
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
          loaderColor: Colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'lg': return styles.sizeLg;
      case 'md': return styles.sizeMd;
      case 'sm': return styles.sizeSm;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View style={[
      fullWidth && styles.fullWidth,
      animatedStyle,
      disabled && styles.disabled
    ]}>
      <AnimatedPressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.baseContainer,
          variantStyles.container,
          sizeStyles,
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.loaderColor} />
        ) : (
          <Animated.Text style={[Typography.bodyMedium as any, variantStyles.text, textStyle, size === 'lg' ? { fontSize: 16 } : size === 'sm' ? { fontSize: 13 } : { fontSize: 15 }]}>
            {children}
          </Animated.Text>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  // Sizes
  sizeLg: {
    height: 54,
    borderRadius: Radius.md,
    paddingHorizontal: 24,
  },
  sizeMd: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  sizeSm: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  // Primary
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.white,
    fontFamily: 'GeneralSans-Medium',
  },
  // Secondary
  secondaryContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryText: {
    color: Colors.primary,
    fontFamily: 'GeneralSans-Medium',
  },
  // Ghost
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
    fontFamily: 'GeneralSans-Medium',
  },
});
