import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { colors } from '../../constants/colors'
import { spacing, borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { useSearch } from '../../hooks/useSearch'
import { useProducts } from '../../hooks/useProducts'
import { ProductCard } from '../../components/product/ProductCard'

const trendingSearches = ['Wireless Headphones', 'Running Shoes', 'Smart Watch', 'Backpack', 'Sunglasses']

export default function SearchScreen() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const { query, setQuery, submitSearch, recentSearches, clearRecent } = useSearch()
  
  // Track the actual search value sent to the API
  const [activeQuery, setActiveQuery] = useState('')
  const [searched, setSearched] = useState(false)

  // Fetch products based on category param and search query
  const apiParams: Record<string, string> = {}
  if (params.category) apiParams.category = params.category as string
  if (activeQuery) apiParams.q = activeQuery

  const { data, isLoading } = useProducts(apiParams)
  const results = data?.data?.data || []

  // Auto-trigger search if a category parameter is present on mount
  useEffect(() => {
    if (params.category) {
      setSearched(true)
    }
  }, [params.category])

  const handleSearch = (q: string) => {
    if (q.trim()) {
      submitSearch(q)
    }
    setActiveQuery(q)
    setSearched(true)
  }

  const isSearching = query.length > 0 || params.category

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          autoFocus={!params.category}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {
            setQuery('')
            setActiveQuery('')
            if (!params.category) setSearched(false)
          }}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isSearching && !searched && (
        <>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <TouchableOpacity onPress={clearRecent}>
                  <Text style={styles.clearAll}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => {
                    setQuery(s)
                    handleSearch(s)
                  }}
                >
                  <Text style={styles.recentText}>🕐 {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.trendingList}>
              {trendingSearches.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.trendingChip}
                  onPress={() => {
                    setQuery(s)
                    handleSearch(s)
                  }}
                >
                  <Text style={styles.trendingText}>🔥 {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {searched && isLoading && (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {searched && !isLoading && (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.results}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No results found for "{activeQuery || 'this category'}"</Text>
            </View>
          }
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    margin: spacing.md,
    borderRadius: borderRadius.card,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  clear: {
    fontSize: 16,
    color: colors.textSecondary,
    padding: 4,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  clearAll: {
    ...typography.body,
    color: colors.primary,
  },
  recentItem: {
    paddingVertical: spacing.sm,
  },
  recentText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  trendingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingChip: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  trendingText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  results: {
    padding: spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
