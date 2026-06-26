import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Spacing } from '../../constants/tokens'
import { Button } from '../Button'

interface EmptyStateProps {
  icon?: string
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction} style={{ marginTop: Spacing.md }}>
          {actionLabel}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: 'ClashDisplay-Medium',
    fontSize: 20,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
})
