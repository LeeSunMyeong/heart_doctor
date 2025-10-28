import {useSubscriptionStore} from '../../src/store/subscriptionStore';
import {useAssessmentStore} from '../../src/store/assessmentStore';
import {usePaymentStore} from '../../src/store/paymentStore';

describe('Phase 1: Zustand Stores', () => {
  describe('SubscriptionStore', () => {
    beforeEach(() => {
      // Reset store state before each test
      useSubscriptionStore.setState({
        subscription: null,
        plans: [],
        isLoading: false,
        error: null,
      });
    });

    it('should initialize with null subscription', () => {
      const {subscription} = useSubscriptionStore.getState();
      expect(subscription).toBeNull();
    });

    it('should set subscription data', () => {
      const mockSubscription = {
        id: 'sub_1',
        userId: 'user_1',
        planType: 'premium' as const,
        status: 'active' as const,
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        usageCount: 5,
        usageLimit: 100,
      };

      useSubscriptionStore.getState().setSubscription(mockSubscription);
      const {subscription} = useSubscriptionStore.getState();

      expect(subscription).toEqual(mockSubscription);
    });

    it('should check if user is premium', () => {
      const mockSubscription = {
        id: 'sub_1',
        userId: 'user_1',
        planType: 'premium' as const,
        status: 'active' as const,
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        usageCount: 5,
        usageLimit: 100,
      };

      useSubscriptionStore.getState().setSubscription(mockSubscription);
      const isPremium = useSubscriptionStore.getState().isPremium();

      expect(isPremium).toBe(true);
    });

    it('should calculate remaining usage correctly', () => {
      const mockSubscription = {
        id: 'sub_1',
        userId: 'user_1',
        planType: 'free' as const,
        status: 'active' as const,
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        usageCount: 3,
        usageLimit: 10,
      };

      useSubscriptionStore.getState().setSubscription(mockSubscription);
      const remaining = useSubscriptionStore.getState().getRemainingUsage();

      expect(remaining).toBe(7);
    });

    it('should increment usage count', () => {
      const mockSubscription = {
        id: 'sub_1',
        userId: 'user_1',
        planType: 'free' as const,
        status: 'active' as const,
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        usageCount: 3,
        usageLimit: 10,
      };

      useSubscriptionStore.getState().setSubscription(mockSubscription);
      useSubscriptionStore.getState().incrementUsage();

      const {subscription} = useSubscriptionStore.getState();
      expect(subscription?.usageCount).toBe(4);
    });
  });

  describe('AssessmentStore', () => {
    beforeEach(() => {
      useAssessmentStore.setState({
        formData: {},
        currentStep: 0,
        totalSteps: 3,
        latestResult: null,
        results: [],
        isLoading: false,
        error: null,
        isSubmitting: false,
      });
    });

    it('should initialize with empty form data', () => {
      const {formData} = useAssessmentStore.getState();
      expect(formData).toEqual({});
    });

    it('should update form data', () => {
      useAssessmentStore.getState().updateFormData({
        age: 45,
        sex: 'M',
      });

      const {formData} = useAssessmentStore.getState();
      expect(formData.age).toBe(45);
      expect(formData.sex).toBe('M');
    });

    it('should navigate between steps', () => {
      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(1);

      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(2);

      useAssessmentStore.getState().prevStep();
      expect(useAssessmentStore.getState().currentStep).toBe(1);
    });

    it('should not go beyond total steps', () => {
      useAssessmentStore.setState({currentStep: 2});
      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(2);
    });

    it('should reset form data', () => {
      useAssessmentStore.getState().updateFormData({
        age: 45,
        sex: 'M',
      });
      useAssessmentStore.setState({currentStep: 2});

      useAssessmentStore.getState().resetForm();

      const {formData, currentStep} = useAssessmentStore.getState();
      expect(Object.keys(formData).length).toBeGreaterThan(0);
      expect(currentStep).toBe(0);
    });

    it('should add result to history', () => {
      const mockResult = {
        id: 'result_1',
        userId: 'user_1',
        prediction: 0.75,
        riskLevel: 'high' as const,
        createdAt: '2025-01-15T10:00:00Z',
        formData: {},
      };

      useAssessmentStore.getState().addResult(mockResult);

      const {results, latestResult} = useAssessmentStore.getState();
      expect(results.length).toBe(1);
      expect(latestResult).toEqual(mockResult);
    });
  });

  describe('PaymentStore', () => {
    beforeEach(() => {
      usePaymentStore.setState({
        payments: [],
        paymentMethods: [],
        selectedMethod: null,
        isLoading: false,
        error: null,
        isProcessing: false,
      });
    });

    it('should initialize with empty payments', () => {
      const {payments} = usePaymentStore.getState();
      expect(payments).toEqual([]);
    });

    it('should add payment method', () => {
      const mockMethod = {
        id: 'pm_1',
        userId: 'user_1',
        type: 'card' as const,
        last4: '4242',
        brand: 'visa',
        isDefault: true,
      };

      usePaymentStore.getState().addPaymentMethod(mockMethod);
      const {paymentMethods} = usePaymentStore.getState();

      expect(paymentMethods.length).toBe(1);
      expect(paymentMethods[0]).toEqual(mockMethod);
    });

    it('should set default payment method', () => {
      const method1 = {
        id: 'pm_1',
        userId: 'user_1',
        type: 'card' as const,
        last4: '4242',
        brand: 'visa',
        isDefault: true,
      };

      const method2 = {
        id: 'pm_2',
        userId: 'user_1',
        type: 'card' as const,
        last4: '1234',
        brand: 'mastercard',
        isDefault: false,
      };

      usePaymentStore.getState().setPaymentMethods([method1, method2]);
      usePaymentStore.getState().setDefaultMethod('pm_2');

      const {paymentMethods} = usePaymentStore.getState();
      expect(paymentMethods[0].isDefault).toBe(false);
      expect(paymentMethods[1].isDefault).toBe(true);
    });

    it('should remove payment method', () => {
      const mockMethods = [
        {
          id: 'pm_1',
          userId: 'user_1',
          type: 'card' as const,
          last4: '4242',
          brand: 'visa',
          isDefault: true,
        },
        {
          id: 'pm_2',
          userId: 'user_1',
          type: 'card' as const,
          last4: '1234',
          brand: 'mastercard',
          isDefault: false,
        },
      ];

      usePaymentStore.getState().setPaymentMethods(mockMethods);
      usePaymentStore.getState().removePaymentMethod('pm_1');

      const {paymentMethods} = usePaymentStore.getState();
      expect(paymentMethods.length).toBe(1);
      expect(paymentMethods[0].id).toBe('pm_2');
    });

    it('should complete payment flow', () => {
      usePaymentStore.getState().startPayment();
      expect(usePaymentStore.getState().isProcessing).toBe(true);

      const mockPayment = {
        id: 'pay_1',
        userId: 'user_1',
        amount: 9900,
        currency: 'KRW',
        status: 'succeeded' as const,
        paymentMethodId: 'pm_1',
        createdAt: '2025-01-15T10:00:00Z',
      };

      usePaymentStore.getState().completePayment(mockPayment);

      const {payments, isProcessing} = usePaymentStore.getState();
      expect(isProcessing).toBe(false);
      expect(payments.length).toBe(1);
      expect(payments[0]).toEqual(mockPayment);
    });

    it('should get default payment method', () => {
      const mockMethods = [
        {
          id: 'pm_1',
          userId: 'user_1',
          type: 'card' as const,
          last4: '4242',
          brand: 'visa',
          isDefault: false,
        },
        {
          id: 'pm_2',
          userId: 'user_1',
          type: 'card' as const,
          last4: '1234',
          brand: 'mastercard',
          isDefault: true,
        },
      ];

      usePaymentStore.getState().setPaymentMethods(mockMethods);
      const defaultMethod = usePaymentStore.getState().getDefaultPaymentMethod();

      expect(defaultMethod?.id).toBe('pm_2');
    });
  });
});
