import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Input } from '../../components/ui/Input'
import { CartSummary } from '../../components/cart/CartSummary'
import { useCartStore } from '../../stores/cartStore'
import { useCheckoutStore } from '../../stores/checkoutStore'

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { items, total, fetchCart } = useCartStore()
  const { setAddress } = useCheckoutStore()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const subtotal = total
  const shipping = subtotal >= 500 ? 0 : 49
  const discount = 0
  const grandTotal = subtotal + shipping - discount

  const handleContinue = () => {
    try {
      if (!fullName || !phone || !street || !city || !stateProvince || !zip || !country) {
        Alert.alert('Missing Fields', 'Please fill in all shipping address fields.')
        return
      }
      setAddress({
        label: 'Shipping Address',
        fullName,
        phone,
        street,
        city,
        state: stateProvince,
        zip,
        country,
        isDefault: true,
      })
      setTimeout(() => {
        router.push('/checkout/payment')
      }, 100)
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
    }
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
          <Input label="State" value={stateProvince} onChangeText={setStateProvince} placeholder="NY" style={{ flex: 1 }} />
        </View>
        <Input label="ZIP Code" value={zip} onChangeText={setZip} placeholder="10001" />
        <Input label="Country" value={country} onChangeText={setCountry} placeholder="United States" />

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={grandTotal}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.payButton,
            pressed && styles.payButtonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.payButtonText}>Continue to Payment</Text>
        </Pressable>
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
  payButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonPressed: {
    opacity: 0.85,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
