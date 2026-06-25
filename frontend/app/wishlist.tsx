import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { colors } from '../constants/colors'
import { spacing } from '../constants/spacing'
import { typography } from '../constants/typography'
import { EmptyState } from '../components/common/EmptyState'
import { useWishlistStore } from '../stores/wishlistStore'

export default function WishlistScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { items } = useWishlistStore()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist</Text>
        <View style={{ width: 50 }} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          message="Save items you love by tapping the heart icon"
          actionLabel="Browse Products"
          onAction={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item}</Text>
          )}
          contentContainerStyle={styles.list}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  list: {
    padding: spacing.md,
  },
  item: {
    ...typography.body,
    color: colors.textPrimary,
  },
})
