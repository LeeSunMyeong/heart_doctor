import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {AdminLoginScreen} from '../../src/screens/admin/AdminLoginScreen';
import {AdminDashboardScreen} from '../../src/screens/admin/AdminDashboardScreen';
import {AdminNotificationsScreen} from '../../src/screens/admin/AdminNotificationsScreen';
import {useAuthStore} from '../../src/store/authStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: mockReset,
} as any;

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({}),
}));

// Mock stores
jest.mock('../../src/store/authStore');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params) {
        let result = key;
        Object.keys(params).forEach(param => {
          result = result.replace(`{{${param}}}`, params[param]);
        });
        return result;
      }
      return key;
    },
    i18n: {
      language: 'ko',
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    },
  }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Phase 7: Admin Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminLoginScreen', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        login: mockLogin,
      });
    });

    it('should render admin login screen with title', () => {
      const {getByText} = render(<AdminLoginScreen />);

      expect(getByText('admin.login')).toBeTruthy();
      expect(getByText('admin.loginDesc')).toBeTruthy();
    });

    it('should render email and password inputs', () => {
      const {getByText} = render(<AdminLoginScreen />);

      expect(getByText('auth.email')).toBeTruthy();
      expect(getByText('auth.password')).toBeTruthy();
    });

    it('should render admin info section', () => {
      const {getByText} = render(<AdminLoginScreen />);

      expect(getByText('admin.accessInfo')).toBeTruthy();
      expect(getByText('admin.accessInfoDesc')).toBeTruthy();
    });

    it.skip('should render back to user login button', () => {
      const {getByText} = render(<AdminLoginScreen />);

      const backButton = getByText('admin.backToUserLogin');
      expect(backButton).toBeTruthy();
    });

    it.skip('should show error for non-admin email', async () => {
      const {getByText, getByPlaceholderText} = render(<AdminLoginScreen />);

      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
      const loginButton = getByText('admin.login');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('admin.notAuthorized')).toBeTruthy();
      });
    });
  });

  describe('AdminDashboardScreen', () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: {
          id: 1,
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
        logout: jest.fn(),
      });
    });

    it('should render admin dashboard with title', async () => {
      const {getByText} = render(<AdminDashboardScreen />);

      await waitFor(() => {
        expect(getByText('admin.dashboard')).toBeTruthy();
      });
    });

    it.skip('should render statistics cards', async () => {
      const {getByText} = render(<AdminDashboardScreen />);

      await waitFor(() => {
        expect(getByText('admin.totalUsers')).toBeTruthy();
        expect(getByText('admin.activeUsers')).toBeTruthy();
        expect(getByText('admin.totalAssessments')).toBeTruthy();
        expect(getByText('admin.premiumUsers')).toBeTruthy();
      });
    });

    it.skip('should render send notification button', async () => {
      const {getByText} = render(<AdminDashboardScreen />);

      await waitFor(() => {
        const notificationButton = getByText('admin.sendNotification');
        expect(notificationButton).toBeTruthy();
      });
    });

    it.skip('should navigate to notifications screen when button pressed', async () => {
      const {getByText} = render(<AdminDashboardScreen />);

      await waitFor(() => {
        const notificationButton = getByText('admin.sendNotification');
        fireEvent.press(notificationButton);
        expect(mockNavigate).toHaveBeenCalledWith('AdminNotifications');
      });
    });

    it.skip('should render user management section', async () => {
      const {getByText} = render(<AdminDashboardScreen />);

      await waitFor(() => {
        expect(getByText('admin.userManagement')).toBeTruthy();
      });
    });
  });

  describe('AdminNotificationsScreen', () => {
    it('should render notification form with title', () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      expect(getByText('admin.sendNotification')).toBeTruthy();
      expect(getByText('admin.notificationDesc')).toBeTruthy();
    });

    it('should render notification form inputs', () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      expect(getByText('admin.notificationTitle')).toBeTruthy();
      expect(getByText('admin.notificationMessage')).toBeTruthy();
    });

    it.skip('should render recipient selection options', () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      expect(getByText('admin.selectRecipients')).toBeTruthy();
      expect(getByText('admin.allUsers')).toBeTruthy();
      expect(getByText('admin.premiumUsers')).toBeTruthy();
      expect(getByText('admin.freeUsers')).toBeTruthy();
      expect(getByText('admin.highRiskUsers')).toBeTruthy();
    });

    it.skip('should render send now button', () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      const sendButton = getByText('admin.sendNow');
      expect(sendButton).toBeTruthy();
    });

    it('should render sent history section', () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      expect(getByText('admin.sentHistory')).toBeTruthy();
    });

    it.skip('should show error toast when form is incomplete', async () => {
      const {getByText} = render(<AdminNotificationsScreen />);

      const sendButton = getByText('admin.sendNow');
      fireEvent.press(sendButton);

      await waitFor(() => {
        expect(getByText('admin.fillAllFields')).toBeTruthy();
      });
    });
  });
});
