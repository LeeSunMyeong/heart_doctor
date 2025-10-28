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

type RootStackParamList = {
  Login: undefined;
  FindAccount: undefined;
};

type FindAccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindAccount'>;

type TabType = 'findId' | 'resetPassword';

export const FindAccountScreen = () => {
  const navigation = useNavigation<FindAccountScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('findId');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
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

  const handleFindId = async () => {
    if (!phone) {
      Alert.alert('입력 오류', '휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!isVerificationSent) {
      Alert.alert('인증 필요', '휴대폰 인증을 완료해주세요.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement find ID API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('아이디 찾기 완료', '등록된 아이디: user123');
    } catch (error: any) {
      Alert.alert('아이디 찾기 실패', error.message || '아이디를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userId || !phone) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (!isVerificationSent) {
      Alert.alert('인증 필요', '휴대폰 인증을 완료해주세요.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password reset API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('비밀번호 재설정', '비밀번호 재설정 링크가 발송되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('비밀번호 재설정 실패', error.message || '비밀번호를 재설정할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = activeTab === 'findId'
    ? phone && isVerificationSent
    : userId && phone && isVerificationSent;

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
        <Text style={styles.headerTitle}>계정 복구</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'findId' && styles.tabActive]}
          onPress={() => {
            setActiveTab('findId');
            setPhone('');
            setUserId('');
            setIsVerificationSent(false);
          }}
          disabled={loading}>
          <Text style={[styles.tabText, activeTab === 'findId' && styles.tabTextActive]}>
            아이디 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resetPassword' && styles.tabActive]}
          onPress={() => {
            setActiveTab('resetPassword');
            setPhone('');
            setUserId('');
            setIsVerificationSent(false);
          }}
          disabled={loading}>
          <Text style={[styles.tabText, activeTab === 'resetPassword' && styles.tabTextActive]}>
            비밀번호 재설정
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {activeTab === 'findId' ? (
          // Find ID Tab Content
          <>
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

            {/* Find ID Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                isFormValid && styles.actionButtonActive,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleFindId}
              disabled={!isFormValid || loading}>
              {loading ? (
                <ActivityIndicator color={isFormValid ? '#FFFFFF' : '#C7C7CD'} />
              ) : (
                <Text
                  style={[
                    styles.actionButtonText,
                    isFormValid && styles.actionButtonTextActive,
                  ]}>
                  아이디 찾기
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Reset Password Tab Content
          <>
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

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                isFormValid && styles.actionButtonActive,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={!isFormValid || loading}>
              {loading ? (
                <ActivityIndicator color={isFormValid ? '#FFFFFF' : '#C7C7CD'} />
              ) : (
                <Text
                  style={[
                    styles.actionButtonText,
                    isFormValid && styles.actionButtonTextActive,
                  ]}>
                  비밀번호 재설정
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
    marginBottom: 20,
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
  actionButton: {
    height: 52,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonActive: {
    backgroundColor: '#000000',
  },
  actionButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default FindAccountScreen;
