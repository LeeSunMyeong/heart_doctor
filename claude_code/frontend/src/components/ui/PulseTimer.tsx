import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {Modal} from './Modal';
import Icon from 'react-native-vector-icons/Ionicons';

export interface PulseTimerProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (count: number) => void;
  duration?: number;
}

export const PulseTimer: React.FC<PulseTimerProps> = ({
  visible,
  onClose,
  onComplete,
  duration = 60,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      resetTimer();
    }
  }, [visible]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setPulseCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const incrementPulse = () => {
    if (isRunning) {
      setPulseCount(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    onComplete(pulseCount);
    onClose();
  };

  const contentStyles: ViewStyle = {
    alignItems: 'center',
    paddingVertical: 24,
  };

  const timerStyles: TextStyle = {
    fontSize: 48,
    fontWeight: '700',
    color: isRunning ? '#3B82F6' : '#6B7280',
    marginBottom: 24,
  };

  const instructionsStyles: TextStyle = {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  };

  const pulseButtonStyles: ViewStyle = {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isRunning ? '#3B82F6' : '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  };

  const pulseCountStyles: TextStyle = {
    fontSize: 36,
    fontWeight: '700',
    color: isRunning ? '#FFFFFF' : '#9CA3AF',
  };

  const buttonRowStyles: ViewStyle = {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  };

  const controlButtonStyles: ViewStyle = {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const primaryButtonStyles: ViewStyle = {
    ...controlButtonStyles,
    backgroundColor: '#3B82F6',
  };

  const secondaryButtonStyles: ViewStyle = {
    ...controlButtonStyles,
    backgroundColor: '#6B7280',
  };

  const successButtonStyles: ViewStyle = {
    ...controlButtonStyles,
    backgroundColor: '#22C55E',
  };

  const buttonTextStyles: TextStyle = {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  };

  return (
    <Modal visible={visible} onClose={onClose} title="맥박 측정">
      <View style={contentStyles}>
        <Text style={timerStyles}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>

        <Text style={instructionsStyles}>
          {!isRunning
            ? '시작 버튼을 누르고 1분 동안 맥박을 측정하세요.\n맥박을 느낄 때마다 화면을 탭하세요.'
            : '맥박을 느낄 때마다 아래 버튼을 탭하세요.'}
        </Text>

        <TouchableOpacity
          style={pulseButtonStyles}
          onPress={incrementPulse}
          disabled={!isRunning}
          activeOpacity={0.7}>
          <Text style={pulseCountStyles}>{pulseCount}</Text>
        </TouchableOpacity>

        <View style={buttonRowStyles}>
          {!isRunning ? (
            <>
              <TouchableOpacity
                style={primaryButtonStyles}
                onPress={startTimer}
                activeOpacity={0.7}>
                <Text style={buttonTextStyles}>시작</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={secondaryButtonStyles}
                onPress={onClose}
                activeOpacity={0.7}>
                <Text style={buttonTextStyles}>취소</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={secondaryButtonStyles}
                onPress={resetTimer}
                activeOpacity={0.7}>
                <Text style={buttonTextStyles}>초기화</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={successButtonStyles}
                onPress={handleComplete}
                activeOpacity={0.7}>
                <Text style={buttonTextStyles}>완료</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
