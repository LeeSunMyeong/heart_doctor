import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {colors, typography, spacing} from '../../theme';
import {useSettingsStore} from '../../store/settingsStore';
import type {ThemeMode} from '../../types';

export const ThemeSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {settings, toggleDarkMode} = useSettingsStore();

  // For this implementation, we'll use a simple dark mode toggle
  // In a real app, you'd implement a full theme system with 'light' | 'dark' | 'system'
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(
    settings?.darkMode ? 'dark' : 'light',
  );

  const themeOptions: Array<{
    id: ThemeMode;
    title: string;
    description: string;
  }> = [
    {
      id: 'light',
      title: t('settings.themeOptions.light'),
      description: t('settings.themeOptions.lightDesc'),
    },
    {
      id: 'dark',
      title: t('settings.themeOptions.dark'),
      description: t('settings.themeOptions.darkDesc'),
    },
    {
      id: 'system',
      title: t('settings.themeOptions.system'),
      description: t('settings.themeOptions.systemDesc'),
    },
  ];

  const handleThemeSelect = (theme: ThemeMode) => {
    setSelectedTheme(theme);

    // For now, just toggle dark mode
    // In a real implementation, you'd handle system theme detection
    if (theme === 'dark' && !settings?.darkMode) {
      toggleDarkMode();
    } else if (theme === 'light' && settings?.darkMode) {
      toggleDarkMode();
    }
    // System theme would require additional platform-specific logic
  };

  const renderThemeOption = (option: {
    id: ThemeMode;
    title: string;
    description: string;
  }) => {
    const isSelected = selectedTheme === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.themeOption,
          isSelected && styles.themeOptionSelected,
        ]}
        onPress={() => handleThemeSelect(option.id)}>
        <View style={styles.themeOptionContent}>
          <View style={styles.themeOptionLeft}>
            <Text style={[
              styles.themeOptionTitle,
              isSelected && styles.themeOptionTitleSelected,
            ]}>
              {option.title}
            </Text>
            <Text style={styles.themeOptionDescription}>
              {option.description}
            </Text>
          </View>
          <View style={styles.themeOptionRight}>
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
          <Text style={styles.title}>{t('settings.theme')}</Text>
          <Text style={styles.subtitle}>{t('settings.themeDesc')}</Text>
        </View>

        {/* Theme Options */}
        <View style={styles.section}>
          <Card style={styles.optionsCard}>
            {themeOptions.map((option, index) => (
              <View key={option.id}>
                {renderThemeOption(option)}
                {index < themeOptions.length - 1 && (
                  <View style={styles.optionDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preview')}</Text>
          <Card style={styles.previewCard}>
            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>
                {t('settings.previewSample')}
              </Text>
              <Text style={styles.previewText}>
                {t('settings.previewDesc')}
              </Text>
            </View>
          </Card>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>{t('settings.themeInfo')}</Text>
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
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionsCard: {
    marginHorizontal: spacing.lg,
  },
  themeOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  themeOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionLeft: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  themeOptionTitleSelected: {
    color: colors.primary[700],
  },
  themeOptionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  themeOptionRight: {
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
  previewCard: {
    marginHorizontal: spacing.lg,
  },
  previewContent: {
    padding: spacing.lg,
  },
  previewTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  previewText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
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
