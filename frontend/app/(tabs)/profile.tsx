import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'shopping-bag', title: 'My Orders', route: '/order' },
    { icon: 'heart', title: 'Wishlist', route: '/wishlist' },
    { icon: 'credit-card', title: 'Payment Methods', route: '/settings' },
    { icon: 'map-pin', title: 'Shipping Addresses', route: '/settings' },
    { icon: 'settings', title: 'Settings', route: '/settings' },
  ]

  // Add Admin option for admin users
  if (user?.role === 'admin') {
    menuItems.unshift({ icon: 'shield', title: 'Admin Dashboard', route: '/admin' })
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={24} color={Colors.black} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* USER INFO */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={Colors.gray500} />
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* MENU LIST */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.menuItem} 
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <Feather name={item.icon as any} size={20} color={Colors.black} />
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.gray500} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 16,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    ...(Typography.h1 as any),
  },
  logoutBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    ...(Typography.h1 as any),
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
  },
  menuSection: {
    paddingHorizontal: Spacing.screenH,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 16,
    color: Colors.black,
    marginLeft: 16,
  },
});
