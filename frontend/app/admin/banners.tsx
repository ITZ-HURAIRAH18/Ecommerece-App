import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { adminService } from '../../services/adminService'

export default function AdminBanners() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: adminService.getBanners,
  })

  const banners = data?.data?.data || []

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Banners</Text>
        <View style={{ width: 50 }} />
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
              {item.title && <Text style={styles.bannerTitle}>{item.title}</Text>}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No banners found</Text>
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
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  bannerCard: {
    backgroundColor: colors.background, borderRadius: borderRadius.card,
    overflow: 'hidden', marginBottom: spacing.sm,
  },
  bannerImage: { width: '100%', height: 160, backgroundColor: colors.secondaryBg },
  bannerTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '600', padding: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
})
