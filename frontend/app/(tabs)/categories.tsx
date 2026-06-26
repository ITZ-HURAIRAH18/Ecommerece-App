import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../constants/tokens';
import { categoryService } from '../../services/categoryService';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (Spacing.screenH * 2) - 16) / 2;

function CategoryCard({ category, onPress }: { category: any, onPress: () => void }) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Clean the name of emojis
  const cleanName = category.name.replace(/[^a-zA-Z ]/g, '').trim();

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={styles.cardTitle}>{cleanName}</Text>
    </AnimatedPressable>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const categories = categoriesData?.data?.data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Categories</Text>
        <Pressable style={styles.searchBtn} onPress={() => router.push('/(tabs)/search')}>
          <Feather name="search" size={24} color={Colors.black} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((cat: any) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onPress={() => router.push(`/(tabs)/search?category=${cat._id}`)}
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
    backgroundColor: Colors.gray100, // Background gray100 as per design
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 16,
    backgroundColor: Colors.gray100,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    ...(Typography.h1 as any),
  },
  searchBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Shadow.card,
  },
  cardTitle: {
    ...(Typography.h2 as any),
  },
});
