import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Badge } from '../ui/Badge'
import { formatPrice } from '../../utils/formatPrice'

interface OrderCardProps {
  order: {
    _id: string
    orderNumber: string
    orderStatus: string
    total: number
    items: Array<{ image: string; name: string; quantity: number }>
    createdAt: string
  }
}

const statusVariant: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
  placed: 'primary',
  confirmed: 'primary',
  processing: 'warning',
  shipped: 'warning',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'error',
  returned: 'error',
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/order/${order._id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <Badge
          label={order.orderStatus.replace(/_/g, ' ')}
          variant={statusVariant[order.orderStatus] || 'neutral'}
        />
      </View>
      <View style={styles.items}>
        {order.items.slice(0, 3).map((item, i) => (
          <Image
            key={i}
            source={{ uri: item.image }}
            style={styles.itemImage}
            contentFit="cover"
          />
        ))}
        {order.items.length > 3 && (
          <View style={styles.moreBadge}>
            <Text style={styles.moreText}>+{order.items.length - 3}</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  items: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: spacing.xs,
    backgroundColor: colors.secondaryBg,
  },
  moreBadge: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.secondaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  total: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
})
