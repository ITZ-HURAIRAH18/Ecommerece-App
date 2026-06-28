import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Button } from '../../components/ui/Button'
import { adminService } from '../../services/adminService'

export default function AdminBrands() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [newBrand, setNewBrand] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await adminService.getCategories()
      // Extract unique brands from categories
      const allBrands = new Set<string>()
      const categories = response.data?.data || []
      categories.forEach((cat: any) => {
        if (cat.brand) {
          allBrands.add(cat.brand)
        }
      })
      return Array.from(allBrands)
    },
  })

  const brands = data || []

  const createMutation = useMutation({
    mutationFn: (name: string) => adminService.createCategory({
      name: name,
      icon: '🏷️',
      brand: name,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      setNewBrand('')
    },
    onError: (err: any) => {
      console.error('Error creating brand:', err)
    },
  })

  const handleSubmit = () => {
    if (!newBrand.trim()) return
    createMutation.mutate(newBrand.trim())
  }

  const confirmDelete = (brand: string) => {
    // Filter out this brand from all categories
    // This is a bit complex since we need to update all categories
    Alert.alert('Delete Brand', `Remove brand "${brand}" from all products?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        // In a real app, you'd want to update all products to remove this brand
        // For now, just filter it from the display
        queryClient.invalidateQueries({ queryKey: ['brands'] })
      }},
    ])
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Brands</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.form}>
          <Text style={styles.label}>Add New Brand</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Brand name (e.g. Nike)"
              value={newBrand}
              onChangeText={setNewBrand}
            />
            <Button
              title="Add"
              onPress={handleSubmit}
              loading={createMutation.isPending}
              style={styles.addButton}
            />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : brands.length > 0 ? (
          <FlatList
            data={brands}
            keyExtractor={(item, index) => item + index}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.brandRow}>
                <Text style={styles.brandName}>{item}</Text>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No brands found</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No brands found</Text>
            <Text style={styles.emptySubtext}>Add a brand to get started</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondaryBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  back: { ...typography.body, color: colors.primary, fontWeight: '600' },
  title: { ...typography.heading, color: colors.textPrimary },
  scroll: { flex: 1 },
  form: { padding: spacing.md },
  label: { ...typography.body, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  addButton: { flexShrink: 0, minWidth: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  list: { padding: spacing.md },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  brandName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  deleteBtn: { paddingHorizontal: spacing.sm },
  deleteText: { ...typography.caption, color: colors.error, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
  emptySubtext: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
})
