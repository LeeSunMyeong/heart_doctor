import {create} from 'zustand';
import {Payment, PaymentMethod} from '../types';
import {paymentService, handleApiError, PaymentRequest} from '../api';

interface PaymentState {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;

  // API Actions
  loadPaymentHistory: (userId: number) => Promise<void>;
  processPayment: (paymentData: PaymentRequest) => Promise<boolean>;

  // Actions
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  setDefaultMethod: (methodId: string) => void;

  // Payment processing
  startPayment: () => void;
  completePayment: (payment: Payment) => void;
  failPayment: (error: string) => void;
  resetPaymentState: () => void;

  // Utility
  getPaymentById: (paymentId: string) => Payment | undefined;
  getPaymentMethodById: (methodId: string) => PaymentMethod | undefined;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  paymentMethods: [],
  selectedMethod: null,
  isLoading: false,
  error: null,
  isProcessing: false,

  // API Actions
  loadPaymentHistory: async (userId: number) => {
    set({isLoading: true, error: null});

    try {
      const apiPayments = await paymentService.getPaymentHistory(userId);

      const payments: Payment[] = apiPayments.map(payment => ({
        id: payment.paymentId.toString(),
        userId: payment.userId,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status.toLowerCase() as
          | 'pending'
          | 'success'
          | 'fail'
          | 'canceled'
          | 'refunded',
        method: payment.paymentMethod,
        plan: 'Premium', // Would need from API
        date: payment.createdAt,
        refundDate: undefined, // Would need from API if refunded
      }));

      set({payments, isLoading: false});
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isLoading: false});
    }
  },

  processPayment: async (paymentData: PaymentRequest) => {
    set({isProcessing: true, error: null});

    try {
      const apiPayment = await paymentService.createPayment(paymentData);

      // Complete the payment
      const completedPayment = await paymentService.completePayment(
        apiPayment.paymentId,
        apiPayment.transactionId,
      );

      const payment: Payment = {
        id: completedPayment.paymentId.toString(),
        userId: completedPayment.userId,
        transactionId: completedPayment.transactionId,
        amount: completedPayment.amount,
        status: completedPayment.status.toLowerCase() as 'success',
        method: completedPayment.paymentMethod,
        plan: 'Premium',
        date: completedPayment.createdAt,
      };

      const {payments} = get();
      set({
        payments: [payment, ...payments],
        isProcessing: false,
      });

      return true;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isProcessing: false});
      return false;
    }
  },

  // Actions
  setPayments: (payments: Payment[]) => {
    set({payments});
  },

  addPayment: (payment: Payment) => {
    const {payments} = get();
    set({
      payments: [payment, ...payments],
    });
  },

  setPaymentMethods: (methods: PaymentMethod[]) => {
    set({paymentMethods: methods});
  },

  addPaymentMethod: (method: PaymentMethod) => {
    const {paymentMethods} = get();
    set({
      paymentMethods: [...paymentMethods, method],
    });
  },

  removePaymentMethod: (methodId: string) => {
    const {paymentMethods} = get();
    set({
      paymentMethods: paymentMethods.filter(m => m.id !== methodId),
    });
  },

  setSelectedMethod: (method: PaymentMethod | null) => {
    set({selectedMethod: method});
  },

  setDefaultMethod: (methodId: string) => {
    const {paymentMethods} = get();
    set({
      paymentMethods: paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    });
  },

  // Payment processing
  startPayment: () => {
    set({isProcessing: true, error: null});
  },

  completePayment: (payment: Payment) => {
    const {payments} = get();
    set({
      payments: [payment, ...payments],
      isProcessing: false,
      error: null,
    });
  },

  failPayment: (error: string) => {
    set({
      isProcessing: false,
      error,
    });
  },

  resetPaymentState: () => {
    set({
      selectedMethod: null,
      isProcessing: false,
      error: null,
    });
  },

  // Utility
  getPaymentById: (paymentId: string) => {
    const {payments} = get();
    return payments.find(p => p.id === paymentId);
  },

  getPaymentMethodById: (methodId: string) => {
    const {paymentMethods} = get();
    return paymentMethods.find(m => m.id === methodId);
  },

  getDefaultPaymentMethod: () => {
    const {paymentMethods} = get();
    return paymentMethods.find(m => m.isDefault);
  },

  clearError: () => {
    set({error: null});
  },
}));
