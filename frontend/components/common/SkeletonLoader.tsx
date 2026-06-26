import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import { Colors, Radius } from '../../constants/tokens'

interface SkeletonLoaderProps {
  width?: number | string
  height?: number
  borderRadius?: number
}

export function SkeletonLoader({ width = '100%', height = 20, borderRadius = Radius.sm }: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[styles.skeleton, { width: width as any, height, borderRadius }, animatedStyle]}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <SkeletonLoader height={180} borderRadius={Radius.md} />
      <View style={{ padding: 10 }}>
        <SkeletonLoader height={14} width="80%" />
        <View style={{ height: 8 }} />
        <SkeletonLoader height={14} width="40%" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.gray100,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
})
