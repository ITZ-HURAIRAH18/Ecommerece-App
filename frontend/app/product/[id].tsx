import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Chip } from '../../components/ui/Chip'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatPrice } from '../../utils/formatPrice'
import { useProduct } from '../../hooks/useProducts'
import { useCartStore } from '../../stores/cartStore'
import { useWishlistStore } from '../../stores/wishlistStore'
import { SkeletonLoader } from '../../components/common/SkeletonLoader'
import { ErrorState } from '../../components/common/ErrorState'

const { width } = Dimensions.get('window')

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { data, isLoading, error, refetch } = useProduct(id!)
  const { addItem } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <SkeletonLoader height={300} />
        <View style={{ padding: spacing.md }}>
          <SkeletonLoader height={24} width="80%" style={{ marginBottom: 8 }} />
          <SkeletonLoader height={20} width="40%" style={{ marginBottom: 16 }} />
          <SkeletonLoader height={100} />
        </View>
      </View>
    )
  }

  if (error || !data?.data?.data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message="Failed to load product" onRetry={refetch} />
      </View>
    )
  }

  const product = data.data.data
  const wishlisted = isWishlisted(product._id)
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  const handleAddToCart = async () => {
    await addItem(product._id, qty, selectedVariants)
  }

  const handleBuyNow = async () => {
    await addItem(product._id, qty, selectedVariants)
    router.push('/checkout')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImage] }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() => toggle(product._id)}
          >
            <Text style={styles.wishlistIcon}>{wishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          {product.images.length > 1 && (
            <View style={styles.dots}>
              {product.images.map((_: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImage(i)}
                  style={[
                    styles.dot,
                    { backgroundColor: i === selectedImage ? colors.primary : colors.border },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>
              {'⭐'.repeat(Math.round(product.ratingsAverage))}
            </Text>
            <Text style={styles.ratingValue}>
              {product.ratingsAverage.toFixed(1)} ({product.ratingsCount} reviews)
            </Text>
          </View>

          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <Text style={styles.discountPrice}>{formatPrice(product.discountPrice!)}</Text>
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
                <Badge
                  label={`${Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF`}
                  variant="error"
                />
              </>
            ) : (
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            )}
          </View>

          {product.stock > 0 && product.stock <= 5 && (
            <Text style={styles.stockWarning}>Only {product.stock} left in stock</Text>
          )}
          {product.stock === 0 && (
            <Text style={styles.outOfStock}>Out of stock</Text>
          )}

          {product.variants?.map((v: { name: string; options: string[] }) => (
            <View key={v.name} style={styles.variantSection}>
              <Text style={styles.variantLabel}>{v.name}: {selectedVariants[v.name] || 'Select'}</Text>
              <View style={styles.variantOptions}>
                {v.options.map((opt: string) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={selectedVariants[v.name] === opt}
                    onPress={() =>
                      setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))
                    }
                  />
                ))}
              </View>
            </View>
          ))}

          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQty(Math.min(product.stock || 99, qty + 1))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description || product.shortDescription}
            </Text>
          </View>

          {product.specifications?.length > 0 && (
            <View style={styles.specSection}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {product.specifications.map((spec: { key: string; value: string }, i: number) => (
                <View key={i} style={styles.specRow}>
                  <Text style={styles.specKey}>{spec.key}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          variant="outline"
          style={styles.addToCartBtn}
        />
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
          style={styles.buyNowBtn}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width,
    height: width,
    backgroundColor: colors.secondaryBg,
  },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  backText: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  wishlistIcon: {
    fontSize: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  details: {
    padding: spacing.md,
  },
  name: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stars: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  ratingValue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.display,
    color: colors.textPrimary,
  },
  discountPrice: {
    ...typography.display,
    color: colors.error,
  },
  originalPrice: {
    ...typography.body,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  stockWarning: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  outOfStock: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  variantSection: {
    marginBottom: spacing.md,
  },
  variantLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  variantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  qtyLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: spacing.md,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
  },
  stepperText: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  qtyValue: {
    ...typography.body,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
  },
  descriptionSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  specSection: {
    marginBottom: spacing.lg,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specKey: {
    ...typography.body,
    color: colors.textSecondary,
    width: 120,
  },
  specValue: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  addToCartBtn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  buyNowBtn: {
    flex: 1,
  },
})
