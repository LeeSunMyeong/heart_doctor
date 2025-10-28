import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
    borderWidth: 1,
    borderColor: error ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  };

  const inputTextStyles: TextStyle = {
    fontSize: 16,
    color: '#1F2937',
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && (
        <Text style={[labelStyles, labelStyle]}>
          {label}
          {required && <Text style={{color: '#EF4444'}}> *</Text>}
        </Text>
      )}
      <View style={inputContainerStyles}>
        <RNTextInput
          {...props}
          style={[inputTextStyles, inputStyle]}
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
      </View>
      {error && <Text style={[errorStyles, errorStyle]}>{error}</Text>}
    </View>
  );
};
