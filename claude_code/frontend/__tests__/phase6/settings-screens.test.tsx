import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {SettingsScreen} from '../../src/screens/settings/SettingsScreen';
import {ThemeSettingsScreen} from '../../src/screens/settings/ThemeSettingsScreen';
import {LanguageSettingsScreen} from '../../src/screens/settings/LanguageSettingsScreen';
import {NotificationSettingsScreen} from '../../src/screens/settings/NotificationSettingsScreen';
import {InputMethodSettingsScreen} from '../../src/screens/settings/InputMethodSettingsScreen';
import {UsageLimitScreen} from '../../src/screens/settings/UsageLimitScreen';
import {useAuthStore} from '../../src/store/authStore';
import {useSettingsStore} from '../../src/store/settingsStore';
import {useSubscriptionStore} from '../../src/store/subscriptionStore';

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
jest.mock('../../src/store/settingsStore');
jest.mock('../../src/store/subscriptionStore');

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

describe('Phase 6: Settings Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SettingsScreen', () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        },
        logout: jest.fn(),
      });

      (useSettingsStore as unknown as jest.Mock).mockReturnValue({
        settings: {
          id: 1,
          darkMode: false,
          language: 'ko',
          pushNotification: true,
          emailNotification: true,
          marketingNotification: false,
        },
        setSettings: jest.fn(),
      });
    });

    it('should render settings screen with title', async () => {
      const {getByText} = render(<SettingsScreen />);

      await waitFor(() => {
        expect(getByText('settings.title')).toBeTruthy();
        expect(getByText('settings.subtitle')).toBeTruthy();
      });
    });

    it('should render user profile section', async () => {
      const {getByText} = render(<SettingsScreen />);

      await waitFor(() => {
        expect(getByText('Test User')).toBeTruthy();
        expect(getByText('test@example.com')).toBeTruthy();
      });
    });

    it('should render settings menu items', async () => {
      const {getByText} = render(<SettingsScreen />);

      await waitFor(() => {
        expect(getByText('settings.theme')).toBeTruthy();
        expect(getByText('settings.language')).toBeTruthy();
        expect(getByText('settings.notifications')).toBeTruthy();
        expect(getByText('settings.inputMethod')).toBeTruthy();
        expect(getByText('settings.usageLimit')).toBeTruthy();
      });
    });

    it.skip('should show logout confirmation when logout button is pressed', async () => {
      const {getByText} = render(<SettingsScreen />);

      await waitFor(() => {
        const logoutButton = getByText('auth.logout');
        fireEvent.press(logoutButton);
      });

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('ThemeSettingsScreen', () => {
    beforeEach(() => {
      (useSettingsStore as unknown as jest.Mock).mockReturnValue({
        settings: {
          darkMode: false,
        },
        toggleDarkMode: jest.fn(),
      });
    });

    it('should render theme settings screen with title', () => {
      const {getByText} = render(<ThemeSettingsScreen />);

      expect(getByText('settings.theme')).toBeTruthy();
      expect(getByText('settings.themeDesc')).toBeTruthy();
    });

    it('should render theme options', () => {
      const {getByText} = render(<ThemeSettingsScreen />);

      expect(getByText('settings.themeOptions.light')).toBeTruthy();
      expect(getByText('settings.themeOptions.dark')).toBeTruthy();
      expect(getByText('settings.themeOptions.system')).toBeTruthy();
    });

    it('should show preview section', () => {
      const {getByText} = render(<ThemeSettingsScreen />);

      expect(getByText('settings.preview')).toBeTruthy();
      expect(getByText('settings.previewSample')).toBeTruthy();
    });
  });

  describe('LanguageSettingsScreen', () => {
    beforeEach(() => {
      (useSettingsStore as unknown as jest.Mock).mockReturnValue({
        settings: {
          language: 'ko',
        },
        setLanguage: jest.fn(),
      });
    });

    it('should render language settings screen with title', () => {
      const {getByText} = render(<LanguageSettingsScreen />);

      expect(getByText('settings.language')).toBeTruthy();
      expect(getByText('settings.languageDesc')).toBeTruthy();
    });

    it.skip('should render language options', () => {
      const {getByText} = render(<LanguageSettingsScreen />);

      expect(getByText('한국어')).toBeTruthy();
      expect(getByText('English')).toBeTruthy();
    });

    it('should show info section', () => {
      const {getByText} = render(<LanguageSettingsScreen />);

      expect(getByText('settings.languageInfo')).toBeTruthy();
    });
  });

  describe('NotificationSettingsScreen', () => {
    beforeEach(() => {
      (useSettingsStore as unknown as jest.Mock).mockReturnValue({
        settings: {
          pushNotification: true,
          emailNotification: true,
          marketingNotification: false,
        },
        togglePushNotification: jest.fn(),
        updateSettings: jest.fn(),
      });
    });

    it('should render notification settings screen with title', () => {
      const {getByText} = render(<NotificationSettingsScreen />);

      expect(getByText('settings.notifications')).toBeTruthy();
      expect(getByText('settings.notificationsDesc')).toBeTruthy();
    });

    it('should render notification toggle switches', () => {
      const {getByText} = render(<NotificationSettingsScreen />);

      expect(getByText('settings.pushNotifications')).toBeTruthy();
      expect(getByText('settings.emailNotifications')).toBeTruthy();
      expect(getByText('settings.marketingNotifications')).toBeTruthy();
    });

    it('should show notification info section', () => {
      const {getByText} = render(<NotificationSettingsScreen />);

      expect(getByText('settings.notificationInfo')).toBeTruthy();
      expect(getByText('settings.notificationInfoDesc')).toBeTruthy();
    });
  });

  describe('InputMethodSettingsScreen', () => {
    it('should render input method settings screen with title', () => {
      const {getByText} = render(<InputMethodSettingsScreen />);

      expect(getByText('settings.inputMethod')).toBeTruthy();
      expect(getByText('settings.inputMethodDesc')).toBeTruthy();
    });

    it('should render input method options', () => {
      const {getByText} = render(<InputMethodSettingsScreen />);

      expect(getByText('settings.inputMethodOptions.manual')).toBeTruthy();
      expect(getByText('settings.inputMethodOptions.voice')).toBeTruthy();
      expect(getByText('settings.inputMethodOptions.camera')).toBeTruthy();
    });

    it.skip('should show feature status section', () => {
      const {getByText} = render(<InputMethodSettingsScreen />);

      expect(getByText('settings.featureStatus')).toBeTruthy();
      expect(getByText('settings.available')).toBeTruthy();
      expect(getByText('settings.comingSoon')).toBeTruthy();
    });
  });

  describe('UsageLimitScreen', () => {
    beforeEach(() => {
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        subscription: {
          type: 'free',
          usageLimit: 3,
        },
      });
    });

    it('should render usage limit screen with title', () => {
      const {getByText} = render(<UsageLimitScreen navigation={mockNavigation} />);

      expect(getByText('settings.usageLimit')).toBeTruthy();
      expect(getByText('settings.usageLimitDesc')).toBeTruthy();
    });

    it('should show current usage section', () => {
      const {getByText} = render(<UsageLimitScreen navigation={mockNavigation} />);

      expect(getByText('settings.currentUsage')).toBeTruthy();
      expect(getByText('subscription.dailyLimit')).toBeTruthy();
    });

    it('should show plan comparison section', () => {
      const {getByText} = render(<UsageLimitScreen navigation={mockNavigation} />);

      expect(getByText('settings.planComparison')).toBeTruthy();
      expect(getByText('subscription.free')).toBeTruthy();
      expect(getByText('subscription.premium')).toBeTruthy();
    });

    it.skip('should show upgrade button for free users', () => {
      const {getByText} = render(<UsageLimitScreen navigation={mockNavigation} />);

      const upgradeButton = getByText('subscription.upgradeToPremium');
      expect(upgradeButton).toBeTruthy();

      fireEvent.press(upgradeButton);
      expect(mockNavigate).toHaveBeenCalledWith('Pricing');
    });

    it('should not show upgrade button for premium users', () => {
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        subscription: {
          type: 'premium',
          usageLimit: -1,
        },
      });

      const {queryByText} = render(<UsageLimitScreen navigation={mockNavigation} />);

      const upgradeButton = queryByText('subscription.upgradeToPremium');
      expect(upgradeButton).toBeNull();
    });
  });
});
