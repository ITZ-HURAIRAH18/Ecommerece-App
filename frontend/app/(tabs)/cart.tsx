import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { CartItem } from '../../components/cart/CartItem'
import { CartSummary } from '../../components/cart/CartSummary'
import { EmptyState } from '../../components/common/EmptyState'
import { Button } from '../../components/ui/Button'
import { useCart } from '../../hooks/useCart'

export default function CartScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { items, total, updateQty, removeItem } = useCart()

  const subtotal = total
  const shipping = subtotal >= 500 ? 0 : 49
  const discount = 0
  const grandTotal = subtotal + shipping - discount

  if (!items.length) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse our products and add items you love"
          actionLabel="Start Shopping"
          onAction={() => router.push('/(tabs)')}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Cart ({items.length})</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQty={updateQty}
            onRemove={removeItem}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottom}>
        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={grandTotal}
        />
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout')}
          size="lg"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  bottom: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
