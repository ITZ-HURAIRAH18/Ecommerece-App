import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'
import { borderRadius } from '../../constants/spacing'
import { typography } from '../../constants/typography'

interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
}

const variantColors = {
  primary: { bg: colors.primary + '20', text: colors.primary },
  success: { bg: colors.success + '20', text: colors.success },
  warning: { bg: colors.warning + '20', text: colors.warning },
  error: { bg: colors.error + '20', text: colors.error },
  neutral: { bg: colors.secondaryBg, text: colors.textSecondary },
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  const vc = variantColors[variant]

  return (
    <View style={[styles.badge, { backgroundColor: vc.bg }]}>
      <Text style={[styles.text, { color: vc.text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
})
