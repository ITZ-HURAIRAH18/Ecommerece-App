import { View, Text, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Button } from '../../components/ui/Button'

export default function SuccessScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { orderId } = useLocalSearchParams<{ orderId?: string }>()

  const orderNumber = 'ORD-' + Date.now()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.checkmark}>✅</Text>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Thank you for your purchase</Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>

        <Text style={styles.message}>
          You will receive a confirmation email shortly. Track your order from the Orders section.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Track Order"
          onPress={() => router.push(orderId ? `/order/${orderId}` : '/order')}
          style={styles.button}
        />
        <Button
          title="Continue Shopping"
          onPress={() => router.replace('/(tabs)')}
          variant="outline"
          style={styles.button}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  checkmark: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  orderInfo: {
    backgroundColor: colors.secondaryBg,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  orderLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderNumber: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottom: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  button: {
    marginBottom: spacing.sm,
  },
})
