import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Button } from '../../components/ui/Button'
import { orderService } from '../../services/orderService'
import { useCartStore } from '../../stores/cartStore'
import { useCheckoutStore } from '../../stores/checkoutStore'

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, etc.' },
  { id: 'wallet', label: 'Wallet', icon: '👛', description: 'Balance: $0.00' },
]

export default function PaymentScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { address, clearAddress } = useCheckoutStore()
  const [selected, setSelected] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    if (!address) {
      Alert.alert('Missing Address', 'No shipping address found. Please go back and fill in your details.')
      router.back()
    }
  }, [])

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert('Error', 'Shipping address is missing. Please go back and fill in your details.')
      return
    }

    setPlacing(true)
    try {
      const { data } = await orderService.placeOrder({
        shippingAddress: address as Record<string, unknown>,
        paymentMethod: selected,
      })
      const orderId = data.data._id
      await clearCart()
      clearAddress()
      router.replace(`/checkout/success?orderId=${orderId}`)
    } catch (err: any) {
      Alert.alert('Order Failed', err?.response?.data?.message || 'Could not place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.stepLabel}>Step 2 of 3 — Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selected === method.id && styles.methodCardSelected,
            ]}
            onPress={() => setSelected(method.id)}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{method.label}</Text>
              <Text style={styles.methodDesc}>{method.description}</Text>
            </View>
            <View
              style={[
                styles.radio,
                selected === method.id && styles.radioSelected,
              ]}
            >
              {selected === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <Button title="Place Order" onPress={handlePlaceOrder} size="lg" loading={placing} disabled={placing} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  back: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
    padding: spacing.md,
  },
  stepLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
  },
  methodIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  methodDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  bottom: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
