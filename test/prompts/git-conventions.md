# Git Conventions

## 1. 목적과 범위
20인 규모의 제품 개발 조직에서 Git Flow 전략을 일관성 있게 사용하기 위한 규칙을 정의한다. 프론트엔드, 백엔드, 데이터 팀 모두 동일한 절차를 따르며, 모든 변경 사항은 자동화된 검증과 코드 리뷰를 거쳐 `main`에 반영된다. 업무 관리는 GitHub Issues/Projects(또는 동등한 이슈 트래커)를 기준으로 한다.

## 2. 브랜치 전략 (Git Flow)
- `main`: 배포 가능한 상태만 유지하고, 배포 태그는 `vMAJOR.MINOR.PATCH` 형식으로 부여한다.
- `develop`: 다음 릴리스를 준비하는 통합 브랜치. 모든 기능 개발은 여기에서 분기한다.
- `feature/*`: 기능 단위 개발 브랜치. 이름은 `feature/<issue-number>-<slug>` 형식을 따른다 (예: `feature/123-login-flow`).
- `release/*`: QA 및 릴리스 준비 브랜치. 생성 시점에 버전을 고정하고, QA 수정 이후 `main` 및 `develop`에 병합한다.
- `hotfix/*`: `main`에서 발견된 긴급 이슈 해결용. 수정 후 `main`과 `develop`에 모두 병합한다.
- `chore/*` & `bugfix/*`: 유지보수성 작업 또는 버그 픽스에 사용하며, 이슈 번호를 포함한다.

## 3. 작업 흐름
1. 담당 이슈(예: GitHub Issue)를 확인하고 `feature/*` 브랜치를 생성한다.
2. 작업 전 최신 `develop`을 리베이스하거나 머지한다.
3. 수시로 커밋하지만 PR 생성 전에는 스쿼시 또는 `git rebase -i`로 히스토리를 정리한다.
4. 작업 완료 시 GitHub/GitLab에서 PR을 올리고 자동 CI를 통과시킨다.
5. 최소 2인(기능팀 1인 + 크로스팀 1인)의 리뷰 승인을 받아야 하며, 리뷰 코멘트는 모두 처리한다.
6. `develop`에 병합할 때는 `Squash & Merge`를 기본으로 사용한다. `release/*`는 `Merge` 전략으로 전체 커밋을 유지한다.
7. 릴리스 준비 시 `release/<version>` 브랜치를 생성하고 QA를 진행한다. QA 종료 후 `main`에 병합하고 버전 태그를 생성한다.

## 4. 커밋 메시지 규칙
- Conventional Commits 베이스: `type(scope): subject`
- 사용 가능한 type: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `revert`, `perf`, `build`, `ci`.
- subject는 현재형, 50자 이내, 소문자 시작, 마침표 생략.
- body는 필요 시 `왜`와 `어떻게`를 요약하고, Breaking Change는 `BREAKING CHANGE:` 섹션에 명시한다.
- 모든 커밋은 관련 이슈를 본문에 `Refs: #123` 형식으로 연결한다.

## 5. Pull Request 가이드
- PR 제목은 `[type] #123: 요약` 형식을 사용한다.
- 템플릿 필수 항목: 작업 요약, 테스트 결과, 스크린샷/동영상, 영향 범위, 롤백 방법.
- CI 파이프라인 (lint, test, build)을 통과하지 못한 PR은 리뷰 대상이 아니다.
- 리뷰어는 1영업일 내 첫 코멘트를 남기고, 작성자는 24시간 내에 피드백을 반영한다.
- 논쟁이 생길 경우 테크 리드를 호출하여 결론을 낸다. 합의 내용은 PR에 기록한다.

## 6. 태깅 및 릴리스 노트
- 릴리스 태그: `vMAJOR.MINOR.PATCH` (예: `v1.2.0`).
- `release/*` 병합 시 `CHANGELOG.md`를 업데이트하고 PR에 포함한다.
- 태그 생성과 동시에 깃호스팅 플랫폼에서 릴리스 노트를 발행하며, 주요 변경, 마이그레이션 가이드, 테스팅 결과를 요약한다.

## 7. 자동화 및 보호 규칙
- `main`, `develop`, `release/*` 브랜치는 직접 푸시를 금지하고 PR만 허용한다.
- PR은 필수 검증(CI, 테스트 커버리지, 린트)을 모두 통과해야 병합 가능하다.
- pre-commit 훅으로 포맷터와 린터(ESLint, Prettier, Spotless, Checkstyle)를 실행한다.
- 대형 파일(LFS 필요 항목)을 커밋하기 전 동료와 상의한다.

## 8. 문서화 및 회고
- 각 릴리스 종료 후 회고 문서를 작성하고 브랜치 전략 개선 여부를 논의한다.
- 위 규칙은 분기별로 검토하며 변경 시 전원에게 공유한다.
