import React from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';
import {ToggleButton} from './ToggleButton';

export interface YesNoFieldProps {
  label: string;
  value: boolean | null;
  onValueChange: (value: boolean) => void;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  yesLabel?: string;
  noLabel?: string;
}

export const YesNoField: React.FC<YesNoFieldProps> = ({
  label,
  value,
  onValueChange,
  description,
  error,
  required = false,
  disabled = false,
  containerStyle,
  yesLabel = 'Yes',
  noLabel = 'No',
}) => {
  const containerStyles: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyles: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  };

  const descriptionStyles: TextStyle = {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      <Text style={labelStyles}>
        {label}
        {required && <Text style={{color: '#EF4444'}}> *</Text>}
      </Text>
      {description && <Text style={descriptionStyles}>{description}</Text>}
      <ToggleButton
        value={value === true}
        onValueChange={onValueChange}
        labels={{true: yesLabel, false: noLabel}}
        disabled={disabled}
      />
      {error && <Text style={errorStyles}>{error}</Text>}
    </View>
  );
};
