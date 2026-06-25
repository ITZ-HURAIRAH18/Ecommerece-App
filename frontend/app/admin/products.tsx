import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useState } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { adminService } from '../../services/adminService'
import { formatPrice } from '../../utils/formatPrice'

export default function AdminProducts() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page],
    queryFn: () => adminService.getProducts(page),
  })

  const products = data?.data?.data || []
  const pagination = data?.data?.pagination

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Product', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ])
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity onPress={() => router.push('/admin/product-form')}>
          <Text style={styles.add}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productRow}
              onPress={() => router.push(`/admin/product-form?id=${item._id}`)}
              onLongPress={() => confirmDelete(item._id, item.name)}
            >
              <Image
                source={{ uri: item.images?.[0] }}
                style={styles.productImage}
                contentFit="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                <Text style={styles.productStock}>Stock: {item.stock}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item._id, item.name)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
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
  add: { ...typography.body, color: colors.primary, fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  productRow: {
    flexDirection: 'row', backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, marginBottom: spacing.sm, alignItems: 'center',
  },
  productImage: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.secondaryBg, marginRight: spacing.md },
  productInfo: { flex: 1 },
  productName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  productPrice: { ...typography.caption, color: colors.primary, fontWeight: '600', marginTop: 2 },
  productStock: { ...typography.caption, color: colors.textSecondary },
  deleteBtn: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  deleteText: { ...typography.caption, color: colors.error, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
})
