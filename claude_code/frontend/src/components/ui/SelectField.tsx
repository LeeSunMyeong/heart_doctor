import React from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';
import {SelectInput, SelectOption} from './SelectInput';

export interface SelectFieldProps {
  label: string;
  value: string | number | null;
  options: SelectOption[];
  onValueChange: (value: string | number) => void;
  description?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onValueChange,
  description,
  placeholder,
  error,
  required = false,
  disabled = false,
  containerStyle,
}) => {
  const containerStyles: ViewStyle = {
    marginBottom: 16,
  };

  const descriptionStyles: TextStyle = {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {description && <Text style={descriptionStyles}>{description}</Text>}
      <SelectInput
        label={label}
        value={value}
        options={options}
        onValueChange={onValueChange}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
      />
    </View>
  );
};
