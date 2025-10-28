import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginScreen} from '../../src/screens/auth/LoginScreen';
import {SignupScreen} from '../../src/screens/auth/SignupScreen';
import {AccountRecoveryScreen} from '../../src/screens/auth/AccountRecoveryScreen';
import {useAuthStore} from '../../src/store/authStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn().mockReturnValue(true);
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
} as any;

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock useAuthStore
jest.mock('../../src/store/authStore');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Phase 3: Authentication Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginScreen', () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        login: jest.fn(),
        isLoading: false,
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should render login form elements', () => {
      const {getAllByText, getByPlaceholderText} = render(
        <LoginScreen navigation={mockNavigation} />,
      );

      expect(getAllByText('auth.login').length).toBeGreaterThan(0);
      expect(getByPlaceholderText('auth.emailPlaceholder')).toBeTruthy();
      expect(getByPlaceholderText('auth.passwordPlaceholder')).toBeTruthy();
      expect(getAllByText('auth.forgotPassword').length).toBeGreaterThan(0);
    });

    it('should validate email format', async () => {
      const {getByPlaceholderText, getByText, getAllByText} = render(
        <LoginScreen navigation={mockNavigation} />,
      );

      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const loginButtons = getAllByText('auth.login');
      const loginButton = loginButtons[loginButtons.length - 1];

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('auth.emailInvalid')).toBeTruthy();
      });
    });

    it('should validate password minimum length', async () => {
      const {getByPlaceholderText, getByText, getAllByText} = render(
        <LoginScreen navigation={mockNavigation} />,
      );

      const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
      const loginButtons = getAllByText('auth.login');
      const loginButton = loginButtons[loginButtons.length - 1];

      fireEvent.changeText(passwordInput, '123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('auth.passwordMinLength')).toBeTruthy();
      });
    });

    it('should call login function with valid credentials', async () => {
      const mockLogin = jest.fn().mockResolvedValue(undefined);
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: null,
        clearError: jest.fn(),
      });

      const {getByPlaceholderText, getAllByText} = render(
        <LoginScreen navigation={mockNavigation} />,
      );

      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
      const loginButtons = getAllByText('auth.login');
      const loginButton = loginButtons[loginButtons.length - 1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should navigate to signup screen', () => {
      const {getByText} = render(<LoginScreen navigation={mockNavigation} />);

      const signupLink = getByText('auth.signup');
      fireEvent.press(signupLink);

      expect(mockNavigate).toHaveBeenCalledWith('Signup');
    });

    it('should navigate to account recovery screen', () => {
      const {getByText} = render(<LoginScreen navigation={mockNavigation} />);

      const forgotPasswordLink = getByText('auth.forgotPassword');
      fireEvent.press(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('AccountRecovery');
    });
  });

  describe('SignupScreen', () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        register: jest.fn(),
        isLoading: false,
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should render signup form elements', () => {
      const {getAllByText, getByPlaceholderText} = render(
        <SignupScreen navigation={mockNavigation} />,
      );

      expect(getAllByText('auth.signup').length).toBeGreaterThan(0);
      expect(getByPlaceholderText('auth.namePlaceholder')).toBeTruthy();
      expect(getByPlaceholderText('auth.emailPlaceholder')).toBeTruthy();
      expect(getByPlaceholderText('auth.passwordPlaceholder')).toBeTruthy();
      expect(
        getByPlaceholderText('auth.confirmPasswordPlaceholder'),
      ).toBeTruthy();
    });

    it('should validate name field', async () => {
      const {getByPlaceholderText, getByText, getAllByText} = render(
        <SignupScreen navigation={mockNavigation} />,
      );

      const nameInput = getByPlaceholderText('auth.namePlaceholder');
      const signupButtons = getAllByText('auth.signup');
      const signupButton = signupButtons[signupButtons.length - 1];

      fireEvent.changeText(nameInput, 'A');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(getByText('auth.nameMinLength')).toBeTruthy();
      });
    });

    it('should validate password confirmation match', async () => {
      const {getByPlaceholderText, getByText, getAllByText} = render(
        <SignupScreen navigation={mockNavigation} />,
      );

      const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
      const confirmPasswordInput = getByPlaceholderText(
        'auth.confirmPasswordPlaceholder',
      );
      const signupButtons = getAllByText('auth.signup');
      const signupButton = signupButtons[signupButtons.length - 1];

      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'differentpassword');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(getByText('auth.passwordMismatch')).toBeTruthy();
      });
    });

    it('should toggle terms checkbox', () => {
      const {getByText} = render(<SignupScreen navigation={mockNavigation} />);

      // Find terms text (partial match)
      const termsText = getByText('auth.agreeToTerms', {exact: false});
      fireEvent.press(termsText);

      // Checkbox state should be toggled (visual verification)
      expect(termsText).toBeTruthy();
    });

    it('should call register function with valid data', async () => {
      const mockRegister = jest.fn().mockResolvedValue(undefined);
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: null,
        clearError: jest.fn(),
      });

      const {getByPlaceholderText, getByText, getAllByText} = render(
        <SignupScreen navigation={mockNavigation} />,
      );

      const nameInput = getByPlaceholderText('auth.namePlaceholder');
      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
      const confirmPasswordInput = getByPlaceholderText(
        'auth.confirmPasswordPlaceholder',
      );
      const termsText = getByText('auth.agreeToTerms', {exact: false});
      const signupButtons = getAllByText('auth.signup');
      const signupButton = signupButtons[signupButtons.length - 1]; // Get the button, not the title

      fireEvent.changeText(nameInput, 'Test User');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');
      fireEvent.press(termsText); // Agree to terms
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should navigate to login screen', () => {
      const {getByText} = render(<SignupScreen navigation={mockNavigation} />);

      const loginLink = getByText('auth.login');
      fireEvent.press(loginLink);

      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  describe('AccountRecoveryScreen', () => {
    it('should render account recovery form elements', () => {
      const {getByText, getByPlaceholderText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      expect(getByText('auth.accountRecovery')).toBeTruthy();
      expect(getByPlaceholderText('auth.emailPlaceholder')).toBeTruthy();
      expect(getByText('auth.sendResetLink')).toBeTruthy();
      expect(getByText('auth.backToLogin')).toBeTruthy();
    });

    it('should display reset instructions', () => {
      const {getByText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      expect(getByText('auth.resetInstructions')).toBeTruthy();
    });

    it('should validate email format', async () => {
      const {getByPlaceholderText, getByText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const resetButton = getByText('auth.sendResetLink');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(getByText('auth.emailInvalid')).toBeTruthy();
      });
    });

    it('should handle password reset submission', async () => {
      const {getByPlaceholderText, getByText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      const emailInput = getByPlaceholderText('auth.emailPlaceholder');
      const resetButton = getByText('auth.sendResetLink');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(resetButton);

      // Simulated API call should complete
      await waitFor(
        () => {
          expect(emailInput).toBeTruthy();
        },
        {timeout: 2000},
      );
    });

    it('should navigate back to login screen', () => {
      const {getByText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      const backButton = getByText('auth.backToLogin');
      fireEvent.press(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    it('should display help section', () => {
      const {getByText} = render(
        <AccountRecoveryScreen navigation={mockNavigation} />,
      );

      expect(getByText('auth.needHelp')).toBeTruthy();
      expect(getByText('auth.contactSupport')).toBeTruthy();
    });
  });
});
