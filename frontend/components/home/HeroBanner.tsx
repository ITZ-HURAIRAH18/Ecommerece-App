import { View, FlatList, Text, Dimensions, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useRef, useEffect, useState } from 'react'
import { colors } from '../../constants/colors'
import { borderRadius } from '../../constants/spacing'

const { width } = Dimensions.get('window')
const BANNER_WIDTH = width - 32

interface Banner {
  _id: string
  image: string
  title?: string
}

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (banners.length <= 1) return

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length
        flatListRef.current?.scrollToIndex({ index: next, animated: true })
        return next
      })
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [banners.length])

  if (!banners.length) return null

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH)
          setActiveIndex(index)
        }}
        renderItem={({ item }) => (
          <View style={styles.banner}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            {item.title && (
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            )}
          </View>
        )}
      />
      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === activeIndex ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  banner: {
    width: BANNER_WIDTH,
    height: 180,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondaryBg,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
})
