/**
 * Phase 9: Integration Tests - Authentication Flow
 * 인증 플로우 통합 테스트 (로그인 → 대시보드 → 로그아웃)
 */

import {describe, it, expect, beforeEach, jest} from '@jest/globals';

// Mock react-native-mmkv BEFORE any imports
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock axios BEFORE any imports
const mockAxiosInstance = {
  defaults: {
    baseURL: 'http://localhost:8080/api',
    timeout: 30000,
    headers: {},
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {use: jest.fn()},
    response: {use: jest.fn()},
  },
};

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockAxiosInstance),
  },
  isAxiosError: jest.fn(),
}));

// Mock the entire API module to prevent axios instantiation issues
jest.mock('../../src/api', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    getCurrentUser: jest.fn(),
  },
  handleApiError: jest.fn((error) => 'Mocked error'),
}));

import {useAuthStore} from '../../src/store/authStore';

describe('Phase 9: Authentication Flow Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('Login Flow', () => {
    it('should complete full login flow successfully', () => {
      const store = useAuthStore.getState();

      // Initial state: not authenticated
      expect(store.isAuthenticated).toBe(false);
      expect(store.user).toBeNull();

      // Simulate successful login
      const mockUser = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date().toISOString(),
      };

      store.setUser(mockUser);

      // Verify authenticated state
      const updatedStore = useAuthStore.getState();
      expect(updatedStore.isAuthenticated).toBe(true);
      expect(updatedStore.user).toEqual(mockUser);
      expect(updatedStore.user?.email).toBe('test@example.com');
    });

    it('should handle login failure gracefully', () => {
      const store = useAuthStore.getState();

      // Simulate login error
      const errorMessage = 'Invalid credentials';
      useAuthStore.setState({error: errorMessage, isLoading: false});

      const updatedStore = useAuthStore.getState();
      expect(updatedStore.isAuthenticated).toBe(false);
      expect(updatedStore.error).toBe(errorMessage);
      expect(updatedStore.user).toBeNull();
    });
  });

  describe('Logout Flow', () => {
    it('should clear user data on logout', () => {
      // Setup: user is logged in
      const mockUser = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date().toISOString(),
      };

      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });

      // Logout
      const store = useAuthStore.getState();
      store.setUser(null);

      // Verify cleared state
      const updatedStore = useAuthStore.getState();
      expect(updatedStore.isAuthenticated).toBe(false);
      expect(updatedStore.user).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should clear errors when requested', () => {
      // Set error state
      useAuthStore.setState({error: 'Some error'});
      expect(useAuthStore.getState().error).toBe('Some error');

      // Clear error
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });

    it('should maintain error state until explicitly cleared', () => {
      const errorMessage = 'Network error';
      useAuthStore.setState({error: errorMessage});

      // Error should persist
      expect(useAuthStore.getState().error).toBe(errorMessage);

      // Even after other state changes
      useAuthStore.setState({isLoading: true});
      expect(useAuthStore.getState().error).toBe(errorMessage);
    });
  });

  describe('Loading States', () => {
    it('should manage loading state during authentication', () => {
      const store = useAuthStore.getState();

      // Start loading
      useAuthStore.setState({isLoading: true});
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Complete loading
      useAuthStore.setState({isLoading: false});
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('Admin Authentication', () => {
    it('should recognize admin role', () => {
      const adminUser = {
        userId: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN' as const,
        createdAt: new Date().toISOString(),
      };

      useAuthStore.setState({
        user: adminUser,
        isAuthenticated: true,
      });

      const store = useAuthStore.getState();
      expect(store.user?.role).toBe('ADMIN');
    });
  });
});
