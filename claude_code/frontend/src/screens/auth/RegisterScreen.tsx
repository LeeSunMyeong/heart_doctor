import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { authService } from '../../services/authService';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Terms agreement states
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhoneNumber(cleaned);
    }
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
    setAgreeMarketing(newValue);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,}$/;
    return passwordRegex.test(password);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword || !phoneNumber || !birthDate) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (phoneNumber.length !== 11 || !phoneNumber.startsWith('01')) {
      Alert.alert('입력 오류', '올바른 전화번호를 입력해주세요. (예: 01012345678)');
      return;
    }

    if (fullName.length < 2 || fullName.length > 50) {
      Alert.alert('입력 오류', '이름은 2자 이상 50자 이하여야 합니다.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        '비밀번호 오류',
        '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('비밀번호 불일치', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      Alert.alert('약관 동의', '필수 약관에 동의해주세요.');
      return;
    }

    const age = calculateAge(birthDate);
    if (age < 18 || age > 120) {
      Alert.alert('나이 오류', '18세 이상 120세 이하만 가입할 수 있습니다.');
      return;
    }

    setLoading(true);
    try {
      console.log('[RegisterScreen] Starting registration process');

      const phoneExists = await authService.checkPhoneExists(phoneNumber);
      if (phoneExists) {
        Alert.alert('회원가입 실패', '이미 등록된 전화번호입니다.');
        setLoading(false);
        return;
      }

      const userId = await authService.register({
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
        age,
        gender,
      });

      console.log('[RegisterScreen] Registration successful! UserId:', userId);
      Alert.alert('회원가입 성공', '가입이 완료되었습니다. 로그인해주세요.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('회원가입 실패', error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>HeartCheck에 오신 것을 환영합니다</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
              8자 이상, 대소문자/숫자/특수문자 포함
            </Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}>
                <Icon
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>휴대폰</Text>
            <TextInput
              style={styles.input}
              placeholder="01012345678"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={formatPhoneNumber}
              maxLength={11}
              editable={!loading}
            />
          </View>

          {/* Birth Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={birthDate}
              onChangeText={setBirthDate}
              editable={!loading}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'MALE' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('MALE')}
                disabled={loading}>
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'MALE' && styles.genderButtonTextActive,
                  ]}>
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'FEMALE' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('FEMALE')}
                disabled={loading}>
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'FEMALE' && styles.genderButtonTextActive,
                  ]}>
                  여성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'OTHER' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('OTHER')}
                disabled={loading}>
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'OTHER' && styles.genderButtonTextActive,
                  ]}>
                  기타
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.termsRow}
              onPress={handleAgreeAll}
              disabled={loading}>
              <View style={[styles.checkbox, agreeAll && styles.checkboxChecked]}>
                {agreeAll && <Icon name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsTextBold}>전체 동의</Text>
            </TouchableOpacity>

            <View style={styles.termsDivider} />

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              disabled={loading}>
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Icon name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                [필수] 이용약관
                <Text style={styles.termsLink}> 보기</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreePrivacy(!agreePrivacy)}
              disabled={loading}>
              <View style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}>
                {agreePrivacy && <Icon name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                [필수] 개인정보 처리방침
                <Text style={styles.termsLink}> 보기</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreeMarketing(!agreeMarketing)}
              disabled={loading}>
              <View
                style={[styles.checkbox, agreeMarketing && styles.checkboxChecked]}>
                {agreeMarketing && <Icon name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                [선택] 마케팅 정보 수신
                <Text style={styles.termsLink}> 보기</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>회원가입</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.googleButton} disabled={loading}>
              <Icon name="logo-google" size={20} color="#000000" />
              <Text style={styles.googleButtonText}>Google로 가입</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.kakaoButton} disabled={loading}>
              <Text style={styles.kakaoButtonText}>Kakao로 가입</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}>
            <Text style={styles.loginText}>
              이미 계정이 있으신가요?{' '}
              <Text style={styles.loginLink}>로그인</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  termsText: {
    fontSize: 14,
    color: '#374151',
  },
  termsTextBold: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  termsLink: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  termsDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  registerButton: {
    height: 50,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#F87171',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  socialContainer: {
    marginBottom: 24,
  },
  googleButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 12,
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  kakaoButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 8,
  },
  kakaoButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default RegisterScreen;
