import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { categoryService } from '../../services/categoryService'

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })
  const categories = data?.data?.data || []

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Categories</Text>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/search?category=${item._id}`)}
            >
              <Text style={styles.icon}>{item.icon || '📁'}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  list: {
    padding: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    margin: spacing.xs,
    alignItems: 'center',
  },
  icon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
})
