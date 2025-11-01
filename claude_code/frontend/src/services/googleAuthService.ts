import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import axios from 'axios';
import { getBaseUrl } from './config';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

// Google Sign-In 초기화 설정
const WEB_CLIENT_ID = GOOGLE_WEB_CLIENT_ID || '';
const IOS_CLIENT_ID = GOOGLE_IOS_CLIENT_ID || '';

export const configureGoogleSignIn = () => {
  try {
    console.log('[GoogleAuth] Configuration starting...');
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    console.log('[GoogleAuth] Configuration successful');
  } catch (error) {
    console.error('[GoogleAuth] Configuration error:', error);
    // Native module may not be available yet, will retry on actual sign-in
  }
};

export interface GoogleLoginResponse {
  user: {
    userId: number;
    userName: string;
    phone: string;
    role: string;
    provider: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

export const googleAuthService = {
  /**
   * Google 로그인
   */
  async signIn(): Promise<GoogleLoginResponse> {
    try {
      // Google Sign-In 진행 (already configured in App.tsx on startup)
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      console.log('[GoogleAuth] Sign-In successful');

      // Google Sign-In 라이브러리는 {type: 'success', data: {...}} 구조로 반환
      const userInfo = (signInResult as any).type === 'success'
        ? (signInResult as any).data
        : signInResult;

      console.log('[GoogleAuth] idToken exists:', !!userInfo.idToken);
      console.log('[GoogleAuth] User info received:', {
        email: userInfo.user?.email ? '***@***' : 'N/A',
        name: userInfo.user?.name ? '***' : 'N/A',
      });

      if (!userInfo.idToken) {
        console.error('[GoogleAuth] ERROR: idToken is null or undefined!');
        throw new Error('Google Sign-In did not return an ID token. Please check your Google OAuth configuration.');
      }

      // ID Token을 백엔드로 전송
      console.log('[GoogleAuth] Sending request to backend with idToken');
      const response = await axios.post<{
        success: boolean;
        data: GoogleLoginResponse;
        message: string;
      }>(`${getBaseUrl()}/api/auth/google`, {
        idToken: userInfo.idToken,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Google login failed');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('[GoogleAuth] Sign-In error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('로그인이 취소되었습니다.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('이미 로그인 진행 중입니다.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services가 필요합니다.');
      } else {
        throw new Error(error.message || 'Google 로그인에 실패했습니다.');
      }
    }
  },

  /**
   * Google 로그아웃
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('[GoogleAuth] Sign-Out successful');
    } catch (error) {
      console.error('[GoogleAuth] Sign-Out error:', error);
    }
  },

  /**
   * Google 계정 연결 해제
   */
  async revokeAccess(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
      console.log('[GoogleAuth] Access revoked');
    } catch (error) {
      console.error('[GoogleAuth] Revoke access error:', error);
    }
  },

  /**
   * 현재 로그인된 사용자 정보 가져오기
   */
  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error) {
      console.error('[GoogleAuth] Get current user error:', error);
      return null;
    }
  },

  /**
   * 로그인 상태 확인
   */
  async isSignedIn(): Promise<boolean> {
    return await GoogleSignin.isSignedIn();
  },
};
