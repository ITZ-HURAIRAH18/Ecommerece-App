import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Platform, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens';
import { Button } from '../../components/Button';
import { CategoryChip } from '../../components/CategoryChip';
import { useProduct } from '../../hooks/useProducts';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ErrorState } from '../../components/common/ErrorState';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useProduct(id!);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <SkeletonLoader height={width} />
        <View style={{ padding: Spacing.screenH, gap: 16 }}>
          <SkeletonLoader height={32} width="80%" />
          <SkeletonLoader height={24} width="40%" />
          <SkeletonLoader height={100} />
        </View>
      </View>
    );
  }

  if (error || !data?.data?.data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message="Failed to load product" onRetry={refetch} />
      </View>
    );
  }

  const product = data.data.data;
  const wishlisted = isWishlisted(product._id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = async () => {
    await addItem(product._id, qty, selectedVariants);
  };

  const handleBuyNow = async () => {
    await addItem(product._id, qty, selectedVariants);
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // Space for dock
        bounces={false}
      >
        {/* IMAGE CAROUSEL */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== selectedImage) setSelectedImage(slide);
            }}
            scrollEventThrottle={16}
            style={{ width, height: width }}
          >
            {product.images.map((img: any, index: number) => (
              <Image
                key={index}
                source={img.url || img}
                style={{ width, height: width }}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          {/* FLOATING HEADER ON IMAGE */}
          <View style={[styles.floatingHeader, { top: Math.max(insets.top, 16) }]}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color={Colors.black} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => toggle(product._id)}>
              <Feather 
                name="heart" 
                size={22} 
                color={wishlisted ? Colors.primary : Colors.black} 
                style={wishlisted ? { fill: Colors.primary } as any : {}}
              />
            </Pressable>
          </View>

          {/* DOTS PAGINATION */}
          {product.images.length > 1 && (
            <View style={styles.dotsContainer}>
              {product.images.map((_: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === selectedImage ? styles.dotActive : styles.dotInactive
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* DETAILS SECTION */}
        <View style={styles.details}>
          <Text style={styles.title}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <Text style={styles.price}>${product.discountPrice.toFixed(2)}</Text>
                <Text style={styles.oldPrice}>${product.price.toFixed(2)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Feather name="star" size={16} color={Colors.primary} style={{ fill: Colors.primary } as any} />
            <Text style={styles.ratingText}>
              {product.ratingsAverage?.toFixed(1) || '4.5'} ({product.ratingsCount || 0} reviews)
            </Text>
          </View>

          {/* VARIANTS */}
          {product.variants?.map((v: { name: string; options: string[] }) => (
            <View key={v.name} style={styles.variantSection}>
              <Text style={styles.sectionTitle}>{v.name}</Text>
              <View style={styles.variantOptions}>
                {v.options.map((opt: string) => (
                  <CategoryChip
                    key={opt}
                    label={opt}
                    active={selectedVariants[v.name] === opt}
                    onPress={() => setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* QUANTITY */}
          <View style={styles.qtySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.stepper}>
              <Pressable style={styles.stepperBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Feather name="minus" size={16} color={Colors.black} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable style={styles.stepperBtn} onPress={() => setQty(Math.min(product.stock || 99, qty + 1))}>
                <Feather name="plus" size={16} color={Colors.black} />
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DESCRIPTION */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description || product.shortDescription || 'No description available for this product.'}
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* BOTTOM DOCK */}
      <View style={[styles.bottomDock, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.dockRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Button variant="secondary" size="lg" onPress={handleAddToCart}>
              Add to Cart
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button variant="primary" size="lg" onPress={handleBuyNow}>
              Buy Now
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.white,
    opacity: 0.5,
  },
  details: {
    padding: Spacing.screenH,
  },
  title: {
    fontFamily: 'ClashDisplay-Medium',
    fontSize: 24,
    color: Colors.black,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 24,
    color: Colors.primary,
    marginRight: 8,
  },
  oldPrice: {
    ...(Typography.priceOld as any),
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  discountText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 12,
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray700,
    marginLeft: 6,
  },
  variantSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...(Typography.h2 as any),
    marginBottom: 12,
  },
  variantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qtySection: {
    marginBottom: 24,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 16,
    width: 40,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 24,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray700,
    lineHeight: 24,
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenH,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  dockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
