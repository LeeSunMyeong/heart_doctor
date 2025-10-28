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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerifyPhone = async () => {
    if (!phoneNumber) {
      Alert.alert('입력 오류', '휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const exists = await authService.checkPhoneExists(phoneNumber);
      if (exists) {
        Alert.alert('중복 확인', '이미 사용 중인 휴대폰 번호입니다.');
        return;
      }
      setIsVerificationSent(true);
      Alert.alert('인증 완료', '사용 가능한 휴대폰 번호입니다.');
    } catch (error: any) {
      Alert.alert('확인 실패', error.message || '휴대폰 번호 확인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (pwd: string): boolean => {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName || !phoneNumber || !age) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (!isVerificationSent) {
      Alert.alert('인증 필요', '휴대폰 인증을 완료해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        '비밀번호 형식 오류',
        '비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
      );
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      Alert.alert('나이 오류', '나이는 18세 이상 120세 이하여야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const userId = await authService.register({
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
        age: ageNum,
        gender,
      });
      console.log('[RegisterScreen] Registration successful, userId:', userId);
      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && confirmPassword && fullName && phoneNumber && age && isVerificationSent;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#C7C7CD"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          autoCapitalize="none"
        />

        {/* Full Name Input */}
        <TextInput
          style={styles.input}
          placeholder="이름 (2-50자)"
          placeholderTextColor="#C7C7CD"
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        {/* Phone Input with Verification Button */}
        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.phoneInput}
            placeholder="휴대폰 번호 (01012345678)"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!loading && !isVerificationSent}
          />
          <TouchableOpacity
            style={[
              styles.verifyButton,
              isVerificationSent && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyPhone}
            disabled={loading || isVerificationSent}>
            <Text style={styles.verifyButtonText}>
              {isVerificationSent ? '인증완료' : '인증하기'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Age Input */}
        <TextInput
          style={styles.input}
          placeholder="나이 (18-120)"
          placeholderTextColor="#C7C7CD"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          editable={!loading}
        />

        {/* Gender Selector */}
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>성별</Text>
          <View style={styles.genderButtons}>
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

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호 (8자 이상, 대소문자, 숫자, 특수문자 포함)"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          autoCapitalize="none"
        />

        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          autoCapitalize="none"
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            isFormValid && styles.registerButtonActive,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!isFormValid || loading}>
          {loading ? (
            <ActivityIndicator color={isFormValid ? '#FFFFFF' : '#C7C7CD'} />
          ) : (
            <Text
              style={[
                styles.registerButtonText,
                isFormValid && styles.registerButtonTextActive,
              ]}>
              회원가입
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    color: '#000000',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    color: '#000000',
  },
  verifyButton: {
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  registerButton: {
    height: 52,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonActive: {
    backgroundColor: '#000000',
  },
  registerButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  genderContainer: {
    marginBottom: 12,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default RegisterScreen;
