import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Avatar } from '../../components/ui/Avatar'
import { useAuthStore } from '../../stores/authStore'

const menuItems = [
  { icon: '📦', label: 'My Orders', route: '/order' },
  { icon: '❤️', label: 'Wishlist', route: '/wishlist' },
  { icon: '🔔', label: 'Notifications', route: '/notifications' },
  { icon: '📍', label: 'Addresses', route: '/settings' },
  { icon: '💳', label: 'Payment Methods', route: '/settings' },
  { icon: '⚙️', label: 'Settings', route: '/settings' },
  { icon: '🔐', label: 'Admin Panel', route: '/admin', adminOnly: true },
]

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleAuthAction = async () => {
    if (user) {
      await logout()
      router.replace('/(auth)/login')
    } else {
      router.push('/(auth)/login')
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar uri={user?.avatar} name={user?.name} size={72} />
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems
            .filter((item) => !item.adminOnly || user?.role === 'admin')
            .map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={user ? styles.logoutBtn : styles.loginBtn} 
          onPress={handleAuthAction}
        >
          <Text style={user ? styles.logoutText : styles.loginText}>
            {user ? 'Sign Out' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menu: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  chevron: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 20,
  },
  logoutBtn: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.card,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
  },
  loginBtn: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.card,
    alignItems: 'center',
  },
  loginText: {
    ...typography.button,
    color: '#fff',
  },
})
