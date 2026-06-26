import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography } from '../../constants/tokens'
import { Button } from '../Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button variant="primary" onPress={onRetry} style={{ marginTop: Spacing.md }}>
          Retry
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
  message: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
  },
})
