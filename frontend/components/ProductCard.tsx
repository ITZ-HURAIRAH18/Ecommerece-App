import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Typography } from '../constants/tokens';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isWishlisted?: boolean;
}

interface ProductCardProps {
  product: Product;
  mode?: 'grid' | 'horizontal';
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
// Calculate grid item width assuming 2 columns and 20px screen padding and 16px gap
const GRID_ITEM_WIDTH = (width - 40 - 16) / 2;

export function ProductCard({
  product,
  mode = 'grid',
  onPress,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (mode === 'horizontal') {
    return (
      <AnimatedPressable
        style={[styles.horizontalCard, animatedStyle]}
        onPress={() => onPress?.(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image
          source={product.image}
          style={styles.horizontalImage}
          contentFit="cover"
        />
        <View style={styles.horizontalContent}>
          <Text style={styles.categoryLabel}>{product.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color={Colors.primary} style={{ fill: Colors.primary } as any} />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews})
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  // Grid Mode
  return (
    <AnimatedPressable
      style={[styles.gridCard, animatedStyle]}
      onPress={() => onPress?.(product)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.gridImage}
          contentFit="cover"
        />
        <Pressable
          style={styles.wishlistBtn}
          onPress={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
        >
          <Feather
            name="heart"
            size={16}
            color={product.isWishlisted ? Colors.primary : Colors.black}
            style={product.isWishlisted ? { fill: Colors.primary } as any : {}}
          />
        </Pressable>
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.categoryLabel}>{product.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.oldPrice && (
            <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color={Colors.primary} style={{ fill: Colors.primary } as any} />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews})
            </Text>
          </View>
          <Pressable
            style={styles.addToCartBtn}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            <Feather name="plus" size={16} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  // Horizontal Mode
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 10,
    marginVertical: 6,
    borderRadius: Radius.md,
    ...Shadow.card,
  },
  horizontalImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.gray100,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  // Grid Mode
  gridCard: {
    width: GRID_ITEM_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: 16,
    ...Shadow.card,
  },
  imageContainer: {
    width: '100%',
    height: GRID_ITEM_WIDTH * 1.1,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    backgroundColor: Colors.gray100,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridContent: {
    padding: 10,
  },
  
  // Shared
  categoryLabel: {
    ...(Typography.label as any),
    color: Colors.primary,
    marginBottom: 4,
  },
  productName: {
    ...(Typography.h2 as any),
    fontSize: 16, // slightly smaller for card
    lineHeight: 20,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    ...(Typography.price as any),
    fontSize: 18,
    marginRight: 6,
  },
  oldPrice: {
    ...(Typography.priceOld as any),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...(Typography.small as any),
    marginLeft: 4,
  },
  addToCartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
