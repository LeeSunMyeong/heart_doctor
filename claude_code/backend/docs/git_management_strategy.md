# 멀티 Agent 환경 Git 관리 전략

## 현재 상황 분석

### 프로젝트 구성
- **프론트엔드**: React Native + TypeScript (iOS/Android)
- **백엔드**: Spring Boot + Java 17
- **Agent 구성**: 각각 독립적인 Agent가 개발 담당
- **협업 필요성**: API 명세, 데이터 모델, 보안 정책 등 공유

## 추천 전략: 모노레포 (Monorepo) 접근법

### 1. 디렉토리 구조 재편성

```
heart-doctor-app/                    # 루트 프로젝트
├── .git/                           # 단일 Git 관리
├── .github/                        # GitHub Actions 워크플로우
│   └── workflows/
│       ├── frontend-ci.yml         # 프론트엔드 CI/CD
│       ├── backend-ci.yml          # 백엔드 CI/CD
│       └── integration-test.yml    # 통합 테스트
├── frontend/                       # React Native 프로젝트
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── backend/                        # Spring Boot 프로젝트
│   ├── src/
│   ├── build.gradle
│   └── README.md
├── shared/                         # 공통 리소스
│   ├── api-spec/                   # OpenAPI 명세
│   ├── types/                      # 공통 타입 정의
│   ├── constants/                  # 공통 상수
│   └── docs/                       # 공통 문서
├── scripts/                        # 자동화 스크립트
│   ├── setup.sh                    # 초기 설정
│   ├── build-all.sh               # 전체 빌드
│   └── deploy.sh                   # 배포 스크립트
├── docs/                           # 프로젝트 문서
│   ├── requirements_analysis.md
│   ├── frontend_requirements.md
│   ├── backend_requirements.md
│   └── api-documentation.md
├── .gitignore                      # 전체 프로젝트 gitignore
├── .editorconfig                   # 코드 스타일 통일
├── docker-compose.yml              # 로컬 개발 환경
└── README.md                       # 프로젝트 개요
```

### 2. Git 브랜치 전략

#### Modified Git Flow 기반 브랜치 전략 (추천)
```
main                    # 프로덕션 브랜치 (안정화된 코드만)
├── develop            # 개발 통합 브랜치 (Agent 협업 공간)
│   ├── feature/frontend-auth     # 프론트엔드 기능 브랜치
│   ├── feature/backend-user-api  # 백엔드 기능 브랜치
│   ├── feature/integration-payment # 통합 기능 브랜치
│   └── bugfix/login-issue        # 버그 수정 브랜치
├── staging            # 스테이징 브랜치 (QA 전용)
├── release/v1.0       # 릴리즈 브랜치 (월 단위)
└── hotfix/critical-bug # 핫픽스 브랜치 (긴급 수정)
```

**Modified Git Flow 특징:**
- **develop**: Agent 간 일일 통합 및 협업
- **staging**: 주간 QA 및 통합 테스트
- **release**: 월간 릴리즈 준비 (의료 앱 안정성 확보)
- **main**: 검증된 프로덕션 코드만 유지

#### Agent별 작업 브랜치 규칙
```bash
# 프론트엔드 Agent
feature/frontend-{기능명}
bugfix/frontend-{버그명}

# 백엔드 Agent
feature/backend-{기능명}
bugfix/backend-{버그명}

# 통합 작업
feature/integration-{기능명}
feature/shared-{공통기능명}
```

### 3. Agent별 작업 영역 분리

#### 3.1 프론트엔드 Agent 작업 영역
```
frontend/
├── src/
├── package.json        # 프론트엔드 전용
├── .gitignore         # 프론트엔드 전용
└── README.md          # 프론트엔드 가이드

# Git 후크 설정으로 frontend/ 변경시만 테스트 실행
```

#### 3.2 백엔드 Agent 작업 영역
```
backend/
├── src/
├── build.gradle       # 백엔드 전용
├── .gitignore        # 백엔드 전용
└── README.md         # 백엔드 가이드

# Git 후크 설정으로 backend/ 변경시만 테스트 실행
```

#### 3.3 공통 영역 (양쪽 Agent 협업)
```
shared/
├── api-spec/          # OpenAPI 명세 (양쪽에서 참조)
├── types/            # 공통 데이터 타입
└── constants/        # 공통 상수

docs/                 # 프로젝트 문서 (양쪽에서 업데이트)
```

### 4. Agent 협업을 위한 Git 워크플로우

#### 4.1 개발 시작 시
```bash
# 1. 최신 develop 브랜치로 업데이트
git checkout develop
git pull origin develop

# 2. Agent별 기능 브랜치 생성
git checkout -b feature/frontend-user-profile  # 프론트엔드 Agent
git checkout -b feature/backend-user-api       # 백엔드 Agent

# 3. 작업 영역 확인 및 설정
# 프론트엔드 Agent: frontend/ 디렉토리에서만 작업
# 백엔드 Agent: backend/ 디렉토리에서만 작업
```

#### 4.2 일일 동기화 워크플로우
```bash
# 매일 작업 시작 전
git checkout develop
git pull origin develop
git checkout feature/your-branch
git rebase develop

# 작업 중 충돌 방지를 위한 정기 동기화
git fetch origin
git rebase origin/develop
```

#### 4.3 통합 및 머지 프로세스
```bash
# 1. 기능 완료 후 develop으로 PR/MR 생성
# 2. 자동 CI/CD 파이프라인 실행
#    - 프론트엔드 테스트 (frontend/ 변경시)
#    - 백엔드 테스트 (backend/ 변경시)
#    - 통합 테스트 (양쪽 변경시)
# 3. 코드 리뷰 및 승인
# 4. develop 브랜치로 머지
```

### 5. CI/CD 파이프라인 설계

#### 5.1 GitHub Actions 워크플로우

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.changes.outputs.frontend }}
      backend: ${{ steps.changes.outputs.backend }}
      shared: ${{ steps.changes.outputs.shared }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'shared/**'
            backend:
              - 'backend/**'
              - 'shared/**'
            shared:
              - 'shared/**'

  frontend-test:
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Build
        run: cd frontend && npm run build

  backend-test:
    needs: detect-changes
    if: needs.detect-changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: cd backend && ./gradlew test
      - name: Build
        run: cd backend && ./gradlew build

  integration-test:
    needs: [frontend-test, backend-test]
    if: always() && (needs.frontend-test.result == 'success' || needs.backend-test.result == 'success')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: docker-compose up -d
      - name: Run integration tests
        run: ./scripts/run-integration-tests.sh
```

### 6. Agent별 Git 설정 및 가이드

#### 6.1 프론트엔드 Agent 설정
```bash
# 프론트엔드 Agent 전용 .gitconfig 설정
git config --local core.sparseCheckout true
echo "frontend/*" > .git/info/sparse-checkout
echo "shared/*" >> .git/info/sparse-checkout
echo "docs/*" >> .git/info/sparse-checkout
git read-tree -m -u HEAD

# 프론트엔드 관련 커밋 메시지 템플릿
git config --local commit.template .gitmessage-frontend
```

#### 6.2 백엔드 Agent 설정
```bash
# 백엔드 Agent 전용 .gitconfig 설정
git config --local core.sparseCheckout true
echo "backend/*" > .git/info/sparse-checkout
echo "shared/*" >> .git/info/sparse-checkout
echo "docs/*" >> .git/info/sparse-checkout
git read-tree -m -u HEAD

# 백엔드 관련 커밋 메시지 템플릿
git config --local commit.template .gitmessage-backend
```

### 7. 커밋 메시지 컨벤션

```
# 컨벤션 형식
<type>(<scope>): <subject>

<body>

<footer>

# 예시
feat(frontend): add user authentication screen
feat(backend): implement user registration API
fix(shared): update API response type definitions
docs(project): update setup instructions

# Type 정의
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 스타일 변경
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드/배포 관련

# Scope 정의
frontend: 프론트엔드 관련
backend: 백엔드 관련
shared: 공통 코드 관련
docs: 문서 관련
config: 설정 관련
```

### 8. 충돌 해결 전략

#### 8.1 예방적 조치
```bash
# 1. 매일 develop 브랜치와 동기화
git fetch origin
git rebase origin/develop

# 2. shared/ 디렉토리 변경시 즉시 소통
# - Slack/Discord 알림
# - PR 댓글로 관련 Agent 태그

# 3. API 명세 변경시 협의 프로세스
# - shared/api-spec/ 변경 전 이슈 생성
# - 양쪽 Agent 확인 후 진행
```

#### 8.2 충돌 발생시 해결 프로세스
```bash
# 1. 충돌 확인
git status

# 2. 충돌 파일 확인 및 해결
# - shared/ 영역 충돌: 양쪽 Agent 협의
# - 각 영역 충돌: 해당 Agent가 주도적 해결

# 3. 해결 후 테스트
npm test              # 프론트엔드
./gradlew test       # 백엔드

# 4. 커밋 및 푸시
git add .
git commit -m "resolve: merge conflict in shared/api-spec"
git push origin feature/branch-name
```

### 9. 백업 및 복구 전략

#### 9.1 정기 백업
```bash
# 1. 원격 리포지토리 미러링
git clone --mirror origin backup-repo

# 2. 중요 브랜치 태깅
git tag -a v1.0.0-backup -m "Backup before major changes"

# 3. 로컬 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d)
git bundle create ../heart-doctor-backup-$DATE.bundle --all
```

#### 9.2 복구 절차
```bash
# 1. 백업에서 복구
git clone backup-bundle heart-doctor-recovery

# 2. 특정 커밋으로 복구
git reset --hard <commit-hash>

# 3. 브랜치 복구
git checkout -b recovery-branch <backup-commit>
```

## 실제 적용을 위한 단계별 가이드

### Phase 1: 리포지토리 구조 재편성 (1-2일)
1. 현재 디렉토리 구조 분석
2. 새로운 모노레포 구조로 마이그레이션
3. Git 히스토리 보존하며 이동

### Phase 2: CI/CD 파이프라인 구축 (2-3일)
1. GitHub Actions 워크플로우 작성
2. 자동 테스트 및 빌드 설정
3. 배포 파이프라인 구성

### Phase 3: Agent별 가이드라인 수립 (1일)
1. 각 Agent별 작업 가이드 문서 작성
2. Git 워크플로우 교육
3. 충돌 해결 프로세스 정립

### Phase 4: 모니터링 및 최적화 (지속적)
1. Git 워크플로우 효율성 모니터링
2. Agent 피드백 수집 및 개선
3. 자동화 도구 추가 도입

## 결론

**모노레포 전략이 가장 적합한 이유:**

1. **Agent 협업 효율성**: 공통 API 명세와 타입 정의 공유 용이
2. **일관된 버전 관리**: 프론트엔드와 백엔드 버전 동기화
3. **통합 CI/CD**: 전체 시스템 통합 테스트 자동화
4. **프로젝트 관리 단순화**: 단일 이슈 트래커와 프로젝트 보드
5. **코드 재사용성**: 공통 유틸리티와 상수 공유

이 전략을 통해 여러 Agent가 효율적으로 협업하면서도 각자의 영역에서 독립적으로 개발할 수 있는 환경을 구축할 수 있습니다.