import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Colors, Typography } from '../constants/tokens';

export default function SplashScreen() {
  const router = useRouter();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtextOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);

  useEffect(() => {
    // Title fade & slide up over 600ms
    titleOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    titleY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
    
    // Subtext fade in delayed by 200ms
    subtextOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    
    // Line draws left to right over 800ms
    lineWidth.value = withTiming(40, { duration: 800, easing: Easing.inOut(Easing.ease) });

    // Navigate to auth/login after 2.5s
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtextOpacity.value,
  }));

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <Text style={styles.title}>LUXE</Text>
      </Animated.View>
      
      <Animated.View style={subtextAnimatedStyle}>
        <Text style={styles.subtext}>Shop without compromise</Text>
      </Animated.View>
      
      <Animated.View style={[styles.line, lineAnimatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 40,
    color: Colors.black,
  },
  subtext: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 16,
    color: Colors.gray500,
    marginBottom: 16,
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray300,
  },
});
