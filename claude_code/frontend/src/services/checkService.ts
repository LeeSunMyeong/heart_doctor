/**
 * Check Service
 * 건강 검사 데이터 변환 및 제출
 * User data is extracted from JWT token on backend via @AuthenticationPrincipal
 */

import {submitAssessment} from '../api/services/assessmentService';
import {createPrediction} from '../api/services/predictionService';
import {CheckRequest, CheckResponse, PredictionResponse} from '../api/types';

/**
 * HomeScreen AssessmentData interface
 */
export interface AssessmentData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  bodyTemperature: string;
  breathing: string;
  pulse: string;
  chestPain: string;
  flankPain: string;
  footPain: string;
  edemaLegs: string;
  dyspnea: string;
  syncope: string;
  weakness: string;
  vomiting: string;
  palpitation: string;
  dizziness: string;
}

/**
 * AssessmentData를 CheckRequest로 변환
 * User data is no longer sent - extracted from JWT token on backend
 */
export const transformAssessmentData = (
  data: AssessmentData,
): CheckRequest => {
  // Helper function: yes/no string을 boolean으로 변환
  const yesNoToBoolean = (value: string): boolean => {
    return value.toLowerCase() === 'yes' || value.toLowerCase() === '예';
  };

  // Helper function: 체온/호흡 문자열을 숫자 문자열로 변환
  const temperatureBreathingToCode = (value: string): string => {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'low' || lowerValue === '낮음') {
      return '1';
    } else if (lowerValue === 'high' || lowerValue === '높음' || lowerValue === 'fast' || lowerValue === '빠름') {
      return '2';
    } else {
      return '0'; // normal, 보통
    }
  };

  return {
    // Basic Information
    gender: data.gender.toLowerCase() === 'female' || data.gender === '여' || data.gender === '여성',
    age: parseInt(data.age, 10),
    height: parseInt(data.height, 10),
    weight: parseInt(data.weight, 10),

    // Vital Signs
    temperature: temperatureBreathingToCode(data.bodyTemperature),
    breathing: temperatureBreathingToCode(data.breathing),
    pulse: parseInt(data.pulse, 10),

    // Symptoms (only include the ones present in HomeScreen)
    chestPain: yesNoToBoolean(data.chestPain),
    flankPain: yesNoToBoolean(data.flankPain),
    footPain: yesNoToBoolean(data.footPain),
    footEdema: yesNoToBoolean(data.edemaLegs),
    dyspnea: yesNoToBoolean(data.dyspnea),
    syncope: yesNoToBoolean(data.syncope),
    weakness: yesNoToBoolean(data.weakness),
    vomitting: yesNoToBoolean(data.vomiting),
    palpitation: yesNoToBoolean(data.palpitation),
    dizziness: yesNoToBoolean(data.dizziness),

    // 나머지 6개 증상은 UI에 없으므로 기본값 false
    chestTightness: false,
    sweating: false,
    headache: false,
    nausea: false,
    edema: false,
    insomnia: false,
  };
};

/**
 * 건강 검사 제출 및 진단 예측
 */
export const submitCheck = async (
  data: AssessmentData,
): Promise<{check: CheckResponse; prediction: PredictionResponse}> => {
  try {
    // 1. 데이터 변환
    const checkRequest = transformAssessmentData(data);

    console.log('[CheckService] 변환된 데이터:', checkRequest);

    // 2. 검사 데이터 저장 (JWT token will be sent in Authorization header)
    const checkResponse = await submitAssessment(checkRequest);

    console.log('[CheckService] 검사 제출 성공:', checkResponse);

    // 3. 저장된 checkId로 진단 예측 생성
    console.log('[CheckService] 진단 예측 요청 시작...');
    const prediction = await createPrediction({
      checkId: checkResponse.checkId,
    });

    console.log('[CheckService] 진단 예측 성공:', prediction);

    return {
      check: checkResponse,
      prediction: prediction,
    };
  } catch (error) {
    console.error('[CheckService] 검사 제출 또는 진단 실패:', error);
    throw error;
  }
};
