import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { formatPrice } from '../../utils/formatPrice'
import { useWishlistStore } from '../../stores/wishlistStore'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    price: number
    discountPrice?: number
    images: string[]
    ratingsAverage: number
    stock: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product._id)
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${product._id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggle(product._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.wishlistIcon}>{wishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {product.stock <= 3 && product.stock > 0 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Only {product.stock} left</Text>
          </View>
        )}
        {product.stock === 0 && (
          <View style={[styles.stockBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.stockText}>Out of stock</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>{'⭐'.repeat(Math.round(product.ratingsAverage))}</Text>
          <Text style={styles.rating}>{product.ratingsAverage.toFixed(1)}</Text>
        </View>
        <View style={styles.priceRow}>
          {hasDiscount ? (
            <>
              <Text style={styles.discountPrice}>{formatPrice(product.discountPrice!)}</Text>
              <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
            </>
          ) : (
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.secondaryBg,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  wishlistIcon: {
    fontSize: 16,
  },
  stockBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  stockText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 10,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stars: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  discountPrice: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
  originalPrice: {
    ...typography.caption,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
})
