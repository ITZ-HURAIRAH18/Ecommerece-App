import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { formatPrice } from '../../utils/formatPrice'

interface ProductCarouselProps {
  title: string
  products: Array<{
    _id: string
    name: string
    price: number
    discountPrice?: number
    images: string[]
  }>
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item._id}`)}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>
              {item.discountPrice
                ? formatPrice(item.discountPrice)
                : formatPrice(item.price)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  card: {
    width: 140,
    marginRight: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  image: {
    width: 140,
    height: 140,
    backgroundColor: colors.secondaryBg,
  },
  name: {
    ...typography.caption,
    color: colors.textPrimary,
    padding: spacing.xs,
    paddingBottom: 0,
  },
  price: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    padding: spacing.xs,
    paddingTop: 2,
  },
})
