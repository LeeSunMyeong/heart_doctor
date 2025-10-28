# 기술 스택 분석: Readdy → React Native

**문서 생성일**: 2025-10-23
**단계**: Phase 0 - 마이그레이션 전 분석

---

## 개요

본 문서는 Readdy 웹 애플리케이션과 React Native 모바일 애플리케이션 간의 기술 스택 차이에 대한 종합적인 분석을 제공합니다.

---

## 1. 핵심 프레임워크 비교

### Readdy (웹 애플리케이션)
| 기술 | 버전 | 목적 |
|------------|---------|---------|
| React | 19.1.0 | UI 프레임워크 |
| React DOM | 19.1.0 | 웹 렌더링 |
| Vite | 7.0.3 | 빌드 도구 & 개발 서버 |
| TypeScript | 5.8.3 | 타입 안정성 |

### Frontend (React Native 애플리케이션)
| 기술 | 버전 | 목적 |
|------------|---------|---------|
| React | 18.2.0 | UI 프레임워크 |
| React Native | 0.73.9 | 모바일 프레임워크 |
| Metro | @react-native/metro-config 0.73.5 | 빌드 도구 & 번들러 |
| TypeScript | 5.0.4 | 타입 안정성 |

**주요 차이점**:
- React 버전: 19.1.0 (웹) vs 18.2.0 (모바일) - **버전 차이 존재**
- 빌드 시스템: Vite (웹) vs Metro (모바일) - **완전한 교체**
- 렌더링: React DOM (웹) vs React Native (모바일) - **근본적인 차이**

---

## 2. 내비게이션 시스템

### Readdy 내비게이션
```javascript
// React Router DOM v7.6.3 사용
import { useNavigate, Link, Navigate } from 'react-router-dom';

// 웹 라우팅 방식
<Link to="/settings">Settings</Link>
navigate('/result');
```

**기능**:
- `<Route>` 컴포넌트를 사용한 선언적 라우팅
- 브라우저 히스토리 API 통합
- URL 기반 내비게이션
- 해시 라우팅 지원

### Frontend 내비게이션
```javascript
// React Navigation v6.x 사용
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 모바일 내비게이션 방식
navigation.navigate('SettingsScreen');
```

**기능**:
- 스택 기반 내비게이션
- 탭 내비게이션
- 모달 프레젠테이션
- 제스처 기반 내비게이션

**마이그레이션 전략**:
- `Link` → `navigation.navigate()` 매핑
- `useNavigate()` → `useNavigation()` 교체
- 라우트 정의를 스택/탭 네비게이터로 변환
- URL 기반 라우팅 로직 제거

---

## 3. 스타일링 시스템

### Readdy 스타일링
```javascript
// 완전한 TailwindCSS v3.4.17 지원
<div className="flex items-center justify-center space-x-4 mb-6">
  <button className="px-2 py-1 rounded text-xs font-medium bg-black text-white">
    Submit
  </button>
</div>
```

**기능**:
- 완전한 TailwindCSS 유틸리티 클래스
- CSS 그라디언트, backdrop 필터, 트랜지션
- Hover, focus, active 상태
- 복잡한 애니메이션
- 커스텀 PostCSS 플러그인

### Frontend 스타일링
```javascript
// NativeWind v2.0.11 (React Native용 TailwindCSS)
<View className="flex items-center justify-center space-x-4 mb-6">
  <TouchableOpacity className="px-2 py-1 rounded text-xs font-medium bg-black text-white">
    <Text>Submit</Text>
  </TouchableOpacity>
</View>
```

**기능**:
- TailwindCSS 유틸리티의 부분 집합
- 기본 flexbox, 간격, 색상
- 제한적인 애니메이션 지원
- hover 상태 없음 (모바일에는 hover가 없음)
- backdrop 필터, 복잡한 그라디언트 미지원

**NativeWind 제한사항**:
❌ **지원되지 않음**:
- `backdrop-blur-*`, `backdrop-filter`
- `bg-gradient-*` (복잡한 그라디언트)
- `cursor-*` 유틸리티
- `select-*` (텍스트 선택)
- `scroll-*` 유틸리티
- `divide-*` 유틸리티
- 의사 클래스: `hover:`, `focus:`, `active:` (제한적)
- `group-hover:` 패턴
- `peer-*` 유틸리티
- 복잡한 트랜지션 및 애니메이션

✅ **지원됨**:
- Flexbox: `flex`, `flex-row`, `items-center`, `justify-between`
- 간격: `p-*`, `m-*`, `space-x-*`, `space-y-*`
- 색상: `bg-*`, `text-*`, `border-*`
- 타이포그래피: `text-*`, `font-*`, `leading-*`
- 테두리: `border`, `rounded-*`
- 그림자: 기본 `shadow-*` (React Native elevation 사용)
- 위치: `absolute`, `relative`, `top-*`, `left-*`

**대안 솔루션**:
- 복잡한 애니메이션 → React Native Animated 또는 Reanimated
- 그라디언트 → `react-native-linear-gradient` 패키지
- 고급 효과 → 커스텀 네이티브 컴포넌트

---

## 4. 국제화 (i18n)

### Readdy i18n
```javascript
// react-i18next v15.6.0 + i18next v25.3.2
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 브라우저 기반 언어 감지
i18next.use(LanguageDetector).init({...});
```

**기능**:
- 브라우저 언어 감지
- Local storage 지속성
- URL 기반 언어 전환
- 네임스페이스 지원

### Frontend i18n
**현재 상태**: ❌ **설치되지 않음**

**필요한 설정**:
```bash
npm install react-i18next i18next
npm install @react-native-async-storage/async-storage  # 이미 설치됨
```

**필요한 구현**:
```javascript
// React Native용
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 모바일 기반 언어 감지
i18next.init({
  lng: 'ko',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});
```

**마이그레이션 작업**:
1. `react-i18next`와 `i18next` 설치
2. Readdy에서 번역 파일 복사
3. React Native i18n 설정 생성
4. 브라우저 언어 감지기를 AsyncStorage 기반 지속성으로 교체
5. 언어 전환 기능 테스트

---

## 5. 상태 관리

### Readdy 상태 관리
**현재 상태**: ❌ **구현되지 않음**

로컬 컴포넌트 상태 사용:
```javascript
const [data, setData] = useState<AssessmentData>(initialData);
const [isLoggedIn, setIsLoggedIn] = useState(true);
```

### Frontend 상태 관리
✅ **Zustand v4.4.7** - 이미 설치 및 구성됨

**기존 Store**:
- `authStore.ts` - 인증 상태
- `settingsStore.ts` - 사용자 설정
- `notificationStore.ts` - 알림

**장점**:
- 중앙화된 상태 관리
- MMKV를 통한 지속성
- TypeScript 지원
- 간단한 API

**마이그레이션 전략**:
- Readdy 컴포넌트 상태를 Zustand store로 이동
- 폼 데이터를 위한 assessment store 생성
- 프리미엄 기능을 위한 subscription store 생성
- 중요한 데이터에 대한 지속성 구현

---

## 6. 아이콘 라이브러리

### Readdy 아이콘
```html
<!-- Remix Icon (웹 CDN 또는 패키지) -->
<i className="ri-settings-3-line text-xl text-gray-700"></i>
<i className="ri-notification-3-line text-xl text-gray-700"></i>
```

**사용법**: CSS 클래스를 사용하는 아이콘 폰트

### Frontend 아이콘
**필요**: React Native Vector Icons 또는 React Native SVG

**옵션**:
1. **react-native-vector-icons** (권장)
   ```bash
   npm install react-native-vector-icons
   ```

   ```javascript
   import Icon from 'react-native-vector-icons/Ionicons';
   <Icon name="settings-outline" size={24} color="#374151" />
   ```

2. **react-native-svg** (이미 설치됨)
   - 커스텀 SVG 아이콘
   - 더 많은 제어, 더 큰 번들 크기

**마이그레이션 매핑**:
| Remix Icon (Readdy) | Ionicons (React Native) |
|---------------------|-------------------------|
| `ri-settings-3-line` | `settings-outline` |
| `ri-notification-3-line` | `notifications-outline` |
| `ri-bank-card-line` | `card-outline` |
| `ri-history-line` | `time-outline` |
| `ri-logout-box-line` | `log-out-outline` |
| `ri-login-box-line` | `log-in-outline` |
| `ri-timer-line` | `timer-outline` |
| `ri-close-line` | `close-outline` |
| `ri-vip-crown-line` | `crown-outline` |

---

## 7. 폼 처리

### Readdy 폼
```javascript
// React 상태를 사용하는 네이티브 HTML input
<input
  type="number"
  value={data.age}
  onChange={(e) => handleInputChange('age', e.target.value)}
  className="flex-1 p-1.5 border border-gray-300 rounded"
/>
```

### Frontend 폼
```javascript
// React Native TextInput
import { TextInput } from 'react-native';

<TextInput
  value={data.age}
  onChangeText={(text) => handleInputChange('age', text)}
  keyboardType="numeric"
  style={styles.input}
/>
```

**주요 차이점**:
- `onChange` → `onChangeText`
- `e.target.value` → 직접 텍스트 값
- `type="number"` → `keyboardType="numeric"`
- 네이티브 검증 속성 없음 (required, min, max)
- 커스텀 검증 구현 필요

---

## 8. 차트 & 시각화

### Readdy 차트
```javascript
// Recharts v3.2.0 (웹 전용)
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={data}>
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

### Frontend 차트
**현재 상태**: ❌ **설치되지 않음**

**옵션**:
1. **react-native-chart-kit** (권장)
   ```bash
   npm install react-native-chart-kit
   npm install react-native-svg  # 이미 설치됨
   ```

2. **Victory Native**
   ```bash
   npm install victory-native
   ```

**마이그레이션 전략**:
- Result 화면의 차트 요구사항 평가
- 적절한 React Native 차트 라이브러리 선택
- 모바일 친화적인 라이브러리로 차트 컴포넌트 재작성
- 실제 데이터로 성능 테스트

---

## 9. HTTP 클라이언트

### Readdy HTTP 클라이언트
**현재 상태**: 브라우저 `fetch` API 사용 (추정)

### Frontend HTTP 클라이언트
✅ **Axios v1.7.9** - 이미 설치됨

**기존 구성**:
- `services/api.ts` - API 클라이언트 설정
- Base URL 구성
- Request/response 인터셉터 (가능성 있음)

**장점**:
- 플랫폼 간 일관된 API
- Request/response 인터셉터
- 더 나은 오류 처리
- TypeScript 지원

---

## 10. 스토리지 & 지속성

### Readdy 스토리지
```javascript
// 브라우저 localStorage 및 sessionStorage
localStorage.setItem('user', JSON.stringify(userData));
sessionStorage.setItem('token', authToken);
```

### Frontend 스토리지
✅ **여러 스토리지 옵션 설치됨**:

1. **MMKV v2.11.0** (민감한 데이터에 권장)
   - 빠르고 암호화된 스토리지
   - 동기 API
   - 토큰, 사용자 데이터에 최적

2. **AsyncStorage v1.21.0** (환경설정용)
   - 키-값 스토리지
   - 비동기 API
   - 설정, 캐시에 최적

**마이그레이션 전략**:
- 민감한 데이터 (토큰, 사용자 정보) → MMKV
- 환경설정 (테마, 언어) → AsyncStorage
- 모든 `localStorage` 참조 제거
- 스토리지 추상화 레이어 구현

---

## 11. 결제 통합

### Readdy 결제
```javascript
// 웹용 Stripe
import { useStripe, useElements } from '@stripe/react-stripe-js';
```

**패키지**: `@stripe/react-stripe-js` v4.0.2

### Frontend 결제
**현재 상태**: ❌ **설치되지 않음**

**필요**:
```bash
npm install @stripe/stripe-react-native
# 또는
npm install react-native-iap  # App Store/Play Store용
```

**마이그레이션 고려사항**:
- Stripe React Native는 웹 버전과 다른 API를 가짐
- 모바일 앱 스토어용 인앱 구매 고려
- 플랫폼별 결제 흐름 구현
- 결제 검증을 다르게 처리

---

## 12. 백엔드 통합

### Readdy 백엔드
```javascript
// Firebase & Supabase
import { initializeApp } from 'firebase';
import { createClient } from '@supabase/supabase-js';
```

**패키지**:
- `firebase` v12.0.0
- `@supabase/supabase-js` v2.57.4

### Frontend 백엔드
**현재 상태**: Axios를 사용한 커스텀 API

**백엔드**: Spring Boot REST API (CLAUDE.md에서)

**마이그레이션 전략**:
- Frontend는 이미 커스텀 API용 Axios 사용
- Firebase/Supabase가 필요하지 않을 수 있음
- 백엔드 API 엔드포인트 일치 확인
- 일관성을 위해 API 서비스 레이어 업데이트

---

## 13. 개발 도구

### Readdy 개발 도구
| 도구 | 버전 | 목적 |
|------|---------|---------|
| Vite | 7.0.3 | 개발 서버, HMR |
| ESLint | 9.30.1 | 코드 린팅 |
| TypeScript | 5.8.3 | 타입 체킹 |
| Autoprefixer | 10.4.21 | CSS vendor prefix |
| PostCSS | 8.5.6 | CSS 처리 |

**개발 경험**:
- 즉각적인 HMR (Hot Module Replacement)
- 빠른 빌드 시간
- 웹 인스펙터 도구

### Frontend 개발 도구
| 도구 | 버전 | 목적 |
|------|---------|---------|
| Metro | 0.73.5 | 개발 서버, 번들러 |
| ESLint | 8.19.0 | 코드 린팅 |
| TypeScript | 5.0.4 | 타입 체킹 |
| Jest | 29.6.3 | 테스팅 프레임워크 |
| Prettier | 2.8.8 | 코드 포매팅 |

**개발 경험**:
- Metro 번들러 (Vite보다 느림)
- React Native 디버거
- iOS 시뮬레이터 / Android 에뮬레이터
- 실제 기기 테스팅

---

## 14. 테스팅 프레임워크

### Readdy 테스팅
**현재 상태**: ❌ **구현되지 않음**

### Frontend 테스팅
✅ **Jest v29.6.3** - 구성됨

**사용 가능**:
- `jest.config.js` - 테스트 구성
- `react-test-renderer` - 컴포넌트 테스팅
- `@react-native/babel-preset` - 테스트 변환

**테스팅 격차**:
- E2E 테스팅 프레임워크 없음
- 제한적인 컴포넌트 테스트

**권장 추가사항**:
```bash
npm install --save-dev @testing-library/react-native
npm install --save-dev detox  # E2E 테스팅 (선택사항)
```

---

## 15. 빌드 & 배포

### Readdy 빌드
```bash
npm run build
# 출력: /out 디렉토리 (정적 파일)
# 배포: 모든 정적 호스팅 (Vercel, Netlify 등)
```

### Frontend 빌드
```bash
# Android
npm run android
cd android && ./gradlew assembleRelease

# iOS
npm run ios
cd ios && xcodebuild -workspace ... -scheme ...
```

**출력**:
- Android: APK/AAB 파일
- iOS: IPA 파일
- 배포: App Store, Google Play

---

## 중요 격차 요약

### 반드시 설치
1. ✅ `react-i18next` + `i18next` - 국제화
2. ✅ `react-native-vector-icons` - 아이콘 라이브러리
3. ✅ `react-native-chart-kit` 또는 `victory-native` - 차트
4. ✅ `@stripe/stripe-react-native` - 결제 (Stripe 사용 시)
5. ✅ `@testing-library/react-native` - 컴포넌트 테스팅

### 반드시 구성
1. ✅ AsyncStorage 지속성을 사용한 i18n 설정
2. ✅ 내비게이션 스택/탭 구조
3. ✅ 상태 관리를 위한 Zustand store
4. ✅ MMKV 스토리지 통합
5. ✅ 아이콘 폰트 연결 (vector icons 사용 시)

### 반드시 리팩토링
1. ✅ 모든 `<div>` → `<View>`
2. ✅ 모든 `<span>`/`<p>` → `<Text>`
3. ✅ 모든 `<button>` → `<TouchableOpacity>` 또는 `<Pressable>`
4. ✅ 모든 `<input>` → `<TextInput>`
5. ✅ 모든 React Router → React Navigation
6. ✅ 모든 Remix Icons → Vector Icons
7. ✅ 모든 localStorage → MMKV/AsyncStorage
8. ✅ 모든 Recharts → React Native 차트
9. ✅ 모든 Stripe 웹 → Stripe React Native

---

## React 버전 호환성 참고사항

**이슈**: React 19.1.0 (Readdy) vs 18.2.0 (React Native)

**영향**:
- React 19 기능 (use 등)이 React Native에서 아직 사용 불가
- Hook 동작 차이 최소화
- 대부분의 코드는 호환 가능

**권장사항**:
- 마이그레이션 중 React 19 전용 기능 피하기
- React 18과 호환되는 코드 작성
- React Native의 React 19 업그레이드 경로 모니터링

---

## 다음 단계 (Phase 1)

이 분석을 바탕으로 Phase 1은 다음에 초점을 맞춰야 합니다:

1. 누락된 종속성 설치
2. React Native용 i18n 구성
3. 아이콘 라이브러리 설정
4. 내비게이션 구조 생성
5. 스타일링 규칙 확립
6. 상태 관리 store 구성

---

*분석 완료: 2025-10-23*
