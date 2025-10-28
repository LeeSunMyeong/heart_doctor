import React, {useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onHide?: () => void;
  showIcon?: boolean;
  closeable?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  position = 'top',
  duration = 3000,
  onHide,
  showIcon = true,
  closeable = true,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Auto hide after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: position === 'top' ? -100 : 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onHide?.();
    });
  };

  const getToastColor = (): string => {
    switch (type) {
      case 'success':
        return '#22C55E';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
      default:
        return '#3B82F6';
    }
  };

  const getIconName = (): string => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  if (!visible) return null;

  const containerStyles: ViewStyle = {
    position: 'absolute',
    left: 16,
    right: 16,
    [position]: 50,
    zIndex: 9999,
  };

  const toastStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: getToastColor(),
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  };

  const iconContainerStyles: ViewStyle = {
    marginRight: 12,
  };

  const messageStyles: TextStyle = {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  };

  return (
    <Animated.View
      style={[
        containerStyles,
        {
          transform: [{translateY}],
        },
      ]}>
      <View style={toastStyles}>
        {showIcon && (
          <View style={iconContainerStyles}>
            <Icon name={getIconName()} size={24} color={getToastColor()} />
          </View>
        )}
        <Text style={messageStyles}>{message}</Text>
        {closeable && (
          <TouchableOpacity onPress={hideToast} activeOpacity={0.7}>
            <Icon name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
