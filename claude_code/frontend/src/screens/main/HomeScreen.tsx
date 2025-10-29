import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';
import {AppHeader} from '../../components/common/AppHeader';
import {submitCheck} from '../../services/checkService';

interface AssessmentData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  bodyTemperature: string;
  breathing: string;
  pulse: string;
  chestPain: string;
  flankPain: string;
  footPain: string;
  edemaLegs: string;
  dyspnea: string;
  syncope: string;
  weakness: string;
  vomiting: string;
  palpitation: string;
  dizziness: string;
}

const initialData: AssessmentData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  bodyTemperature: '',
  breathing: '',
  pulse: '',
  chestPain: '',
  flankPain: '',
  footPain: '',
  edemaLegs: '',
  dyspnea: '',
  syncope: '',
  weakness: '',
  vomiting: '',
  palpitation: '',
  dizziness: '',
};

export const HomeScreen = ({navigation}: any) => {
  const [data, setData] = useState<AssessmentData>(initialData);
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pulseTimer, setPulseTimer] = useState({
    isRunning: false,
    seconds: 60,
    count: 0,
  });

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const calculateBMI = () => {
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const weightKg = parseFloat(data.weight);
      if (heightM > 0) {
        return (weightKg / (heightM * heightM)).toFixed(1);
      }
    }
    return '';
  };

  const isFormValid = () => {
    return Object.values(data).every(value => value.trim() !== '');
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[HomeScreen] 검사 제출 시작:', data);

      // API 호출
      const response = await submitCheck(data);

      console.log('[HomeScreen] 검사 제출 성공:', response);

      // 성공 시 결과 화면으로 이동
      navigation.navigate('Result', {
        checkData: response,
        assessmentData: data,
      });
    } catch (error: any) {
      console.error('[HomeScreen] 검사 제출 실패:', error);

      // 에러 메시지 표시
      Alert.alert(
        '오류',
        error?.message || '건강 검사 제출에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePulseTimer = () => {
    if (pulseTimer.isRunning) {
      setPulseTimer(prev => ({...prev, isRunning: false}));
    } else {
      setPulseTimer({isRunning: true, seconds: 60, count: 0});

      const interval = setInterval(() => {
        setPulseTimer(prev => {
          if (prev.seconds <= 1) {
            clearInterval(interval);
            handleInputChange('pulse', prev.count.toString());
            setShowPulseModal(false);
            return {isRunning: false, seconds: 60, count: prev.count};
          }
          return {...prev, seconds: prev.seconds - 1};
        });
      }, 1000);
    }
  };

  const incrementPulseCount = () => {
    if (pulseTimer.isRunning) {
      setPulseTimer(prev => ({...prev, count: prev.count + 1}));
    }
  };

  const resetPulseTimer = () => {
    setPulseTimer({isRunning: false, seconds: 60, count: 0});
    handleInputChange('pulse', '');
  };

  const renderSelectField = (
    label: string,
    field: keyof AssessmentData,
    options: {value: string; label: string}[],
  ) => (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.selectButtons}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleInputChange(field, option.value)}
            style={[
              styles.selectButton,
              data[field] === option.value && styles.selectButtonActive,
            ]}>
            <Text
              style={[
                styles.selectButtonText,
                data[field] === option.value && styles.selectButtonTextActive,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderYesNoField = (label: string, field: keyof AssessmentData) => (
    <View style={styles.fieldRow}>
      <Text style={styles.yesNoLabel} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.selectButtons}>
        {[
          {value: 'yes', label: '예'},
          {value: 'no', label: '아니오'},
        ].map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleInputChange(field, option.value)}
            style={[
              styles.selectButton,
              data[field] === option.value && styles.selectButtonActive,
            ]}>
            <Text
              style={[
                styles.selectButtonText,
                data[field] === option.value && styles.selectButtonTextActive,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 공통 헤더 컴포넌트 */}
      <AppHeader />

      {/* 메인 콘텐츠 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.formWrapper}>
          {/* 기본 정보 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기본 정보</Text>

            {renderSelectField('성별', 'gender', [
              {value: 'male', label: '남'},
              {value: 'female', label: '여'},
            ])}

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>나이</Text>
              <RNTextInput
                style={styles.input}
                value={data.age}
                onChangeText={value => handleInputChange('age', value)}
                placeholder="나이"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>키</Text>
              <View style={styles.inputWithUnit}>
                <RNTextInput
                  style={styles.input}
                  value={data.height}
                  onChangeText={value => handleInputChange('height', value)}
                  placeholder="cm"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>몸무게</Text>
              <View style={styles.inputWithUnit}>
                <RNTextInput
                  style={styles.input}
                  value={data.weight}
                  onChangeText={value => handleInputChange('weight', value)}
                  placeholder="kg"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>

            {data.height && data.weight && (
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiLabel}>BMI</Text>
                <Text style={styles.bmiValue}>{calculateBMI()}</Text>
              </View>
            )}
          </View>

          {/* 생체 정보 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>생체 정보</Text>

            {renderSelectField('체온', 'bodyTemperature', [
              {value: 'low', label: '낮음'},
              {value: 'normal', label: '보통'},
              {value: 'high', label: '높음'},
            ])}

            {renderSelectField('호흡상태', 'breathing', [
              {value: 'slow', label: '느림'},
              {value: 'normal', label: '보통'},
              {value: 'fast', label: '빠름'},
            ])}

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>맥박</Text>
              <View style={styles.pulseInputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={data.pulse}
                  onChangeText={value => handleInputChange('pulse', value)}
                  placeholder="분당 맥박수"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.timerButton}
                  onPress={() => setShowPulseModal(true)}>
                  <Icon name="timer-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.unit}>분당</Text>
              </View>
            </View>
          </View>

          {/* 증상 체크 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>증상 체크</Text>
            {renderYesNoField('가슴 통증', 'chestPain')}
            {renderYesNoField('옆구리 통증', 'flankPain')}
            {renderYesNoField('발 통증', 'footPain')}
            {renderYesNoField('발 부종', 'edemaLegs')}
            {renderYesNoField('호흡곤란', 'dyspnea')}
            {renderYesNoField('어중음탈락(실신)', 'syncope')}
            {renderYesNoField('피로감', 'weakness')}
            {renderYesNoField('구토', 'vomiting')}
            {renderYesNoField('심장 두근거림', 'palpitation')}
            {renderYesNoField('어지러움', 'dizziness')}
          </View>

          {/* 검사 완료 버튼 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            style={[
              styles.submitButton,
              (!isFormValid() || isSubmitting) && styles.submitButtonDisabled,
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>분석하다</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 맥박 측정 모달 */}
      <Modal
        visible={showPulseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPulseModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>맥박 측정</Text>
              <TouchableOpacity onPress={() => setShowPulseModal(false)}>
                <Icon name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.timerDisplay}>
                <Text style={styles.timerSeconds}>{pulseTimer.seconds}초</Text>
                <Text style={styles.timerLabel}>남은 시간</Text>
              </View>
              <View style={styles.timerDisplay}>
                <Text style={styles.timerCount}>{pulseTimer.count}회</Text>
                <Text style={styles.timerLabel}>맥박 수</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={togglePulseTimer}
                style={[
                  styles.modalButton,
                  pulseTimer.isRunning ? styles.stopButton : styles.startButton,
                ]}>
                <Text style={styles.modalButtonText}>
                  {pulseTimer.isRunning ? '정지' : '1분 타이머 시작'}
                </Text>
              </TouchableOpacity>

              {pulseTimer.isRunning && (
                <TouchableOpacity
                  onPress={incrementPulseCount}
                  style={[styles.modalButton, styles.countButton]}>
                  <Text style={styles.modalButtonText}>맥박 카운트 +1</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={resetPulseTimer}
                style={[styles.modalButton, styles.resetButton]}>
                <Text style={[styles.modalButtonText, styles.resetButtonText]}>
                  리셋
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  formWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 48,
    flexShrink: 0,
  },
  yesNoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    width: 80,
    flexShrink: 0,
  },
  selectButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
  },
  selectButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectButtonTextActive: {
    color: '#FFFFFF',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    fontSize: 12,
    color: '#000000',
  },
  unit: {
    fontSize: 12,
    color: '#6B7280',
  },
  pulseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  timerButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bmiContainer: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 12,
    color: '#1E40AF',
  },
  bmiValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  submitButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalBody: {
    marginBottom: 24,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerSeconds: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalActions: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3B82F6',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  countButton: {
    backgroundColor: '#10B981',
  },
  resetButton: {
    backgroundColor: '#D1D5DB',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButtonText: {
    color: '#374151',
  },
});
