# HeartRisk Backend API Spec (v1 Draft)

## Authentication
### POST /api/v1/auth/signup
- Request
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "phone": "+821012345678"
}
```
- Response `200`
```json
{
  "accessToken": "access-uuid",
  "refreshToken": "refresh-uuid"
}
```

### POST /api/v1/auth/login
- Request body identical to signup.
- Errors: `400` invalid credentials.

## Intake & Screening
### POST /api/v1/screenings
- Headers: `X-User-Email`
- Request
```json
{
  "resultLabel": "NORMAL",
  "riskScore": 0.12,
  "recommendation": "지속적인 운동 유지",
  "sdkVersion": "1.0.0",
  "metrics": [
    {"key": "age", "value": "52", "unit": "years"},
    {"key": "restingHeartRate", "value": "78", "unit": "bpm"}
  ]
}
```
- Response `202` Accepted (asynchronous persisting allowed).

### GET /api/v1/screenings
- Response `200`
```json
[
  {
    "id": 12,
    "resultLabel": "NORMAL",
    "riskScore": 0.12,
    "recommendation": "지속적인 운동 유지",
    "sdkVersion": "1.0.0",
    "createdAt": "2024-09-17T12:45:00Z"
  }
]
```

### GET /api/v1/screenings/{id}
- Response `200`
```json
{
  "id": 12,
  "resultLabel": "NORMAL",
  "riskScore": 0.12,
  "recommendation": "지속적인 운동 유지",
  "sdkVersion": "1.0.0",
  "metrics": [
    {"key": "age", "value": "52", "unit": "years"}
  ]
}
```

## Settings
### GET /api/v1/settings/me
- Response `200`
```json
{
  "locale": "ko",
  "inputMode": "VOICE",
  "timeoutSec": 90,
  "notificationsEnabled": true
}
```

### PUT /api/v1/settings/me
- Request body 동일한 필드 구조.
- Response `200` updated settings.

## Subscription
### GET /api/v1/subscriptions/me
- Response `200`
```json
{
  "plan": "MONTHLY",
  "status": "ACTIVE",
  "renewalDate": "2024-10-17T08:00:00Z",
  "platform": "GOOGLE"
}
```
- Response `204` when 사용자가 아직 구독 없음.

### POST /api/v1/subscriptions/purchase
- Request
```json
{
  "plan": "MONTHLY",
  "platform": "GOOGLE",
  "providerTransactionId": "GPA.1234-5678-9012-34567",
  "amount": 5.99,
  "currency": "USD",
  "purchasedAt": "2024-09-17T10:11:12Z"
}
```
- Response `200` with latest subscription.
- Errors: `400` duplicate providerTransactionId.

## Audio Session (Skeleton)
### POST /api/v1/audio/sessions
- Placeholder: To be implemented in Phase 2 with OpenAI realtime integration.

## Error Schema
```
{
  "timestamp": "2024-09-17T12:00:00Z",
  "error": "Validation failed",
  "details": {
    "email": "must be a well-formed email address"
  }
}
```

## Notes
- 모든 요청은 임시로 `X-User-Email` 헤더를 사용해 사용자 식별(Phase 2에서 JWT 교체 예정).
- 응답의 날짜/시간은 ISO-8601(UTC) 표준을 따른다.
- 추후 관리자 API는 `/api/v1/admin` 네임스페이스에 추가된다.
