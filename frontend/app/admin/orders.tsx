import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { adminService } from '../../services/adminService'

const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusModal, setStatusModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => adminService.getOrders(statusFilter),
  })

  const orders = data?.data?.data || []

  const updateMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      adminService.updateOrderStatus(id, orderStatus),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }); setStatusModal(false) },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed'),
  })

  const getBadgeVariant = (status: string) => {
    if (['delivered', 'paid'].includes(status)) return 'success' as const
    if (['cancelled', 'returned'].includes(status)) return 'error' as const
    if (['shipped', 'out_for_delivery'].includes(status)) return 'primary' as const
    return 'warning' as const
  }

  const openStatusChange = (order: any) => {
    setSelectedOrder(order)
    setStatusModal(true)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Orders</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        horizontal
        data={['', ...statuses]}
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
        keyExtractor={(item) => item || 'all'}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === item && styles.filterChipActive]}
            onPress={() => setStatusFilter(item)}
          >
            <Text style={[styles.filterText, statusFilter === item && styles.filterTextActive]}>
              {item ? item.replace(/_/g, ' ') : 'All'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.orderCard} onPress={() => openStatusChange(item)}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <Badge label={item.orderStatus?.replace(/_/g, ' ')} variant={getBadgeVariant(item.orderStatus)} />
              </View>
              <Text style={styles.orderUser}>{item.user?.name || item.user?.email}</Text>
              <Text style={styles.orderTotal}>${item.total?.toFixed(2)}</Text>
              <Text style={styles.orderDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}

      <Modal visible={statusModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Update Status: {selectedOrder?.orderNumber}
            </Text>
            <View style={styles.statusGrid}>
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusChip,
                    selectedOrder?.orderStatus === s && styles.statusChipActive,
                  ]}
                  onPress={() =>
                    updateMutation.mutate({ id: selectedOrder._id, orderStatus: s })
                  }
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      selectedOrder?.orderStatus === s && styles.statusChipTextActive,
                    ]}
                  >
                    {s.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setStatusModal(false)}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondaryBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background,
  },
  back: { ...typography.body, color: colors.primary, fontWeight: '600' },
  title: { ...typography.heading, color: colors.textPrimary },
  filterBar: { maxHeight: 48, backgroundColor: colors.background },
  filterContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill, backgroundColor: colors.secondaryBg, marginRight: spacing.sm,
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { ...typography.caption, color: colors.textSecondary, textTransform: 'capitalize' },
  filterTextActive: { color: colors.white },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  orderCard: {
    backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, marginBottom: spacing.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  orderNumber: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  orderUser: { ...typography.caption, color: colors.textSecondary },
  orderTotal: { ...typography.body, color: colors.textPrimary, fontWeight: '600', marginTop: spacing.xs },
  orderDate: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
  modalOverlay: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background, borderRadius: borderRadius.card,
    padding: spacing.lg,
  },
  modalTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill, backgroundColor: colors.secondaryBg,
    borderWidth: 1, borderColor: colors.border,
  },
  statusChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { ...typography.caption, color: colors.textPrimary, textTransform: 'capitalize' },
  statusChipTextActive: { color: colors.white },
})
