import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { CartSummary } from '../../components/cart/CartSummary'
import { useCartStore } from '../../stores/cartStore'

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { items, total } = useCartStore()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const subtotal = total
  const shipping = subtotal >= 500 ? 0 : 49
  const discount = 0
  const grandTotal = subtotal + shipping - discount

  const handleContinue = () => {
    if (!fullName || !phone || !street || !city || !state || !zip) return
    const address = JSON.stringify({ fullName, phone, street, city, state, zip })
    router.push(`/checkout/payment?address=${encodeURIComponent(address)}`)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.stepLabel}>Step 1 of 3 — Shipping Address</Text>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 234 567 8900" keyboardType="phone-pad" />
        <Input label="Street Address" value={street} onChangeText={setStreet} placeholder="123 Main St" />
        <View style={styles.row}>
          <Input label="City" value={city} onChangeText={setCity} placeholder="New York" style={{ flex: 1, marginRight: spacing.sm }} />
          <Input label="State" value={state} onChangeText={setState} placeholder="NY" style={{ flex: 1 }} />
        </View>
        <Input label="ZIP Code" value={zip} onChangeText={setZip} placeholder="10001" />

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={grandTotal}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <Button title="Continue to Payment" onPress={handleContinue} size="lg" />
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
  row: {
    flexDirection: 'row',
  },
  bottom: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
