import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  style,
  textStyle,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
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
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDisabled ? '#CBD5E0' : '#3B82F6',
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
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
      case 'md':
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantTextColor: TextStyle = {
      color:
        variant === 'outline' || variant === 'ghost'
          ? isDisabled
            ? '#CBD5E0'
            : '#3B82F6'
          : '#FFFFFF',
    };

    const sizeTextStyles: TextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
    };

    return {
      ...baseTextStyles,
      ...variantTextColor,
      ...sizeTextStyles,
    };
  };

  const fullWidthStyle: ViewStyle = fullWidth ? {width: '100%'} : {};

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={[getVariantStyles(), getSizeStyles(), fullWidthStyle, style]}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#FFFFFF'
          }
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};
