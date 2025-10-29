/**
 * Prediction Service
 * AI 진단 예측 API 서비스
 * JWT token is automatically sent via Authorization header by api
 */

import {api} from '../../services/api';
import {PredictionRequest, PredictionResponse} from '../types';

/**
 * 진단 예측 생성 (Mock 데이터)
 * POST /api/predictions
 */
export const createPrediction = async (
  request: PredictionRequest,
): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>(
    '/predictions',
    request,
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || '진단 예측 생성에 실패했습니다.');
  }

  return response.data;
};

/**
 * 검사별 진단 결과 조회
 * GET /api/predictions/check/{checkId}
 */
export const getPredictionByCheckId = async (
  checkId: number,
): Promise<PredictionResponse> => {
  const response = await api.get<PredictionResponse>(
    `/predictions/check/${checkId}`,
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || '진단 결과 조회에 실패했습니다.');
  }

  return response.data;
};
