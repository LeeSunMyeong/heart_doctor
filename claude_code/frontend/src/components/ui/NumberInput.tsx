import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';

export interface NumberInputProps
  extends Omit<RNTextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  value: number | null;
  onValueChange: (value: number | null) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  unit?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  error,
  required = false,
  min,
  max,
  value,
  onValueChange,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  unit,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(
    value !== null ? String(value) : '',
  );

  const handleChangeText = (text: string) => {
    setLocalValue(text);

    if (text === '' || text === '-') {
      onValueChange(null);
      return;
    }

    const numValue = parseFloat(text);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        return;
      }
      if (max !== undefined && numValue > max) {
        return;
      }
      onValueChange(numValue);
    }
  };

  const containerStyles: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyles: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  };

  const inputTextStyles: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  };

  const unitStyles: TextStyle = {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  const hintText = min !== undefined && max !== undefined
    ? ` (${min}-${max})`
    : min !== undefined
    ? ` (min: ${min})`
    : max !== undefined
    ? ` (max: ${max})`
    : '';

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && (
        <Text style={[labelStyles, labelStyle]}>
          {label}
          {required && <Text style={{color: '#EF4444'}}> *</Text>}
          {hintText && <Text style={{color: '#9CA3AF', fontWeight: '400'}}>{hintText}</Text>}
        </Text>
      )}
      <View style={inputContainerStyles}>
        <RNTextInput
          {...props}
          style={[inputTextStyles, inputStyle]}
          value={localValue}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
          onFocus={e => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        {unit && <Text style={unitStyles}>{unit}</Text>}
      </View>
      {error && <Text style={[errorStyles, errorStyle]}>{error}</Text>}
    </View>
  );
};
