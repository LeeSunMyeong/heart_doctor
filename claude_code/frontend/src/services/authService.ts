import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 인증 관련 타입 정의
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
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  userId: number;
  email?: string;
  userName: string;
  phone: string;
  userDob: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

// 인증 서비스
class AuthService {
  /**
   * 로그인
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);

      if (response.success && response.data) {
        // 토큰 및 사용자 정보 저장
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
      }

      throw new Error(response.message || '로그인에 실패했습니다.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * 회원가입
   */
  async register(userData: RegisterRequest): Promise<number> {
    try {
      console.log(`[AuthService] Register request:`, userData);
      const response = await api.post<number>('/auth/register', userData);
      console.log(`[AuthService] Register response:`, response);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || '회원가입에 실패했습니다.');
    } catch (error) {
      console.error(`[AuthService] Register error:`, error);
      throw error;
    }
  }

  /**
   * 전화번호 중복 체크
   */
  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      console.log(`[AuthService] Checking phone exists: ${phone}`);
      const response = await api.get<boolean>(`/auth/check-phone/${phone}`);
      console.log(`[AuthService] Phone check response:`, response);

      if (response.success && response.data !== undefined) {
        return response.data;
      }

      return false;
    } catch (error) {
      console.error(`[AuthService] Phone check error:`, error);
      throw error;
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청 (선택사항)
      // await api.post('/auth/logout');

      // 로컬 토큰 및 사용자 정보 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로컬 데이터는 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString) as User;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * 이메일 찾기
   */
  async findEmail(userName: string, phone: string): Promise<string> {
    try {
      const response = await api.post<{ email: string }>('/auth/find-email', {
        userName,
        phone,
      });

      if (response.success && response.data) {
        return response.data.email;
      }

      throw new Error(response.message || '이메일을 찾을 수 없습니다.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * 비밀번호 재설정 요청
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await api.post('/auth/password-reset/request', { email });

      if (!response.success) {
        throw new Error(response.message || '비밀번호 재설정 요청에 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 비밀번호 재설정
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post('/auth/password-reset/confirm', {
        token,
        newPassword,
      });

      if (!response.success) {
        throw new Error(response.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data) {
        // 새 토큰 저장
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

        return response.data;
      }

      throw new Error(response.message || '토큰 갱신에 실패했습니다.');
    } catch (error) {
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
}

export const authService = new AuthService();
export default authService;
