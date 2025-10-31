import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';
import {AppHeader} from '../../components/common/AppHeader';
import type {RootStackParamList} from '../../types';
import {useVoiceTest} from '../../hooks/useVoiceTest';
import assessmentService from '../../api/services/assessmentService';

type VoiceTestModeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VoiceTestMode'
>;

export const VoiceTestModeScreen = () => {
  const navigation = useNavigation<VoiceTestModeScreenNavigationProp>();
  const {
    state,
    currentQuestion,
    currentQuestionIndex,
    assessmentData,
    transcript,
    error,
    progress,
    startTest,
    stopTest,
    skipQuestion,
    retryQuestion,
    confirmAnswer,
    isRecording,
    isSpeaking,
  } = useVoiceTest();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle test completion and submit results
   */
  useEffect(() => {
    if (state === 'completed') {
      handleTestCompletion();
    }
  }, [state]);

  /**
   * Submit assessment data and navigate to results
   */
  const handleTestCompletion = async () => {
    try {
      setIsSubmitting(true);

      // Submit assessment data
      const result = await assessmentService.submitAssessment(assessmentData);

      Alert.alert(
        '검사 완료',
        '음성 검사가 완료되었습니다. 결과를 확인하세요.',
        [
          {
            text: '확인',
            onPress: () => {
              navigation.replace('Result', {
                predictionResult: result,
              });
            },
          },
        ],
      );
    } catch (err: any) {
      console.error('[VoiceTest] Submission error:', err);
      Alert.alert(
        '오류',
        '결과 제출에 실패했습니다. 다시 시도해 주세요.',
        [
          {text: '확인', onPress: () => navigation.goBack()},
        ],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle start test button press
   */
  const handleStartVoiceTest = async () => {
    console.log('[VoiceTestScreen] Start button pressed');
    try {
      console.log('[VoiceTestScreen] Calling startTest()');
      await startTest();
      console.log('[VoiceTestScreen] startTest() completed');
    } catch (err: any) {
      console.error('[VoiceTestScreen] Error:', err);
      Alert.alert('오류', err.message || '음성 검사를 시작할 수 없습니다.');
    }
  };

  /**
   * Handle stop test with confirmation
   */
  const handleStopTest = () => {
    Alert.alert(
      '검사 중단',
      '정말로 검사를 중단하시겠습니까? 저장된 데이터가 없습니다.',
      [
        {text: '취소', style: 'cancel'},
        {text: '중단', style: 'destructive', onPress: stopTest},
      ],
    );
  };

  /**
   * Handle switch to text mode
   */
  const handleSwitchToTextMode = () => {
    if (state !== 'idle' && state !== 'completed') {
      Alert.alert(
        '모드 전환',
        '검사가 진행 중입니다. 중단하고 텍스트 모드로 전환하시겠습니까?',
        [
          {text: '취소', style: 'cancel'},
          {
            text: '전환',
            onPress: () => {
              stopTest();
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  /**
   * Render state-specific UI
   */
  const renderStateUI = () => {
    switch (state) {
      case 'idle':
        return renderIdleState();

      case 'connecting':
        return renderConnectingState();

      case 'ready':
      case 'listening':
      case 'processing':
      case 'speaking':
        return renderActiveState();

      case 'completed':
        return renderCompletedState();

      case 'error':
        return renderErrorState();

      default:
        return renderIdleState();
    }
  };

  /**
   * Render idle state (initial screen)
   */
  const renderIdleState = () => (
    <>
      {/* Voice Section */}
      <View style={styles.voiceSection}>
        <View style={styles.microphoneCircle}>
          <Icon name="mic" size={80} color="#FFFFFF" />
        </View>

        <Text style={styles.voiceTitle}>AI 음성 검사</Text>

        <Text style={styles.voiceDescription}>
          AI와 실시간 대화를 통해 심장관련 건강지표를{'\n'}검사합니다.
        </Text>

        <Text style={styles.voiceSubDescription}>
          총 17개 항목에 대해 자연스럽게 질문드리겠습니{'\n'}다.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="chatbubbles-outline" size={24} color="#10B981" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>자연스러운 대화</Text>
            <Text style={styles.featureDescription}>
              AI가 친근하게 질문하고 답변을 받습니다
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="time-outline" size={24} color="#A78BFA" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>빠른 검사</Text>
            <Text style={styles.featureDescription}>
              약 5-10분 내에 모든 검사가 완료됩니다
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="swap-horizontal-outline" size={24} color="#FBBF24" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>모드 전환 가능</Text>
            <Text style={styles.featureDescription}>
              언제든지 텍스트 입력 모드로 전환 가능합니다
            </Text>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartVoiceTest}>
        <Icon name="mic" size={20} color="#FFFFFF" />
        <Text style={styles.startButtonText}>음성 검사 시작하기</Text>
      </TouchableOpacity>

      {/* Guide */}
      <View style={styles.guideContainer}>
        <View style={styles.guideHeader}>
          <Icon name="information-circle-outline" size={20} color="#F59E0B" />
          <Text style={styles.guideTitle}>음성 검사 안내</Text>
        </View>
        <View style={styles.guideContent}>
          <Text style={styles.guideItem}>• 조용한 환경에서 검사를 진행해주세요</Text>
          <Text style={styles.guideItem}>• 마이크 권한을 허용해주세요</Text>
          <Text style={styles.guideItem}>
            • 명확하게 답변해주시면 더 정확합니다
          </Text>
          <Text style={styles.guideItem}>
            • 언제든지 텍스트 모드로 전환 가능합니다
          </Text>
        </View>
      </View>
    </>
  );

  /**
   * Render connecting state
   */
  const renderConnectingState = () => (
    <View style={styles.statusContainer}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.statusTitle}>연결 중...</Text>
      <Text style={styles.statusDescription}>
        AI 음성 시스템에 연결하고 있습니다
      </Text>
    </View>
  );

  /**
   * Render active test state
   */
  const renderActiveState = () => (
    <>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex} / 17
        </Text>
      </View>

      {/* Current Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>현재 질문</Text>
        <Text style={styles.questionText}>
          {currentQuestion?.text || '질문을 불러오는 중...'}
        </Text>
      </View>

      {/* Microphone Status */}
      <View style={styles.microphoneStatus}>
        <View
          style={[
            styles.microphoneCircle,
            isRecording && styles.microphoneRecording,
            isSpeaking && styles.microphoneSpeaking,
          ]}>
          <Icon
            name={isSpeaking ? 'volume-high' : 'mic'}
            size={60}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.statusLabel}>
          {isSpeaking
            ? 'AI가 말하는 중...'
            : state === 'listening'
            ? '답변을 기다리는 중...'
            : state === 'processing'
            ? '답변을 처리하는 중...'
            : '준비 중...'}
        </Text>
      </View>

      {/* Transcript */}
      {transcript && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>인식된 답변</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={retryQuestion}
          disabled={isSpeaking}>
          <Icon name="refresh" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>다시 듣기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={skipQuestion}
          disabled={isSpeaking}>
          <Icon name="play-forward" size={20} color="#6B7280" />
          <Text style={styles.secondaryButtonText}>건너뛰기</Text>
        </TouchableOpacity>

        {transcript && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={confirmAnswer}
            disabled={isSpeaking}>
            <Icon name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>확인</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stop Button */}
      <TouchableOpacity
        style={styles.stopButton}
        onPress={handleStopTest}>
        <Icon name="stop-circle-outline" size={20} color="#EF4444" />
        <Text style={styles.stopButtonText}>검사 중단</Text>
      </TouchableOpacity>
    </>
  );

  /**
   * Render completed state
   */
  const renderCompletedState = () => (
    <View style={styles.statusContainer}>
      {isSubmitting ? (
        <>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.statusTitle}>결과 제출 중...</Text>
          <Text style={styles.statusDescription}>
            잠시만 기다려 주세요
          </Text>
        </>
      ) : (
        <>
          <View style={styles.successIcon}>
            <Icon name="checkmark-circle" size={80} color="#10B981" />
          </View>
          <Text style={styles.statusTitle}>검사 완료!</Text>
          <Text style={styles.statusDescription}>
            모든 질문에 답변해 주셔서 감사합니다
          </Text>
        </>
      )}
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.statusContainer}>
      <View style={styles.errorIcon}>
        <Icon name="alert-circle" size={80} color="#EF4444" />
      </View>
      <Text style={styles.statusTitle}>오류 발생</Text>
      <Text style={styles.statusDescription}>
        {error || '음성 검사 중 문제가 발생했습니다'}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleStartVoiceTest}>
        <Icon name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.wrapper}>
          {/* Switch Mode Button - Always visible */}
          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={handleSwitchToTextMode}>
            <Icon name="document-text-outline" size={20} color="#3B82F6" />
            <Text style={styles.switchModeText}>텍스트 검사 모드로 전환</Text>
          </TouchableOpacity>

          {/* State-specific UI */}
          {renderStateUI()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  wrapper: {
    gap: 16,
  },
  switchModeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  switchModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  voiceSection: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  microphoneCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  voiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  voiceDescription: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  voiceSubDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guideContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
  },
  guideContent: {
    gap: 8,
  },
  guideItem: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  // Status container styles
  statusContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  successIcon: {
    marginBottom: 8,
  },
  errorIcon: {
    marginBottom: 8,
  },
  // Progress styles
  progressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  // Question styles
  questionContainer: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  // Microphone status styles
  microphoneStatus: {
    alignItems: 'center',
    gap: 16,
    marginVertical: 20,
  },
  microphoneRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  microphoneSpeaking: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  // Transcript styles
  transcriptContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  transcriptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  transcriptText: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
  },
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  // Stop button
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  // Retry and back buttons
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
