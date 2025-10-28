/**
 * Payment Service
 * 결제 및 구독 관련 API
 */

import apiClient, {getApiData} from '../client';
import {PaymentRequest, PaymentResponse, ApiResponse} from '../types';

/**
 * 결제 생성
 */
export const createPayment = async (
  paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
  const response = await apiClient.post<ApiResponse<PaymentResponse>>(
    '/payments',
    paymentData,
  );

  return getApiData(response);
};

/**
 * 결제 완료 처리
 */
export const completePayment = async (
  paymentId: number,
  transactionId: string,
): Promise<PaymentResponse> => {
  const response = await apiClient.put<ApiResponse<PaymentResponse>>(
    `/payments/${paymentId}/complete`,
    {
      transactionId,
    },
  );

  return getApiData(response);
};

/**
 * 결제 실패 처리
 */
export const failPayment = async (
  paymentId: number,
  reason: string,
): Promise<PaymentResponse> => {
  const response = await apiClient.put<ApiResponse<PaymentResponse>>(
    `/payments/${paymentId}/fail`,
    {
      reason,
    },
  );

  return getApiData(response);
};

/**
 * 결제 취소
 */
export const cancelPayment = async (
  paymentId: number,
  reason: string,
): Promise<PaymentResponse> => {
  const response = await apiClient.put<ApiResponse<PaymentResponse>>(
    `/payments/${paymentId}/cancel`,
    {
      reason,
    },
  );

  return getApiData(response);
};

/**
 * 결제 환불
 */
export const refundPayment = async (
  paymentId: number,
  reason: string,
  amount?: number,
): Promise<PaymentResponse> => {
  const response = await apiClient.post<ApiResponse<PaymentResponse>>(
    `/payments/${paymentId}/refund`,
    {
      reason,
      amount,
    },
  );

  return getApiData(response);
};

/**
 * 결제 상세 조회
 */
export const getPaymentById = async (
  paymentId: number,
): Promise<PaymentResponse> => {
  const response = await apiClient.get<ApiResponse<PaymentResponse>>(
    `/payments/${paymentId}`,
  );

  return getApiData(response);
};

/**
 * 거래 ID로 결제 조회
 */
export const getPaymentByTransactionId = async (
  transactionId: string,
): Promise<PaymentResponse> => {
  const response = await apiClient.get<ApiResponse<PaymentResponse>>(
    `/payments/transaction/${transactionId}`,
  );

  return getApiData(response);
};

/**
 * 사용자의 결제 내역 조회
 */
export const getPaymentHistory = async (
  userId: number,
): Promise<PaymentResponse[]> => {
  const response = await apiClient.get<ApiResponse<PaymentResponse[]>>(
    `/payments/history/${userId}`,
  );

  return getApiData(response);
};

/**
 * 성공한 결제 내역만 조회
 */
export const getSuccessfulPayments = async (
  userId: number,
): Promise<PaymentResponse[]> => {
  const response = await apiClient.get<ApiResponse<PaymentResponse[]>>(
    `/payments/successful/${userId}`,
  );

  return getApiData(response);
};

/**
 * 최근 결제 조회
 */
export const getLatestPayment = async (
  userId: number,
): Promise<PaymentResponse> => {
  const response = await apiClient.get<ApiResponse<PaymentResponse>>(
    `/payments/latest/${userId}`,
  );

  return getApiData(response);
};

/**
 * 구독 플랜 목록 조회
 */
export const getSubscriptionPlans = async (): Promise<
  Array<{
    planId: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
  }>
> => {
  const response = await apiClient.get<ApiResponse<Array<{
    planId: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
  }>>>('/subscriptions/plans');

  return getApiData(response);
};

/**
 * 현재 구독 정보 조회
 */
export const getCurrentSubscription = async (
  userId: number,
): Promise<{
  subscriptionId: number;
  planName: string;
  status: string;
  expiryDate: string;
  autoRenew: boolean;
}> => {
  const response = await apiClient.get<ApiResponse<{
    subscriptionId: number;
    planName: string;
    status: string;
    expiryDate: string;
    autoRenew: boolean;
  }>>(`/subscriptions/${userId}`);

  return getApiData(response);
};

export default {
  createPayment,
  completePayment,
  failPayment,
  cancelPayment,
  refundPayment,
  getPaymentById,
  getPaymentByTransactionId,
  getPaymentHistory,
  getSuccessfulPayments,
  getLatestPayment,
  getSubscriptionPlans,
  getCurrentSubscription,
};
