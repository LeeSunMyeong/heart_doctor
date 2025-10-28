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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerifyPhone = async () => {
    if (!phone) {
      Alert.alert('입력 오류', '휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement phone verification API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsVerificationSent(true);
      Alert.alert('인증번호 발송', '인증번호가 발송되었습니다.');
    } catch (error: any) {
      Alert.alert('발송 실패', error.message || '인증번호 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !userId || !password) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (!isVerificationSent) {
      Alert.alert('인증 필요', '휴대폰 인증을 완료해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name,
        phone,
        userId,
        password,
      });
      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name && phone && userId && password && isVerificationSent;

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

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#C7C7CD"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        {/* Phone Input with Verification Button */}
        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.phoneInput}
            placeholder="휴대폰 번호"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
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

        {/* ID Input */}
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#C7C7CD"
          value={userId}
          onChangeText={setUserId}
          editable={!loading}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
});

export default RegisterScreen;
