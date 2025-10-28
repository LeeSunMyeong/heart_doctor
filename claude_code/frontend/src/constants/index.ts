// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FIND_EMAIL: '/auth/find-email',
    PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm',
  },
  // 검사
  CHECKS: {
    CREATE: '/checks',
    GET: (id: number) => `/checks/${id}`,
    UPDATE: (id: number) => `/checks/${id}`,
    USER_HISTORY: (userId: number) => `/checks/user/${userId}`,
  },
  // AI 진단
  PREDICTIONS: {
    CREATE: '/predictions',
    GET: (id: number) => `/predictions/${id}`,
  },
  // 구독
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CREATE: '/subscriptions',
    CANCEL: (id: number) => `/subscriptions/${id}/cancel`,
    USER: (userId: number) => `/subscriptions/user/${userId}`,
    ACTIVE: (userId: number) => `/subscriptions/user/${userId}/active`,
  },
  // 결제
  PAYMENTS: {
    CREATE: '/payments',
    COMPLETE: (id: number) => `/payments/${id}/complete`,
    GET: (id: number) => `/payments/${id}`,
    HISTORY: (userId: number) => `/payments/history/${userId}`,
    REFUND: (id: number) => `/payments/${id}/refund`,
  },
  // 설정
  SETTINGS: {
    GET: (userId: number) => `/settings/${userId}`,
    UPDATE: (userId: number) => `/settings/${userId}`,
    TOGGLE_PUSH: (userId: number) => `/settings/${userId}/push-notification/toggle`,
    TOGGLE_DARK_MODE: (userId: number) => `/settings/${userId}/dark-mode/toggle`,
    RESET: (userId: number) => `/settings/${userId}/reset`,
  },
  // 알림
  NOTIFICATIONS: {
    LIST: (userId: number) => `/notifications/user/${userId}`,
    UNREAD: (userId: number) => `/notifications/user/${userId}/unread`,
    UNREAD_COUNT: (userId: number) => `/notifications/user/${userId}/unread-count`,
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: (userId: number) => `/notifications/user/${userId}/read-all`,
    DELETE: (id: number) => `/notifications/${id}`,
  },
} as const;

// 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// 앱 설정
export const APP_CONFIG = {
  APP_NAME: 'Heart Check',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'ko',
  SUPPORTED_LANGUAGES: ['ko', 'en'],
} as const;

// 테마 색상
export const COLORS = {
  primary: '#0ea5e9',
  secondary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: {
    light: '#ffffff',
    dark: '#1f2937',
  },
  text: {
    light: '#1f2937',
    dark: '#f9fafb',
  },
} as const;

// 심장질환 16개 증상 (백엔드 Check 엔티티와 매칭)
export const HEART_SYMPTOMS = {
  CHEST_PAIN: {
    key: 'chestPain',
    label: '가슴 통증',
    description: '가슴에 압박감이나 통증이 있나요?',
  },
  SHORTNESS_OF_BREATH: {
    key: 'shortnessOfBreath',
    label: '호흡 곤란',
    description: '숨이 차거나 호흡이 어렵나요?',
  },
  HEART_PALPITATIONS: {
    key: 'heartPalpitations',
    label: '심계항진',
    description: '심장이 두근거리거나 불규칙하게 뛰나요?',
  },
  FATIGUE: {
    key: 'fatigue',
    label: '피로감',
    description: '지속적인 피로나 무기력함을 느끼나요?',
  },
  DIZZINESS: {
    key: 'dizziness',
    label: '어지러움',
    description: '어지럽거나 현기증이 나나요?',
  },
  SWELLING: {
    key: 'swelling',
    label: '부종',
    description: '발목이나 다리에 부종이 있나요?',
  },
  NAUSEA: {
    key: 'nausea',
    label: '메스꺼움',
    description: '속이 메스껍거나 구토를 하나요?',
  },
  EXCESSIVE_SWEATING: {
    key: 'excessiveSweating',
    label: '과도한 발한',
    description: '평소보다 땀을 많이 흘리나요?',
  },
  IRREGULAR_HEARTBEAT: {
    key: 'irregularHeartbeat',
    label: '불규칙한 심박',
    description: '심장 박동이 불규칙한가요?',
  },
  WEAKNESS: {
    key: 'weakness',
    label: '전신 쇠약',
    description: '전신에 힘이 없나요?',
  },
  COUGHING: {
    key: 'coughing',
    label: '기침',
    description: '지속적인 기침이 있나요?',
  },
  RAPID_WEIGHT_GAIN: {
    key: 'rapidWeightGain',
    label: '급격한 체중 증가',
    description: '최근 급격히 체중이 늘었나요?',
  },
  LEG_CRAMPS: {
    key: 'legCramps',
    label: '다리 경련',
    description: '다리에 경련이 자주 일어나나요?',
  },
  BACK_PAIN: {
    key: 'backPain',
    label: '등 통증',
    description: '등이나 어깨에 통증이 있나요?',
  },
  INDIGESTION: {
    key: 'indigestion',
    label: '소화불량',
    description: '소화가 잘 안되나요?',
  },
  SLEEP_DISTURBANCE: {
    key: 'sleepDisturbance',
    label: '수면 장애',
    description: '잠을 잘 못 자나요?',
  },
} as const;

// 6가지 심장질환 타입
export const HEART_DISEASE_TYPES = {
  NORMAL: { key: 'normal', label: '정상', color: '#10b981' },
  ANGINA: { key: 'angina', label: '협심증', color: '#f59e0b' },
  MYOCARDIAL_INFARCTION: { key: 'myocardialInfarction', label: '심근경색', color: '#ef4444' },
  ARRHYTHMIA: { key: 'arrhythmia', label: '부정맥', color: '#ec4899' },
  HEART_FAILURE: { key: 'heartFailure', label: '심부전', color: '#8b5cf6' },
  VALVULAR_DISEASE: { key: 'valvularDisease', label: '판막질환', color: '#3b82f6' },
} as const;

// 구독 플랜 타입
export const SUBSCRIPTION_PLANS = {
  MONTHLY: { key: 'MONTHLY', label: '월간', duration: 30 },
  YEARLY: { key: 'YEARLY', label: '연간', duration: 365 },
  LIFETIME: { key: 'LIFETIME', label: '평생', duration: -1 },
} as const;

// 결제 상태
export const PAYMENT_STATUS = {
  PENDING: { key: 'PENDING', label: '대기중', color: '#f59e0b' },
  SUCCESS: { key: 'SUCCESS', label: '성공', color: '#10b981' },
  FAIL: { key: 'FAIL', label: '실패', color: '#ef4444' },
  CANCELED: { key: 'CANCELED', label: '취소됨', color: '#6b7280' },
  REFUNDED: { key: 'REFUNDED', label: '환불됨', color: '#8b5cf6' },
} as const;

// 알림 타입
export const NOTIFICATION_TYPES = {
  SYSTEM: { key: 'SYSTEM', label: '시스템', icon: 'settings' },
  HEALTH: { key: 'HEALTH', label: '건강', icon: 'heart' },
  PAYMENT: { key: 'PAYMENT', label: '결제', icon: 'credit-card' },
  SUBSCRIPTION: { key: 'SUBSCRIPTION', label: '구독', icon: 'calendar' },
  PROMOTION: { key: 'PROMOTION', label: '프로모션', icon: 'gift' },
  SECURITY: { key: 'SECURITY', label: '보안', icon: 'shield' },
  UPDATE: { key: 'UPDATE', label: '업데이트', icon: 'download' },
  REMINDER: { key: 'REMINDER', label: '리마인더', icon: 'bell' },
} as const;

export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  APP_CONFIG,
  COLORS,
  HEART_SYMPTOMS,
  HEART_DISEASE_TYPES,
  SUBSCRIPTION_PLANS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
};
