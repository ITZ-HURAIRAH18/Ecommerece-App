import { View, FlatList, StyleSheet } from 'react-native'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '../common/SkeletonLoader'
import { EmptyState } from '../common/EmptyState'
import { spacing } from '../../constants/spacing'

interface ProductGridProps {
  products: any[]
  isLoading?: boolean
  numColumns?: 1 | 2
  onEndReached?: () => void
}

export function ProductGrid({
  products,
  isLoading,
  numColumns = 2,
  onEndReached,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={{ flex: 1, margin: spacing.xs }}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    )
  }

  if (!products.length) {
    return <EmptyState icon="📦" title="No products found" />
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={{ flex: 1 / numColumns, padding: spacing.xs }}>
          <ProductCard product={item} />
        </View>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.grid}
    />
  )
}

const styles = StyleSheet.create({
  grid: {
    padding: spacing.xs,
  },
})
