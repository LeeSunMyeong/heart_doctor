// 사용자 타입
export interface User {
  userId: number;
  email: string;
  userName: string;
  phone: string;
  userDob: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 검사 타입
export interface Check {
  checkId: number;
  user: User;
  // 16개 증상
  chestPain: boolean;
  shortnessOfBreath: boolean;
  heartPalpitations: boolean;
  fatigue: boolean;
  dizziness: boolean;
  swelling: boolean;
  nausea: boolean;
  excessiveSweating: boolean;
  irregularHeartbeat: boolean;
  weakness: boolean;
  coughing: boolean;
  rapidWeightGain: boolean;
  legCramps: boolean;
  backPain: boolean;
  indigestion: boolean;
  sleepDisturbance: boolean;
  // 생체 데이터
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number;
  cholesterol?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  createdAt: string;
  updatedAt: string;
}

// AI 진단 결과 타입
export interface Prediction {
  predictionId: number;
  check: Check;
  // 6가지 질환 확률
  normal: number;
  angina: number;
  myocardialInfarction: number;
  arrhythmia: number;
  heartFailure: number;
  valvularDisease: number;
  // 메타데이터
  modelVersion: string;
  confidence: number;
  recommendations?: string;
  createdAt: string;
}

// 구독 타입
export interface Subscription {
  id: number;
  user: User;
  costModel: CostModel;
  fromDate: string;
  toDate: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
}

// 요금제 타입
export interface CostModel {
  costId: number;
  type: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  cost: number;
  description?: string;
  features?: string[];
}

// 결제 타입
export interface Payment {
  id: number;
  user: User;
  costModel: CostModel;
  status: 'PENDING' | 'SUCCESS' | 'FAIL' | 'CANCELED' | 'REFUNDED';
  storeInfo: string; // 'G' for Google Play, 'A' for App Store
  transactionId?: string;
  payTime: string;
  refundTime?: string;
}

// 설정 타입
export interface Setting {
  id: number;
  user: User;
  // 알림 설정
  pushNotification: boolean;
  emailNotification: boolean;
  marketingNotification: boolean;
  // UI 설정
  darkMode: boolean;
  language: string; // 'ko' or 'en'
  // 보안 설정
  privacyLevel: number; // 1: Low, 2: Medium, 3: High
  sessionTimeout: number; // 분 단위
  // 데이터 설정
  autoBackup: boolean;
  dataSaveMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// 알림 타입
export interface Notification {
  id: number;
  user: User;
  type: 'SYSTEM' | 'HEALTH' | 'PAYMENT' | 'SUBSCRIPTION' | 'PROMOTION' | 'SECURITY' | 'UPDATE' | 'REMINDER';
  title: string;
  message: string;
  url?: string;
  isRead: boolean;
  readTime?: string;
  sentTime: string;
  scheduledTime?: string;
  priority: number; // 1: Low, 2: Normal, 3: High, 4: Urgent
}

// 일일 사용량 할당 타입
export interface DailyUsageQuota {
  id: number;
  user: User;
  usageDate: string;
  usageCount: number;
  maxUsage: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PageRequest {
  page: number;
  size: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 내비게이션 타입
export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Signup: undefined;
  Register: undefined;
  FindId: undefined;
  ResetPassword: undefined;
  AccountRecovery: undefined;
  ForgotPassword: undefined;

  // Main Tab
  MainTabs: undefined;

  // Home Stack
  Home: undefined;
  CheckTest: undefined;
  CheckResult: { predictionId: number };

  // Health Stack
  Health: undefined;
  HealthHistory: undefined;
  HealthDetail: { checkId: number };

  // Subscription Stack
  Subscription: undefined;
  SubscriptionPlans: undefined;
  Payment: { planId: number };

  // Profile Stack
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
  NotificationDetail: { notificationId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Health: undefined;
  Subscription: undefined;
  Profile: undefined;
};

// 평가 폼 타입 (간소화된 건강 검사 입력)
export interface AssessmentForm {
  // 기본 정보
  age: number | null;
  sex: 'M' | 'F' | null;

  // 심장 관련 수치
  chestPainType: number | null; // 0-3
  restingBP: number | null; // 혈압
  cholesterol: number | null; // 콜레스테롤
  fastingBS: number | null; // 공복 혈당 (0: <=120mg/dl, 1: >120mg/dl)
  restingECG: number | null; // 심전도 결과 (0-2)
  maxHR: number | null; // 최대 심박수
  exerciseAngina: boolean | null; // 운동 유발 협심증
  oldpeak: number | null; // ST 우울증
  stSlope: number | null; // ST 경사 (0-2)
}

// 평가 결과 타입
export interface AssessmentResult {
  id: string;
  formData: AssessmentForm;
  predictions: {
    normal: number;
    angina: number;
    myocardialInfarction: number;
    arrhythmia: number;
    heartFailure: number;
    valvularDisease: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  recommendations: string[];
  createdAt: string;
}

// 구독 플랜 타입 (앱 내 표시용)
export interface SubscriptionPlan {
  id: string;
  type: 'free' | 'premium';
  name: string;
  price: number;
  duration: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  popular?: boolean;
  usageLimit: number; // -1 for unlimited
}

// 결제 수단 타입
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'google_pay' | 'apple_pay';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: string;
}

// 설정 관련 타입
export type ThemeMode = 'light' | 'dark' | 'system';

export type InputMethod = 'manual' | 'voice' | 'camera';

export interface SettingsMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  screen?: string;
  action?: () => void;
  value?: string | boolean;
  showArrow?: boolean;
}

// 관리자 관련 타입
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAssessments: number;
  premiumUsers: number;
  totalRevenue: number;
  averageRiskScore: number;
  newUsersToday: number;
  assessmentsToday: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  recipients: 'all' | 'premium' | 'free' | 'high_risk';
  scheduledDate?: string;
  sentDate?: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  updatedAt: string;
}

export interface UserManagementItem {
  userId: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  subscriptionType: 'free' | 'premium';
  assessmentCount: number;
  lastAssessment?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  createdAt: string;
}
