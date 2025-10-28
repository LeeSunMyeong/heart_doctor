# Readdy 디자인 분석 및 적용 계획

## 📋 목차
1. [Readdy 디자인 분석](#readdy-디자인-분석)
2. [현재 구현 상태](#현재-구현-상태)
3. [적용되지 않은 디자인 요소](#적용되지-않은-디자인-요소)
4. [디자인 적용 플랜](#디자인-적용-플랜)

---

## 1. Readdy 디자인 분석

### 1.1 공통 디자인 시스템

#### 헤더 구조
- **상단 아이콘 메뉴** (5개 아이콘)
  - 설정 (ri-settings-3-line)
  - 결제/구독 (ri-bank-card-line)
  - 알림 (ri-notification-3-line) + 빨간 점 배지
  - 이력 (ri-history-line)
  - 로그인/로그아웃 (ri-login-box-line / ri-logout-box-line)
  - 스타일: 회색 배경 (`bg-gray-100`), 둥근 형태 (`rounded-full`)

- **앱 제목**
  - "심장 건강지표 분석 도구"
  - 폰트: Pacifico (serif)
  - 크기: `text-xl font-bold`
  - 색상: `text-black`

- **뒤로가기 버튼**
  - 왼쪽 상단에 배치
  - 회색 배경 (`bg-gray-100`)
  - 아이콘: `ri-arrow-left-line`

#### 색상 시스템
```css
주요 색상:
- 배경: #FFFFFF (white)
- 강조: #EF4444 (red-500, red-600)
- 텍스트: #000000 (black), #374151 (gray-700)
- 버튼:
  - 활성: #000000 (black background, white text)
  - 비활성: #FFFFFF (white background, gray border)
- 입력 필드:
  - 테두리: #D1D5DB (gray-300)
  - 포커스: #EF4444 (red-500)

보조 색상:
- 성공: #10B981 (green-600)
- 경고: #F59E0B (yellow-400)
- 정보: #3B82F6 (blue-500)
- 프리미엄: #8B5CF6 (purple-600)
```

#### 타이포그래피
```
제목: text-xl ~ text-2xl, font-bold
부제목: text-lg, font-bold
본문: text-sm ~ text-base
라벨: text-xs ~ text-sm, font-medium
```

#### 레이아웃
- 패딩: `px-4 ~ px-6`, `py-2 ~ py-4`
- 여백: `space-y-3 ~ space-y-4`
- 둥근 모서리: `rounded-lg` (8px)
- 카드: `border border-gray-200`, `shadow-sm`

---

### 1.2 페이지별 디자인 분석

#### 🏠 Home (홈 화면)
**디자인 특징:**
- 컴팩트한 폼 디자인
- 3개 섹션: 기본 정보, 생체 정보, 증상 체크
- 회색 배경 카드 안에 흰색 섹션
- 작은 폰트 (12px~14px)
- 검정 배경 선택 버튼
- 빨간색 제출 버튼
- 맥박 측정 모달

#### 🔐 Login (로그인)
**디자인 특징:**
- 중앙 정렬 폼
- 빨간색 하트 아이콘 (80x80px, `bg-red-100`)
- 이메일 + 비밀번호 입력
- 비밀번호 표시/숨김 토글
- "로그인 상태 유지" 체크박스
- 빨간색 로그인 버튼
- 구분선 + "또는" 텍스트
- 소셜 로그인 버튼:
  - Google: 흰 배경, 테두리
  - Kakao: 노란색 배경 (`bg-yellow-400`)
- 회원가입 링크

#### 📝 Signup (회원가입)
**디자인 특징:**
- 긴 폼 구조 (스크롤 가능)
- 필드: 이름, 이메일, 비밀번호, 비밀번호 확인, 휴대폰, 생년월일, 성별
- 비밀번호 힌트 텍스트 (`text-xs text-gray-500`)
- 약관 동의:
  - 전체 동의
  - 필수: 이용약관, 개인정보 처리방침
  - 선택: 마케팅 정보 수신
  - "보기" 링크 (`text-xs text-gray-500 underline`)
- 빨간색 회원가입 버튼
- 소셜 가입 옵션
- 로그인 링크

#### 📊 Result (결과 화면)
**디자인 특징:**
- 그라데이션 배경 (`bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100`)
- 반투명 헤더 (`bg-white/80 backdrop-blur-sm`)
- 중앙 이미지 표시
- 큰 제목 (`text-2xl font-bold`)
- 반투명 정보 박스 (`bg-white/90 backdrop-blur-sm`)
- 검정 배경 버튼 ("새 검사 시작하기")

#### 💳 Pricing (요금제)
**디자인 특징:**
- 현재 구독 상태 표시 (그라데이션 배경)
- 사용량 진행 바
- 4가지 요금제:
  - 무료 체험 (회색)
  - 월간 (파란색, "추천" 배지)
  - 연간 (초록색, "17% 할인" 배지)
  - 종신 (보라색, "최고 할인" 배지)
- 할인 전/후 가격 표시
- 기능 목록 (체크/엑스 아이콘)
- FAQ 섹션 (`bg-gray-50`)
- 하단 고정 구독 버튼

#### 🔔 Notifications (알림)
**디자인 특징:**
- 필터 탭 (전체/읽지 않음)
- 알림 타입 아이콘:
  - info: `ri-information-line` (파란색)
  - warning: `ri-alert-line` (노란색)
  - success: `ri-check-line` (초록색)
  - urgent: `ri-error-warning-line` (빨간색)
- 읽지 않음 표시 (파란 점)
- 상대 시간 표시 ("2시간 전", "3일 전")
- "읽음 표시" 버튼
- 삭제 버튼 (휴지통 아이콘)

#### 📜 History (이력)
**디자인 특징:**
- 탭 전환 (검사 이력 / 결제 이력)
- 테이블 레이아웃:
  - 헤더 (`bg-gray-50`)
  - 행 구분선 (`divide-y`)
  - 호버 효과 (`hover:bg-gray-50`)
- 상태 배지:
  - 정상: 초록색
  - 비정상: 빨간색
  - 완료: 초록색
  - 대기중: 노란색
  - 실패: 빨간색
- 빈 상태 화면:
  - 큰 아이콘 (24x24)
  - 안내 메시지
  - CTA 버튼

---

## 2. 현재 구현 상태

### 2.1 구현된 화면
| 화면 | 파일 | 상태 | 디자인 적용 |
|------|------|------|------------|
| Home | HomeScreen.tsx | ✅ 완료 | ✅ Readdy 디자인 적용됨 |
| Login | LoginScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |
| Signup | SignupScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |
| Result | ResultScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |
| Pricing | PricingScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |
| Notifications | NotificationsScreen.tsx | ✅ 구현됨 | ❌ 빈 화면 |
| History | HistoryScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |
| Settings | SettingsScreen.tsx | ✅ 구현됨 | ❌ 리스트만 |
| AccountRecovery | AccountRecoveryScreen.tsx | ✅ 구현됨 | ⚠️ 기본 디자인만 |

### 2.2 구현 필요한 화면
| 화면 | Readdy 파일 | 필요 여부 |
|------|-------------|-----------|
| Voice Assessment | assessment/voice/page.tsx | 🔴 높음 |
| Premium Home | home/premium/page.tsx | 🟡 중간 |
| Payment | payment/page.tsx | 🟠 높음 |
| PaymentHistory | payment-history/page.tsx | 🟢 낮음 (History 통합) |
| Theme Settings | settings/theme/page.tsx | 🟡 중간 |
| Notification Settings | settings/notifications/page.tsx | 🟡 중간 |
| Language Settings | settings/language/page.tsx | 🟡 중간 |
| Input Method Settings | settings/input-method/page.tsx | 🟡 중간 |
| Admin Dashboard | admin/dashboard/page.tsx | 🟢 낮음 |
| Admin Login | admin/login/page.tsx | 🟢 낮음 |

---

## 3. 적용되지 않은 디자인 요소

### 3.1 공통 요소
- ❌ Remix Icons 아이콘 시스템 (`ri-*`) → React Native는 Ionicons 사용
- ❌ Tailwind CSS 클래스 → StyleSheet 변환 필요
- ❌ 웹 폰트 (Pacifico) → React Native 폰트 설정 필요
- ❌ backdrop-blur 효과 → React Native에서 제한적 지원

### 3.2 화면별 미적용 요소

#### Login & Signup
- ❌ 중앙 정렬 레이아웃
- ❌ 빨간 하트 아이콘
- ❌ 소셜 로그인 버튼 디자인
- ❌ 비밀번호 표시/숨김 토글
- ❌ 약관 동의 UI (Signup)
- ❌ "보기" 링크 스타일

#### Result
- ❌ 그라데이션 배경
- ❌ 반투명 헤더
- ❌ 이미지 표시 (Readdy API 연동)
- ❌ 반투명 정보 박스

#### Pricing
- ❌ 현재 구독 상태 카드
- ❌ 사용량 진행 바
- ❌ 요금제 배지 ("추천", "할인")
- ❌ 할인 전/후 가격 표시
- ❌ 기능 체크리스트
- ❌ FAQ 섹션
- ❌ 색상별 구독 버튼

#### Notifications
- ❌ 전체 UI 구조
- ❌ 필터 탭
- ❌ 타입별 아이콘/색상
- ❌ 읽지 않음 표시
- ❌ 상대 시간 표시
- ❌ 읽음 표시/삭제 버튼

#### History
- ❌ 탭 전환 UI
- ❌ 테이블 레이아웃
- ❌ 상태 배지 스타일
- ❌ 빈 상태 화면

---

## 4. 디자인 적용 플랜

### 📅 Phase 1: 핵심 화면 디자인 (1주)
**우선순위: 🔴 높음**

#### 1.1 Login 화면 (2일)
```
작업 내용:
✅ 중앙 정렬 레이아웃
✅ 빨간 하트 아이콘 (LinearGradient 사용)
✅ 비밀번호 표시/숨김 토글
✅ 빨간색 로그인 버튼
✅ 소셜 로그인 버튼 (Google, Kakao)
✅ 회원가입 링크 스타일

컴포넌트:
- IconButton (재사용 가능한 아이콘 버튼)
- SocialLoginButton (소셜 로그인 버튼)
```

#### 1.2 Signup 화면 (2일)
```
작업 내용:
✅ 긴 폼 스크롤 레이아웃
✅ 비밀번호 힌트 텍스트
✅ 생년월일 입력 (DatePicker)
✅ 성별 선택 (라디오 버튼)
✅ 약관 동의 체크박스 리스트
✅ "보기" 링크 스타일
✅ 소셜 가입 버튼

컴포넌트:
- CheckboxList (약관 동의)
- RadioGroup (성별 선택)
```

#### 1.3 Result 화면 (3일)
```
작업 내용:
✅ 그라데이션 배경 (LinearGradient)
✅ 반투명 헤더 (BlurView 또는 rgba)
✅ 이미지 표시 (API 연동 또는 로컬)
✅ 반투명 정보 박스
✅ 검정 배경 버튼
✅ 정상/비정상 상태별 UI 분기

컴포넌트:
- GradientBackground
- TransparentCard
```

---

### 📅 Phase 2: 구독 시스템 디자인 (1주)
**우선순위: 🔴 높음**

#### 2.1 Pricing 화면 (3일)
```
작업 내용:
✅ 현재 구독 상태 카드
✅ 사용량 진행 바 (ProgressBar)
✅ 4가지 요금제 카드
✅ 배지 ("추천", "할인")
✅ 할인 전/후 가격 표시
✅ 기능 체크리스트 (아이콘)
✅ FAQ 섹션
✅ 하단 고정 구독 버튼
✅ 색상별 버튼 스타일

컴포넌트:
- SubscriptionCard
- ProgressBar
- FeatureCheckList
- Badge
```

#### 2.2 Payment 화면 (2일)
```
작업 내용:
✅ 결제 정보 입력 폼
✅ 카드 정보 입력
✅ 결제 수단 선택
✅ 결제 금액 표시
✅ 결제 버튼

컴포넌트:
- PaymentForm
- CardInput
```

#### 2.3 PaymentHistory 화면 (2일)
```
작업 내용:
✅ History 화면의 결제 탭으로 통합
✅ 테이블 레이아웃
✅ 날짜/금액/상태 표시
✅ 상태 배지
```

---

### 📅 Phase 3: 알림 & 이력 디자인 (3일)
**우선순위: 🟠 중간**

#### 3.1 Notifications 화면 (2일)
```
작업 내용:
✅ 필터 탭 (전체/읽지 않음)
✅ 알림 리스트
✅ 타입별 아이콘 (info, warning, success, urgent)
✅ 타입별 색상 배경
✅ 읽지 않음 표시 (파란 점)
✅ 상대 시간 표시 함수
✅ 읽음 표시 버튼
✅ 삭제 버튼
✅ 빈 상태 화면

컴포넌트:
- NotificationItem
- FilterTabs
- EmptyState
```

#### 3.2 History 화면 (1일)
```
작업 내용:
✅ 탭 전환 UI (검사 이력 / 결제 이력)
✅ 테이블 헤더/본문 레이아웃
✅ 상태 배지 (정상/비정상, 완료/대기/실패)
✅ 호버 효과
✅ 빈 상태 화면

컴포넌트:
- TabBar
- TableRow
- StatusBadge
```

---

### 📅 Phase 4: 음성 검사 (2주)
**우선순위: 🔴 높음 (기능 구현)**

#### 4.1 Voice Assessment 화면 (5일)
```
작업 내용:
✅ 음성 녹음 UI
✅ OpenAI Realtime API 연동
✅ 실시간 음성 인식
✅ 녹음 상태 표시
✅ 텍스트 변환 결과 표시
✅ 오디오 재생 버튼

컴포넌트:
- VoiceRecorder
- WaveformVisualizer
- TranscriptionView
```

#### 4.2 음성 명령 처리 (5일)
```
작업 내용:
✅ 음성 → 텍스트 변환
✅ 명령 파싱 및 필드 매핑
✅ 폼 자동 입력
✅ 음성 피드백

API:
- OpenAI Realtime API
- WebSocket 연결
```

---

### 📅 Phase 5: 설정 화면 디자인 (5일)
**우선순위: 🟡 중간**

#### 5.1 Settings 메인 화면 (1일)
```
작업 내용:
✅ 리스트 스타일 개선
✅ 아이콘 추가
✅ 섹션 구분선
✅ 화살표 아이콘

컴포넌트:
- SettingsItem
- SettingsSection
```

#### 5.2 세부 설정 화면들 (4일)
```
화면별 작업:
- Theme Settings (1일)
  ✅ 테마 선택 (라이트/다크/시스템)
  ✅ 미리보기

- Notification Settings (1일)
  ✅ 알림 타입별 on/off
  ✅ 알림 시간 설정

- Language Settings (1일)
  ✅ 언어 선택 (한국어/영어)
  ✅ 라디오 버튼

- Input Method Settings (1일)
  ✅ 입력 방식 선택 (수동/음성/카메라)
  ✅ 기본 입력 방식 설정

컴포넌트:
- ToggleSwitch
- RadioButtonGroup
- ThemePreview
```

---

### 📅 Phase 6: 추가 기능 & 폴리싱 (1주)
**우선순위: 🟢 낮음**

#### 6.1 Admin 화면 (3일)
```
작업 내용:
✅ Admin Login
✅ Dashboard (통계/차트)
✅ Admin Notifications

컴포넌트:
- StatCard
- Chart (react-native-chart-kit)
```

#### 6.2 애니메이션 & 트랜지션 (2일)
```
작업 내용:
✅ 화면 전환 애니메이션
✅ 버튼 호버 효과
✅ 로딩 인디케이터
✅ 스켈레톤 UI

라이브러리:
- react-native-reanimated
- react-native-gesture-handler
```

#### 6.3 최종 폴리싱 (2일)
```
작업 내용:
✅ 일관성 체크 (색상, 폰트, 간격)
✅ 접근성 개선 (AccessibilityLabel)
✅ 반응형 레이아웃 검증
✅ 성능 최적화
```

---

## 5. 컴포넌트 라이브러리 계획

### 5.1 공통 컴포넌트

```typescript
// 버튼
- Button (기본 버튼)
- IconButton (아이콘 버튼)
- SocialLoginButton (소셜 로그인)

// 입력
- TextInput (텍스트 입력)
- PasswordInput (비밀번호 입력)
- DatePicker (날짜 선택)
- RadioButton (라디오 버튼)
- Checkbox (체크박스)
- ToggleSwitch (토글 스위치)

// 카드 & 레이아웃
- Card (기본 카드)
- SubscriptionCard (구독 카드)
- TransparentCard (반투명 카드)
- GradientBackground (그라데이션 배경)

// 리스트 & 테이블
- ListItem (리스트 항목)
- TableRow (테이블 행)
- NotificationItem (알림 항목)

// 상태 & 피드백
- Badge (배지)
- StatusBadge (상태 배지)
- ProgressBar (진행 바)
- LoadingIndicator (로딩)
- EmptyState (빈 상태)

// 네비게이션
- TabBar (탭 바)
- FilterTabs (필터 탭)
- HeaderBar (헤더 바)
```

### 5.2 스타일 시스템

```typescript
// colors.ts
export const colors = {
  primary: '#EF4444',      // red-500
  primaryDark: '#DC2626',  // red-600
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#374151', // gray-700
  border: '#D1D5DB',       // gray-300
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  premium: '#8B5CF6',
  // ... more colors
};

// typography.ts
export const typography = {
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold' },
  body: { fontSize: 14 },
  label: { fontSize: 12, fontWeight: '600' },
  caption: { fontSize: 10 },
};

// spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
```

---

## 6. 기술 스택 & 라이브러리

### 6.1 필수 라이브러리
```json
{
  "dependencies": {
    "react-native-vector-icons": "^10.0.0",
    "react-native-linear-gradient": "^2.8.0",
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0",
    "@react-native-community/datetimepicker": "^7.6.0",
    "react-native-chart-kit": "^6.12.0"
  }
}
```

### 6.2 선택 라이브러리
```json
{
  "dependencies": {
    "react-native-blur": "^4.3.0",
    "react-native-skeleton-content": "^1.0.0",
    "lottie-react-native": "^6.4.0"
  }
}
```

---

## 7. 개발 가이드라인

### 7.1 디자인 원칙
1. **일관성**: 모든 화면에서 동일한 색상, 폰트, 간격 사용
2. **간결성**: 불필요한 요소 제거, 핵심 기능에 집중
3. **접근성**: 모든 인터랙티브 요소에 접근성 라벨 추가
4. **반응성**: 다양한 화면 크기 대응

### 7.2 코드 규칙
1. **컴포넌트 분리**: 재사용 가능한 컴포넌트 최대한 분리
2. **스타일 시스템**: colors, typography, spacing 사용
3. **타입 안전성**: TypeScript 엄격 모드 사용
4. **성능**: useMemo, useCallback 적절히 사용

### 7.3 테스트 계획
1. **컴포넌트 테스트**: 각 공통 컴포넌트 단위 테스트
2. **화면 테스트**: 주요 화면 스냅샷 테스트
3. **E2E 테스트**: 핵심 사용자 플로우 테스트

---

## 8. 일정 요약

| Phase | 기간 | 우선순위 | 작업 내용 |
|-------|------|----------|-----------|
| Phase 1 | 1주 | 🔴 높음 | Login, Signup, Result 화면 |
| Phase 2 | 1주 | 🔴 높음 | Pricing, Payment 시스템 |
| Phase 3 | 3일 | 🟠 중간 | Notifications, History |
| Phase 4 | 2주 | 🔴 높음 | Voice Assessment 기능 |
| Phase 5 | 5일 | 🟡 중간 | Settings 화면들 |
| Phase 6 | 1주 | 🟢 낮음 | Admin, 애니메이션, 폴리싱 |

**총 개발 기간: 약 5.5주**

---

## 9. 다음 단계

1. ✅ 이 문서 검토 및 승인
2. ⬜ Phase 1 작업 시작 (Login 화면)
3. ⬜ 공통 컴포넌트 라이브러리 구축
4. ⬜ 스타일 시스템 설정
5. ⬜ 각 Phase별 진행 및 검토

---

**작성일**: 2025-01-27
**작성자**: Claude Code
**버전**: 1.0.0
