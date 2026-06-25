import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Badge } from '../../components/ui/Badge'
import { adminService } from '../../services/adminService'

export default function AdminUsers() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminService.getUsers(),
  })

  const users = data?.data?.data || []

  const deleteUserFn = async (id: string) => {
    await adminService.deleteUser(id)
    refetch()
  }

  const updateUserFn = async ({ id, role }: { id: string; role: string }) => {
    await adminService.updateUser(id, { role })
    refetch()
  }

  const toggleRole = (user: any) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    Alert.alert(
      'Change Role',
      `Change ${user.name || user.email} to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change', onPress: async () => {
          try {
            await updateUserFn({ id: user._id, role: newRole })
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update role')
          }
        }},
      ]
    )
  }

  const confirmDelete = async (user: any) => {
    Alert.alert('Delete User', `Delete ${user.name || user.email}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteUserFn(user._id)
          Alert.alert('Success', 'User deleted successfully')
        } catch (err: any) {
          Alert.alert('Error', err?.response?.data?.message || 'Failed to delete user')
        }
      }},
    ])
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Users</Text>
        <View style={{ width: 50 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name || 'Unknown'}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleRole(item)}>
                <Badge label={item.role || 'customer'} variant={item.role === 'admin' ? 'primary' : 'neutral'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No users found</Text>
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
  userRow: {
    flexDirection: 'row', backgroundColor: colors.background, padding: spacing.md,
    borderRadius: borderRadius.card, marginBottom: spacing.sm, alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  userEmail: { ...typography.caption, color: colors.textSecondary },
  deleteBtn: { paddingHorizontal: spacing.sm, marginLeft: spacing.sm },
  deleteText: { ...typography.caption, color: colors.error, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary },
})
