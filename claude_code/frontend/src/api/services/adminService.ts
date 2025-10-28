/**
 * Admin Service
 * 관리자 전용 API
 */

import apiClient, {getApiData} from '../client';
import {
  AdminStatsResponse,
  NotificationRequest,
  NotificationResponse,
  ApiResponse,
  UserInfo,
} from '../types';

/**
 * 관리자 대시보드 통계 조회
 */
export const getAdminStats = async (): Promise<AdminStatsResponse> => {
  const response = await apiClient.get<ApiResponse<AdminStatsResponse>>(
    '/admin/stats',
  );

  return getApiData(response);
};

/**
 * 전체 사용자 목록 조회
 */
export const getAllUsers = async (
  page: number = 0,
  size: number = 20,
): Promise<{
  users: UserInfo[];
  totalPages: number;
  totalElements: number;
}> => {
  const response = await apiClient.get<ApiResponse<{
    users: UserInfo[];
    totalPages: number;
    totalElements: number;
  }>>('/admin/users', {
    params: {
      page,
      size,
    },
  });

  return getApiData(response);
};

/**
 * 사용자 상세 정보 조회
 */
export const getUserById = async (userId: number): Promise<UserInfo> => {
  const response = await apiClient.get<ApiResponse<UserInfo>>(
    `/admin/users/${userId}`,
  );

  return getApiData(response);
};

/**
 * 사용자 정보 수정
 */
export const updateUser = async (
  userId: number,
  updates: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await apiClient.put<ApiResponse<UserInfo>>(
    `/admin/users/${userId}`,
    updates,
  );

  return getApiData(response);
};

/**
 * 사용자 비활성화
 */
export const deactivateUser = async (userId: number): Promise<void> => {
  const response = await apiClient.put<ApiResponse<void>>(
    `/admin/users/${userId}/deactivate`,
  );

  getApiData(response);
};

/**
 * 알림 전송
 */
export const sendNotification = async (
  notification: NotificationRequest,
): Promise<NotificationResponse> => {
  const response = await apiClient.post<ApiResponse<NotificationResponse>>(
    '/admin/notifications',
    notification,
  );

  return getApiData(response);
};

/**
 * 알림 전송 내역 조회
 */
export const getNotificationHistory = async (): Promise<
  NotificationResponse[]
> => {
  const response = await apiClient.get<ApiResponse<NotificationResponse[]>>(
    '/admin/notifications/history',
  );

  return getApiData(response);
};

/**
 * 알림 예약
 */
export const scheduleNotification = async (
  notification: NotificationRequest,
  scheduledDate: string,
): Promise<NotificationResponse> => {
  const response = await apiClient.post<ApiResponse<NotificationResponse>>(
    '/admin/notifications/schedule',
    {
      ...notification,
      scheduledDate,
    },
  );

  return getApiData(response);
};

/**
 * 시스템 설정 조회
 */
export const getSystemSettings = async (): Promise<{
  dailyFreeTestLimit: number;
  premiumPriceMonthly: number;
  premiumPriceYearly: number;
  maintenanceMode: boolean;
}> => {
  const response = await apiClient.get<ApiResponse<{
    dailyFreeTestLimit: number;
    premiumPriceMonthly: number;
    premiumPriceYearly: number;
    maintenanceMode: boolean;
  }>>('/admin/settings');

  return getApiData(response);
};

/**
 * 시스템 설정 업데이트
 */
export const updateSystemSettings = async (settings: {
  dailyFreeTestLimit?: number;
  premiumPriceMonthly?: number;
  premiumPriceYearly?: number;
  maintenanceMode?: boolean;
}): Promise<void> => {
  const response = await apiClient.put<ApiResponse<void>>(
    '/admin/settings',
    settings,
  );

  getApiData(response);
};

/**
 * 전체 수익 통계 조회
 */
export const getRevenueStats = async (
  startDate?: string,
  endDate?: string,
): Promise<{
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueByPlan: Array<{planName: string; revenue: number; count: number}>;
}> => {
  const response = await apiClient.get<ApiResponse<{
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    revenueByPlan: Array<{planName: string; revenue: number; count: number}>;
  }>>('/admin/revenue', {
    params: {
      startDate,
      endDate,
    },
  });

  return getApiData(response);
};

export default {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  sendNotification,
  getNotificationHistory,
  scheduleNotification,
  getSystemSettings,
  updateSystemSettings,
  getRevenueStats,
};
