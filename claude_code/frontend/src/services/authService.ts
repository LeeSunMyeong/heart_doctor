import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API 타입 정의
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface LoginResponse {
  user: UserInfo;
  tokens: TokenInfo;
}

export interface UserInfo {
  userId: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  userType: string;
  subscriptionStatus: string;
  remainingFreeTests?: number;
  dailyTestLimit?: number;
  subscriptionExpiry?: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// 간소화된 User 타입 (호환성)
export interface User {
  userId: number;
  email: string;
  userName: string;
  phone?: string;
  userType: string;
}

// 인증 서비스
class AuthService {
  /**
   * 로그인
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('[AuthService] Login request:', { phone: credentials.phone });
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('[AuthService] Login response:', response);

      if (response) {
        // 토큰 및 사용자 정보 저장
        await AsyncStorage.setItem('accessToken', response.tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', response.tokens.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));

        console.log('[AuthService] Login successful, tokens saved');
        return response;
      }

      throw new Error('로그인에 실패했습니다.');
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
      if (error.response?.status === 401) {
        throw new Error('휴대폰 번호 또는 비밀번호가 잘못되었습니다.');
      }
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  }

  /**
   * 회원가입
   */
  async register(userData: RegisterRequest): Promise<number> {
    try {
      console.log('[AuthService] Register request:', userData);

      // 비밀번호 확인
      if (userData.password !== userData.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      const response = await api.post<{success: boolean; data: number; message: string}>(
        '/auth/register',
        userData
      );
      console.log('[AuthService] Register response:', response);

      if (response.success && response.data) {
        console.log('[AuthService] Registration successful, userId:', response.data);
        return response.data;
      }

      throw new Error(response.message || '회원가입에 실패했습니다.');
    } catch (error: any) {
      console.error('[AuthService] Register error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  }

  /**
   * 전화번호 중복 체크
   */
  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      console.log('[AuthService] Checking phone exists:', phone);
      const response = await api.get<{success: boolean; data: boolean; message: string}>(
        `/auth/check-phone/${phone}`
      );
      console.log('[AuthService] Phone check response:', response);

      if (response.success) {
        return response.data;
      }

      return false;
    } catch (error: any) {
      console.error('[AuthService] Phone check error:', error);
      return false;
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청
      await api.post('/auth/logout', {});

      // 로컬 토큰 및 사용자 정보 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      console.log('[AuthService] Logout successful');
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      // 에러가 발생해도 로컬 데이터는 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString) as UserInfo;
      }
      return null;
    } catch (error) {
      console.error('[AuthService] Get current user error:', error);
      return null;
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await api.post<LoginResponse>(
        '/auth/refresh',
        {},
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        }
      );

      if (response) {
        // 새 토큰 저장
        await AsyncStorage.setItem('accessToken', response.tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', response.tokens.refreshToken);
        console.log('[AuthService] Token refresh successful');

        return response;
      }

      throw new Error('토큰 갱신에 실패했습니다.');
    } catch (error: any) {
      console.error('[AuthService] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * 인증 상태 확인
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * 액세스 토큰 가져오기
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('[AuthService] Get access token error:', error);
      return null;
    }
  }

  /**
   * 현재 사용자 정보 확인 (서버)
   */
  async me(): Promise<string> {
    try {
      const response = await api.get<{success: boolean; data: string; message: string}>('/auth/me');

      if (response.success) {
        return response.data;
      }

      throw new Error('사용자 정보를 가져올 수 없습니다.');
    } catch (error: any) {
      console.error('[AuthService] Me error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
