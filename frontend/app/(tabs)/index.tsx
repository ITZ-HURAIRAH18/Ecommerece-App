import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import { useState, useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { HeroBanner } from '../../components/home/HeroBanner'
import { CategoryScroll } from '../../components/home/CategoryScroll'
import { SectionHeader } from '../../components/home/SectionHeader'
import { ProductGrid } from '../../components/product/ProductGrid'
import { ProductCarousel } from '../../components/product/ProductCarousel'
import { useFeaturedProducts, useNewArrivals } from '../../hooks/useProducts'

const mockBanners = [
  { _id: '1', image: 'https://picsum.photos/seed/banner1/800/400', title: 'Summer Sale - Up to 50% Off' },
  { _id: '2', image: 'https://picsum.photos/seed/banner2/800/400', title: 'New Collection 2024' },
  { _id: '3', image: 'https://picsum.photos/seed/banner3/800/400', title: 'Free Shipping on Orders $50+' },
]

const mockCategories = [
  { _id: '1', name: 'Electronics', icon: '💻' },
  { _id: '2', name: 'Fashion', icon: '👕' },
  { _id: '3', name: 'Home', icon: '🏡' },
  { _id: '4', name: 'Beauty', icon: '💄' },
  { _id: '5', name: 'Sports', icon: '⚽' },
  { _id: '6', name: 'Books', icon: '📚' },
]

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts()
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useNewArrivals()

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <HeroBanner banners={mockBanners} />

        <SectionHeader title="Categories" actionLabel="See All" onAction={() => router.push('/(tabs)/categories')} />
        <CategoryScroll
          categories={mockCategories}
          onSelect={(cat) => router.push(`/(tabs)/search?category=${cat._id}`)}
        />

        <SectionHeader title="Featured" actionLabel="See All" onAction={() => router.push('/(tabs)/search?sort=popular')} />
        <ProductGrid
          products={featuredData?.data?.data || []}
          isLoading={featuredLoading}
        />

        <ProductCarousel
          title="New Arrivals"
          products={newArrivalsData?.data?.data || []}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
