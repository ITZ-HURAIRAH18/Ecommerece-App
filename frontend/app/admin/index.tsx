import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { adminService } from '../../services/adminService'

const menuItems = [
  { title: 'Products', icon: '📦', route: '/admin/products' },
  { title: 'Categories', icon: '📂', route: '/admin/categories' },
  { title: 'Brands', icon: '🏷️', route: '/admin/brands' },
  { title: 'Orders', icon: '📋', route: '/admin/orders' },
  { title: 'Banners', icon: '🖼️', route: '/admin/banners' },
  { title: 'Users', icon: '👥', route: '/admin/users' },
]

export default function AdminDashboard() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminService.getDashboard,
  })

  const stats = data?.data?.data?.stats
  const recentOrders = data?.data?.data?.recentOrders || []

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Admin</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : stats ? (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.statValue}>${(stats.totalRevenue || 0).toFixed(0)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.statValue}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {recentOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {recentOrders.map((order: any) => (
              <TouchableOpacity
                key={order._id}
                style={styles.orderRow}
                onPress={() => router.push(`/admin/orders?highlight=${order._id}`)}
              >
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderTotal}>${order.total?.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm,
  },
  statCard: {
    width: '47%', padding: spacing.md, borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
  },
  statValue: { ...typography.display, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  menuGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm,
  },
  menuCard: {
    width: '47%', backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, alignItems: 'center',
  },
  menuIcon: { fontSize: 32, marginBottom: spacing.sm },
  menuTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  section: { padding: spacing.md },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  orderRow: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.background,
    padding: spacing.md, borderRadius: borderRadius.card, marginBottom: spacing.xs,
  },
  orderNumber: { ...typography.body, color: colors.textPrimary, fontWeight: '500' },
  orderTotal: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
})
