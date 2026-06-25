import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Button } from '../../components/ui/Button'
import { categoryService } from '../../services/categoryService'
import { adminService } from '../../services/adminService'

export default function AdminCategories() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [catName, setCatName] = useState('')
  const [catIcon, setCatIcon] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  const categories = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => adminService.createCategory ? adminService.createCategory(fd) : categoryService.create({ name: catName, icon: catIcon }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal() },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed'),
  })

  const updateMutation = useMutation({
    mutationFn: (fd: FormData) => adminService.updateCategory(editItem._id, fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal() },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const openCreate = () => {
    setEditItem(null)
    setCatName('')
    setCatIcon('')
    setModalVisible(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setCatName(item.name)
    setCatIcon(item.icon || '')
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditItem(null)
    setCatName('')
    setCatIcon('')
  }

  const handleSave = () => {
    if (!catName) { Alert.alert('Error', 'Name is required'); return }
    const fd = new FormData()
    fd.append('name', catName)
    fd.append('icon', catIcon)
    if (editItem) {
      updateMutation.mutate(fd)
    } else {
      createMutation.mutate(fd)
    }
  }

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Category', `Delete "${name}"?`, [
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
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={openCreate}>
          <Text style={styles.add}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.categoryRow}>
              <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
              <TouchableOpacity style={styles.categoryInfo} onPress={() => openEdit(item)}>
                <Text style={styles.categoryName}>{item.name}</Text>
                {item.slug && <Text style={styles.categorySlug}>/{item.slug}</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item._id, item.name)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editItem ? 'Edit Category' : 'New Category'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Category name"
              value={catName}
              onChangeText={setCatName}
            />
            <TextInput
              style={styles.input}
              placeholder="Icon emoji (e.g. 📦)"
              value={catIcon}
              onChangeText={setCatIcon}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="outline" onPress={closeModal} style={{ flex: 1, marginRight: spacing.sm }} />
              <Button title="Save" onPress={handleSave} loading={createMutation.isPending || updateMutation.isPending} style={{ flex: 1 }} />
            </View>
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
  add: { ...typography.body, color: colors.primary, fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  categoryRow: {
    flexDirection: 'row', backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, marginBottom: spacing.sm, alignItems: 'center',
  },
  categoryIcon: { fontSize: 28, marginRight: spacing.md },
  categoryInfo: { flex: 1 },
  categoryName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  categorySlug: { ...typography.caption, color: colors.textSecondary },
  deleteBtn: { paddingHorizontal: spacing.sm },
  deleteText: { ...typography.caption, color: colors.error, fontWeight: '600' },
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
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.card,
    padding: spacing.md, fontSize: 16, color: colors.textPrimary, marginBottom: spacing.md,
  },
  modalActions: { flexDirection: 'row', marginTop: spacing.sm },
})
