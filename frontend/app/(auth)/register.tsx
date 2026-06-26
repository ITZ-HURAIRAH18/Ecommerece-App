import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/tokens';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength logic
  const calculateStrength = () => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = calculateStrength();
  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Strong';
    return 'Very strong';
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password, fullName);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP SECTION */}
          <View style={styles.topSection}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color={Colors.black} />
            </Pressable>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Create account.</Text>
              <Text style={styles.subtitle}>Join thousands of smart shoppers</Text>
            </View>
          </View>

          {/* FORM SECTION */}
          <View style={styles.formSection}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Input
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            
            <View style={styles.gap16} />

            <Input
              label="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={styles.gap16} />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={
                <Feather 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={Colors.gray500} 
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <View style={styles.gap16} />

            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3, 4].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: strength >= level ? Colors.primary : Colors.gray300 }
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.strengthLabel}>{getStrengthLabel()}</Text>
              </View>
            )}

            <View style={styles.gap32} />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleRegister}
              loading={loading}
            >
              Create account
            </Button>

            <View style={styles.gap24} />

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.bottomLink}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenH,
  },
  topSection: {
    paddingTop: 60,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextContainer: {
    marginTop: 8,
  },
  title: {
    ...(Typography.display as any),
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    ...(Typography.body as any),
    color: Colors.gray500,
  },
  formSection: {
    paddingBottom: 40,
  },
  gap16: { height: 16 },
  gap24: { height: 24 },
  gap32: { height: 32 },
  errorText: {
    ...(Typography.small as any),
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 12,
    color: Colors.gray700,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    color: Colors.gray700,
  },
  bottomLink: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});
