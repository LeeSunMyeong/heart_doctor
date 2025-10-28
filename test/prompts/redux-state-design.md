# Redux State Management Design

## 1. 설계 목표
- React Native(TypeScript) 앱에서 인증, 건강 데이터 입력, 검사 결과, 결제, 환경설정, 음성 입력 경험을 일관되게 관리한다.
- 서버와의 동기화, 네트워크 상태 변화, 비동기 처리(예: OpenAI Realtime Audio 스트림)를 안정적으로 지원한다.
- 확장이 용이한 슬라이스 구조와 엄격한 타입 시스템으로 20인 규모 팀 협업을 용이하게 한다.
- 테스트 가능성과 디버깅 편의성을 확보하기 위해 Redux DevTools, 로깅 미들웨어, 표준화된 action 패턴을 사용한다.

## 2. 전역 Store 구조
```
rootState
├── auth          // 로그인 세션, 토큰, 사용자 인증 상태
├── profile       // 사용자 기본 정보 및 Health 입력 기본값
├── intakeForm    // 건강 정보 입력 폼 상태, 유효성 결과, 임시 저장 데이터
├── screening     // 검사 요청/응답 상태, 결과 데이터, 위험도 메타
├── settings      // 언어, 비용모델, 입력 방식, 알림 설정 등 환경설정
├── subscription  // 구독 상태, 결제 이력 메타, 재시도 정보
├── audioSession  // OpenAI Realtime Audio 연결 상태, 녹음 버퍼, 전사 텍스트
├── ui            // 글로벌 UI 상태(로딩, 토스트, 모달, 네트워크 상태)
└── analytics     // 사용자 이벤트 큐, 배치 전송 관리, 실험 플래그
```
- 각 슬라이스는 `src/store/<sliceName>/index.ts`에 배치하고, RTK `createSlice`를 사용한다.
- 슬라이스별 selector는 `selectors.ts`, thunk는 `thunks.ts`로 분리해 테스트를 용이하게 한다.
- `RootState`와 `AppDispatch` 타입을 `src/store/types.ts`에서 export해 컴포넌트에서 재사용한다.

## 3. 슬라이스별 세부 정의
### auth
- 상태: `accessToken`, `refreshToken`, `userId`, `status`(idle/loading/authenticated/expired), `error`.
- 주요 action: `loginRequested`, `loginSucceeded`, `tokenRefreshed`, `logout`.
- thunk: `authenticate`, `refreshSession` (API 호출, 토큰 저장/만료 처리).
- Persist: `redux-persist`로 `accessToken`/`refreshToken` 암호화 저장.

### profile
- 상태: `demographics`(sex, age 등), `lastSyncedAt`, `dataSources`.
- action: `profileLoaded`, `profileUpdated`, `syncFailed`.

### intakeForm
- 상태: `fields`(16개 입력값 + validation 상태), `draftId`, `isDirty`, `lastAutosaveAt`.
- action: `fieldChanged`, `validationUpdated`, `resetForm`.
- thunk: `autosaveDraft` (백엔드 초안 저장 API 연동), `loadDraft`.

### screening
- 상태: `currentRequestId`, `status`(idle/loading/success/error), `result`(질환, 위험도, 권장 행동), `history`.
- thunk: `runScreening` (건강 정보 제출 → 결과 수신), `fetchHistory`.
- extraReducers: `runScreening.fulfilled`에서 `result`와 `history` 업데이트.

### settings
- 상태: `locale`, `pricingPlan`, `inputMode`, `notifications`, `timeoutSec`.
- action: `localeChanged`, `planSelected`, `inputModeSet`.
- thunk: `applySettings` (서버 반영 및 기기 로컬 저장).

### subscription
- 상태: `status`(active/inGrace/canceled), `renewalDate`, `failedAttempts`, `receipts`.
- thunk: `startPurchase`, `restorePurchase`, `syncReceipt` (플랫폼별 결제 SDK와 상호작용).
- 미들웨어: 결제 이벤트 로깅 및 `analytics` 슬라이스와 연계.

### audioSession
- 상태: `connectionState`(idle/connecting/streaming/error), `transcript`, `audioChunks`, `segmentConfidence`, `error`.
- thunk: `startRealtimeSession`, `sendAudioFrame`, `stopSession`.
- OpenAI Realtime API: WebSocket 래퍼 서비스(`audioClient`)와 연계, 토큰 주기 갱신.
- 미들웨어: 네트워크 reconnect, 음성 입력 중단 시 클린업.

### ui
- 상태: `globalLoading`, `toasts`(queue), `modal`, `networkStatus`.
- action: `showToast`, `hideToast`, `setNetworkStatus`.
- 네트워크 리스너와 연계해 오프라인 UI 상태 갱신.

### analytics
- 상태: `eventsQueue`, `lastDispatchAt`, `flags`(A/B 테스트), `consent`.
- thunk: `flushEvents`, `updateConsent`.
- `redux-observable` 또는 커스텀 미들웨어로 배치 전송과 리트라이 관리.

## 4. 미들웨어 및 비동기 처리
- 기본 미들웨어: `redux-thunk`(RTK 기본 포함), `redux-logger`(개발 환경), `analyticsMiddleware`, `errorReportingMiddleware`.
- OpenAI Audio: 전용 `audioMiddleware`를 추가해 WebSocket 이벤트를 action으로 디스패치하고, 백그라운드 모드에서 자동 재연결.
- 에러 처리: 전역 에러 action(`ui/showToast`, `analytics/logError`)을 통해 사용자 알림과 로깅 분리.

## 5. 데이터 동기화 및 Persist 전략
- `redux-persist` 사용: `auth`, `settings`, `subscription`(민감 정보는 암호화 스토리지)만 영속화.
- `intakeForm`은 24시간 자동 만료 정책을 두고, `redux-persist` + 서버 draft 저장을 혼합.
- 네트워크 오프라인 시 `analytics.eventsQueue`에 이벤트를 적재 후 온라인 시 flush.

## 6. 타입스크립트 가이드
- 각 action payload는 `PayloadAction<Type>`으로 명시하고, slice별 `State` 인터페이스 정의.
- 공통 유틸 타입(예: `AsyncStatus`)은 `src/types/common.ts`에서 관리.
- Selector는 `createSelector`로 메모이제이션하여 재렌더 최소화.

## 7. 테스트 전략
- 슬라이스 단위: reducer, action creator 스냅샷 테스트.
- thunk: `msw`/`jest-fetch-mock`으로 API 응답 시나리오를 검증.
- 미들웨어: `redux-mock-store`를 활용해 OpenAI Audio 이벤트 플로우와 analytics 전송 검증.
- 통합: `@testing-library/react-native` + `Provider`로 주요 화면 플로우(로그인 → 입력 → 결과)를 테스트.

## 8. 도입 순서
1. `src/store/configureStore.ts`에서 RTK 기반 스토어 생성.
2. `auth`, `settings`, `ui` 기본 슬라이스부터 구현하여 앱 뼈대 구축.
3. `intakeForm`, `screening` 슬라이스와 OpenAI Audio 연동을 병행하여 핵심 사용자 플로우 완성.
4. `subscription`, `analytics`는 결제/지표 요구 확보 후 추가.
5. 모든 슬라이스에 대해 Storybook/Playground 상태 예제를 준비해 QA가 시나리오를 빠르게 재현할 수 있게 한다.

## 9. 오픈 이슈
- OpenAI Realtime API 토큰 갱신 주기와 만료 시 fallback 처리 정책 확정 필요.
- analytics 전송 파이프라인(내부 서버 vs 외부 도구) 결정 필요.
- 결제 영수증 검증 서버-클라이언트 책임 범위 정의 필요.
