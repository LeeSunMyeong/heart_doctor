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
 * Updated to match backend CheckRequest DTO
 * User data is extracted from JWT token via @AuthenticationPrincipal
 */
export interface CheckRequest {
  // Basic Information
  gender: boolean; // false:남, true:여
  age: number;
  height: number; // cm
  weight: number; // kg

  // Vital Signs
  temperature: string; // "0":보통, "1":낮음, "2":높음
  breathing: string; // "0":보통, "1":낮음, "2":높음
  pulse: number; // 30~220 bpm

  // 16 Symptoms (boolean)
  chestPain?: boolean; // Q1. 가슴 통증
  flankPain?: boolean; // Q2. 옆구리 통증
  footPain?: boolean; // Q3. 발 통증
  footEdema?: boolean; // Q4. 발 부종
  dyspnea?: boolean; // Q5. 호흡곤란
  syncope?: boolean; // Q6. 실신
  weakness?: boolean; // Q7. 피로감
  vomitting?: boolean; // Q8. 구토
  palpitation?: boolean; // Q9. 심장 두근거림
  dizziness?: boolean; // Q10. 어지러움
  chestTightness?: boolean; // Q11. 흉부 답답함
  sweating?: boolean; // Q12. 식은땀
  headache?: boolean; // Q13. 두통
  nausea?: boolean; // Q14. 메스꺼움
  edema?: boolean; // Q15. 부종
  insomnia?: boolean; // Q16. 수면장애
}

export interface CheckResponse {
  checkId: number;
  userId: number;
  assessmentTime: string;

  // Basic Information
  gender: boolean;
  age: number;
  height: number;
  weight: number;
  bmi: number;

  // Vital Signs
  temperature: string;
  breathing: string;
  pulse: number;

  // Symptoms
  chestPain: boolean;
  flankPain: boolean;
  footPain: boolean;
  footEdema: boolean;
  dyspnea: boolean;
  syncope: boolean;
  weakness: boolean;
  vomitting: boolean;
  palpitation: boolean;
  dizziness: boolean;
  chestTightness: boolean;
  sweating: boolean;
  headache: boolean;
  nausea: boolean;
  edema: boolean;
  insomnia: boolean;

  // Additional info
  symptomCount: number;
  riskLevel: string;
}

/**
 * Prediction Request DTO
 * User data is extracted from JWT token on backend via @AuthenticationPrincipal
 */
export interface PredictionRequest {
  checkId: number;
}

export interface PredictionResponse {
  predictionId: number;
  predictTime: string;
  diagnosis: 'NORMAL' | 'ANGINA' | 'MYOCARDIAL_INFARCTION' | 'HEART_FAILURE' | 'ATRIAL_FIBRILLATION' | 'OTHER';
  diagnosisKorean: string;
  highestProbability: number;
  probabilities: {
    normal: number;
    angina: number;
    mi: number;
    hf: number;
    af: number;
    other: number;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  medicalReviewRecommended: boolean;
  alertMessage: string;
  comment: string;
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
