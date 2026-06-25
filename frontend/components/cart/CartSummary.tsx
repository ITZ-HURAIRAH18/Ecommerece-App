import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { formatPrice } from '../../utils/formatPrice'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export function CartSummary({ subtotal, shipping, discount, total }: CartSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>
          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
        </Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.success }]}>Discount</Text>
          <Text style={[styles.value, { color: colors.success }]}>
            -{formatPrice(discount)}
          </Text>
        </View>
      )}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primary,
  },
})
