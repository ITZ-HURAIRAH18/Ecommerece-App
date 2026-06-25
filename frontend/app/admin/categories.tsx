import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { categoryService } from '../../services/categoryService'

export default function AdminCategories() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  const categories = data?.data?.data || []

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Categories</Text>
        <View style={{ width: 50 }} />
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
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.name}</Text>
                {item.slug && <Text style={styles.categorySlug}>/{item.slug}</Text>}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No categories found</Text>
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
  categoryRow: {
    flexDirection: 'row', backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, marginBottom: spacing.sm, alignItems: 'center',
  },
  categoryIcon: { fontSize: 28, marginRight: spacing.md },
  categoryInfo: { flex: 1 },
  categoryName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  categorySlug: { ...typography.caption, color: colors.textSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
})
