/**
 * API Response Types
 * 백엔드 ApiResponse<T> 구조를 정의
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  requestId?: string;
  error?: ErrorInfo;
}

export interface ErrorInfo {
  code: string;
  description: string;
  field?: string;
}

/**
 * Auth API Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserInfo;
  tokens: TokenInfo;
}

export interface UserInfo {
  userId: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  userType: 'FREE' | 'PREMIUM' | 'ADMIN';
  subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'TRIAL';
  remainingFreeTests?: number;
  dailyTestLimit?: number;
  subscriptionExpiry?: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // 초 단위
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
  agreeToTerms: boolean;
}

export interface UserRegistrationResponse {
  userId: number;
  email: string;
  name: string;
}

export interface PasswordResetRequest {
  email: string;
}

/**
 * Assessment API Types
 */
export interface CheckRequest {
  // Basic Information
  age: number;
  sex: 'M' | 'F';

  // Vital Signs
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  maxHR: number;

  // Heart Metrics
  chestPainType: 0 | 1 | 2 | 3;
  restingECG: 0 | 1 | 2;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 0 | 1 | 2;
}

export interface CheckResponse {
  checkId: number;
  userId: number;
  // Check data fields
  age: number;
  sex: string;
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  maxHR: number;
  chestPainType: number;
  restingECG: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: number;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionResponse {
  predictionId: number;
  checkId: number;
  userId: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  predictions: {
    normal?: number;
    angina?: number;
    myocardialInfarction?: number;
    arrhythmia?: number;
    heartFailure?: number;
    valvularDisease?: number;
  };
  recommendations: string[];
  createdAt: string;
}

/**
 * Payment API Types
 */
export interface PaymentRequest {
  userId: number;
  subscriptionPlanId: number;
  paymentMethod: string;
  amount: number;
}

export interface PaymentResponse {
  paymentId: number;
  userId: number;
  transactionId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAIL' | 'CANCELED' | 'REFUNDED';
  paymentMethod: string;
  createdAt: string;
}

/**
 * Admin API Types
 */
export interface AdminStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalAssessments: number;
  premiumUsers: number;
  totalRevenue: number;
  averageRiskScore: number;
  newUsersToday: number;
  assessmentsToday: number;
}

export interface NotificationRequest {
  title: string;
  message: string;
  recipients: 'all' | 'premium' | 'free' | 'high_risk';
}

export interface NotificationResponse {
  notificationId: number;
  title: string;
  message: string;
  recipients: string;
  sentDate: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
}
