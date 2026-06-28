import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens';
import { ProductCard } from '../../components/ProductCard';
import { CategoryChip } from '../../components/CategoryChip';
import { useFeaturedProducts, useNewArrivals } from '../../hooks/useProducts';
import { categoryService } from '../../services/categoryService';
import { useAuthStore } from '../../stores/authStore';

const mockBanners = [
  { _id: '1', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800', title: 'Summer Collection' },
  { _id: '2', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800', title: 'New Arrivals' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCat, setSelectedCat] = useState('all');

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const categories = categoriesData?.data?.data || [];
  const featured = featuredData?.data?.data || [];
  const newArrivals = newArrivalsData?.data?.data || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderSectionHeader = (title: string, onSeeAll: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See all</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.name || 'Shopper'}</Text>
        </View>
        <Pressable style={styles.bellBtn} onPress={() => router.push('/notifications')}>
          <Feather name="bell" size={22} color={Colors.black} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* HERO BANNER */}
        <View style={styles.heroContainer}>
          <Image source={mockBanners[0].image} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroLabel}>SALE</Text>
            <Text style={styles.heroTitle}>{mockBanners[0].title}</Text>
          </View>
        </View>

        {/* CATEGORIES ROW */}
        {renderSectionHeader('Categories', () => router.push('/(tabs)/categories'))}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <CategoryChip 
            label="All" 
            active={selectedCat === 'all'} 
            onPress={() => setSelectedCat('all')} 
          />
          {categories.map((cat: any) => (
            <CategoryChip 
              key={cat._id}
              label={cat.name.replace(/[^a-zA-Z ]/g, '')} // remove old emojis
              active={selectedCat === cat._id}
              onPress={() => setSelectedCat(cat._id)}
            />
          ))}
        </ScrollView>

        {/* FEATURED PRODUCTS (GRID) */}
        {renderSectionHeader('Featured', () => router.push('/(tabs)/search?sort=popular'))}
        <View style={styles.gridContainer}>
          {featured.map((item: any) => (
            <ProductCard
              key={item._id}
              mode="grid"
              product={{
                id: item._id,
                name: item.name,
                price: item.price,
                oldPrice: item.price * 1.2,
                image: item.images[0]?.url || 'https://placehold.co/150x150?text=Product',
                category: item.category?.name?.replace(/[^a-zA-Z ]/g, '') || 'Category',
                rating: item.ratings || 4.5,
                reviews: item.numOfReviews || 12,
              }}
              onPress={() => router.push(`/product/${item._id}`)}
            />
          ))}
        </View>

        {/* NEW ARRIVALS (HORIZONTAL LIST) */}
        {renderSectionHeader('New arrivals', () => router.push('/(tabs)/search?sort=newest'))}
        <View style={styles.horizontalList}>
          {newArrivals.map((item: any) => (
            <ProductCard
              key={item._id}
              mode="horizontal"
              product={{
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.images[0]?.url || 'https://placehold.co/150x150?text=Product',
                category: item.category?.name?.replace(/[^a-zA-Z ]/g, '') || 'Category',
                rating: item.ratings || 4.8,
                reviews: item.numOfReviews || 5,
              }}
              onPress={() => router.push(`/product/${item._id}`)}
            />
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 12,
  },
  greeting: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    color: Colors.gray500,
  },
  userName: {
    ...(Typography.h1 as any),
    fontSize: 22,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    marginHorizontal: Spacing.screenH,
    marginTop: 16,
    height: (Dimensions.get('window').width - 40) / 2,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroLabel: {
    ...(Typography.label as any),
    color: Colors.white,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 24,
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    ...(Typography.h2 as any),
  },
  seeAllText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.screenH,
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
  },
  horizontalList: {
    paddingHorizontal: Spacing.screenH,
  },
});
