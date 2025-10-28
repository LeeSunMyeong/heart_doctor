import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Toast} from '../../components/ui/Toast';
import {colors, typography, spacing} from '../../theme';
import {useSettingsStore} from '../../store/settingsStore';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const LanguageSettingsScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {settings, setLanguage} = useSettingsStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const languageOptions: LanguageOption[] = [
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
    },
  ];

  const currentLanguage = settings?.language || i18n.language;

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Update settings store
      setLanguage(languageCode);

      // Show success toast
      setToastMessage(t('settings.languageChanged'));
      setShowToast(true);
    } catch (error) {
      console.error('Failed to change language:', error);
      setToastMessage(t('errors.unknownError'));
      setShowToast(true);
    }
  };

  const renderLanguageOption = (option: LanguageOption) => {
    const isSelected = currentLanguage === option.code;

    return (
      <TouchableOpacity
        key={option.code}
        style={[
          styles.languageOption,
          isSelected && styles.languageOptionSelected,
        ]}
        onPress={() => handleLanguageSelect(option.code)}>
        <View style={styles.languageOptionContent}>
          <View style={styles.languageOptionLeft}>
            <Text style={[
              styles.languageOptionTitle,
              isSelected && styles.languageOptionTitleSelected,
            ]}>
              {option.nativeName}
            </Text>
            <Text style={styles.languageOptionSubtitle}>
              {option.name}
            </Text>
          </View>
          <View style={styles.languageOptionRight}>
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
          <Text style={styles.title}>{t('settings.language')}</Text>
          <Text style={styles.subtitle}>{t('settings.languageDesc')}</Text>
        </View>

        {/* Language Options */}
        <View style={styles.section}>
          <Card style={styles.optionsCard}>
            {languageOptions.map((option, index) => (
              <View key={option.code}>
                {renderLanguageOption(option)}
                {index < languageOptions.length - 1 && (
                  <View style={styles.optionDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>{t('settings.languageInfo')}</Text>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
        duration={2000}
      />
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
  languageOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageOptionLeft: {
    flex: 1,
  },
  languageOptionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  languageOptionTitleSelected: {
    color: colors.primary[700],
  },
  languageOptionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  languageOptionRight: {
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
