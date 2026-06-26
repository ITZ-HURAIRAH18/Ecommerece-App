import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius } from '../../constants/tokens';
import { useSearch } from '../../hooks/useSearch';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard, Product } from '../../components/ProductCard';
import { categoryService } from '../../services/categoryService';

const trendingSearches = ['Wireless Headphones', 'Running Shoes', 'Smart Watch', 'Backpack', 'Sunglasses'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { query, setQuery, submitSearch, recentSearches, clearRecent } = useSearch();
  
  const [activeQuery, setActiveQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const apiParams: Record<string, string> = {};
  if (params.category) apiParams.category = params.category as string;
  if (activeQuery) apiParams.q = activeQuery;

  const { data, isLoading } = useProducts(apiParams);
  const results = data?.data?.data || [];

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });
  const categories = categoriesData?.data?.data || [];
  const activeCategory = categories.find((c: { _id: string }) => c._id === params.category);

  useEffect(() => {
    if (params.category) {
      setSearched(true);
    }
  }, [params.category]);

  const handleSearch = (q: string) => {
    if (q.trim()) {
      submitSearch(q);
    }
    setActiveQuery(q);
    setSearched(true);
  };

  const isSearching = query.length > 0 || params.category;

  const renderRecentSearch = ({ item }: { item: string }) => (
    <Pressable
      style={styles.recentChip}
      onPress={() => {
        setQuery(item);
        handleSearch(item);
      }}
    >
      <Text style={styles.recentText}>{item}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </Pressable>
        <View style={styles.searchContainer}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
            placeholderTextColor={Colors.gray500}
            style={styles.searchInput}
            autoFocus={!params.category}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          <Pressable onPress={() => {
            if (query.length > 0) {
              setQuery('');
              setActiveQuery('');
              if (!params.category) setSearched(false);
            } else {
              handleSearch(query);
            }
          }} style={styles.searchIcon}>
            <Feather name={query.length > 0 ? "x" : "search"} size={20} color={Colors.gray500} />
          </Pressable>
        </View>
      </View>

      {!isSearching && !searched && (
        <View style={styles.suggestionsContainer}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecent}>
                  <Text style={styles.clearAll}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipsRow}>
                {recentSearches.map((s, i) => (
                  <View key={i}>{renderRecentSearch({ item: s })}</View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.chipsRow}>
              {trendingSearches.map((s, i) => (
                <View key={i}>{renderRecentSearch({ item: s })}</View>
              ))}
            </View>
          </View>
        </View>
      )}

      {searched && isLoading && (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {searched && !isLoading && (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard 
              mode="horizontal"
              product={{
                id: item._id,
                name: item.name,
                price: item.price,
                oldPrice: item.price * 1.2,
                image: item.images[0]?.url || 'https://via.placeholder.com/150',
                category: item.category?.name?.replace(/[^a-zA-Z ]/g, '') || 'Category',
                rating: item.ratings || 4.5,
                reviews: item.numOfReviews || 12,
              }}
              onPress={() => router.push(`/product/${item._id}`)}
            />
          )}
          contentContainerStyle={styles.results}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No results found{activeQuery ? ` for "${activeQuery}"` : activeCategory ? ` in "${activeCategory.name}"` : ''}
              </Text>
            </View>
          }
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchContainer: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.black,
  },
  searchIcon: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.screenH,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 15,
    color: Colors.gray700,
  },
  clearAll: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: Colors.gray100,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  recentText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    color: Colors.black,
  },
  results: {
    padding: Spacing.screenH,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
