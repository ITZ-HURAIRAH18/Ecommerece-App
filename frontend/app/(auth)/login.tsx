import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/tokens';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
          {/* TOP SECTION (approx 40%) */}
          <View style={styles.topSection}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color={Colors.black} />
            </Pressable>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Welcome back.</Text>
              <Text style={styles.subtitle}>Sign in to continue shopping</Text>
            </View>
          </View>

          {/* FORM SECTION */}
          <View style={styles.formSection}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

            <View style={styles.gap8} />

            <Pressable style={styles.forgotWrapper} onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <View style={styles.gap32} />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleLogin}
              loading={loading}
            >
              Sign in
            </Button>

            <View style={styles.gap24} />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.gap24} />

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => {}}
            >
              Continue with Google
            </Button>

            <View style={styles.gap24} />

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.bottomLink}>Create one</Text>
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
    minHeight: '40%',
    paddingTop: 60,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  headerTextContainer: {
    marginTop: 40,
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
  gap8: { height: 8 },
  gap16: { height: 16 },
  gap24: { height: 24 },
  gap32: { height: 32 },
  errorText: {
    ...(Typography.small as any),
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  dividerText: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 13,
    color: Colors.gray500,
    paddingHorizontal: 16,
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
