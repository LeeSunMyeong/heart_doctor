import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Base URL - 개발/프로덕션 환경에 따라 변경
// iOS 시뮬레이터: localhost, Android 에뮬레이터: 10.0.2.2, 실제 기기: Mac IP
const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://192.168.45.204:8080/api'
  : 'https://api.heartcheck.com/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 토큰 갱신 및 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 성공 응답 처리
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401 Unauthorized - 토큰 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 토큰 갱신 요청
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Backend returns ApiResponse<LoginResponse> structure
        const loginResponse = response.data.data;
        const { accessToken, refreshToken: newRefreshToken } = loginResponse.tokens;

        // 새 토큰 저장
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 - 로그아웃 처리
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // 로그인 화면으로 리다이렉트 (Navigation에서 처리)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Response 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API 클래스
class API {
  // GET 요청
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST 요청
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT 요청
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE 요청
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH 요청
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // 에러 처리
  private handleError(error: any): Error {
    console.log('[API] Error occurred:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;

      if (axiosError.response) {
        // 서버 응답 에러
        console.log('[API] Server error response:', axiosError.response.data);
        console.log('[API] Status code:', axiosError.response.status);

        const errorData = axiosError.response.data;
        const message = errorData?.error || errorData?.message || '서버 오류가 발생했습니다.';

        console.log('[API] Error message:', message);
        return new Error(message);
      } else if (axiosError.request) {
        // 요청은 보냈지만 응답을 받지 못함
        console.log('[API] No response received from server');
        return new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      }
    }

    // 기타 에러
    console.log('[API] Unknown error:', error);
    return new Error(error.message || '알 수 없는 오류가 발생했습니다.');
  }
}

export const api = new API();
export default apiClient;
