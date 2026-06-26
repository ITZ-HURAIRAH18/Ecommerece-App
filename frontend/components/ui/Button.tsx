import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Button as AppButton } from '../Button'

interface UIButtonProps {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export function Button({ title, variant, ...props }: UIButtonProps) {
  const mappedVariant = variant === 'outline' ? 'secondary' : variant as 'primary' | 'secondary' | 'ghost' | undefined
  return (
    <AppButton variant={mappedVariant} {...props}>
      {title}
    </AppButton>
  )
}
