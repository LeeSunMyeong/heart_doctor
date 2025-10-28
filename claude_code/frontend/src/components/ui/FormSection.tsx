import React from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  containerStyle,
  titleStyle,
}) => {
  const sectionStyles: ViewStyle = {
    marginBottom: 24,
  };

  const headerStyles: ViewStyle = {
    marginBottom: 16,
  };

  const titleStyles: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  };

  const descriptionStyles: TextStyle = {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  };

  return (
    <View style={[sectionStyles, containerStyle]}>
      <View style={headerStyles}>
        <Text style={[titleStyles, titleStyle]}>{title}</Text>
        {description && <Text style={descriptionStyles}>{description}</Text>}
      </View>
      {children}
    </View>
  );
};
