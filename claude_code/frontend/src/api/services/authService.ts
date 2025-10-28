/**
 * Authentication Service
 * 사용자 인증 관련 API
 */

import apiClient, {getApiData} from '../client';
import {
  LoginRequest,
  LoginResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,
  PasswordResetRequest,
  ApiResponse,
} from '../types';
import {tokenStorage} from '../../utils/storage';

/**
 * 로그인
 */
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    credentials,
  );

  const data = getApiData(response);

  // 토큰 저장
  if (data.tokens) {
    tokenStorage.setAccessToken(data.tokens.accessToken);
    tokenStorage.setRefreshToken(data.tokens.refreshToken);
    tokenStorage.setTokenExpiry(data.tokens.expiresIn);
    tokenStorage.setUserInfo(data.user);
  }

  return data;
};

/**
 * 회원가입
 */
export const register = async (
  userData: UserRegistrationRequest,
): Promise<UserRegistrationResponse> => {
  const response = await apiClient.post<
    ApiResponse<UserRegistrationResponse>
  >('/auth/register', userData);

  return getApiData(response);
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<void>>('/auth/logout');
  } finally {
    // 로컬 토큰 삭제
    tokenStorage.clearAll();
  }
};

/**
 * 비밀번호 재설정 요청
 */
export const requestPasswordReset = async (
  request: PasswordResetRequest,
): Promise<void> => {
  const response = await apiClient.post<ApiResponse<void>>(
    '/auth/password-reset',
    request,
  );

  getApiData(response);
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> => {
  const refreshTokenValue = tokenStorage.getRefreshToken();

  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.post<ApiResponse<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }>>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });

  const data = getApiData(response);

  // 새 토큰 저장
  tokenStorage.setAccessToken(data.accessToken);
  tokenStorage.setRefreshToken(data.refreshToken);
  tokenStorage.setTokenExpiry(data.expiresIn);

  return data;
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<LoginResponse['user']> => {
  const response = await apiClient.get<ApiResponse<LoginResponse['user']>>(
    '/auth/me',
  );

  const data = getApiData(response);

  // 사용자 정보 저장
  tokenStorage.setUserInfo(data);

  return data;
};

/**
 * 이메일 중복 확인
 */
export const checkEmailAvailability = async (
  email: string,
): Promise<{available: boolean}> => {
  const response = await apiClient.get<ApiResponse<{available: boolean}>>(
    `/auth/check-email?email=${encodeURIComponent(email)}`,
  );

  return getApiData(response);
};

export default {
  login,
  register,
  logout,
  requestPasswordReset,
  refreshToken,
  getCurrentUser,
  checkEmailAvailability,
};
