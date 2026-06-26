import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Radius, Typography } from '../../constants/tokens'

interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'neutral'
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  primary: { bg: Colors.primaryLight, text: Colors.primary },
  success: { bg: '#DCFCE7', text: '#16A34A' },
  error:   { bg: '#FEE2E2', text: '#DC2626' },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  neutral: { bg: Colors.gray100, text: Colors.gray700 },
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const vs = variantStyles[variant] || variantStyles.neutral
  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }]}>
      <Text style={[styles.text, { color: vs.text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  text: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
