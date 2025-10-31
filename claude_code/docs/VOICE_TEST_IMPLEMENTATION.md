# 음성 검사 구현 문서

## 개요

OpenAI Realtime API를 사용하여 심장 건강 검사를 음성으로 진행하는 기능을 구현합니다. 텍스트 입력 방식과 동일한 데이터를 수집하고, 동일한 백엔드 API를 통해 결과를 저장합니다.

## 시스템 아키텍처

```
[React Native App] → [Backend API] → [OpenAI Realtime API]
         ↓                  ↓
   [WebRTC/WebSocket]  [Token Generation]
         ↓                  ↓
   [Audio I/O]        [Data Validation]
         ↓                  ↓
   [User Response]    [DB Storage]
         ↓                  ↓
   [Result Screen]    [Prediction API]
```

## 로직 흐름 분석

### 1. 음성 검사 단계 구조

```typescript
enum VoiceTestPhase {
  INITIALIZATION = 'initialization',    // 준비 확인
  BASIC_INFO = 'basic_info',           // 기본 정보 (6문항)
  SYMPTOMS = 'symptoms',               // 증상 체크 (10문항)
  COMPLETION = 'completion',           // 완료 및 감사 인사
}

interface Question {
  id: string;
  phase: VoiceTestPhase;
  text: string;
  type: 'yes_no' | 'gender' | 'number' | 'choice';
  options?: string[];
  fieldName: keyof AssessmentData;
  validation?: (value: string) => boolean;
}
```

### 2. 질문 순서 및 매핑

#### Phase 1: 초기화 (INITIALIZATION)
```
Q0: 준비 확인
- 텍스트: "심장 닥터의 심장 건강 분석 시간입니다. 고객님 지금 준비되셨나요?"
- 응답: "예" → 시작 / "아니오" → 취소
- 매핑: N/A (시작 트리거)
```

#### Phase 2: 기본 정보 (BASIC_INFO)
```
Q1: 성별 → gender
- 응답: "남자" | "여자" → "male" | "female"

Q2: 나이 → age
- 응답: 숫자 (예: "스물다섯" → "25")

Q3: 몸무게 → weight
- 응답: 숫자 (예: "칠십" → "70")

Q4: 키 → height
- 응답: 숫자 (예: "백칠십오" → "175")

Q5: 체온 → bodyTemperature
- 응답: "낮다" | "보통" | "높다" → "low" | "normal" | "high"

Q6: 호흡 → breathing
- 응답: "느리다" | "보통" | "빠르다" → "slow" | "normal" | "fast"
```

#### Phase 3: 증상 체크 (SYMPTOMS)
```
Q7: 가슴 통증 → chestPain
Q8: 옆구리/등 통증 → flankPain
Q9: 발 통증 → footPain
Q10: 발 부종 → edemaLegs
Q11: 호흡곤란 → dyspnea
Q12: 실신 → syncope
Q13: 피로감 → weakness
Q14: 구토 → vomiting
Q15: 심장 두근거림 → palpitation
Q16: 어지러움 → dizziness

모두 응답: "예" | "아니오" → "yes" | "no"
```

### 3. 데이터 변환 로직

```typescript
interface VoiceResponse {
  transcript: string;      // 사용자 음성 텍스트
  confidence: number;      // 인식 신뢰도
  timestamp: Date;         // 응답 시간
}

interface ParsedResponse {
  value: string;          // 정규화된 값
  isValid: boolean;       // 유효성 여부
  originalText: string;   // 원본 텍스트
}

// 음성 응답 → AssessmentData 변환
function parseVoiceResponse(
  question: Question,
  response: VoiceResponse
): ParsedResponse {
  // 1. 텍스트 정규화
  const normalized = normalizeKoreanText(response.transcript);

  // 2. 타입별 파싱
  switch (question.type) {
    case 'yes_no':
      return parseYesNo(normalized);
    case 'gender':
      return parseGender(normalized);
    case 'number':
      return parseKoreanNumber(normalized);
    case 'choice':
      return parseChoice(normalized, question.options);
  }
}
```

## 백엔드 구현

### 1. OpenAI Realtime API 토큰 생성

#### Endpoint: `POST /api/v1/voice/token`

```java
@RestController
@RequestMapping("/api/v1/voice")
public class VoiceTestController {

    @Autowired
    private OpenAIRealtimeService openAIService;

    @PostMapping("/token")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TokenResponse> generateToken(
        @RequestHeader("Authorization") String token
    ) {
        // 1. 사용자 인증 확인
        User user = authService.getUserFromToken(token);

        // 2. OpenAI ephemeral token 생성
        String ephemeralToken = openAIService.generateClientSecret();

        // 3. 세션 메타데이터 저장 (optional)
        VoiceSession session = voiceSessionService.createSession(
            user.getId(),
            ephemeralToken
        );

        return ResponseEntity.ok(new TokenResponse(
            ephemeralToken,
            session.getSessionId()
        ));
    }
}
```

#### Service 구현

```java
@Service
public class OpenAIRealtimeService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String TOKEN_URL =
        "https://api.openai.com/v1/realtime/client_secrets";

    public String generateClientSecret() {
        // Session configuration
        Map<String, Object> sessionConfig = Map.of(
            "session", Map.of(
                "type", "realtime",
                "model", "gpt-realtime-mini-2025-10-06",
                "audio", Map.of(
                    "output", Map.of("voice", "alloy")
                ),
                "instructions", buildInstructions()
            )
        );

        // HTTP Request
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
            new HttpEntity<>(sessionConfig, headers);

        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
            TOKEN_URL,
            request,
            TokenResponse.class
        );

        return response.getBody().getValue();
    }

    private String buildInstructions() {
        return """
            당신은 심장 건강 검사를 진행하는 의료 도우미입니다.

            규칙:
            1. 항상 정중하고 친절하게 대화하세요
            2. 한 번에 하나의 질문만 하세요
            3. 사용자 답변을 명확하게 이해하지 못한 경우, 다시 질문하세요
            4. 숫자는 정확하게 파악하세요 (예: "스물다섯" → 25)
            5. 예/아니오 질문에는 명확한 답변을 요청하세요

            질문 스크립트를 순서대로 따라가며, 각 답변을 정확하게 기록하세요.
            """;
    }
}
```

### 2. 데이터 저장 엔드포인트

음성 검사 결과는 기존 `/api/v1/checks` 엔드포인트를 재사용합니다.

```java
// 기존 엔드포인트 사용
POST /api/v1/checks
{
  "gender": "male",
  "age": "25",
  "height": "175",
  "weight": "70",
  "bodyTemperature": "normal",
  "breathing": "normal",
  "pulse": "75",  // 음성 검사에서는 자동 계산 또는 기본값
  "chestPain": "no",
  "flankPain": "no",
  // ... 나머지 증상
}
```

### 3. 데이터베이스 스키마 (선택적)

음성 검사 세션 추적을 위한 테이블 (optional):

```sql
CREATE TABLE voice_test_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    openai_session_id VARCHAR(255),
    ephemeral_token VARCHAR(500),
    status VARCHAR(50) NOT NULL, -- 'active', 'completed', 'cancelled'
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    audio_duration_seconds INTEGER,
    check_id BIGINT REFERENCES checks(check_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_voice_sessions_user ON voice_test_sessions(user_id);
CREATE INDEX idx_voice_sessions_status ON voice_test_sessions(status);
```

## 프론트엔드 구현

### 1. 필요한 패키지 설치

```bash
cd frontend
npm install @openai/realtime-api-beta
npm install @react-native-community/audio-toolkit  # or similar
```

### 2. 파일 구조

```
frontend/src/
├── services/
│   ├── voiceTestService.ts          # OpenAI Realtime API 연동
│   └── audioService.ts               # 오디오 입출력 관리
├── hooks/
│   ├── useVoiceTest.ts              # 음성 검사 로직
│   └── useAudioPermission.ts        # 권한 관리
├── screens/main/
│   └── VoiceTestModeScreen.tsx      # 기존 파일 업데이트
└── constants/
    └── voiceTestQuestions.ts        # 질문 데이터
```

### 3. 질문 데이터 구조

```typescript
// constants/voiceTestQuestions.ts
export const VOICE_TEST_QUESTIONS: Question[] = [
  // Phase 0: Initialization
  {
    id: 'init',
    phase: VoiceTestPhase.INITIALIZATION,
    text: '심장 닥터의 심장 건강 분석 시간입니다. 고객님 지금 준비되셨나요? 준비되셨으면 "예"라고 말씀해 주세요. 혹시 답변 준비가 안 되었거나 분석을 취소하려면 "아니오"로 답변해 주세요.',
    type: 'yes_no',
    fieldName: null,
  },

  // Phase 1: Basic Info
  {
    id: 'gender',
    phase: VoiceTestPhase.BASIC_INFO,
    text: '고객님의 성별을 말씀해 주세요. "남자" 혹은 "여자"라고 말씀해 주세요.',
    type: 'gender',
    fieldName: 'gender',
    validation: (value) => ['male', 'female'].includes(value),
  },
  {
    id: 'age',
    phase: VoiceTestPhase.BASIC_INFO,
    text: '고객님의 나이는 몇 세인가요? 숫자로 말씀해 주세요.',
    type: 'number',
    fieldName: 'age',
    validation: (value) => {
      const num = parseInt(value);
      return !isNaN(num) && num > 0 && num < 150;
    },
  },
  {
    id: 'weight',
    phase: VoiceTestPhase.BASIC_INFO,
    text: '고객님의 몸무게는 몇 kg인가요? 숫자로 말씀해 주세요.',
    type: 'number',
    fieldName: 'weight',
    validation: (value) => {
      const num = parseInt(value);
      return !isNaN(num) && num > 20 && num < 300;
    },
  },
  // ... 나머지 질문들
];
```

### 4. 음성 검사 서비스

```typescript
// services/voiceTestService.ts
import { RealtimeClient } from '@openai/realtime-api-beta';

interface VoiceTestConfig {
  onQuestionStart: (question: Question) => void;
  onResponseReceived: (transcript: string) => void;
  onAnswerValidated: (field: string, value: string) => void;
  onTestComplete: (data: AssessmentData) => void;
  onError: (error: Error) => void;
}

export class VoiceTestService {
  private client: RealtimeClient;
  private currentQuestionIndex: number = 0;
  private assessmentData: Partial<AssessmentData> = {};
  private config: VoiceTestConfig;

  constructor(config: VoiceTestConfig) {
    this.config = config;
    this.client = new RealtimeClient({
      apiKey: '', // Will be set during initialization
      dangerouslyAllowAPIKeyInBrowser: true, // Use ephemeral token instead
    });
  }

  async initialize(ephemeralToken: string): Promise<void> {
    try {
      // Connect to OpenAI Realtime API
      await this.client.connect({
        apiKey: ephemeralToken,
      });

      // Configure session
      await this.client.updateSession({
        instructions: this.buildInstructions(),
        voice: 'alloy',
        input_audio_transcription: {
          model: 'whisper-1',
        },
      });

      // Set up event listeners
      this.setupEventListeners();

      // Start first question
      await this.askNextQuestion();
    } catch (error) {
      this.config.onError(error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Listen for user responses
    this.client.on('conversation.item.completed', async (event) => {
      if (event.item.role === 'user') {
        const transcript = event.item.content[0].transcript;
        this.config.onResponseReceived(transcript);

        // Parse and validate response
        await this.handleUserResponse(transcript);
      }
    });

    // Listen for assistant responses
    this.client.on('conversation.item.completed', (event) => {
      if (event.item.role === 'assistant') {
        // Assistant finished speaking
        console.log('Assistant:', event.item.content[0].transcript);
      }
    });

    // Error handling
    this.client.on('error', (error) => {
      this.config.onError(error);
    });
  }

  private async askNextQuestion(): Promise<void> {
    if (this.currentQuestionIndex >= VOICE_TEST_QUESTIONS.length) {
      await this.completeTest();
      return;
    }

    const question = VOICE_TEST_QUESTIONS[this.currentQuestionIndex];
    this.config.onQuestionStart(question);

    // Send question to assistant
    await this.client.sendUserMessageContent([
      { type: 'input_text', text: question.text },
    ]);
  }

  private async handleUserResponse(transcript: string): Promise<void> {
    const question = VOICE_TEST_QUESTIONS[this.currentQuestionIndex];

    // Parse response based on question type
    const parsed = this.parseResponse(question, transcript);

    if (!parsed.isValid) {
      // Ask again if invalid
      await this.client.sendUserMessageContent([
        {
          type: 'input_text',
          text: '죄송합니다. 다시 한 번 말씀해 주시겠습니까?',
        },
      ]);
      return;
    }

    // Store answer
    if (question.fieldName) {
      this.assessmentData[question.fieldName] = parsed.value;
      this.config.onAnswerValidated(question.fieldName, parsed.value);
    }

    // Move to next question
    this.currentQuestionIndex++;
    await this.askNextQuestion();
  }

  private parseResponse(
    question: Question,
    transcript: string
  ): ParsedResponse {
    const normalized = transcript.toLowerCase().trim();

    switch (question.type) {
      case 'yes_no':
        return this.parseYesNo(normalized);
      case 'gender':
        return this.parseGender(normalized);
      case 'number':
        return this.parseNumber(normalized);
      case 'choice':
        return this.parseChoice(normalized, question.options);
      default:
        return { value: normalized, isValid: false, originalText: transcript };
    }
  }

  private parseYesNo(text: string): ParsedResponse {
    if (text.includes('예') || text.includes('네') || text.includes('yes')) {
      return { value: 'yes', isValid: true, originalText: text };
    }
    if (text.includes('아니') || text.includes('no')) {
      return { value: 'no', isValid: true, originalText: text };
    }
    return { value: text, isValid: false, originalText: text };
  }

  private parseGender(text: string): ParsedResponse {
    if (text.includes('남') || text.includes('male')) {
      return { value: 'male', isValid: true, originalText: text };
    }
    if (text.includes('여') || text.includes('female')) {
      return { value: 'female', isValid: true, originalText: text };
    }
    return { value: text, isValid: false, originalText: text };
  }

  private parseNumber(text: string): ParsedResponse {
    // Try direct number extraction
    const numberMatch = text.match(/\d+/);
    if (numberMatch) {
      return {
        value: numberMatch[0],
        isValid: true,
        originalText: text,
      };
    }

    // Try Korean number parsing
    const koreanNumber = this.parseKoreanNumber(text);
    if (koreanNumber !== null) {
      return {
        value: koreanNumber.toString(),
        isValid: true,
        originalText: text,
      };
    }

    return { value: text, isValid: false, originalText: text };
  }

  private parseKoreanNumber(text: string): number | null {
    // Korean number parsing logic
    // 예: "스물다섯" → 25, "일백칠십오" → 175
    const koreanNumbers = {
      영: 0, 일: 1, 이: 2, 삼: 3, 사: 4,
      오: 5, 육: 6, 칠: 7, 팔: 8, 구: 9,
      십: 10, 백: 100, 천: 1000,
      스물: 20, 서른: 30, 마흔: 40,
      쉰: 50, 예순: 60, 일흔: 70,
      여든: 80, 아흔: 90,
    };

    // Implementation needed
    return null;
  }

  private parseChoice(
    text: string,
    options: string[]
  ): ParsedResponse {
    for (const option of options) {
      if (text.includes(option)) {
        return { value: option, isValid: true, originalText: text };
      }
    }
    return { value: text, isValid: false, originalText: text };
  }

  private async completeTest(): Promise<void> {
    // Add default pulse value if not collected
    if (!this.assessmentData.pulse) {
      this.assessmentData.pulse = '75'; // Default value
    }

    // Validate all required fields
    const isComplete = this.validateAssessmentData(
      this.assessmentData as AssessmentData
    );

    if (isComplete) {
      this.config.onTestComplete(this.assessmentData as AssessmentData);
    } else {
      this.config.onError(
        new Error('Incomplete assessment data')
      );
    }
  }

  private validateAssessmentData(data: AssessmentData): boolean {
    const requiredFields: (keyof AssessmentData)[] = [
      'gender', 'age', 'height', 'weight',
      'bodyTemperature', 'breathing',
      'chestPain', 'flankPain', 'footPain',
      'edemaLegs', 'dyspnea', 'syncope',
      'weakness', 'vomiting', 'palpitation', 'dizziness',
    ];

    return requiredFields.every(field => {
      const value = data[field];
      return value !== undefined && value !== null && value !== '';
    });
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  private buildInstructions(): string {
    return `
당신은 심장 건강 검사를 진행하는 친절한 의료 도우미입니다.

규칙:
1. 항상 정중하고 친절하게 대화하세요
2. 한 번에 하나의 질문만 하세요
3. 사용자의 답변을 명확하게 이해하지 못한 경우, 정중하게 다시 질문하세요
4. 숫자는 정확하게 파악하세요
5. 예/아니오 질문에는 명확한 답변을 요청하세요
6. 각 질문 전에 짧은 호흡을 두세요

진행 방식:
- 제공된 질문 스크립트를 순서대로 따라가세요
- 각 답변을 정확하게 듣고 확인하세요
- 불분명한 답변은 재질문하세요
    `.trim();
  }
}
```

### 5. React Hook 구현

```typescript
// hooks/useVoiceTest.ts
export function useVoiceTest() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({});
  const [error, setError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  const voiceService = useRef<VoiceTestService | null>(null);
  const navigation = useNavigation();

  const initializeVoiceTest = async () => {
    try {
      // 1. Get ephemeral token from backend
      const response = await fetch(`${API_BASE_URL}/api/v1/voice/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const { ephemeralToken } = await response.json();

      // 2. Initialize voice service
      voiceService.current = new VoiceTestService({
        onQuestionStart: (question) => {
          setCurrentQuestion(question);
          console.log('[Voice Test] Question:', question.text);
        },
        onResponseReceived: (transcript) => {
          setLastTranscript(transcript);
          console.log('[Voice Test] User said:', transcript);
        },
        onAnswerValidated: (field, value) => {
          setAssessmentData(prev => ({ ...prev, [field]: value }));
          console.log('[Voice Test] Answer recorded:', field, value);
        },
        onTestComplete: async (data) => {
          console.log('[Voice Test] Complete:', data);
          await handleTestComplete(data);
        },
        onError: (err) => {
          console.error('[Voice Test] Error:', err);
          setError(err.message);
          Alert.alert('오류', '음성 검사 중 오류가 발생했습니다.');
        },
      });

      await voiceService.current.initialize(ephemeralToken);
      setIsInitialized(true);
      setIsRecording(true);
    } catch (err) {
      console.error('[Voice Test] Initialization error:', err);
      setError(err.message);
      Alert.alert('오류', '음성 검사를 시작할 수 없습니다.');
    }
  };

  const handleTestComplete = async (data: AssessmentData) => {
    try {
      setIsRecording(false);

      // Submit to backend (same as text mode)
      const response = await submitCheck(data);

      // Navigate to result screen
      navigation.navigate('Result', {
        checkData: response,
        assessmentData: data,
      });
    } catch (err) {
      console.error('[Voice Test] Submit error:', err);
      Alert.alert('오류', '검사 결과 제출에 실패했습니다.');
    }
  };

  const stopVoiceTest = async () => {
    if (voiceService.current) {
      await voiceService.current.disconnect();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (voiceService.current) {
        voiceService.current.disconnect();
      }
    };
  }, []);

  return {
    isInitialized,
    isRecording,
    currentQuestion,
    assessmentData,
    lastTranscript,
    error,
    initializeVoiceTest,
    stopVoiceTest,
  };
}
```

### 6. UI 업데이트

```typescript
// screens/main/VoiceTestModeScreen.tsx
export const VoiceTestModeScreen = () => {
  const {
    isInitialized,
    isRecording,
    currentQuestion,
    assessmentData,
    lastTranscript,
    error,
    initializeVoiceTest,
    stopVoiceTest,
  } = useVoiceTest();

  const handleStartVoiceTest = async () => {
    // Check audio permissions
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert('권한 필요', '마이크 권한이 필요합니다.');
      return;
    }

    await initializeVoiceTest();
  };

  const handleCancelTest = () => {
    Alert.alert(
      '검사 취소',
      '음성 검사를 취소하시겠습니까?',
      [
        { text: '계속하기', style: 'cancel' },
        {
          text: '취소',
          style: 'destructive',
          onPress: async () => {
            await stopVoiceTest();
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView style={styles.content}>
        {!isRecording ? (
          // Initial state - show start button
          <View style={styles.initialState}>
            {/* ... existing UI ... */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartVoiceTest}>
              <Icon name="mic" size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>음성 검사 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Recording state - show progress
          <View style={styles.recordingState}>
            {/* Animated microphone */}
            <View style={styles.recordingIndicator}>
              <Animated.View style={[styles.pulseCircle, pulseAnimation]} />
              <Icon name="mic" size={60} color="#FFFFFF" />
            </View>

            {/* Current question */}
            {currentQuestion && (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {currentQuestion.text}
                </Text>
              </View>
            )}

            {/* Last transcript */}
            {lastTranscript && (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptLabel}>들은 내용:</Text>
                <Text style={styles.transcriptText}>{lastTranscript}</Text>
              </View>
            )}

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {Object.keys(assessmentData).length} / 16 완료
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(Object.keys(assessmentData).length / 16) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelTest}>
              <Text style={styles.cancelButtonText}>검사 취소</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
```

## 개발 체크리스트

### Backend ✅ 완료

- [x] **OpenAI Integration**
  - [x] OpenAI API Key 환경변수 설정 (`application.properties`)
  - [x] OpenAIRealtimeService 구현 (`OpenAIRealtimeService.java`)
  - [x] Token generation endpoint 구현 (`VoiceTestController.java`)
  - [x] Error handling 및 retry logic

- [x] **API Endpoints**
  - [x] `POST /api/v1/voice/token` 구현 (JWT 인증 통합)
  - [x] 기존 `POST /api/v1/prediction` 재사용 확인
  - [x] Authentication 미들웨어 적용 (`@PreAuthorize`)

- [x] **Configuration**
  - [x] RestTemplate 설정 (`RestTemplateConfig.java`)
  - [x] DTO 클래스 생성 (TokenResponse, OpenAITokenRequest, OpenAITokenResponse)
  - [x] 한글 시스템 지시문 작성

- [x] **Testing**
  - [x] 백엔드 컴파일 성공
  - [x] Token generation endpoint 생성 확인
  - [x] Spring Boot 서버 시작 성공

### Frontend ✅ 완료

- [x] **Dependencies**
  - [x] WebSocket 네이티브 지원 (React Native)
  - [x] react-native-permissions 설치 완료
  - [x] 추가 패키지 불필요 (OpenAI beta 패키지 대신 직접 WebSocket 사용)

- [x] **Core Implementation**
  - [x] voiceTestQuestions.ts 작성 (17개 질문 + 매핑)
  - [x] VoiceTestService 클래스 구현 (WebSocket 기반)
  - [x] useVoiceTest hook 구현 (7가지 상태 관리)
  - [x] Audio permission handling (Android/iOS)

- [x] **Parsing Logic**
  - [x] Yes/No parser 구현 (`parseYesNo`)
  - [x] Gender parser 구현 (`parseSex`)
  - [x] Number parser 구현 (`parseVoiceNumber`)
  - [x] Korean number parser 구현 (기본 숫자 단어 지원)
  - [x] Response validation 구현

- [x] **UI Components**
  - [x] VoiceTestModeScreen 업데이트 (완전 재구현)
  - [x] Recording indicator 구현 (상태별 마이크 아이콘)
  - [x] Progress bar 구현 (0-17 진행률)
  - [x] Transcript display (실시간 음성 인식 결과)
  - [x] Error states 처리 (재시도, 에러 화면)

- [x] **State Management**
  - [x] 7가지 상태: idle, connecting, ready, listening, processing, speaking, completed, error
  - [x] 상태별 UI 렌더링 함수
  - [x] 상태 전환 로직

- [x] **Navigation**
  - [x] Result screen navigation (자동 제출 후 이동)
  - [x] Cancel/back handling (확인 다이얼로그)
  - [x] 텍스트 모드 전환 (확인 다이얼로그)

- [x] **Testing**
  - [x] Navigation 정상 동작 확인
  - [x] Metro bundler 실행 확인
  - [x] VoiceTestService 초기화 로그 확인
  - [ ] Full flow E2E 테스트 (다음 단계)

### Integration 🔄 진행 중

- [x] **Core Flow**
  - [x] Token generation → Session init
  - [x] WebSocket 연결 로직
  - [x] Response parsing → Data collection
  - [x] Submit → Result display
  - [ ] Audio streaming (실제 테스트 필요)

- [x] **Error Handling**
  - [x] Network errors
  - [x] OpenAI API errors
  - [x] Permission denied
  - [x] Timeout handling

- [ ] **Edge Cases** (실제 테스트 필요)
  - [ ] App backgrounding
  - [ ] Network interruption
  - [ ] Invalid responses
  - [ ] Incomplete sessions

### DevOps 📋 대기 중

- [x] **Environment Setup**
  - [x] OpenAI API key 설정 (dev)
  - [ ] Rate limiting 설정
  - [ ] Monitoring 설정

- [ ] **Deployment**
  - [ ] Backend deployment
  - [ ] App update 배포
  - [ ] Feature flag (선택적)

## 보안 고려사항

1. **API Key 관리**
   - Backend에서만 OpenAI API key 사용
   - Ephemeral token은 클라이언트에서 안전하게 사용 가능
   - Token 만료 시간 적절히 설정

2. **데이터 보안**
   - 음성 데이터는 OpenAI 서버에서 처리
   - Transcript는 필요시에만 저장
   - HIPAA/의료 데이터 규정 준수

3. **Rate Limiting**
   - 사용자당 일일 음성 검사 횟수 제한
   - Abuse 방지 로직

## 성능 최적화

1. **Network Optimization**
   - WebRTC 우선 사용 (낮은 latency)
   - Fallback to WebSocket

2. **Audio Quality**
   - 적절한 샘플 레이트 설정
   - Noise cancellation

3. **Caching**
   - 질문 데이터 로컬 캐싱
   - Token 재사용 (만료 전)

## 모니터링 및 분석

1. **Metrics**
   - Session completion rate
   - Average session duration
   - Error rates by type
   - OpenAI API usage

2. **User Analytics**
   - Voice vs Text mode usage
   - Question completion rates
   - Drop-off points

## 구현 완료 파일 목록

### Backend 파일

1. **Configuration**
   - `backend/src/main/resources/application.properties` - OpenAI API 설정 추가

2. **DTOs**
   - `backend/src/main/java/ac/cbnu/heartcheck/dto/voice/TokenResponse.java` - 토큰 응답 DTO
   - `backend/src/main/java/ac/cbnu/heartcheck/dto/voice/OpenAITokenRequest.java` - OpenAI API 요청 DTO
   - `backend/src/main/java/ac/cbnu/heartcheck/dto/voice/OpenAITokenResponse.java` - OpenAI API 응답 DTO

3. **Services**
   - `backend/src/main/java/ac/cbnu/heartcheck/service/OpenAIRealtimeService.java` - OpenAI Realtime API 통합 서비스

4. **Controllers**
   - `backend/src/main/java/ac/cbnu/heartcheck/controller/VoiceTestController.java` - 음성 검사 API 컨트롤러

5. **Configuration Classes**
   - `backend/src/main/java/ac/cbnu/heartcheck/config/RestTemplateConfig.java` - HTTP 클라이언트 설정

### Frontend 파일

1. **Constants**
   - `frontend/src/constants/voiceTestQuestions.ts` - 17개 질문 정의 및 파싱 유틸리티

2. **Services**
   - `frontend/src/services/voiceTestService.ts` - WebSocket 기반 OpenAI Realtime API 서비스

3. **Hooks**
   - `frontend/src/hooks/useVoiceTest.ts` - 음성 검사 상태 관리 및 로직 Hook

4. **Screens**
   - `frontend/src/screens/main/VoiceTestModeScreen.tsx` - 음성 검사 UI (완전 재구현)

5. **Navigation**
   - `frontend/src/navigation/RootNavigator.tsx` - VoiceTestMode 화면 등록 (기존 파일 수정)
   - `frontend/src/types/index.ts` - VoiceTestMode 타입 추가 (기존 파일 수정)

## 다음 단계

### 1. 백엔드 서버 재시작 및 확인 ✅
```bash
cd backend
./gradlew bootRun
# 서버가 포트 8080에서 정상 실행되는지 확인
```

### 2. 실제 음성 검사 테스트 🎯
```bash
# 프론트엔드에서 다음 흐름 테스트:
1. 홈 화면 → "음성 검사 모드로 전환" 클릭
2. VoiceTestModeScreen에서 "음성 검사 시작하기" 클릭
3. 마이크 권한 허용
4. OpenAI 연결 확인 (connecting → ready)
5. AI 질문 듣기 및 답변
6. 17개 질문 완료
7. 결과 자동 제출 및 Result 화면 이동
```

### 3. 디버깅 및 개선 사항
- [ ] WebSocket 연결 안정성 테스트
- [ ] 음성 인식 정확도 확인 (한글 숫자 파싱)
- [ ] 네트워크 오류 시나리오 테스트
- [ ] 답변 재시도 플로우 테스트
- [ ] 중단/취소 시나리오 테스트

### 4. 추가 기능 (선택사항)
- [ ] 음성 검사 이력 저장 (voice_test_sessions 테이블)
- [ ] 통계 및 분석 대시보드
- [ ] Rate limiting 구현
- [ ] 오디오 품질 최적화
- [ ] 백그라운드 모드 대응

### 5. 프로덕션 배포 준비
- [ ] 환경별 API key 분리 (dev/staging/prod)
- [ ] 에러 로깅 및 모니터링 설정
- [ ] 성능 테스트 및 최적화
- [ ] 사용자 피드백 수집
- [ ] 앱스토어/플레이스토어 업데이트
