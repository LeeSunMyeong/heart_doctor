import {create} from 'zustand';
import {
  authService,
  handleApiError,
  UserInfo,
  UserRegistrationRequest,
} from '../api';
import {tokenStorage} from '../utils/storage';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistrationRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserInfo | null) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({isLoading: true, error: null});
    try {
      const response = await authService.login({email, password});
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData: UserRegistrationRequest) => {
    set({isLoading: true, error: null});
    try {
      await authService.register(userData);
      set({isLoading: false});
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({isLoading: true});
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({isLoading: false});
      throw error;
    }
  },

  setUser: (user: UserInfo | null) => {
    set({user, isAuthenticated: !!user});
  },

  clearError: () => {
    set({error: null});
  },

  checkAuthStatus: async () => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        set({
          user: null,
          isAuthenticated: false,
        });
        return;
      }

      // Token이 만료되지 않았으면 사용자 정보 조회
      if (!tokenStorage.isTokenExpired()) {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
        });
      } else {
        // Token 만료 시 로그아웃 처리
        tokenStorage.clearAll();
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      tokenStorage.clearAll();
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
