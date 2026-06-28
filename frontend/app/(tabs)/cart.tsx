import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../../components/Button';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CartItem({ item }: { item: any }) {
  const { updateQty, removeItem } = useCartStore();

  const productId = typeof item.product === 'object' ? item.product._id?.toString() : item.product?.toString();

  const scale = useSharedValue(1);
  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.cartItem, animatedStyle]}>
      <Image source={item.image || 'https://placehold.co/150x150?text=Product'} style={styles.itemImage} contentFit="cover" />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Pressable onPress={() => removeItem(productId)} style={styles.removeBtn}>
            <Feather name="x" size={16} color={Colors.gray500} />
          </Pressable>
        </View>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityRow}>
          <Pressable 
            style={styles.qtyBtn} 
            onPress={() => updateQty(productId, Math.max(1, item.quantity - 1))}
          >
            <Feather name="minus" size={14} color={Colors.black} />
          </Pressable>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <Pressable 
            style={styles.qtyBtn} 
            onPress={() => updateQty(productId, item.quantity + 1)}
          >
            <Feather name="plus" size={14} color={Colors.black} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Feather name="shopping-bag" size={32} color={Colors.gray500} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Looks like you haven't added anything yet.</Text>
          <Button variant="primary" onPress={() => router.push('/(tabs)/categories')} style={{ marginTop: 24 }}>
            Start Shopping
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Pressable onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => typeof item.product === 'object' ? item.product._id?.toString() || Math.random().toString() : item.product?.toString() || Math.random().toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        }
      />

      <View style={[styles.bottomDock, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          onPress={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 16,
  },
  headerTitle: {
    ...(Typography.h1 as any),
  },
  clearText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
    color: Colors.error,
  },
  listContent: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 120, // space for dock
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    backgroundColor: Colors.gray100,
  },
  itemContent: {
    flex: 1,
    marginLeft: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontFamily: 'GeneralSans-Medium',
    fontSize: 15,
    color: Colors.black,
    lineHeight: 20,
    marginRight: 12,
  },
  removeBtn: {
    padding: 4,
  },
  itemPrice: {
    fontFamily: 'ClashDisplay-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: Colors.gray100,
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: Colors.white,
  },
  qtyText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
    width: 32,
    textAlign: 'center',
  },
  summaryContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    color: Colors.gray700,
  },
  summaryValue: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray300,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 16,
    color: Colors.black,
  },
  totalValue: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 20,
    color: Colors.primary,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    ...(Typography.h1 as any),
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
