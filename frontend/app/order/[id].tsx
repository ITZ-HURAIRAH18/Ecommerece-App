import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatPrice } from '../../utils/formatPrice'

const mockOrder = {
  _id: '1',
  orderNumber: 'ORD-1718000001',
  orderStatus: 'shipped',
  items: [
    { name: 'Wireless Headphones', image: 'https://picsum.photos/seed/headphones/200', price: 79.99, quantity: 1 },
    { name: 'Phone Case', image: 'https://picsum.photos/seed/phonecase/200', price: 19.99, quantity: 2 },
  ],
  shippingAddress: {
    fullName: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US',
  },
  paymentMethod: 'cod',
  subtotal: 119.97,
  shippingFee: 0,
  discount: 10,
  total: 109.97,
  estimatedDelivery: '2024-06-28',
  trackingNumber: '1Z999AA10123456784',
  statusHistory: [
    { status: 'placed', timestamp: '2024-06-20T10:00:00Z' },
    { status: 'confirmed', timestamp: '2024-06-20T11:30:00Z' },
    { status: 'shipped', timestamp: '2024-06-21T09:00:00Z' },
  ],
  createdAt: '2024-06-20T10:00:00Z',
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const order = mockOrder

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Detail</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Badge label={order.orderStatus.replace(/_/g, ' ')} variant="primary" />
          </View>
          {order.trackingNumber && (
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Tracking: </Text>
              <Text style={styles.trackingValue}>{order.trackingNumber}</Text>
            </View>
          )}
          {order.estimatedDelivery && (
            <Text style={styles.estimatedDelivery}>
              Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {order.statusHistory.map((entry, i) => (
            <View key={i} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  i === order.statusHistory.length - 1 && styles.timelineDotActive,
                ]}
              />
              {i < order.statusHistory.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>
                  {entry.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
                <Text style={styles.timelineDate}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
            </Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                -{formatPrice(order.discount)}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>
      </ScrollView>
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
  section: {
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  trackingLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  trackingValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  estimatedDelivery: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginTop: 4,
    marginRight: spacing.md,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: -16,
    width: 2,
    backgroundColor: colors.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  timelineDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.secondaryBg,
    marginRight: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  itemQty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  itemPrice: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addressText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
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
