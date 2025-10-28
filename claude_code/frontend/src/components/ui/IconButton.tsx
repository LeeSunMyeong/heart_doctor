import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: isDisabled ? '#CBD5E0' : '#3B82F6',
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: isDisabled ? '#E2E8F0' : '#64748B',
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          width: 32,
          height: 32,
        };
      case 'md':
        return {
          width: 40,
          height: 40,
        };
      case 'lg':
        return {
          width: 48,
          height: 48,
        };
      default:
        return {
          width: 40,
          height: 40,
        };
    }
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={[getVariantStyles(), getSizeStyles(), style]}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? '#3B82F6' : '#FFFFFF'}
        />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
