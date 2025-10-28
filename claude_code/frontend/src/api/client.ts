/**
 * Axios API Client
 * 백엔드 API와 통신하기 위한 Axios 인스턴스 및 인터셉터
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {tokenStorage} from '../utils/storage';
import {ApiResponse} from './types';

/**
 * API Base URL
 * 개발/프로덕션 환경에 따라 변경
 */
const API_BASE_URL =
  __DEV__ && process.env.API_URL
    ? process.env.API_URL
    : 'http://localhost:8080/api';

/**
 * Axios Instance 생성
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * 요청 전에 Access Token 자동 삽입
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 로깅 (개발 환경)
    if (__DEV__) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * 응답 처리 및 에러 핸들링
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 응답 로깅 (개발 환경)
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 에러 로깅
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error,
    });

    // 401 Unauthorized - Token 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 Access Token 갱신
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          // Refresh Token이 없으면 로그아웃 처리
          tokenStorage.clearAll();
          throw new Error('No refresh token available');
        }

        // Token Refresh API 호출
        const refreshResponse = await axios.post<ApiResponse<{
          accessToken: string;
          refreshToken: string;
          tokenType: string;
          expiresIn: number;
        }>>(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        if (refreshResponse.data.success) {
          const {accessToken, refreshToken: newRefreshToken, expiresIn} =
            refreshResponse.data.data;

          // 새 토큰 저장
          tokenStorage.setAccessToken(accessToken);
          tokenStorage.setRefreshToken(newRefreshToken);
          tokenStorage.setTokenExpiry(expiresIn);

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh 실패 - 로그아웃 처리
        console.error('Token refresh failed:', refreshError);
        tokenStorage.clearAll();
        return Promise.reject(refreshError);
      }
    }

    // 403 Forbidden - 권한 없음
    if (error.response?.status === 403) {
      console.error('Access Denied:', error.response.data?.message);
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data?.message);
    }

    return Promise.reject(error);
  },
);

/**
 * API Error Handler
 * AxiosError를 사용자 친화적인 에러 메시지로 변환
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;

    // 백엔드 에러 메시지
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    // HTTP 상태 코드별 메시지
    switch (axiosError.response?.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return axiosError.message || 'An error occurred.';
    }
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    return error.message;
  }

  // 알 수 없는 에러
  return 'An unknown error occurred.';
};

/**
 * API Response Success Check
 */
export const isApiSuccess = <T>(
  response: AxiosResponse<ApiResponse<T>>,
): boolean => {
  return response.data.success;
};

/**
 * API Response Data Extraction
 */
export const getApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data.data;
};

export default apiClient;
