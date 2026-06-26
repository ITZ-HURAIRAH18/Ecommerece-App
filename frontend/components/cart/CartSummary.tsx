import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens'

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
        <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: Colors.success }]}>Discount</Text>
          <Text style={[styles.value, { color: Colors.success }]}>-${discount.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    color: Colors.gray700,
  },
  value: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray300,
    marginVertical: Spacing.sm,
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
})
