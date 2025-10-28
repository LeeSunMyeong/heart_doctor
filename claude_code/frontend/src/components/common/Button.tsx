import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '../../styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' ? colors.background : colors.primary
          }
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // Sizes
  size_small: {
    height: spacing.buttonSmall,
    paddingHorizontal: spacing.lg,
  },
  size_medium: {
    height: spacing.buttonMedium,
    paddingHorizontal: spacing.xl,
  },
  size_large: {
    height: spacing.buttonLarge,
    paddingHorizontal: spacing.xl,
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: colors.buttonActive,
  },
  variant_outline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_text: {
    backgroundColor: 'transparent',
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },

  // Text base
  text: {
    textAlign: 'center',
  },

  // Text sizes
  text_small: {
    ...typography.buttonSmall,
  },
  text_medium: {
    ...typography.button,
  },
  text_large: {
    ...typography.buttonLarge,
  },

  // Text variants
  text_primary: {
    color: colors.background,
  },
  text_secondary: {
    color: colors.background,
  },
  text_outline: {
    color: colors.text,
  },
  text_text: {
    color: colors.primary,
  },

  textDisabled: {
    color: colors.textDisabled,
  },
});
