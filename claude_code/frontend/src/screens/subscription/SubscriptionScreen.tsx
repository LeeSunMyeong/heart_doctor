import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles';

export const SubscriptionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>구독</Text>
      <Text style={styles.subtitle}>구독 관리 기능은 준비 중입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
