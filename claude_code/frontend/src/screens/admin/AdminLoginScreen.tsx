import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import {Toast} from '../../components/ui/Toast';
import {LoadingSpinner} from '../../components/ui/LoadingSpinner';
import {colors, typography, spacing} from '../../theme';
import {useAuthStore} from '../../store/authStore';

type AdminLoginScreenNavigationProp = NativeStackNavigationProp<any>;

export const AdminLoginScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<AdminLoginScreenNavigationProp>();
  const {login} = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError(t('auth.emailRequired'));
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError(t('auth.passwordRequired'));
      return false;
    }
    if (value.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock admin login - check if email contains "admin"
      // In real app, this would call API endpoint
      if (!email.toLowerCase().includes('admin')) {
        setToastType('error');
        setToastMessage(t('admin.notAuthorized'));
        setShowToast(true);
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock admin user
      const adminUser = {
        id: 1,
        email: email,
        name: 'Admin User',
        role: 'ADMIN' as const,
      };

      login(adminUser);

      // Navigate to admin dashboard
      navigation.reset({
        index: 0,
        routes: [{name: 'AdminDashboard'}],
      });
    } catch (error) {
      setToastType('error');
      setToastMessage(t('auth.loginFailed'));
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
            <Text style={styles.title}>{t('admin.login')}</Text>
            <Text style={styles.subtitle}>{t('admin.loginDesc')}</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <View style={styles.formContent}>
              <TextInput
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                onBlur={() => validateEmail(email)}
              />

              <TextInput
                label={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                error={passwordError}
                onBlur={() => validatePassword(password)}
                style={styles.passwordInput}
              />

              <Button
                title={t('admin.login')}
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              />
            </View>
          </Card>

          {/* Info Section */}
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>{t('admin.accessInfo')}</Text>
                <Text style={styles.infoText}>
                  {t('admin.accessInfoDesc')}
                </Text>
              </View>
            </View>
          </Card>

          {/* Back to User Login */}
          <Button
            title={t('admin.backToUserLogin')}
            onPress={handleBackToLogin}
            variant="outline"
            style={styles.backButton}
          />

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LoadingSpinner size="large" />
          </View>
        )}

        {/* Toast */}
        <Toast
          visible={showToast}
          message={toastMessage}
          type={toastType}
          onDismiss={() => setShowToast(false)}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  formContent: {
    padding: spacing.lg,
  },
  passwordInput: {
    marginTop: spacing.md,
  },
  loginButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary[600],
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  infoContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[700],
    lineHeight: 20,
  },
  backButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderColor: colors.gray[300],
  },
  bottomSpacing: {
    height: spacing.xl,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
