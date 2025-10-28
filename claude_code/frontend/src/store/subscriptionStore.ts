import {create} from 'zustand';
import {Subscription, SubscriptionPlan} from '../types';
import {paymentService, handleApiError} from '../api';

interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;

  // Computed
  isPremium: () => boolean;
  isActive: () => boolean;
  getRemainingUsage: () => number;
  canUseFeature: (requiredPlan?: 'free' | 'premium') => boolean;

  // API Actions
  loadPlans: () => Promise<void>;
  loadCurrentSubscription: (userId: number) => Promise<void>;

  // Actions
  setSubscription: (subscription: Subscription) => void;
  setPlans: (plans: SubscriptionPlan[]) => void;
  updateSubscription: (data: Partial<Subscription>) => void;
  incrementUsage: () => void;
  resetUsage: () => void;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  plans: [],
  isLoading: false,
  error: null,

  // Computed getters
  isPremium: () => {
    const {subscription} = get();
    return subscription?.planType === 'premium';
  },

  isActive: () => {
    const {subscription} = get();
    if (!subscription) return false;

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return subscription.status === 'active' && endDate > now;
  },

  getRemainingUsage: () => {
    const {subscription} = get();
    if (!subscription) return 0;

    const remaining = subscription.usageLimit - subscription.usageCount;
    return Math.max(0, remaining);
  },

  canUseFeature: (requiredPlan: 'free' | 'premium' = 'free') => {
    const {subscription, isActive, getRemainingUsage} = get();

    if (!subscription) return false;
    if (!isActive()) return false;

    if (requiredPlan === 'premium' && subscription.planType !== 'premium') {
      return false;
    }

    if (subscription.planType === 'free' && getRemainingUsage() <= 0) {
      return false;
    }

    return true;
  },

  // API Actions
  loadPlans: async () => {
    set({isLoading: true, error: null});

    try {
      const apiPlans = await paymentService.getSubscriptionPlans();

      const plans: SubscriptionPlan[] = apiPlans.map(plan => ({
        id: plan.planId.toString(),
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
        popular: plan.name.toLowerCase().includes('premium'),
      }));

      set({plans, isLoading: false});
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isLoading: false});
    }
  },

  loadCurrentSubscription: async (userId: number) => {
    set({isLoading: true, error: null});

    try {
      const apiSubscription =
        await paymentService.getCurrentSubscription(userId);

      const subscription: Subscription = {
        id: apiSubscription.subscriptionId.toString(),
        userId: userId,
        planType:
          apiSubscription.planName.toLowerCase() === 'free' ? 'free' : 'premium',
        status: apiSubscription.status.toLowerCase() as 'active' | 'expired',
        startDate: new Date().toISOString(), // Would need from API
        endDate: apiSubscription.expiryDate,
        usageLimit: apiSubscription.planName.toLowerCase() === 'free' ? 3 : 999,
        usageCount: 0, // Would need from API
        autoRenew: apiSubscription.autoRenew,
      };

      set({subscription, isLoading: false});
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isLoading: false});
    }
  },

  // Actions
  setSubscription: (subscription: Subscription) => {
    set({subscription});
  },

  setPlans: (plans: SubscriptionPlan[]) => {
    set({plans});
  },

  updateSubscription: (data: Partial<Subscription>) => {
    const {subscription} = get();
    if (subscription) {
      set({
        subscription: {
          ...subscription,
          ...data,
        },
      });
    }
  },

  incrementUsage: () => {
    const {subscription} = get();
    if (subscription) {
      set({
        subscription: {
          ...subscription,
          usageCount: subscription.usageCount + 1,
        },
      });
    }
  },

  resetUsage: () => {
    const {subscription} = get();
    if (subscription) {
      set({
        subscription: {
          ...subscription,
          usageCount: 0,
        },
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));
