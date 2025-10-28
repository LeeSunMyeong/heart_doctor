# Frontend 구조 감사 보고서

**문서 생성일**: 2025-10-23
**단계**: Phase 0 - 마이그레이션 전 분석

---

## 개요

본 문서는 기존 React Native frontend 구조에 대한 종합적인 감사를 제공하며, 현재 구현, 격차 및 Readdy 디자인 마이그레이션을 위한 준비 상태를 파악합니다.

---

## 1. 디렉토리 구조 분석

### 현재 구조
```
frontend/src/
├── assets/
│   ├── fonts/          ✅ 폰트 에셋 디렉토리
│   ├── icons/          ✅ 아이콘 에셋 디렉토리
│   └── images/         ✅ 이미지 에셋 디렉토리
├── components/
│   ├── common/         ✅ 공유 컴포넌트
│   ├── screens/        ✅ 화면 컴포넌트
│   └── ui/             ✅ UI 컴포넌트
├── constants/
│   └── index.ts        ✅ 앱 상수
├── navigation/
│   ├── stacks/         ✅ 스택 네비게이터
│   ├── AuthNavigator.tsx      ✅ 인증 플로우 네비게이터
│   ├── MainTabNavigator.tsx   ✅ 하단 탭 네비게이터
│   └── RootNavigator.tsx      ✅ 루트 네비게이터
├── services/
│   ├── api.ts          ✅ API 클라이언트
│   └── authService.ts  ✅ 인증 서비스
├── store/
│   ├── authStore.ts           ✅ 인증 상태 store
│   ├── notificationStore.ts   ✅ 알림 store
│   └── settingsStore.ts       ✅ 설정 store
├── types/
│   └── index.ts        ✅ TypeScript 타입
└── utils/              ✅ 유틸리티 함수
```

**평가**: ✅ **잘 구조화됨** - 관심사의 좋은 분리, React Native 모범 사례 준수

---

## 2. 내비게이션 구조 검토

### 기존 내비게이션 아키텍처

#### 2.1 Root Navigator (`RootNavigator.tsx`)
```typescript
// 인증 상태 기반 조건부 렌더링
{!isAuthenticated ? <AuthNavigator /> : <MainTabNavigator />}
```

**기능**:
- ✅ 인증 상태 기반 라우팅
- ✅ Zustand 통합 (`useAuthStore`)
- ✅ 깔끔한 조건부 내비게이션

**상태**: **프로덕션 준비 완료** - 변경 불필요

---

#### 2.2 Auth Navigator (`AuthNavigator.tsx`)
**타입**: Native Stack Navigator

**화면**:
1. ✅ `LoginScreen` - 사용자 로그인
2. ✅ `RegisterScreen` - 사용자 등록
3. ✅ `ForgotPasswordScreen` - 비밀번호 복구

**구성**:
- 헤더 숨김: `headerShown: false`
- 애니메이션: `slide_from_right`

**Readdy 동등물**:
| Readdy 라우트 | Frontend 화면 | 상태 |
|--------------|----------------|--------|
| `/login` | `LoginScreen` | ✅ 존재함 |
| `/signup` | `RegisterScreen` | ✅ 존재함 |
| `/account-recovery` | `ForgotPasswordScreen` | ✅ 존재함 |

**평가**: ✅ **완성됨** - 모든 인증 화면 매핑됨

---

#### 2.3 Main Tab Navigator (`MainTabNavigator.tsx`)
**타입**: Bottom Tab Navigator

**탭**:
1. ✅ **Home** - `HomeStackNavigator`
2. ✅ **Health** - `HealthStackNavigator`
3. ✅ **Subscription** - `SubscriptionStackNavigator`
4. ✅ **Profile** - `ProfileStackNavigator`

**스타일링**:
- 배경: 흰색 (`#ffffff`)
- 활성 색상: 스카이 블루 (`#0ea5e9`)
- 비활성 색상: 회색 (`#6b7280`)
- 높이: 60px

**Readdy 내비게이션 매핑**:
Readdy는 **상단 아이콘 메뉴** 내비게이션을 사용하며, 하단 탭이 아님. 이것은 UX 차이:

| Readdy 내비게이션 | Frontend 내비게이션 | 매핑 결정 |
|-------------------|---------------------|------------------|
| 상단 아이콘 메뉴 (5개 아이콘) | 하단 탭 (4개 탭) | ⚠️ **조정 필요** |
| 설정, 결제, 알림, 히스토리, 로그아웃 | Home, Health, Subscription, Profile | 다른 조직 |

**옵션**:
1. **하단 탭 유지** (모바일 UX에 권장)
2. **상단 아이콘 메뉴 추가** 특정 화면에
3. **하이브리드 접근**: 하단 탭 + 상단 오른쪽 아이콘

**권장사항**: 하단 탭 유지, Home 화면에만 상단 아이콘 메뉴 추가 (Readdy와 일치)

---

### 스택 네비게이터

#### 2.4 Home Stack Navigator
**상태**: ✅ **구현됨**

**예상 화면** (Readdy 기반):
- Home/Assessment 화면
- Result 화면
- Premium pricing 화면

---

#### 2.5 Health Stack Navigator
**상태**: ✅ **구현됨**

**예상 화면**:
- Health 대시보드
- Health 상세정보
- Health 히스토리

---

#### 2.6 Subscription Stack Navigator
**상태**: ✅ **구현됨**

**예상 화면**:
- Subscription 개요
- Subscription 플랜
- 결제 화면
- 결제 히스토리

---

#### 2.7 Profile Stack Navigator
**상태**: ✅ **구현됨**

**예상 화면**:
- Profile 개요
- 설정
- 알림

---

## 3. 기존 화면 컴포넌트

### 3.1 인증 화면

| 화면 | 파일 | 상태 | 비고 |
|--------|------|--------|-------|
| Login | `LoginScreen.tsx` | ✅ 존재함 | 스타일링 업데이트 필요 |
| Register | `RegisterScreen.tsx` | ✅ 존재함 | 스타일링 업데이트 필요 |
| Forgot Password | `ForgotPasswordScreen.tsx` | ✅ 존재함 | 스타일링 업데이트 필요 |

**평가**: 화면은 존재하지만 Readdy와 일치하도록 완전한 재설계 필요할 가능성

---

### 3.2 메인 애플리케이션 화면

| 화면 | 파일 | 상태 | Readdy 동등물 |
|--------|------|--------|-------------------|
| Home | `HomeScreen.tsx` | ✅ 존재함 | `/home/page.tsx` |
| Check Test | `CheckTestScreen.tsx` | ✅ 존재함 | home의 Assessment 폼 |
| Check Result | `CheckResultScreen.tsx` | ✅ 존재함 | `/result/page.tsx` |
| Health | `HealthScreen.tsx` | ✅ 존재함 | N/A |
| Health Detail | `HealthDetailScreen.tsx` | ✅ 존재함 | N/A |
| Health History | `HealthHistoryScreen.tsx` | ✅ 존재함 | `/history` (추정) |
| Subscription | `SubscriptionScreen.tsx` | ✅ 존재함 | `/pricing` 또는 `/home/premium` |
| Subscription Plans | `SubscriptionPlansScreen.tsx` | ✅ 존재함 | `/pricing/page.tsx` |
| Payment | `PaymentScreen.tsx` | ✅ 존재함 | `/payment/page.tsx` |
| Profile | `ProfileScreen.tsx` | ✅ 존재함 | N/A |
| Settings | `SettingsScreen.tsx` | ✅ 존재함 | `/settings/page.tsx` |
| Notifications | `NotificationsScreen.tsx` | ✅ 존재함 | `/notifications/page.tsx` |
| Notification Detail | `NotificationDetailScreen.tsx` | ✅ 존재함 | N/A |

**총 화면**: 14개 기존 화면

**평가**: ✅ **좋은 커버리지** - 대부분의 Readdy 화면에 해당하는 화면 존재

---

### 3.3 누락된 화면 (Readdy에서)

Readdy 페이지를 기반으로 이 화면들이 누락됨:

| Readdy 페이지 | 상태 | 우선순위 |
|-------------|--------|----------|
| `/settings/theme` | ❌ 누락 | 중간 |
| `/settings/language` | ❌ 누락 | 높음 (i18n) |
| `/settings/notifications` | ❌ 누락 | 중간 |
| `/settings/input-method` | ❌ 누락 | 낮음 |
| `/settings/usage-limit` | ❌ 누락 | 중간 |
| `/payment-history` | ❌ 누락 | 높음 |
| `/admin/dashboard` | ❌ 누락 | 낮음 |
| `/admin/notifications` | ❌ 누락 | 낮음 |
| `/admin/login` | ❌ 누락 | 낮음 |

**총 누락**: 9개 화면 (주로 설정 하위 화면 및 관리자)

---

## 4. 상태 관리 감사

### 기존 Zustand Store

#### 4.1 Auth Store (`authStore.ts`)
```typescript
// 예상 구조 (검증 필요)
{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

**상태**: ✅ **구현됨**
**통합**: `RootNavigator.tsx`에서 사용됨

---

#### 4.2 Settings Store (`settingsStore.ts`)
**상태**: ✅ **구현됨**
**예상 사용**: 테마, 언어, 알림 환경설정

---

#### 4.3 Notification Store (`notificationStore.ts`)
**상태**: ✅ **구현됨**
**예상 사용**: 푸시 알림, 인앱 알림

---

### 필요한 새 Store (Readdy에서)

Readdy 상태 관리 요구사항을 기반으로:

| Store | 목적 | 우선순위 | 상태 |
|-------|---------|----------|--------|
| `assessmentStore` | Assessment 폼 데이터, 결과 | 높음 | ❌ 누락 |
| `subscriptionStore` | 프리미엄 상태, 사용 제한 | 높음 | ❌ 누락 |
| `paymentStore` | 결제 히스토리, 거래 | 중간 | ❌ 누락 |
| `adminStore` | 관리자 대시보드 데이터 | 낮음 | ❌ 누락 |

---

## 5. 서비스 레이어 감사

### 기존 서비스

#### 5.1 API Service (`api.ts`)
**상태**: ✅ **구현됨**

**예상 기능**:
- Axios 인스턴스 구성
- Base URL 설정
- Request/response 인터셉터
- 오류 처리

**검증 필요**: 구현 세부 사항 확인

---

#### 5.2 Auth Service (`authService.ts`)
**상태**: ✅ **구현됨**

**예상 기능**:
- Login API 호출
- Register API 호출
- Logout API 호출
- 토큰 관리

**검증 필요**: 백엔드 API와의 통합

---

### 필요한 새 서비스

| 서비스 | 목적 | 우선순위 | 상태 |
|---------|---------|----------|--------|
| `assessmentService.ts` | Assessment 제출, 결과 가져오기 | 높음 | ❌ 누락 |
| `subscriptionService.ts` | Subscription 관리 | 높음 | ❌ 누락 |
| `paymentService.ts` | 결제 처리 | 높음 | ❌ 누락 |
| `notificationService.ts` | 푸시 알림 설정 | 중간 | ❌ 누락 |
| `adminService.ts` | 관리자 작업 | 낮음 | ❌ 누락 |

---

## 6. 컴포넌트 라이브러리 감사

### UI 컴포넌트 (`components/ui/`)

**상태**: 디렉토리 존재하지만 인벤토리 필요

**필요한 컴포넌트** (Readdy 디자인에서):
- ✅ Button (primary, secondary, outline 변형)
- ✅ TextInput (레이블, 검증 포함)
- ✅ Card (콘텐츠 섹션)
- ✅ Modal (오버레이, 확인)
- ✅ Loading Spinner
- ✅ Toggle Button (yes/no 선택)
- ✅ SelectField (버튼 기반 picker)
- ✅ PulseTimer (맥박 측정용 모달)
- ✅ FormSection (그룹화된 입력)

**권장사항**: 기존 UI 컴포넌트 감사 및 누락된 컴포넌트 생성

---

### 공통 컴포넌트 (`components/common/`)

**상태**: 디렉토리 존재하지만 인벤토리 필요

**필요한 컴포넌트**:
- ✅ Header (제목 및 액션 포함)
- ✅ IconMenu (상단 아이콘 내비게이션)
- ✅ BackButton
- ✅ SafeAreaView wrapper
- ✅ ErrorBoundary

---

## 7. 스타일링 시스템 감사

### 현재 설정

**NativeWind**: v2.0.11 ✅ 설치됨

**구성 파일**:
- ✅ `tailwind.config.js` - Tailwind 구성
- ✅ `postcss.config.js` - PostCSS 설정
- ✅ `babel.config.js` - NativeWind 플러그인이 있는 Babel
- ✅ `global.css` - 전역 스타일
- ✅ `nativewind-env.d.ts` - TypeScript 정의

**평가**: ✅ **완전히 구성됨** - 사용 준비 완료

**필요한 Readdy 디자인 토큰**:
- 색상 팔레트 추출
- 타이포그래피 스케일
- 간격 시스템
- 그림자/elevation 유틸리티

---

## 8. 에셋 감사

### 폰트
**디렉토리**: `src/assets/fonts/`
**상태**: ✅ 존재함

**Readdy 사용**: 제목에 `Pacifico` 폰트

**필요한 작업**: React Native용 Pacifico 폰트 설치

---

### 아이콘
**디렉토리**: `src/assets/icons/`
**상태**: ✅ 존재함

**현재 접근 방식**: 알 수 없음 (검증 필요)

**Readdy 사용**: Remix Icon (웹 아이콘 폰트)

**권장사항**: `react-native-vector-icons` 설치 및 Ionicons 사용

---

### 이미지
**디렉토리**: `src/assets/images/`
**상태**: ✅ 존재함

**필요한 작업**: Readdy에서 필요한 이미지 복사

---

## 9. 종속성 분석

### 설치된 종속성

#### 핵심
- ✅ `react` 18.2.0
- ✅ `react-native` 0.73.9

#### 내비게이션
- ✅ `@react-navigation/native` 6.1.18
- ✅ `@react-navigation/native-stack` 6.9.17
- ✅ `@react-navigation/bottom-tabs` 6.6.1
- ✅ `react-native-screens` 3.31.1
- ✅ `react-native-gesture-handler` 2.14.0
- ✅ `react-native-safe-area-context` 4.8.2

#### 상태 관리
- ✅ `zustand` 4.4.7

#### 스토리지
- ✅ `@react-native-async-storage/async-storage` 1.21.0
- ✅ `react-native-mmkv` 2.11.0

#### 스타일링
- ✅ `nativewind` 2.0.11
- ✅ `tailwindcss` 3.3.0

#### HTTP 클라이언트
- ✅ `axios` 1.7.9

#### 그래픽
- ✅ `react-native-svg` 14.1.0

#### 테스팅
- ✅ `jest` 29.6.3
- ✅ `react-test-renderer` 18.2.0

---

### 누락된 종속성 (마이그레이션에 필요)

#### 중요 (즉시 설치)
```bash
npm install react-i18next i18next
npm install react-native-vector-icons
npm install react-native-chart-kit  # 또는 victory-native
```

#### 중요 (Phase 1 중 설치)
```bash
npm install @stripe/stripe-react-native  # Stripe 사용 시
npm install react-native-reanimated      # 애니메이션용
npm install @testing-library/react-native
```

#### 선택사항 (필요에 따라 설치)
```bash
npm install react-native-iap             # 인앱 구매용
npm install @react-native-firebase/app   # Firebase 사용 시
npm install detox                        # E2E 테스팅
```

---

## 10. 구성 파일 감사

### 빌드 구성

#### Metro Config (`metro.config.js`)
**상태**: ✅ **기본 구성**
**필요**: 에셋 해상도, 변환기 설정 확인

#### Babel Config (`babel.config.js`)
**상태**: ✅ **구성됨**
**예상**:
- React Native preset
- NativeWind 플러그인

#### TypeScript Config (`tsconfig.json`)
**상태**: ✅ **구성됨**
**버전**: TypeScript 5.0.4

---

### 테스팅 구성

#### Jest Config (`jest.config.js`)
**상태**: ✅ **구성됨**
**커버리지**: 현재 제한적인 테스트

---

## 11. Git 및 버전 관리

### 리포지토리 상태
**상태**: ✅ Git 초기화됨 (`.git` 디렉토리 존재)

**Gitignore**: ✅ 존재함

**권장사항**: 마이그레이션 작업을 위한 feature 브랜치 생성

---

## 12. 요약: 준비 상태 평가

### ✅ 강점
1. **잘 구조화된** 스택 및 탭 네비게이터가 있는 내비게이션 시스템
2. **완성된 인증 플로우** 전용 네비게이터 포함
3. **상태 관리** Zustand가 이미 구축됨
4. **스토리지 솔루션** (MMKV + AsyncStorage) 구성됨
5. **스타일링 시스템** (NativeWind) 사용 준비 완료
6. **API 클라이언트** (Axios) 구성됨
7. **대부분의 화면** 이미 존재 (Readdy의 23개 화면 중 14개)

### ⚠️ 격차
1. **i18n 구성되지 않음** - 설치 및 구성 필요
2. **아이콘 라이브러리 누락** - react-native-vector-icons 필요
3. **차트 라이브러리 누락** - React Native 차트 솔루션 필요
4. **9개 화면 누락** - 주로 설정 하위 화면 및 관리자
5. **4개 새 store 필요** - Assessment, subscription, payment, admin
6. **5개 새 서비스 필요** - Assessment, subscription, payment, notification, admin

### 🔧 빠른 성과 (즉시 구현 가능)
1. 누락된 종속성 설치 (i18n, 아이콘, 차트)
2. AsyncStorage 지속성으로 i18n 구성
3. Readdy 번역 파일 복사
4. 누락된 Zustand store 생성
5. 아이콘 라이브러리 설정

### 📊 마이그레이션 준비 점수

| 카테고리 | 점수 | 비고 |
|----------|-------|-------|
| 내비게이션 | 9/10 | 훌륭한 구조, 소수의 UX 결정 필요 |
| 상태 관리 | 7/10 | 프레임워크 준비, 도메인 store 필요 |
| 스타일링 | 9/10 | NativeWind 구성, 디자인 토큰 필요 |
| 컴포넌트 | 6/10 | 화면 존재, UI 컴포넌트 라이브러리 필요 |
| 서비스 | 5/10 | 기본 설정, 도메인 서비스 필요 |
| 종속성 | 6/10 | 핵심 설치됨, 중요 패키지 누락 |
| **전체** | **7/10** | **좋은 기초, 마이그레이션 준비 완료** |

---

## 13. 권장 Phase 0 작업

### 즉시 (이 단계)
1. ✅ `react-i18next` + `i18next` 설치
2. ✅ `react-native-vector-icons` 설치
3. ✅ `react-native-chart-kit` 설치
4. ✅ React Native용 i18n 구성
5. ✅ 디자인 토큰 문서 생성
6. ✅ NativeWind 제한사항 문서화

### Phase 1 (다음 단계)
1. 누락된 Zustand store 생성
2. 누락된 서비스 파일 생성
3. UI 컴포넌트 라이브러리 구축
4. 내비게이션 아이콘 메뉴 컴포넌트 설정
5. 폰트 에셋 구성

---

## 14. 위험 평가

### 낮은 위험 ✅
- 내비게이션 구조 잘 확립됨
- 상태 관리 프레임워크 준비됨
- 스타일링 시스템 구성됨

### 중간 위험 ⚠️
- i18n 통합 (새 종속성)
- 아이콘 마이그레이션 (다른 라이브러리)
- 차트 구현 (다른 라이브러리)
- 결제 통합 (플랫폼 차이)

### 높은 위험 🔴
- 식별되지 않음 - 견고한 기초

---

## 결론

기존 React Native frontend는 잘 구조화된 내비게이션, 상태 관리 및 스타일링 시스템을 갖춘 **강력한 기초**를 가지고 있습니다. 주요 격차는:

1. 누락된 종속성 (i18n, 아이콘, 차트)
2. 누락된 도메인별 store 및 서비스
3. 불완전한 화면 커버리지 (9개 화면)
4. 제한적인 UI 컴포넌트 라이브러리

**전체 평가**: ✅ **Phase 0 설정 후 마이그레이션 준비 완료**

아키텍처는 건전하고 React Native 모범 사례를 따릅니다. 종속성 설치 및 구성 (Phase 0)을 통해 프로젝트는 체계적인 Readdy 디자인 마이그레이션을 위한 좋은 위치에 있을 것입니다.

---

*감사 완료: 2025-10-23*
