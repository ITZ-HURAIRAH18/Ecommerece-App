import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Button } from '../../components/ui/Button'
import { adminService } from '../../services/adminService'

export default function AdminBanners() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerLink, setBannerLink] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: adminService.getBanners,
  })

  const banners = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => adminService.createBanner(fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }); setModalVisible(false); setBannerTitle(''); setBannerLink('') },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  })

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Banner', 'Delete this banner?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ])
  }

  const handleCreate = () => {
    if (!bannerTitle) { Alert.alert('Error', 'Title is required'); return }
    const fd = new FormData()
    fd.append('title', bannerTitle)
    if (bannerLink) fd.append('link', bannerLink)
    createMutation.mutate(fd)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Banners</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.add}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={banners}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.bannerCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.bannerImage}
                contentFit="cover"
              />
              <View style={styles.bannerOverlay}>
                {item.title && <Text style={styles.bannerTitle}>{item.title}</Text>}
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item._id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No banners found</Text>
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Banner</Text>
            <TextInput
              style={styles.input}
              placeholder="Banner title"
              value={bannerTitle}
              onChangeText={setBannerTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Link URL (optional)"
              value={bannerLink}
              onChangeText={setBannerLink}
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="outline" onPress={() => { setModalVisible(false); setBannerTitle(''); setBannerLink('') }} style={{ flex: 1, marginRight: spacing.sm }} />
              <Button title="Create" onPress={handleCreate} loading={createMutation.isPending} style={{ flex: 1 }} />
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
  bannerCard: {
    backgroundColor: colors.background, borderRadius: borderRadius.card,
    overflow: 'hidden', marginBottom: spacing.sm,
  },
  bannerImage: { width: '100%', height: 160, backgroundColor: colors.secondaryBg },
  bannerOverlay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
  },
  bannerTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '600', flex: 1 },
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
