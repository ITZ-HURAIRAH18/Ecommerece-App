import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { typography } from '../../constants/typography'

interface Category {
  _id: string
  name: string
  image?: string
  icon?: string
}

interface CategoryScrollProps {
  categories: Category[]
  onSelect: (category: Category) => void
}

export function CategoryScroll({ categories, onSelect }: CategoryScrollProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onSelect(item)}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Text style={styles.emoji}>{item.icon || '📁'}</Text>
              </View>
            )}
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  item: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 72,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondaryBg,
    marginBottom: spacing.xs,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
    textAlign: 'center',
  },
})
