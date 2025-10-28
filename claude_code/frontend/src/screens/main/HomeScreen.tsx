import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';

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

  const handleSubmit = () => {
    if (isFormValid()) {
      const bmi = calculateBMI();
      console.log('검사 완료:', {...data, bmi});
      navigation.navigate('Result', {assessmentData: {...data, bmi}});
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
      <Text style={styles.yesNoLabel}>{label}</Text>
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
      {/* 상단 아이콘 메뉴 */}
      <View style={styles.header}>
        <View style={styles.iconMenu}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Pricing')}>
            <Icon name="card-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications-outline" size={24} color={colors.textSecondary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('History')}>
            <Icon name="time-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Login')}>
            <Icon name="log-in-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>심장 건강지표 분석 도구</Text>
      </View>

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
            {renderYesNoField('어지러움(실신)', 'syncope')}
            {renderYesNoField('피로감', 'weakness')}
            {renderYesNoField('구토', 'vomiting')}
            {renderYesNoField('심장 두근거림', 'palpitation')}
            {renderYesNoField('어지러움', 'dizziness')}
          </View>

          {/* 검사 완료 버튼 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid()}
            style={[
              styles.submitButton,
              !isFormValid() && styles.submitButtonDisabled,
            ]}>
            <Text style={styles.submitButtonText}>분석하다</Text>
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
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: 48,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  iconMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: 24,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconButtonActive: {
    backgroundColor: colors.text,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'serif',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 64,
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
