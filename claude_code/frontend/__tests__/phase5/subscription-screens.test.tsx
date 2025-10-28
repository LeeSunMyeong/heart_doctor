import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {PricingScreen} from '../../src/screens/subscription/PricingScreen';
import {PaymentScreen} from '../../src/screens/subscription/PaymentScreen';
import {PaymentHistoryScreen} from '../../src/screens/subscription/PaymentHistoryScreen';
import {useSubscriptionStore} from '../../src/store/subscriptionStore';
import {usePaymentStore} from '../../src/store/paymentStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
} as any;

const mockRoute = {
  params: {planId: 'premium-monthly'},
} as any;

// Mock stores
jest.mock('../../src/store/subscriptionStore');
jest.mock('../../src/store/paymentStore');

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
  }),
}));

describe('Phase 5: Subscription Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PricingScreen', () => {
    beforeEach(() => {
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        plans: [],
        setPlans: jest.fn(),
      });
    });

    it('should render pricing screen with title', async () => {
      const {getByText} = render(<PricingScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getByText('subscription.chooseYourPlan')).toBeTruthy();
        expect(getByText('subscription.planDescription')).toBeTruthy();
      });
    });

    it('should render plan cards when plans are loaded', async () => {
      const mockSetPlans = jest.fn();
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        plans: [
          {
            id: 'free',
            type: 'free',
            name: 'Free Plan',
            price: 0,
            duration: 'monthly',
            features: ['Feature 1', 'Feature 2'],
            usageLimit: 3,
          },
        ],
        setPlans: mockSetPlans,
      });

      const {getByText} = render(<PricingScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockSetPlans).toHaveBeenCalled();
        expect(getByText('subscription.free')).toBeTruthy();
      });
    });

    it('should navigate to payment screen when premium plan is selected', async () => {
      const mockSetPlans = jest.fn();
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        plans: [
          {
            id: 'premium-monthly',
            type: 'premium',
            name: 'Premium Monthly',
            price: 9900,
            duration: 'monthly',
            features: ['Unlimited'],
            popular: true,
            usageLimit: -1,
          },
        ],
        setPlans: mockSetPlans,
      });

      const {getByText} = render(<PricingScreen navigation={mockNavigation} />);

      await waitFor(() => {
        const planCard = getByText('Premium Monthly');
        fireEvent.press(planCard);
      });

      await waitFor(() => {
        const subscribeButton = getByText('subscription.subscribe');
        fireEvent.press(subscribeButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('Payment', {
        planId: 'premium-monthly',
      });
    });

    it('should go back when free plan is selected', async () => {
      const mockSetPlans = jest.fn();
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        plans: [
          {
            id: 'free',
            type: 'free',
            name: 'Free Plan',
            price: 0,
            duration: 'monthly',
            features: ['Feature 1'],
            usageLimit: 3,
          },
        ],
        setPlans: mockSetPlans,
      });

      const {getByText} = render(<PricingScreen navigation={mockNavigation} />);

      await waitFor(() => {
        const planCard = getByText('Free Plan');
        fireEvent.press(planCard);
      });

      await waitFor(() => {
        const continueButton = getByText('subscription.continueFree');
        fireEvent.press(continueButton);
      });

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('PaymentScreen', () => {
    beforeEach(() => {
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        plans: [
          {
            id: 'premium-monthly',
            type: 'premium',
            name: 'Premium Monthly',
            price: 9900,
            duration: 'monthly',
            features: ['Unlimited'],
            usageLimit: -1,
          },
        ],
      });
      (usePaymentStore as unknown as jest.Mock).mockReturnValue({
        paymentMethods: [],
        selectedMethod: null,
        isProcessing: false,
        setPaymentMethods: jest.fn(),
        setSelectedMethod: jest.fn(),
        startPayment: jest.fn(),
        completePayment: jest.fn(),
        failPayment: jest.fn(),
      });
    });

    it('should render payment screen with order summary', async () => {
      const {getByText} = render(
        <PaymentScreen navigation={mockNavigation} route={mockRoute} />,
      );

      await waitFor(() => {
        expect(getByText('payment.title')).toBeTruthy();
        expect(getByText('payment.orderSummary')).toBeTruthy();
      });
    });

    it('should render payment methods when available', async () => {
      (usePaymentStore as unknown as jest.Mock).mockReturnValue({
        paymentMethods: [
          {
            id: '1',
            type: 'card',
            name: 'Visa ending in 1234',
            lastFour: '1234',
            expiryDate: '12/25',
            isDefault: true,
            createdAt: new Date().toISOString(),
          },
        ],
        selectedMethod: null,
        isProcessing: false,
        setPaymentMethods: jest.fn(),
        setSelectedMethod: jest.fn(),
        startPayment: jest.fn(),
        completePayment: jest.fn(),
        failPayment: jest.fn(),
      });

      const {getByText} = render(
        <PaymentScreen navigation={mockNavigation} route={mockRoute} />,
      );

      await waitFor(() => {
        expect(getByText('Visa ending in 1234')).toBeTruthy();
        expect(getByText('payment.default')).toBeTruthy();
      });
    });

    it('should show terms agreement checkbox', async () => {
      const {getByText, findByText} = render(
        <PaymentScreen navigation={mockNavigation} route={mockRoute} />,
      );

      await waitFor(() => {
        expect(getByText(/payment.agreeToTerms/)).toBeTruthy();
      });
      const termsLink = await findByText('payment.termsOfService');
      expect(termsLink).toBeTruthy();
    });

    it('should show add payment method button', async () => {
      const mockSelectedMethod = {
        id: '1',
        type: 'card' as const,
        name: 'Visa ending in 1234',
        lastFour: '1234',
        isDefault: true,
        createdAt: new Date().toISOString(),
      };

      (usePaymentStore as unknown as jest.Mock).mockReturnValue({
        paymentMethods: [mockSelectedMethod],
        selectedMethod: mockSelectedMethod,
        isProcessing: false,
        setPaymentMethods: jest.fn(),
        setSelectedMethod: jest.fn(),
        startPayment: jest.fn(),
        completePayment: jest.fn(),
        failPayment: jest.fn(),
      });

      const {getByText} = render(
        <PaymentScreen navigation={mockNavigation} route={mockRoute} />,
      );

      await waitFor(() => {
        expect(getByText('payment.addPaymentMethod')).toBeTruthy();
      });
    });
  });

  describe('PaymentHistoryScreen', () => {
    beforeEach(() => {
      (usePaymentStore as unknown as jest.Mock).mockReturnValue({
        payments: [],
        setPayments: jest.fn(),
      });
    });

    it('should render payment history screen with title', () => {
      const {getByText} = render(
        <PaymentHistoryScreen navigation={mockNavigation} />,
      );

      expect(getByText('payment.paymentHistory')).toBeTruthy();
      expect(getByText('payment.paymentHistoryDesc')).toBeTruthy();
    });

    it('should show empty state when no payments', () => {
      const {getByText} = render(
        <PaymentHistoryScreen navigation={mockNavigation} />,
      );

      expect(getByText('payment.noPayments')).toBeTruthy();
      expect(getByText('payment.noPaymentsDesc')).toBeTruthy();
      expect(getByText('payment.viewPlans')).toBeTruthy();
    });

    it('should render payment list when payments exist', () => {
      const mockPayments = [
        {
          id: 1,
          user: {} as any,
          costModel: {
            costId: 1,
            type: 'MONTHLY' as const,
            cost: 9900,
            description: 'Premium Monthly Plan',
          },
          status: 'SUCCESS' as const,
          storeInfo: 'A',
          transactionId: 'TXN-123',
          payTime: '2025-10-23T10:30:00Z',
        },
      ];

      const mockSetPayments = jest.fn();
      (usePaymentStore as unknown as jest.Mock).mockReturnValue({
        payments: mockPayments,
        setPayments: mockSetPayments,
      });

      const {getByText} = render(
        <PaymentHistoryScreen navigation={mockNavigation} />,
      );

      expect(getByText('Premium Monthly Plan')).toBeTruthy();
      expect(getByText('TXN-123')).toBeTruthy();
    });

    it('should navigate to pricing when view plans button is pressed', () => {
      const {getByText} = render(
        <PaymentHistoryScreen navigation={mockNavigation} />,
      );

      fireEvent.press(getByText('payment.viewPlans'));
      expect(mockNavigate).toHaveBeenCalledWith('Pricing');
    });
  });
});
