import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { 
  Chivo_400Regular, 
  Chivo_500Medium, 
  Chivo_600SemiBold 
} from '@expo-google-fonts/chivo'
import { 
  HankenGrotesk_400Regular, 
  HankenGrotesk_500Medium 
} from '@expo-google-fonts/hanken-grotesk'
import { useAuthStore } from '../stores/authStore'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

function RootLayoutNav() {
  const { restoreSession, isLoading } = useAuthStore()

  const [fontsLoaded, fontError] = useFonts({
    'ClashDisplay-Medium': Chivo_500Medium,
    'ClashDisplay-Semibold': Chivo_600SemiBold,
    'GeneralSans-Regular': HankenGrotesk_400Regular,
    'GeneralSans-Medium': HankenGrotesk_500Medium,
  })

  useEffect(() => {
    restoreSession()
  }, [])

  useEffect(() => {
    if (!isLoading && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync()
    }
  }, [isLoading, fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="order/index" options={{ presentation: 'card' }} />
      <Stack.Screen name="checkout/index" options={{ presentation: 'card' }} />
      <Stack.Screen name="checkout/payment" options={{ presentation: 'card' }} />
      <Stack.Screen name="checkout/success" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="wishlist" options={{ presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      <Stack.Screen name="admin" options={{ presentation: 'card' }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </QueryClientProvider>
  )
}
