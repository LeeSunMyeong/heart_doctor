import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { authService } from '../../services/authService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [loading, setLoading] = useState(false);

  // 전화번호 포맷팅
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhoneNumber(cleaned);
    }
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,}$/;
    return passwordRegex.test(password);
  };

  // 회원가입 처리
  const handleRegister = async () => {
    // 입력 검증
    if (!email || !password || !confirmPassword || !fullName || !phoneNumber || !age) {
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

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      Alert.alert('나이 오류', '18세 이상 120세 이하만 가입할 수 있습니다.');
      return;
    }

    setLoading(true);
    try {
      console.log('[RegisterScreen] Starting registration process');
      console.log('[RegisterScreen] Checking phone:', phoneNumber);

      // 전화번호 중복 체크
      const phoneExists = await authService.checkPhoneExists(phoneNumber);
      console.log('[RegisterScreen] Phone exists result:', phoneExists);

      if (phoneExists) {
        Alert.alert('회원가입 실패', '이미 등록된 전화번호입니다.');
        setLoading(false);
        return;
      }

      console.log('[RegisterScreen] Starting registration with data:', {
        email, fullName, phoneNumber, age: ageNum, gender
      });

      // 회원가입 요청
      const userId = await authService.register({
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
        age: ageNum,
        gender,
      });

      console.log('[RegisterScreen] Registration successful! UserId:', userId);

      console.log('Registration successful, userId:', userId);
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
        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>HeartCheck에 오신 것을 환영합니다</Text>
        </View>

        <View style={styles.form}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>전화번호</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>나이</Text>
            <TextInput
              style={styles.input}
              placeholder="18세 이상"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              maxLength={3}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'MALE' && styles.genderButtonActive]}
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
                style={[styles.genderButton, gender === 'FEMALE' && styles.genderButtonActive]}
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
                style={[styles.genderButton, gender === 'OTHER' && styles.genderButtonActive]}
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

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerButtonText}>가입하기</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}>
            <Text style={styles.loginButtonText}>이미 계정이 있으신가요? 로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
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
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
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
    borderColor: '#d1d5db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  genderButtonActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  genderButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  registerButton: {
    height: 50,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#f87171',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default RegisterScreen;
