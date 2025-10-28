# GPT-Realtime-Mini 음성 입력 구현 계획서 (GA Version)

## 1. 개요

### 1.1 목적
심장질환 검사 폼(17개 질문)을 OpenAI Realtime API의 gpt-realtime-mini 모델을 사용한 음성 대화로 입력받는 기능 구현

### 1.2 선택한 모델
**gpt-realtime-mini (Default model)**

**선택 이유:**
- 75% 비용 절감 (mini vs full realtime 모델)
- 구조화된 Q&A에 최적화된 성능
- Function Calling 지원
- 더 빠른 응답 속도
- 낮은 지연시간 (Low-latency optimized)

**API Version:**
- GA (General Availability) 버전 사용
- Beta 헤더 불필요

### 1.3 기술 스택
- **Frontend**: React Native (iOS/Android)
- **Connection Method**: WebSocket (서버 사이드 중간 계층)
- **Audio**: PCM16 format (24kHz, 16-bit, mono)
- **Backend**: Spring Boot (검사 결과 저장 + WebSocket Proxy)
- **Model**: gpt-realtime-mini

---

## 2. 기술 아키텍처

### 2.1 전체 구조
```
[React Native App]
      ↓ WebSocket
[OpenAI Realtime API]
      ↓ Function Calling
[대화 상태 관리]
      ↓ HTTP POST
[Spring Boot Backend]
      ↓
[PostgreSQL DB]
```

### 2.2 WebSocket 연결 흐름 (GA Version)
```
1. 사용자 "음성으로 입력" 버튼 클릭
2. Backend에서 OpenAI WebSocket 연결
   - URL: wss://api.openai.com/v1/realtime?model=gpt-realtime-mini
   - Authorization: Bearer {OPENAI_API_KEY}
   - Beta 헤더 제거 (GA 버전)
3. Session 설정 (type: realtime, Function Calling)
4. 음성 스트리밍 시작
5. 17개 질문 순차 진행
6. Function Call로 답변 구조화
7. 완료 후 Backend DB 저장
8. WebSocket 연결 종료
```

**주요 변경사항 (Beta → GA):**
- ✅ Beta 헤더(`OpenAI-Beta: realtime=v1`) 제거
- ✅ Session에 `type: "realtime"` 명시 필수
- ✅ 이벤트 이름 변경:
  - `response.audio.delta` → `response.output_audio.delta`
  - `response.audio_transcript.delta` → `response.output_audio_transcript.delta`
  - `response.text.delta` → `response.output_text.delta`

### 2.3 대화 상태 관리
```typescript
type ConversationState = {
  currentQuestionIndex: number;  // 0-16
  answers: QuestionAnswers;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
};

type QuestionAnswers = {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  bodyTemperature: number;
  breathingRate: number;
  // 11 symptoms (0-4 scale)
  chestPain: number;
  shortnessOfBreath: number;
  fatigue: number;
  dizziness: number;
  nausea: number;
  palpitations: number;
  swelling: number;
  coldSweat: number;
  indigestion: number;
  anxiety: number;
  backPain: number;
};
```

---

## 3. 17개 질문 시나리오

### 3.1 질문 목록
```javascript
const questions = [
  // 기본 정보 (6개)
  { id: 'gender', text: '성별을 알려주세요. 남성이신가요, 여성이신가요?', type: 'choice' },
  { id: 'age', text: '나이를 말씀해주세요.', type: 'number' },
  { id: 'weight', text: '체중을 킬로그램 단위로 말씀해주세요.', type: 'number' },
  { id: 'height', text: '키를 센티미터 단위로 말씀해주세요.', type: 'number' },
  { id: 'bodyTemperature', text: '체온을 섭씨로 말씀해주세요.', type: 'number' },
  { id: 'breathingRate', text: '분당 호흡수를 말씀해주세요.', type: 'number' },

  // 증상 (11개, 0-4 척도)
  { id: 'chestPain', text: '가슴 통증 정도를 0부터 4까지 중에서 말씀해주세요. 0은 없음, 4는 매우 심함입니다.', type: 'scale' },
  { id: 'shortnessOfBreath', text: '숨가쁨 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'fatigue', text: '피로감 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'dizziness', text: '어지러움 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'nausea', text: '메스꺼움 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'palpitations', text: '심계항진(두근거림) 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'swelling', text: '부기(부종) 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'coldSweat', text: '식은땀 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'indigestion', text: '소화불량 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'anxiety', text: '불안감 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
  { id: 'backPain', text: '등 통증 정도를 0부터 4까지 중에서 말씀해주세요.', type: 'scale' },
];
```

---

## 4. 코드 구현

### 4.1 WebSocket 연결 및 세션 설정

```typescript
// src/services/realtimeAPI.ts
import { Platform } from 'react-native';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// GA 버전 URL - model 파라미터에 gpt-realtime-mini 사용
const REALTIME_API_URL = 'wss://api.openai.com/v1/realtime?model=gpt-realtime-mini';

export class RealtimeAPIService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // GA 버전: Beta 헤더 제거
      this.ws = new WebSocket(REALTIME_API_URL, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
          // 'OpenAI-Beta': 'realtime=v1' 제거 (GA 버전)
        }
      });

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.configureSession();
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        this.handleServerMessage(JSON.parse(event.data));
      };
    });
  }

  private configureSession() {
    if (!this.ws) return;

    // GA 버전 Session 설정 - type 필드 필수
    this.ws.send(JSON.stringify({
      type: 'session.update',
      session: {
        type: 'realtime',  // GA 버전: 필수 필드 (realtime | transcription)
        model: 'gpt-realtime-mini',  // 명시적 모델 지정
        instructions: `당신은 심장질환 검사를 위한 친절한 의료 상담사입니다.
환자에게 17개의 질문을 순서대로 하나씩 물어보고, 답변을 정확히 기록해주세요.
각 질문에 대해 명확한 답변을 받은 후 다음 질문으로 넘어가세요.
환자가 이해하기 쉽게 친절하고 차분한 어조로 대화하세요.`,
        // GA 버전: audio 설정 구조 변경
        audio: {
          input: { format: 'pcm16' },
          output: {
            format: 'pcm16',
            voice: 'alloy'  // 한국어 지원 음성
          }
        },
        input_audio_transcription: {
          enabled: true,
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [this.createAnswerRecordingTool()],
        tool_choice: 'auto',
        temperature: 0.7,
        max_output_tokens: 300  // GA 버전: max_response_output_tokens → max_output_tokens
      }
    }));
  }

  private createAnswerRecordingTool() {
    return {
      type: 'function',
      name: 'record_answer',
      description: '환자의 답변을 기록합니다. 답변을 받은 즉시 이 함수를 호출하세요.',
      parameters: {
        type: 'object',
        properties: {
          questionId: {
            type: 'string',
            enum: [
              'gender', 'age', 'weight', 'height', 'bodyTemperature', 'breathingRate',
              'chestPain', 'shortnessOfBreath', 'fatigue', 'dizziness', 'nausea',
              'palpitations', 'swelling', 'coldSweat', 'indigestion', 'anxiety', 'backPain'
            ],
            description: '질문 ID'
          },
          value: {
            type: 'string',
            description: '환자의 답변 (숫자 또는 텍스트)'
          },
          confidence: {
            type: 'number',
            description: '답변 인식 확신도 (0.0-1.0)',
            minimum: 0,
            maximum: 1
          }
        },
        required: ['questionId', 'value', 'confidence']
      }
    };
  }

  private handleServerMessage(message: any) {
    console.log('Server message:', message.type);

    switch (message.type) {
      case 'session.created':
        console.log('Session created:', message.session.id);
        this.startConversation();
        break;

      // GA 버전: 이벤트 이름 변경
      case 'response.output_audio.delta':  // Beta: response.audio.delta
        // 오디오 청크 재생
        this.playAudioChunk(message.delta);
        break;

      case 'response.output_audio_transcript.delta':  // Beta: response.audio_transcript.delta
        // AI 응답 텍스트 (실시간 자막용)
        console.log('AI speaking:', message.delta);
        break;

      case 'response.output_text.delta':  // Beta: response.text.delta
        // 텍스트 응답 (있을 경우)
        console.log('AI text:', message.delta);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // 사용자 음성 인식 완료
        console.log('User said:', message.transcript);
        break;

      // GA 버전: conversation item 이벤트 변경
      case 'conversation.item.added':  // Beta: conversation.item.created
        console.log('Item added:', message.item);
        break;

      case 'conversation.item.done':  // New in GA
        console.log('Item done:', message.item);
        break;

      case 'response.function_call_arguments.done':
        // Function Call 완료
        this.handleFunctionCall(message);
        break;

      case 'error':
        console.error('API error:', message.error);
        break;
    }
  }

  private handleFunctionCall(message: any) {
    if (message.name === 'record_answer') {
      const args = JSON.parse(message.arguments);
      console.log('Answer recorded:', args);

      // 상태 업데이트 (React 컴포넌트로 전달)
      this.onAnswerRecorded?.(args.questionId, args.value, args.confidence);

      // 다음 질문으로 이동
      this.moveToNextQuestion();
    }
  }

  private startConversation() {
    // 첫 번째 질문 시작
    this.sendTextMessage('안녕하세요. 심장질환 검사를 시작하겠습니다. 성별을 알려주세요. 남성이신가요, 여성이신가요?');
  }

  private moveToNextQuestion() {
    // 다음 질문 전송 로직
    const nextIndex = this.currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      this.currentQuestionIndex = nextIndex;
      this.sendTextMessage(questions[nextIndex].text);
    } else {
      // 모든 질문 완료
      this.sendTextMessage('검사가 완료되었습니다. 감사합니다.');
      this.onConversationComplete?.();
    }
  }

  sendAudioChunk(audioData: ArrayBuffer) {
    if (!this.ws) return;

    // PCM16 오디오를 base64로 인코딩
    const base64Audio = this.arrayBufferToBase64(audioData);

    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      audio: base64Audio
    }));
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // 콜백 함수들
  onAnswerRecorded?: (questionId: string, value: string, confidence: number) => void;
  onConversationComplete?: () => void;
}
```

### 4.2 React Native 음성 녹음 컴포넌트

```typescript
// src/components/VoiceInputModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { RealtimeAPIService } from '../services/realtimeAPI';

type Props = {
  visible: boolean;
  onClose: () => void;
  onComplete: (answers: QuestionAnswers) => void;
};

export const VoiceInputModal: React.FC<Props> = ({ visible, onClose, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionAnswers>>({});
  const [aiSpeaking, setAiSpeaking] = useState('');

  const realtimeService = useRef<RealtimeAPIService | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    if (visible) {
      initializeVoiceChat();
    } else {
      cleanup();
    }
  }, [visible]);

  const initializeVoiceChat = async () => {
    try {
      // 마이크 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '마이크 권한이 필요합니다.');
        onClose();
        return;
      }

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Realtime API 연결
      realtimeService.current = new RealtimeAPIService();
      realtimeService.current.onAnswerRecorded = handleAnswerRecorded;
      realtimeService.current.onConversationComplete = handleConversationComplete;

      await realtimeService.current.connect();

      // 녹음 시작
      startRecording();
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('오류', '음성 입력을 시작할 수 없습니다.');
      onClose();
    }
  };

  const startRecording = async () => {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 24000,
          numberOfChannels: 1,
          bitRate: 384000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 24000,
          numberOfChannels: 1,
          bitRate: 384000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);

      // 실시간 오디오 스트리밍 (100ms 청크)
      const streamInterval = setInterval(async () => {
        if (recordingRef.current) {
          const status = await recordingRef.current.getStatusAsync();
          if (status.isRecording) {
            const uri = recording.getURI();
            if (uri) {
              // 오디오 청크를 읽어서 Realtime API로 전송
              const audioData = await fetch(uri).then(r => r.arrayBuffer());
              realtimeService.current?.sendAudioChunk(audioData);
            }
          }
        }
      }, 100);

      // cleanup 시 interval 제거
      return () => clearInterval(streamInterval);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const handleAnswerRecorded = (questionId: string, value: string, confidence: number) => {
    console.log(`Answer: ${questionId} = ${value} (confidence: ${confidence})`);

    // confidence가 낮으면 재확인
    if (confidence < 0.7) {
      // AI가 자동으로 재확인할 것임
      return;
    }

    // 답변 저장
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseAnswerValue(questionId, value)
    }));

    // 질문 인덱스 증가
    setCurrentQuestion(prev => prev + 1);
  };

  const parseAnswerValue = (questionId: string, value: string): any => {
    // 성별
    if (questionId === 'gender') {
      return value.toLowerCase().includes('남') ? 'male' : 'female';
    }

    // 숫자 값들
    const numValue = parseFloat(value);
    return isNaN(numValue) ? 0 : numValue;
  };

  const handleConversationComplete = () => {
    // 모든 답변이 수집되었는지 확인
    const requiredFields = [
      'gender', 'age', 'weight', 'height', 'bodyTemperature', 'breathingRate',
      'chestPain', 'shortnessOfBreath', 'fatigue', 'dizziness', 'nausea',
      'palpitations', 'swelling', 'coldSweat', 'indigestion', 'anxiety', 'backPain'
    ];

    const missingFields = requiredFields.filter(field => !(field in answers));

    if (missingFields.length > 0) {
      Alert.alert('오류', `일부 답변이 누락되었습니다: ${missingFields.join(', ')}`);
      return;
    }

    // 완료 콜백 호출
    onComplete(answers as QuestionAnswers);
    cleanup();
    onClose();
  };

  const cleanup = async () => {
    // 녹음 중지
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) {
        console.error('Error stopping recording:', e);
      }
      recordingRef.current = null;
    }

    // WebSocket 연결 종료
    realtimeService.current?.disconnect();
    realtimeService.current = null;

    // 상태 초기화
    setIsRecording(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleCancel = () => {
    Alert.alert(
      '취소 확인',
      '음성 입력을 취소하시겠습니까?',
      [
        { text: '계속하기', style: 'cancel' },
        { text: '취소', style: 'destructive', onPress: () => {
          cleanup();
          onClose();
        }}
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>음성 검사 진행 중</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progress}>{currentQuestion + 1} / 17</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / 17) * 100}%` }]} />
            </View>
          </View>

          {/* 현재 질문 표시 */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {questions[currentQuestion]?.text || '검사를 준비하고 있습니다...'}
            </Text>
          </View>

          {/* AI 음성 텍스트 (실시간 자막) */}
          {aiSpeaking && (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptLabel}>AI:</Text>
              <Text style={styles.transcriptText}>{aiSpeaking}</Text>
            </View>
          )}

          {/* 녹음 상태 표시 */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>듣고 있습니다...</Text>
            </View>
          )}

          {/* 취소 버튼 */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ef4444',
  },
  questionContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  transcriptContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  transcriptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 14,
    color: '#1f2937',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});
```

### 4.3 HomeScreen 통합

```typescript
// src/screens/main/HomeScreen.tsx 수정 부분
import React, { useState } from 'react';
import { VoiceInputModal } from '../../components/VoiceInputModal';

export const HomeScreen = () => {
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleVoiceComplete = (answers: QuestionAnswers) => {
    // 음성으로 받은 답변을 폼 데이터로 변환
    setFormData({
      gender: answers.gender,
      age: answers.age.toString(),
      weight: answers.weight.toString(),
      height: answers.height.toString(),
      bodyTemperature: answers.bodyTemperature.toString(),
      breathingRate: answers.breathingRate.toString(),
      symptoms: {
        chestPain: answers.chestPain,
        shortnessOfBreath: answers.shortnessOfBreath,
        fatigue: answers.fatigue,
        dizziness: answers.dizziness,
        nausea: answers.nausea,
        palpitations: answers.palpitations,
        swelling: answers.swelling,
        coldSweat: answers.coldSweat,
        indigestion: answers.indigestion,
        anxiety: answers.anxiety,
        backPain: answers.backPain,
      }
    });

    Alert.alert('완료', '음성 입력이 완료되었습니다. 결과를 확인해주세요.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 기존 코드... */}

      {/* 음성 입력 버튼 추가 */}
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={() => setIsVoiceModalVisible(true)}
      >
        <Ionicons name="mic" size={24} color="white" />
        <Text style={styles.voiceButtonText}>음성으로 입력</Text>
      </TouchableOpacity>

      {/* 음성 입력 모달 */}
      <VoiceInputModal
        visible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onComplete={handleVoiceComplete}
      />

      {/* 기존 폼... */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... 기존 스타일

  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 5. Backend 통합

### 5.1 데이터 전송 API

```typescript
// src/services/api.ts
export const submitVoiceAssessment = async (answers: QuestionAnswers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checks/voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({
        gender: answers.gender,
        age: answers.age,
        weight: answers.weight,
        height: answers.height,
        bodyTemperature: answers.bodyTemperature,
        breathingRate: answers.breathingRate,
        bmi: calculateBMI(answers.weight, answers.height),
        symptoms: {
          chestPain: answers.chestPain,
          shortnessOfBreath: answers.shortnessOfBreath,
          fatigue: answers.fatigue,
          dizziness: answers.dizziness,
          nausea: answers.nausea,
          palpitations: answers.palpitations,
          swelling: answers.swelling,
          coldSweat: answers.coldSweat,
          indigestion: answers.indigestion,
          anxiety: answers.anxiety,
          backPain: answers.backPain,
        },
        inputMethod: 'VOICE',  // 음성 입력 표시
        voiceSessionDuration: 420,  // 7분 (예상)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};
```

### 5.2 Spring Boot Controller 추가

```java
// backend/src/main/java/ac/cbnu/heartcheck/controller/CheckController.java
@RestController
@RequestMapping("/api/checks")
public class CheckController {

    @Autowired
    private CheckService checkService;

    @PostMapping("/voice")
    public ResponseEntity<CheckResponse> createVoiceCheck(
        @RequestBody @Valid VoiceCheckRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = (User) userDetails;

        Check check = checkService.createCheckFromVoice(user, request);

        return ResponseEntity.ok(CheckResponse.from(check));
    }
}

// DTO
@Data
public class VoiceCheckRequest {
    @NotNull
    private String gender;

    @Min(1) @Max(150)
    private Integer age;

    @DecimalMin("1.0") @DecimalMax("500.0")
    private Double weight;

    @DecimalMin("50.0") @DecimalMax("300.0")
    private Double height;

    @DecimalMin("30.0") @DecimalMax("45.0")
    private Double bodyTemperature;

    @Min(5) @Max(60)
    private Integer breathingRate;

    @NotNull
    private SymptomsData symptoms;

    private String inputMethod = "VOICE";
    private Integer voiceSessionDuration;
}

@Data
public class SymptomsData {
    @Min(0) @Max(4) private Integer chestPain;
    @Min(0) @Max(4) private Integer shortnessOfBreath;
    @Min(0) @Max(4) private Integer fatigue;
    @Min(0) @Max(4) private Integer dizziness;
    @Min(0) @Max(4) private Integer nausea;
    @Min(0) @Max(4) private Integer palpitations;
    @Min(0) @Max(4) private Integer swelling;
    @Min(0) @Max(4) private Integer coldSweat;
    @Min(0) @Max(4) private Integer indigestion;
    @Min(0) @Max(4) private Integer anxiety;
    @Min(0) @Max(4) private Integer backPain;
}
```

---

## 6. 에러 처리 및 재시도 로직

### 6.1 네트워크 에러 처리

```typescript
// src/services/realtimeAPI.ts 추가 부분
export class RealtimeAPIService {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  async connect(): Promise<void> {
    try {
      await this.connectWebSocket();
      this.reconnectAttempts = 0;  // 성공 시 초기화
    } catch (error) {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

        // 지수 백오프
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));

        return this.connect();
      } else {
        throw new Error('Failed to connect after maximum retries');
      }
    }
  }

  private handleServerMessage(message: any) {
    // ... 기존 코드

    if (message.type === 'error') {
      console.error('API error:', message.error);

      // 특정 에러에 대한 처리
      switch (message.error.code) {
        case 'rate_limit_exceeded':
          this.onError?.('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
          break;
        case 'invalid_request_error':
          this.onError?.('잘못된 요청입니다. 다시 시도해주세요.');
          break;
        case 'server_error':
          this.onError?.('서버 오류가 발생했습니다.');
          this.reconnect();
          break;
        default:
          this.onError?.('오류가 발생했습니다: ' + message.error.message);
      }
    }
  }

  private async reconnect() {
    console.log('Attempting to reconnect...');
    this.disconnect();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.connect();
  }

  // 콜백 추가
  onError?: (message: string) => void;
}
```

### 6.2 답변 신뢰도 검증

```typescript
// src/services/realtimeAPI.ts
private handleFunctionCall(message: any) {
  if (message.name === 'record_answer') {
    const args = JSON.parse(message.arguments);

    // 신뢰도가 낮으면 재질문
    if (args.confidence < 0.7) {
      this.sendTextMessage(
        `죄송합니다. 정확히 듣지 못했습니다. 다시 한 번 말씀해주시겠어요? ${questions[this.currentQuestionIndex].text}`
      );
      return;
    }

    // 값 유효성 검사
    if (!this.validateAnswer(args.questionId, args.value)) {
      this.sendTextMessage(
        `입력하신 값이 올바르지 않습니다. ${questions[this.currentQuestionIndex].text}`
      );
      return;
    }

    // 정상 처리
    this.onAnswerRecorded?.(args.questionId, args.value, args.confidence);
    this.moveToNextQuestion();
  }
}

private validateAnswer(questionId: string, value: string): boolean {
  const numValue = parseFloat(value);

  switch (questionId) {
    case 'age':
      return numValue >= 1 && numValue <= 150;
    case 'weight':
      return numValue >= 1 && numValue <= 500;
    case 'height':
      return numValue >= 50 && numValue <= 300;
    case 'bodyTemperature':
      return numValue >= 30 && numValue <= 45;
    case 'breathingRate':
      return numValue >= 5 && numValue <= 60;
    case 'chestPain':
    case 'shortnessOfBreath':
    case 'fatigue':
    case 'dizziness':
    case 'nausea':
    case 'palpitations':
    case 'swelling':
    case 'coldSweat':
    case 'indigestion':
    case 'anxiety':
    case 'backPain':
      return numValue >= 0 && numValue <= 4;
    case 'gender':
      return value.toLowerCase().includes('남') || value.toLowerCase().includes('여');
    default:
      return true;
  }
}
```

---

## 7. 비용 분석 (gpt-realtime-mini)

### 7.1 예상 비용 (GA 버전 기준)
```
모델: gpt-realtime-mini (GA)
가격 (OpenAI 공식 가격 - 2025 기준):
  - Audio Input: $10.00 per 1M tokens
  - Audio Output: $20.00 per 1M tokens
  - Text Input: $0.60 per 1M tokens
  - Text Output: $2.40 per 1M tokens

1회 검사 (7분 기준):
  - Audio Input: ~15,000 tokens = $0.15
  - Audio Output: ~12,000 tokens = $0.24
  - Text (Function Calling): ~5,000 tokens = $0.13
  - 총 비용: ~$0.52 per 검사

월 10,000건 기준:
  - 월 비용: $5,200
  - 연 비용: $62,400

vs gpt-realtime (full model):
  - Full model 가격: $40/1M input, $80/1M output
  - 1회 검사: ~$2.10
  - 월 10,000건: $21,000
  - 연 비용: $252,000
  - 절감액: $189,600 (75% 절감)

참고: GA 버전은 Beta 대비 20% 가격 인하됨
```

### 7.2 최적화 전략
1. **대화 길이 최소화**: 명확한 질문으로 재질문 횟수 감소
2. **효율적인 Instructions**: 간결한 system message (토큰 절약)
3. **오디오 품질 조정**: 24kHz 대신 16kHz 사용 고려
4. **캐싱 활용**: 반복되는 instructions 캐싱
5. **실시간 모니터링**: 비정상적인 토큰 사용 감지

---

## 8. 개발 일정

### Phase 1: 기본 구현 (2주)
- Week 1: WebSocket 연결 및 세션 관리 구현
- Week 2: 음성 녹음 및 스트리밍 구현

### Phase 2: 대화 로직 (2주)
- Week 3: Function Calling 구현 및 17개 질문 시나리오
- Week 4: 답변 검증 및 에러 처리

### Phase 3: UI/UX 및 통합 (1주)
- Week 5: VoiceInputModal 완성 및 HomeScreen 통합

### Phase 4: 테스트 및 최적화 (1주)
- Week 6: 통합 테스트, 비용 최적화, 성능 튜닝

**총 개발 기간: 6주**

---

## 9. 테스트 계획

### 9.1 단위 테스트
```typescript
describe('RealtimeAPIService', () => {
  it('should connect to WebSocket successfully', async () => {
    const service = new RealtimeAPIService();
    await expect(service.connect()).resolves.not.toThrow();
  });

  it('should validate answers correctly', () => {
    const service = new RealtimeAPIService();
    expect(service.validateAnswer('age', '25')).toBe(true);
    expect(service.validateAnswer('age', '200')).toBe(false);
  });

  it('should handle low confidence answers', () => {
    const service = new RealtimeAPIService();
    const mockCallback = jest.fn();
    service.onAnswerRecorded = mockCallback;

    service.handleFunctionCall({
      name: 'record_answer',
      arguments: JSON.stringify({
        questionId: 'age',
        value: '25',
        confidence: 0.5  // 낮은 신뢰도
      })
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
```

### 9.2 통합 테스트
- 실제 OpenAI API와 연결하여 전체 대화 흐름 테스트
- 다양한 발음 및 억양 테스트
- 네트워크 단절 시나리오 테스트
- 동시 다중 사용자 테스트

### 9.3 성능 테스트
- 평균 대화 시간 측정 (목표: 7분 이내)
- 토큰 사용량 모니터링 (목표: 1회당 $0.60 이하)
- 재질문 비율 측정 (목표: 10% 이하)
- 오디오 지연 시간 측정 (목표: 500ms 이하)

---

## 10. 배포 준비

### 10.1 환경 변수 설정
```bash
# .env
OPENAI_API_KEY=sk-proj-xxxxx
REALTIME_API_URL=wss://api.openai.com/v1/realtime
BACKEND_API_URL=https://api.heartcheck.cbnu.ac.kr
```

### 10.2 보안 고려사항
- API Key는 반드시 환경변수로 관리
- Backend proxy를 통한 API 호출 고려 (API Key 노출 방지)
- 음성 데이터 암호화 전송
- 민감한 의료 데이터 처리 규정 준수

### 10.3 모니터링
- 실시간 API 사용량 모니터링
- 오류율 추적
- 평균 대화 시간 및 완료율 추적
- 사용자 피드백 수집

---

## 11. 향후 개선 방안

1. **다국어 지원**: 영어, 중국어 등 추가
2. **오프라인 지원**: 네트워크 없을 때 수동 입력 전환
3. **음성 피드백**: 시각적 피드백 외 음성 안내
4. **개인화**: 사용자별 음성 프로필 저장
5. **고급 분석**: 음성 톤 분석으로 스트레스 수준 파악

---

---

## 12. Beta → GA 마이그레이션 체크리스트

### 코드 변경사항
- ✅ **Beta 헤더 제거**: `OpenAI-Beta: realtime=v1` 삭제
- ✅ **URL 변경**: `?model=gpt-realtime-mini` 사용
- ✅ **Session type 추가**: `session.type = 'realtime'` 필수
- ✅ **Audio 설정 구조 변경**: `audio.input` / `audio.output` 사용
- ✅ **이벤트 이름 변경**:
  - `response.audio.delta` → `response.output_audio.delta`
  - `response.audio_transcript.delta` → `response.output_audio_transcript.delta`
  - `response.text.delta` → `response.output_text.delta`
  - `conversation.item.created` → `conversation.item.added`
- ✅ **새 이벤트 추가**: `conversation.item.done` 처리
- ✅ **Item 객체 변경**: `object=realtime.item` 속성 추가
- ✅ **max_output_tokens**: `max_response_output_tokens` → `max_output_tokens`

### 테스트 항목
- [ ] WebSocket 연결 테스트 (GA 엔드포인트)
- [ ] Session 생성 및 설정 확인
- [ ] 음성 입출력 스트리밍 테스트
- [ ] Function Calling 동작 확인
- [ ] 17개 질문 전체 흐름 테스트
- [ ] 에러 처리 및 재연결 로직 검증
- [ ] 비용 모니터링 설정

---

## 참고 문서

**공식 문서:**
- [OpenAI Realtime API Documentation (GA)](https://platform.openai.com/docs/guides/realtime)
- [Realtime API Reference](https://platform.openai.com/docs/api-reference/realtime_client_events)
- [GPT-Realtime-Mini Model](https://platform.openai.com/docs/models/gpt-realtime-mini)
- [Beta to GA Migration Guide](https://platform.openai.com/docs/guides/realtime#beta-to-ga-migration)

**기술 문서:**
- [React Native Audio Recording](https://docs.expo.dev/versions/latest/sdk/audio/)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)

**가격 정보:**
- [OpenAI Pricing (2025)](https://openai.com/api/pricing/)
