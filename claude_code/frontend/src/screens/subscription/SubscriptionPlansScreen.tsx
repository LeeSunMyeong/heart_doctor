import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles';

export const SubscriptionPlansScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>요금제</Text>
      <Text style={styles.subtitle}>요금제 선택 기능은 준비 중입니다.</Text>
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

export default SubscriptionPlansScreen;
