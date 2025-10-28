# Code Conventions

## 1. 공통 원칙
- 모든 언어에서 변수, 함수, 메서드는 기본적으로 `camelCase`를 사용하며, 클래스와 컴포넌트는 `PascalCase`를 사용한다.
- 자동화된 포맷터(Prettier, ESLint, Spotless, Checkstyle)를 의무화하고 CI에서 동일한 규칙을 검증한다.
- 하나의 파일은 하나의 책임에 집중하고, 200줄을 넘는 경우 분리 가능성을 검토한다.
- TODO는 `TODO(username): 설명` 형식으로 작성하고, 관련 이슈 번호가 있으면 `#123`과 함께 남긴다.
- 주석은 "무엇"보다는 "왜"를 설명하며, 한글 또는 영어 중 팀이 합의한 언어를 통일한다.

## 2. React Native (TypeScript)
- 프로젝트 구조는 `src/features`, `src/components`, `src/hooks`, `src/store`, `src/services` 등 도메인 중심으로 구성한다.
- Redux 상태는 슬라이스 단위로 관리하며, 슬라이스 파일은 `camelCase`로, 타입/인터페이스는 `PascalCase`로 정의한다.
- Redux Toolkit을 기본 사용하고, 비동기 로직은 `createAsyncThunk` 또는 `redux-saga` 중 팀이 선택한 방식을 따른다.
- 컴포넌트 파일명은 `PascalCase.tsx`. 스타일은 `StyleSheet` 또는 `styled-components` 중 하나로 통일하며, 인라인 스타일을 지양한다.
- 훅은 `useCamelCase` 네이밍을 사용하고, 커스텀 훅은 `hooks/` 디렉터리에 배치한다.
- API 호출은 `services/apiClient.ts`에서 공통 래핑하며, 응답 타입을 명확히 정의한다.
- Intl/다국어는 `i18n/`에 JSON 리소스를 관리하고, 키는 `camelCase`로 작성한다.
- OpenAI Realtime Audio 연동 모듈은 `src/services/audio/`에 배치하고, 토큰 및 엔드포인트는 `.env`와 `app.config.ts`를 통해 주입한다.

## 3. Java Spring
- 패키지 명은 전부 소문자, 도메인 단위(예: `com.flowgence.heartrisk.user`).
- 클래스는 `PascalCase`, 메서드는 `camelCase`, 상수는 `UPPER_SNAKE_CASE`를 사용한다.
- Controller → Service → Domain → Repository 레이어 순으로 의존하며, DTO는 `*Request`, `*Response` 접미사를 사용한다.
- JPA 엔티티는 `@Entity`와 `@Table`을 명시하고, 컬럼은 snake_case로 매핑하되, 필드명은 camelCase로 유지한다.
- Validation은 `javax.validation` 어노테이션을 우선 사용하며, 커스텀 Validator는 `validators` 패키지에 둔다.
- API 문서는 `springdoc-openapi` 또는 `Swagger`로 자동 생성하고, 스펙 파일을 `docs/api`에 버전 관리한다.
- OpenAI Realtime Audio 토큰 검증 및 프록시는 Spring에서 서비스 클래스로 분리하여 재사용한다.

## 4. 테스트 및 품질
- TypeScript: Jest + React Testing Library. 파일 이름은 `*.test.ts(x)` 형식으로 컴포넌트와 동일 폴더에 둔다.
- Java: JUnit5 + Mockito. 테스트 클래스는 `ClassNameTest` 패턴을 따른다.
- 커버리지 목표는 프론트/백엔드 모두 80% 이상, 핵심 도메인은 90% 이상을 유지한다.
- 스냅샷 테스트는 UI 변경 시 반드시 갱신 원인을 PR에서 설명한다.
- 테스트 데이터는 `fixtures/` 디렉터리에서 공유하며, 민감정보는 사용하지 않는다.

## 5. 코드 리뷰 체크리스트
- 비즈니스 로직: 요구사항을 충족하는지, 에러 케이스가 처리되었는지 확인한다.
- 성능: 비동기 호출/루프의 복잡도가 적절한지, 메모리 누수 가능성을 점검한다.
- 보안: 인증/인가, 민감 정보 노출 여부를 검토한다.
- 테스트: 신규 코드에 대응하는 테스트가 있는지, 실패 케이스를 고려했는지 평가한다.
- 스타일: 포맷터가 적용되었는지, 네이밍/분리 규칙을 지켰는지 확인한다.

## 6. 문서 및 협업
- 새로운 모듈을 도입하면 `docs/architecture`에 ADR(Architecture Decision Record)을 작성한다.
- 주요 변경은 팀 위키에 릴리스 노트 형식으로 공유한다.
- Pair Programming 또는 Mob Review를 활용해 복잡한 기능은 최소 1회 이상 공동 검토한다.
