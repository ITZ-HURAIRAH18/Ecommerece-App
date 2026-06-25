import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { formatPrice } from '../../utils/formatPrice'

interface CartItemProps {
  item: {
    product: string
    name: string
    image: string
    price: number
    quantity: number
  }
  onUpdateQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <View style={styles.actions}>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onUpdateQty(item.product, Math.max(1, item.quantity - 1))}
            >
              <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onUpdateQty(item.product, item.quantity + 1)}
            >
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onRemove(item.product)}>
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.total}>{formatPrice(item.price * item.quantity)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.card,
    backgroundColor: colors.secondaryBg,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  price: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
  },
  stepperText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  qty: {
    ...typography.body,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },
  remove: {
    ...typography.caption,
    color: colors.error,
    marginLeft: spacing.md,
  },
  total: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
})
