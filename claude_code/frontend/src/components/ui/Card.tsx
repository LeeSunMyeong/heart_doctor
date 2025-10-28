import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#FFFFFF',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        };
      case 'default':
      default:
        return {
          ...baseStyles,
          backgroundColor: '#F9FAFB',
        };
    }
  };

  return (
    <View {...props} style={[getVariantStyles(), style]}>
      {children}
    </View>
  );
};
