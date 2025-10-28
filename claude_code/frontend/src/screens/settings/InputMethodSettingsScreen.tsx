import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {colors, typography, spacing} from '../../theme';
import type {InputMethod} from '../../types';

interface InputMethodOption {
  id: InputMethod;
  title: string;
  description: string;
  icon: string;
}

export const InputMethodSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  // Default to manual input method
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('manual');

  const inputMethodOptions: InputMethodOption[] = [
    {
      id: 'manual',
      title: t('settings.inputMethodOptions.manual'),
      description: t('settings.inputMethodOptions.manualDesc'),
      icon: '✏️',
    },
    {
      id: 'voice',
      title: t('settings.inputMethodOptions.voice'),
      description: t('settings.inputMethodOptions.voiceDesc'),
      icon: '🎤',
    },
    {
      id: 'camera',
      title: t('settings.inputMethodOptions.camera'),
      description: t('settings.inputMethodOptions.cameraDesc'),
      icon: '📷',
    },
  ];

  const handleMethodSelect = (method: InputMethod) => {
    setSelectedMethod(method);
    // In a real app, you'd save this to settings store or AsyncStorage
  };

  const renderInputMethodOption = (option: InputMethodOption) => {
    const isSelected = selectedMethod === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.methodOption,
          isSelected && styles.methodOptionSelected,
        ]}
        onPress={() => handleMethodSelect(option.id)}>
        <View style={styles.methodOptionContent}>
          <View style={styles.methodOptionIcon}>
            <Text style={styles.iconText}>{option.icon}</Text>
          </View>
          <View style={styles.methodOptionLeft}>
            <Text style={[
              styles.methodOptionTitle,
              isSelected && styles.methodOptionTitleSelected,
            ]}>
              {option.title}
            </Text>
            <Text style={styles.methodOptionDescription}>
              {option.description}
            </Text>
          </View>
          <View style={styles.methodOptionRight}>
            <View style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
            ]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.inputMethod')}</Text>
          <Text style={styles.subtitle}>{t('settings.inputMethodDesc')}</Text>
        </View>

        {/* Input Method Options */}
        <View style={styles.section}>
          <Card style={styles.optionsCard}>
            {inputMethodOptions.map((option, index) => (
              <View key={option.id}>
                {renderInputMethodOption(option)}
                {index < inputMethodOptions.length - 1 && (
                  <View style={styles.optionDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Feature Status */}
        <View style={styles.featureSection}>
          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                {t('settings.featureStatus')}
              </Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureDot}>•</Text>
                  <Text style={styles.featureText}>
                    {t('settings.inputMethodOptions.manual')}:{' '}
                    <Text style={styles.featureStatusAvailable}>
                      {t('settings.available')}
                    </Text>
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureDot}>•</Text>
                  <Text style={styles.featureText}>
                    {t('settings.inputMethodOptions.voice')}:{' '}
                    <Text style={styles.featureStatusComingSoon}>
                      {t('settings.comingSoon')}
                    </Text>
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureDot}>•</Text>
                  <Text style={styles.featureText}>
                    {t('settings.inputMethodOptions.camera')}:{' '}
                    <Text style={styles.featureStatusComingSoon}>
                      {t('settings.comingSoon')}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>{t('settings.inputMethodInfo')}</Text>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  optionsCard: {
    marginHorizontal: spacing.lg,
  },
  methodOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  methodOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  methodOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 24,
  },
  methodOptionLeft: {
    flex: 1,
  },
  methodOptionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  methodOptionTitleSelected: {
    color: colors.primary[700],
  },
  methodOptionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  methodOptionRight: {
    marginLeft: spacing.md,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  featureSection: {
    marginBottom: spacing.lg,
  },
  featureCard: {
    marginHorizontal: spacing.lg,
  },
  featureContent: {
    padding: spacing.md,
  },
  featureTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  featureList: {
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureDot: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  featureStatusAvailable: {
    color: colors.success[600],
    fontWeight: typography.fontWeight.medium as any,
  },
  featureStatusComingSoon: {
    color: colors.warning[600],
    fontWeight: typography.fontWeight.medium as any,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
