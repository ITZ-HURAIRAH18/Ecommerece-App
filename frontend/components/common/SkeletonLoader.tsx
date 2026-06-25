import { View, Animated, StyleSheet, ViewStyle } from 'react-native'
import { useEffect, useRef } from 'react'
import { colors } from '../../constants/colors'
import { borderRadius } from '../../constants/spacing'

interface SkeletonLoaderProps {
  width?: number | string
  height?: number
  borderRadiusVal?: number
  style?: ViewStyle
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadiusVal = borderRadius.card,
  style,
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3))

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius: borderRadiusVal, opacity: opacity.current },
        style,
      ]}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonLoader height={180} />
      <View style={styles.padding}>
        <SkeletonLoader height={16} width="80%" style={{ marginBottom: 8 }} />
        <SkeletonLoader height={14} width="60%" style={{ marginBottom: 8 }} />
        <SkeletonLoader height={18} width="40%" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    marginBottom: 8,
  },
  padding: {
    padding: 12,
  },
})
