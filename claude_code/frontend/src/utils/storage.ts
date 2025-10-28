/**
 * MMKV Storage Utility
 * 토큰 및 민감한 데이터 저장을 위한 유틸리티
 */

import {MMKV} from 'react-native-mmkv';

// MMKV 인스턴스 생성
const storage = new MMKV({
  id: 'heart-check-storage',
  encryptionKey: 'heart-check-secure-key-2025', // 프로덕션에서는 환경변수로 관리
});

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  TOKEN_EXPIRY: 'token_expiry',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

/**
 * Token Storage
 */
export const tokenStorage = {
  /**
   * Access Token 저장
   */
  setAccessToken: (token: string): void => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Access Token 조회
   */
  getAccessToken: (): string | undefined => {
    return storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Refresh Token 저장
   */
  setRefreshToken: (token: string): void => {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Refresh Token 조회
   */
  getRefreshToken: (): string | undefined => {
    return storage.getString(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Token Expiry 저장 (Unix timestamp)
   */
  setTokenExpiry: (expiresIn: number): void => {
    const expiryTimestamp = Date.now() + expiresIn * 1000;
    storage.set(STORAGE_KEYS.TOKEN_EXPIRY, expiryTimestamp);
  },

  /**
   * Token 만료 여부 확인
   */
  isTokenExpired: (): boolean => {
    const expiry = storage.getNumber(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) {
      return true;
    }
    return Date.now() >= expiry;
  },

  /**
   * 모든 토큰 삭제
   */
  clearTokens: (): void => {
    storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
    storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
    storage.delete(STORAGE_KEYS.TOKEN_EXPIRY);
  },

  /**
   * User Info 저장
   */
  setUserInfo: (userInfo: object): void => {
    storage.set(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  },

  /**
   * User Info 조회
   */
  getUserInfo: <T>(): T | null => {
    const userInfoStr = storage.getString(STORAGE_KEYS.USER_INFO);
    if (!userInfoStr) {
      return null;
    }
    try {
      return JSON.parse(userInfoStr) as T;
    } catch (error) {
      console.error('Failed to parse user info:', error);
      return null;
    }
  },

  /**
   * User Info 삭제
   */
  clearUserInfo: (): void => {
    storage.delete(STORAGE_KEYS.USER_INFO);
  },

  /**
   * 모든 데이터 삭제 (로그아웃 시)
   */
  clearAll: (): void => {
    storage.clearAll();
  },
};

/**
 * App Settings Storage
 */
export const appStorage = {
  /**
   * 언어 설정 저장
   */
  setLanguage: (language: 'ko' | 'en'): void => {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * 언어 설정 조회
   */
  getLanguage: (): 'ko' | 'en' | undefined => {
    return storage.getString(STORAGE_KEYS.LANGUAGE) as 'ko' | 'en' | undefined;
  },

  /**
   * 테마 설정 저장
   */
  setTheme: (theme: 'light' | 'dark' | 'system'): void => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },

  /**
   * 테마 설정 조회
   */
  getTheme: (): 'light' | 'dark' | 'system' | undefined => {
    return storage.getString(STORAGE_KEYS.THEME) as
      | 'light'
      | 'dark'
      | 'system'
      | undefined;
  },
};

export default storage;
