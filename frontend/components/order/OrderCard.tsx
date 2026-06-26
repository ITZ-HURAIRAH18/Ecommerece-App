import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens'

interface OrderItem {
  _id: string
  orderNumber: string
  orderStatus: string
  total: number
  createdAt: string
  items: Array<{ name: string; quantity: number; price: number }>
}

interface OrderCardProps {
  order: OrderItem
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/order/${order._id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: order.orderStatus === 'delivered' ? '#DCFCE7' : '#FEF3C7' }]}>
          <Text style={[styles.statusText, { color: order.orderStatus === 'delivered' ? '#16A34A' : '#D97706' }]}>
            {order.orderStatus.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>
      <Text style={styles.itemCount}>{order.items?.length || 0} item(s)</Text>
      <View style={styles.footer}>
        <Text style={styles.total}>${order.total?.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderNumber: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 15,
    color: Colors.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  statusText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemCount: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 18,
    color: Colors.black,
  },
  date: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 13,
    color: Colors.gray500,
  },
})
