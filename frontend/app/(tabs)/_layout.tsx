import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/tokens';
import { useCartStore } from '../../stores/cartStore';
import { Text } from 'react-native';

function TabIcon({ name, focused, badgeCount = 0 }: { name: React.ComponentProps<typeof Feather>['name']; focused: boolean, badgeCount?: number }) {
  return (
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeDot} />}
      <Feather name={name} size={24} color={focused ? Colors.primary : Colors.gray500} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray100,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'GeneralSans-Medium',
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ focused }) => <TabIcon name="shopping-bag" focused={focused} badgeCount={cartCount} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 32,
    width: 32,
  },
  activeDot: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'GeneralSans-Medium',
  },
});
