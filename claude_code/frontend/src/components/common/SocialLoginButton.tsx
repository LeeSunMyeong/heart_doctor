import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing } from '../../styles';

interface SocialLoginButtonProps {
  provider: 'google' | 'kakao';
  onPress: () => void;
  style?: ViewStyle;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  style,
}) => {
  const isGoogle = provider === 'google';
  const isKakao = provider === 'kakao';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isGoogle && styles.googleButton,
        isKakao && styles.kakaoButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        {isGoogle && (
          <Text style={styles.icon}>G</Text>
        )}
        {isKakao && (
          <Text style={styles.icon}>K</Text>
        )}
      </View>
      <Text
        style={[
          styles.text,
          isGoogle && styles.googleText,
          isKakao && styles.kakaoText,
        ]}>
        {isGoogle ? 'Google로 계속하기' : 'Kakao로 계속하기'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: spacing.buttonMedium,
    borderRadius: spacing.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  googleButton: {
    backgroundColor: colors.google,
    borderWidth: 1,
    borderColor: colors.border,
  },

  kakaoButton: {
    backgroundColor: colors.kakao,
  },

  iconContainer: {
    width: spacing.iconMd,
    height: spacing.iconMd,
    borderRadius: spacing.radiusFull,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  icon: {
    ...typography.button,
    fontWeight: 'bold',
  },

  text: {
    ...typography.button,
  },

  googleText: {
    color: colors.text,
  },

  kakaoText: {
    color: colors.text,
  },
});
