import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Colors, Spacing, Typography } from '../../constants/tokens'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { authService } from '../../services/authService'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>ShopEase</Text>
        <Text style={styles.title}>Reset Password</Text>

        {sent ? (
          <>
            <Text style={styles.subtitle}>
              An OTP has been sent to your email. Please check your inbox.
            </Text>
            <Button
              variant="primary"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
            >
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you an OTP to reset your password.
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              variant="primary"
              onPress={handleSend}
              loading={loading}
              style={styles.button}
            >
              Send OTP
            </Button>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  logo: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 28,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 32,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  error: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.sm,
  },
})
