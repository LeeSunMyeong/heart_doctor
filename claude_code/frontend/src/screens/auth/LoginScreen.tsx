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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authService } from '../../services/authService';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  FindAccount: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('입력 오류', '휴대폰 번호와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ phone, password });
      console.log('[LoginScreen] Login successful:', response.user);
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('준비 중', `${provider} 로그인 기능은 준비 중입니다.`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>logo</Text>
        </View>

        {/* Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="휴대폰 번호 (숫자만 11자리)"
          placeholderTextColor="#C7C7CD"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
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

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}>
          <Text style={styles.registerButtonText}>회원가입</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는 소셜 계정으로 로그인</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Kakao Login */}
        <TouchableOpacity
          style={styles.kakaoButton}
          onPress={() => handleSocialLogin('카카오')}
          disabled={loading}>
          <Icon name="comment-processing" size={20} color="#000000" />
          <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
        </TouchableOpacity>

        {/* Google Login */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => handleSocialLogin('구글')}
          disabled={loading}>
          <Icon name="google" size={20} color="#000000" />
          <Text style={styles.googleButtonText}>구글로 로그인</Text>
        </TouchableOpacity>

        {/* Apple Login */}
        <TouchableOpacity
          style={styles.appleButton}
          onPress={() => handleSocialLogin('Apple')}
          disabled={loading}>
          <Icon name="apple" size={20} color="#FFFFFF" />
          <Text style={styles.appleButtonText}>Apple로 로그인</Text>
        </TouchableOpacity>

        {/* Find Account Link */}
        <TouchableOpacity
          style={styles.findAccountContainer}
          onPress={() => navigation.navigate('FindAccount')}
          disabled={loading}>
          <Text style={styles.findAccountText}>아이디/비밀번호 찾기</Text>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000000',
    fontStyle: 'italic',
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
  loginButton: {
    height: 52,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#8E8E93',
  },
  kakaoButton: {
    height: 52,
    backgroundColor: '#FEE500',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kakaoButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  googleButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appleButton: {
    height: 52,
    backgroundColor: '#000000',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  findAccountContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  findAccountText: {
    fontSize: 14,
    color: '#8E8E93',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
