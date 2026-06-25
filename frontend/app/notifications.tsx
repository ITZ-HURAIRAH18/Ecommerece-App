import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '../constants/colors'
import { spacing, borderRadius } from '../constants/spacing'
import { typography } from '../constants/typography'
import { EmptyState } from '../components/common/EmptyState'

const mockNotifications = [
  { _id: '1', title: 'Order Shipped', body: 'Your order ORD-1718000001 has been shipped.', type: 'order', isRead: false, createdAt: '2024-06-21T09:00:00Z' },
  { _id: '2', title: 'Flash Sale!', body: 'Up to 50% off on electronics. Hurry!', type: 'promotion', isRead: true, createdAt: '2024-06-20T12:00:00Z' },
  { _id: '3', title: 'Price Drop', body: 'The item in your wishlist is now 20% cheaper!', type: 'system', isRead: false, createdAt: '2024-06-19T15:30:00Z' },
]

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 50 }} />
      </View>

      {mockNotifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications yet" message="We'll notify you when something happens" />
      ) : (
        <FlatList
          data={mockNotifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notif, !item.isRead && styles.notifUnread]}
            >
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]}>
                  {item.title}
                </Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
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
  notif: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifUnread: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primary + '05',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notifDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
})
