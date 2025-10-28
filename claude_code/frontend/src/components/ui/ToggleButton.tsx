import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface ToggleButtonProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  labels?: {
    true: string;
    false: string;
  };
  disabled?: boolean;
  style?: ViewStyle;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  onValueChange,
  labels = {true: 'Yes', false: 'No'},
  disabled = false,
  style,
}) => {
  const buttonContainerStyle: ViewStyle = {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  };

  const buttonStyle = (isActive: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: isActive ? '#3B82F6' : '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const textStyle = (isActive: boolean): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: isActive ? '#FFFFFF' : '#64748B',
  });

  return (
    <View style={[buttonContainerStyle, style]}>
      <TouchableOpacity
        style={buttonStyle(value === true)}
        onPress={() => !disabled && onValueChange(true)}
        disabled={disabled}
        activeOpacity={0.7}>
        <Text style={textStyle(value === true)}>{labels.true}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyle(value === false)}
        onPress={() => !disabled && onValueChange(false)}
        disabled={disabled}
        activeOpacity={0.7}>
        <Text style={textStyle(value === false)}>{labels.false}</Text>
      </TouchableOpacity>
    </View>
  );
};
