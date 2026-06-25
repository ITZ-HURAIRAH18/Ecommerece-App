import { Stack, Redirect } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  if (user?.role !== 'admin') {
    return <Redirect href="/(tabs)" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="products" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="banners" />
      <Stack.Screen name="users" />
      <Stack.Screen name="product-form" />
    </Stack>
  )
}
