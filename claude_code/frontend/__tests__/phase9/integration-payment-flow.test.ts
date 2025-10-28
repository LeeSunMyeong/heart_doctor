/**
 * Phase 9: Integration Tests - Payment Flow
 * 결제 플로우 통합 테스트 (구독 선택 → 결제 → 완료)
 */

import {describe, it, expect, beforeEach} from '@jest/globals';
import {usePaymentStore} from '../../src/store/paymentStore';
import {useSubscriptionStore} from '../../src/store/subscriptionStore';
import type {Payment, Subscription, SubscriptionPlan} from '../../src/types';

describe('Phase 9: Payment Flow Integration', () => {
  beforeEach(() => {
    // Reset stores
    usePaymentStore.setState({
      payments: [],
      paymentMethods: [],
      selectedMethod: null,
      isLoading: false,
      error: null,
      isProcessing: false,
    });

    useSubscriptionStore.setState({
      subscription: null,
      plans: [],
      isLoading: false,
      error: null,
    });
  });

  describe('Subscription Plans', () => {
    it('should load and display subscription plans', () => {
      const mockPlans: SubscriptionPlan[] = [
        {
          id: '1',
          name: 'Free Plan',
          price: 0,
          duration: '1 month',
          features: ['3 assessments per month', 'Basic support'],
          popular: false,
        },
        {
          id: '2',
          name: 'Premium Plan',
          price: 9900,
          duration: '1 month',
          features: [
            'Unlimited assessments',
            'Priority support',
            'Advanced analytics',
          ],
          popular: true,
        },
      ];

      useSubscriptionStore.getState().setPlans(mockPlans);

      expect(useSubscriptionStore.getState().plans.length).toBe(2);
      expect(useSubscriptionStore.getState().plans[0].name).toBe('Free Plan');
      expect(useSubscriptionStore.getState().plans[1].popular).toBe(true);
    });
  });

  describe('Current Subscription', () => {
    it('should manage current subscription state', () => {
      // Use future date for active subscription
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      const mockSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'premium',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: futureDate.toISOString(),
        usageLimit: 999,
        usageCount: 5,
        autoRenew: true,
      };

      useSubscriptionStore.getState().setSubscription(mockSubscription);

      expect(useSubscriptionStore.getState().subscription).toEqual(mockSubscription);
      expect(useSubscriptionStore.getState().isPremium()).toBe(true);
      expect(useSubscriptionStore.getState().isActive()).toBe(true);
    });

    it('should calculate remaining usage correctly', () => {
      const freeSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'free',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        usageLimit: 3,
        usageCount: 1,
        autoRenew: false,
      };

      useSubscriptionStore.getState().setSubscription(freeSubscription);

      expect(useSubscriptionStore.getState().getRemainingUsage()).toBe(2);
    });

    it('should increment usage count', () => {
      const subscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'free',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        usageLimit: 3,
        usageCount: 0,
        autoRenew: false,
      };

      useSubscriptionStore.getState().setSubscription(subscription);

      expect(useSubscriptionStore.getState().subscription?.usageCount).toBe(0);

      useSubscriptionStore.getState().incrementUsage();
      expect(useSubscriptionStore.getState().subscription?.usageCount).toBe(1);

      useSubscriptionStore.getState().incrementUsage();
      expect(useSubscriptionStore.getState().subscription?.usageCount).toBe(2);
    });
  });

  describe('Payment Processing', () => {
    it('should add payment to history', () => {
      const mockPayment: Payment = {
        id: '1',
        userId: 1,
        transactionId: 'TXN123456',
        amount: 9900,
        status: 'success',
        method: 'Credit Card',
        plan: 'Premium',
        date: new Date().toISOString(),
      };

      usePaymentStore.getState().addPayment(mockPayment);

      expect(usePaymentStore.getState().payments.length).toBe(1);
      expect(usePaymentStore.getState().payments[0].transactionId).toBe('TXN123456');
      expect(usePaymentStore.getState().payments[0].status).toBe('success');
    });

    it('should manage payment processing state', () => {
      // Start payment
      usePaymentStore.getState().startPayment();
      expect(usePaymentStore.getState().isProcessing).toBe(true);
      expect(usePaymentStore.getState().error).toBeNull();

      // Complete payment
      const payment: Payment = {
        id: '1',
        userId: 1,
        transactionId: 'TXN123',
        amount: 9900,
        status: 'success',
        method: 'Credit Card',
        plan: 'Premium',
        date: new Date().toISOString(),
      };

      usePaymentStore.getState().completePayment(payment);
      expect(usePaymentStore.getState().isProcessing).toBe(false);
      expect(usePaymentStore.getState().payments.length).toBe(1);
    });

    it('should handle payment failure', () => {
      usePaymentStore.getState().startPayment();
      usePaymentStore.getState().failPayment('Payment declined');

      expect(usePaymentStore.getState().isProcessing).toBe(false);
      expect(usePaymentStore.getState().error).toBe('Payment declined');
    });
  });

  describe('Complete Payment Flow', () => {
    it('should handle complete payment and subscription upgrade flow', () => {
      // Step 1: User selects Premium plan
      const premiumPlan: SubscriptionPlan = {
        id: '2',
        name: 'Premium Plan',
        price: 9900,
        duration: '1 month',
        features: ['Unlimited assessments', 'Priority support'],
        popular: true,
      };

      useSubscriptionStore.getState().setPlans([premiumPlan]);

      // Step 2: Start payment process
      usePaymentStore.getState().startPayment();
      expect(usePaymentStore.getState().isProcessing).toBe(true);

      // Step 3: Complete payment
      const payment: Payment = {
        id: '1',
        userId: 1,
        transactionId: 'TXN789',
        amount: 9900,
        status: 'success',
        method: 'Credit Card',
        plan: 'Premium',
        date: new Date().toISOString(),
      };

      usePaymentStore.getState().completePayment(payment);

      // Step 4: Update subscription
      const newSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'premium',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 999,
        usageCount: 0,
        autoRenew: true,
      };

      useSubscriptionStore.getState().setSubscription(newSubscription);

      // Verify complete flow
      expect(usePaymentStore.getState().isProcessing).toBe(false);
      expect(usePaymentStore.getState().payments.length).toBe(1);
      expect(useSubscriptionStore.getState().subscription?.planType).toBe('premium');
      expect(useSubscriptionStore.getState().isPremium()).toBe(true);
    });
  });

  describe('Feature Access Control', () => {
    it('should allow premium features for premium users', () => {
      const premiumSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'premium',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        usageLimit: 999,
        usageCount: 10,
        autoRenew: true,
      };

      useSubscriptionStore.getState().setSubscription(premiumSubscription);

      expect(useSubscriptionStore.getState().canUseFeature('premium')).toBe(true);
      expect(useSubscriptionStore.getState().canUseFeature('free')).toBe(true);
    });

    it('should restrict premium features for free users', () => {
      const freeSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'free',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        usageLimit: 3,
        usageCount: 1,
        autoRenew: false,
      };

      useSubscriptionStore.getState().setSubscription(freeSubscription);

      expect(useSubscriptionStore.getState().canUseFeature('premium')).toBe(false);
      expect(useSubscriptionStore.getState().canUseFeature('free')).toBe(true);
    });

    it('should block features when usage limit exceeded', () => {
      const freeSubscription: Subscription = {
        id: '1',
        userId: 1,
        planType: 'free',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        usageLimit: 3,
        usageCount: 3, // Limit reached
        autoRenew: false,
      };

      useSubscriptionStore.getState().setSubscription(freeSubscription);

      expect(useSubscriptionStore.getState().getRemainingUsage()).toBe(0);
      expect(useSubscriptionStore.getState().canUseFeature('free')).toBe(false);
    });
  });

  describe('Payment History', () => {
    it('should retrieve payment by ID', () => {
      const payment1: Payment = {
        id: '1',
        userId: 1,
        transactionId: 'TXN001',
        amount: 9900,
        status: 'success',
        method: 'Credit Card',
        plan: 'Premium',
        date: '2025-01-01T00:00:00Z',
      };

      const payment2: Payment = {
        id: '2',
        userId: 1,
        transactionId: 'TXN002',
        amount: 9900,
        status: 'success',
        method: 'PayPal',
        plan: 'Premium',
        date: '2025-02-01T00:00:00Z',
      };

      usePaymentStore.getState().setPayments([payment1, payment2]);

      const found = usePaymentStore.getState().getPaymentById('2');
      expect(found).toBeDefined();
      expect(found?.method).toBe('PayPal');
    });
  });
});
