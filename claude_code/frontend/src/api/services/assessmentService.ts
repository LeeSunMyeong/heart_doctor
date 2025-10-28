/**
 * Assessment Service
 * 건강 검사 관련 API (Check + Prediction)
 */

import apiClient, {getApiData} from '../client';
import {
  CheckRequest,
  CheckResponse,
  PredictionResponse,
  ApiResponse,
} from '../types';

/**
 * 건강 검사 제출
 * Check 생성 + Prediction 자동 실행
 */
export const submitAssessment = async (
  assessmentData: CheckRequest,
): Promise<{
  check: CheckResponse;
  prediction: PredictionResponse;
}> => {
  // 1. Check 생성
  const checkResponse = await apiClient.post<ApiResponse<CheckResponse>>(
    '/checks',
    assessmentData,
  );

  const check = getApiData(checkResponse);

  // 2. Prediction 생성 (checkId 기반)
  const predictionResponse = await apiClient.post<
    ApiResponse<PredictionResponse>
  >('/predictions', {
    checkId: check.checkId,
  });

  const prediction = getApiData(predictionResponse);

  return {check, prediction};
};

/**
 * 사용자의 모든 검사 기록 조회
 */
export const getAssessmentHistory = async (
  userId: number,
): Promise<CheckResponse[]> => {
  const response = await apiClient.get<ApiResponse<CheckResponse[]>>(
    `/checks/user/${userId}`,
  );

  return getApiData(response);
};

/**
 * 특정 검사 상세 조회
 */
export const getAssessmentById = async (
  checkId: number,
): Promise<CheckResponse> => {
  const response = await apiClient.get<ApiResponse<CheckResponse>>(
    `/checks/${checkId}`,
  );

  return getApiData(response);
};

/**
 * 특정 검사의 Prediction 조회
 */
export const getPredictionByCheckId = async (
  checkId: number,
): Promise<PredictionResponse> => {
  const response = await apiClient.get<ApiResponse<PredictionResponse>>(
    `/predictions/check/${checkId}`,
  );

  return getApiData(response);
};

/**
 * 사용자의 최근 검사 조회
 */
export const getRecentAssessment = async (
  userId: number,
): Promise<CheckResponse> => {
  const response = await apiClient.get<ApiResponse<CheckResponse>>(
    `/checks/user/${userId}/recent`,
  );

  return getApiData(response);
};

/**
 * 오늘 검사한 횟수 조회
 */
export const getTodayAssessmentCount = async (
  userId: number,
): Promise<{count: number; limit: number}> => {
  const response = await apiClient.get<
    ApiResponse<{count: number; limit: number}>
  >(`/checks/user/${userId}/today`);

  return getApiData(response);
};

/**
 * 날짜 범위로 검사 기록 조회
 */
export const getAssessmentsByDateRange = async (
  userId: number,
  startDate: string,
  endDate: string,
): Promise<CheckResponse[]> => {
  const response = await apiClient.get<ApiResponse<CheckResponse[]>>(
    `/checks/user/${userId}/range`,
    {
      params: {
        startDate,
        endDate,
      },
    },
  );

  return getApiData(response);
};

/**
 * 고위험 검사 기록 조회
 */
export const getHighRiskAssessments = async (
  userId: number,
): Promise<PredictionResponse[]> => {
  const response = await apiClient.get<ApiResponse<PredictionResponse[]>>(
    `/predictions/user/${userId}/high-risk`,
  );

  return getApiData(response);
};

/**
 * 사용자 검사 통계 조회
 */
export const getAssessmentStatistics = async (
  userId: number,
): Promise<{
  totalAssessments: number;
  averageRiskLevel: string;
  highRiskCount: number;
  lowRiskCount: number;
  lastAssessmentDate: string;
}> => {
  const response = await apiClient.get<ApiResponse<{
    totalAssessments: number;
    averageRiskLevel: string;
    highRiskCount: number;
    lowRiskCount: number;
    lastAssessmentDate: string;
  }>>(`/checks/user/${userId}/statistics`);

  return getApiData(response);
};

export default {
  submitAssessment,
  getAssessmentHistory,
  getAssessmentById,
  getPredictionByCheckId,
  getRecentAssessment,
  getTodayAssessmentCount,
  getAssessmentsByDateRange,
  getHighRiskAssessments,
  getAssessmentStatistics,
};
