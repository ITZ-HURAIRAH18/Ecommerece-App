import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'

const categories = [
  { _id: '1', name: 'Electronics', icon: '💻', count: 245 },
  { _id: '2', name: 'Fashion', icon: '👕', count: 189 },
  { _id: '3', name: 'Home & Living', icon: '🏡', count: 156 },
  { _id: '4', name: 'Beauty', icon: '💄', count: 112 },
  { _id: '5', name: 'Sports', icon: '⚽', count: 98 },
  { _id: '6', name: 'Books', icon: '📚', count: 87 },
  { _id: '7', name: 'Toys', icon: '🎮', count: 65 },
  { _id: '8', name: 'Automotive', icon: '🚗', count: 43 },
]

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Categories</Text>
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
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>{item.count} items</Text>
          </TouchableOpacity>
        )}
      />
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
