/**
 * useVoiceTest Hook
 * Manages voice test state, flow, and OpenAI Realtime API integration
 */

import {useState, useEffect, useCallback, useRef} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import voiceTestService from '../services/voiceTestService';
import audioRecorder from '../utils/audioRecorder';
import {
  voiceTestQuestions,
  parseVoiceNumber,
  parseYesNo,
  parseSex,
  validateResponse,
  getEmptyAssessmentData,
  AssessmentData,
  VoiceQuestion,
} from '../constants/voiceTestQuestions';

export type VoiceTestState =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'completed'
  | 'error';

interface UseVoiceTestReturn {
  // State
  state: VoiceTestState;
  currentQuestion: VoiceQuestion | null;
  currentQuestionIndex: number;
  assessmentData: AssessmentData;
  transcript: string;
  error: string | null;
  progress: number; // 0-100

  // Actions
  startTest: () => Promise<void>;
  stopTest: () => void;
  skipQuestion: () => void;
  retryQuestion: () => void;
  confirmAnswer: () => void;

  // Audio state
  isRecording: boolean;
  isSpeaking: boolean;
}

export const useVoiceTest = (): UseVoiceTestReturn => {
  // State
  const [state, setState] = useState<VoiceTestState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(
    getEmptyAssessmentData(),
  );
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Refs
  const lastUserTranscript = useRef<string>('');
  const questionStartTime = useRef<number>(0);

  // Computed values
  const currentQuestion =
    currentQuestionIndex < voiceTestQuestions.length
      ? voiceTestQuestions[currentQuestionIndex]
      : null;

  const progress =
    voiceTestQuestions.length > 0
      ? (currentQuestionIndex / voiceTestQuestions.length) * 100
      : 0;

  /**
   * Request microphone permissions (Android)
   */
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        console.log('[VoiceTest] Checking Android permissions');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '마이크 권한 요청',
            message: '음성 검사를 위해 마이크 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        console.log('[VoiceTest] Permission granted:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('[VoiceTest] Permission result:', isGranted);
        return isGranted;
      } catch (err) {
        console.error('[VoiceTest] Permission error:', err);
        return false;
      }
    }
    console.log('[VoiceTest] iOS - permissions handled automatically');
    return true; // iOS handles permissions automatically
  };

  /**
   * Setup voice service callbacks
   */
  useEffect(() => {
    voiceTestService.onMessage(handleServerMessage);
    voiceTestService.onError(handleError);
    voiceTestService.onConnectionChange(handleConnectionChange);

    return () => {
      // Cleanup on unmount
      audioRecorder.cleanup();
      voiceTestService.disconnect();
    };
  }, []);

  /**
   * Handle server messages
   */
  const handleServerMessage = useCallback(
    (message: any) => {
      switch (message.type) {
        case 'user_transcript':
          // User's speech transcribed
          lastUserTranscript.current = message.transcript;
          setTranscript(message.transcript);
          setState('processing');
          break;

        case 'ai_transcript':
          // AI's response transcribed
          console.log('[VoiceTest] AI said:', message.transcript);
          setState('speaking');
          setIsSpeaking(true);
          break;

        case 'response_complete':
          // AI finished speaking
          setState('listening');
          setIsSpeaking(false);
          break;

        case 'audio_chunk':
          // Handle audio playback if needed
          break;

        default:
          console.log('[VoiceTest] Unhandled message:', message.type);
      }
    },
    [],
  );

  /**
   * Handle connection errors
   */
  const handleError = useCallback((err: Error) => {
    console.error('[VoiceTest] Error:', err);
    setError(err.message);
    setState('error');
  }, []);

  /**
   * Handle connection state changes
   */
  const handleConnectionChange = useCallback((connected: boolean) => {
    if (connected) {
      setState('ready');
    } else if (state !== 'idle' && state !== 'completed') {
      setState('error');
      setError('연결이 끊어졌습니다.');
    }
  }, []);

  /**
   * Start voice test
   */
  const startTest = async (): Promise<void> => {
    try {
      console.log('[VoiceTest] startTest called');
      setError(null);
      setState('connecting');
      console.log('[VoiceTest] State set to connecting');

      // Request permissions
      console.log('[VoiceTest] Requesting microphone permission');
      const hasPermission = await requestMicrophonePermission();
      console.log('[VoiceTest] Permission result:', hasPermission);
      if (!hasPermission) {
        throw new Error('마이크 권한이 거부되었습니다.');
      }

      // Connect to OpenAI Realtime API
      console.log('[VoiceTest] Calling voiceTestService.connect()');
      await voiceTestService.connect();
      console.log('[VoiceTest] Connected successfully');

      // Start audio recording and send to OpenAI
      console.log('[VoiceTest] Starting audio recording');
      await audioRecorder.startRecording((audioData: string) => {
        // Send audio data to OpenAI in real-time
        voiceTestService.sendAudio(audioData);
      });
      console.log('[VoiceTest] Audio recording started');

      // Reset state
      setCurrentQuestionIndex(0);
      setAssessmentData(getEmptyAssessmentData());
      setTranscript('');
      questionStartTime.current = Date.now();

      // Service will send first question automatically through system instructions
      setState('listening');
      setIsRecording(true);
    } catch (err: any) {
      console.error('[VoiceTest] Start error:', err);
      setError(err.message || '테스트 시작에 실패했습니다.');
      setState('error');
    }
  };

  /**
   * Stop voice test
   */
  const stopTest = useCallback((): void => {
    // Stop audio recording
    audioRecorder.stopRecording().catch(err => {
      console.error('[VoiceTest] Error stopping recording:', err);
    });

    // Disconnect from service
    voiceTestService.disconnect();
    setIsRecording(false);
    setIsSpeaking(false);
    setState('idle');

    Alert.alert(
      '검사 중단',
      '음성 검사가 중단되었습니다. 저장된 데이터가 없습니다.',
    );
  }, []);

  /**
   * Parse and validate user response
   */
  const processUserResponse = useCallback(
    (response: string, question: VoiceQuestion): number | null => {
      if (!question.field) {
        return null; // Preparation or completion question
      }

      let value: number | null = null;

      switch (question.expectedResponseType) {
        case 'yes-no':
          value = parseYesNo(response);
          break;

        case 'number':
          value = parseVoiceNumber(response);
          break;

        case 'text':
          if (question.field === 'sex') {
            value = parseSex(response);
          }
          break;
      }

      return value;
    },
    [],
  );

  /**
   * Confirm and save current answer
   */
  const confirmAnswer = useCallback((): void => {
    if (!currentQuestion || !currentQuestion.field) {
      // Skip non-data questions (preparation, completion)
      moveToNextQuestion();
      return;
    }

    const value = processUserResponse(
      lastUserTranscript.current,
      currentQuestion,
    );

    if (value === null) {
      // Invalid response - ask AI to retry
      voiceTestService.sendTextMessage(
        '답변을 이해하지 못했습니다. 다시 한번 말씀해 주세요.',
      );
      setState('speaking');
      return;
    }

    // Validate response
    const validation = validateResponse(currentQuestion, value);
    if (!validation.valid) {
      voiceTestService.sendTextMessage(
        validation.error || '잘못된 답변입니다. 다시 말씀해 주세요.',
      );
      setState('speaking');
      return;
    }

    // Save answer
    setAssessmentData(prev => ({
      ...prev,
      [currentQuestion.field!]: value,
    }));

    console.log(
      `[VoiceTest] Saved ${currentQuestion.field} = ${value}`,
    );

    // Move to next question
    moveToNextQuestion();
  }, [currentQuestion, lastUserTranscript]);

  /**
   * Move to next question
   */
  const moveToNextQuestion = useCallback((): void => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= voiceTestQuestions.length) {
      // Test completed
      setState('completed');
      setIsRecording(false);
      voiceTestService.disconnect();
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setTranscript('');
    lastUserTranscript.current = '';
    questionStartTime.current = Date.now();

    // Send next question to AI
    const nextQuestion = voiceTestQuestions[nextIndex];
    voiceTestService.sendTextMessage(
      `다음 질문을 해주세요: ${nextQuestion.text}`,
    );
    setState('speaking');
  }, [currentQuestionIndex]);

  /**
   * Skip current question
   */
  const skipQuestion = useCallback((): void => {
    Alert.alert(
      '질문 건너뛰기',
      '이 질문을 건너뛰시겠습니까? 정확한 분석을 위해 모든 질문에 답변하는 것이 좋습니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '건너뛰기',
          style: 'destructive',
          onPress: moveToNextQuestion,
        },
      ],
    );
  }, [moveToNextQuestion]);

  /**
   * Retry current question
   */
  const retryQuestion = useCallback((): void => {
    if (!currentQuestion) {
      return;
    }

    setTranscript('');
    lastUserTranscript.current = '';

    voiceTestService.sendTextMessage(
      `다시 질문해주세요: ${currentQuestion.text}`,
    );
    setState('speaking');
  }, [currentQuestion]);

  return {
    // State
    state,
    currentQuestion,
    currentQuestionIndex,
    assessmentData,
    transcript,
    error,
    progress,

    // Actions
    startTest,
    stopTest,
    skipQuestion,
    retryQuestion,
    confirmAnswer,

    // Audio state
    isRecording,
    isSpeaking,
  };
};
