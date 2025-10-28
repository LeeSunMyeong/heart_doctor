import React from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {colors, typography, spacing} from '../../theme';
import {useSettingsStore} from '../../store/settingsStore';

interface NotificationSettingItem {
  id: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

export const NotificationSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {settings, togglePushNotification, updateSettings} = useSettingsStore();

  const handleToggleEmail = () => {
    if (settings) {
      updateSettings({
        emailNotification: !settings.emailNotification,
      });
    }
  };

  const handleToggleMarketing = () => {
    if (settings) {
      updateSettings({
        marketingNotification: !settings.marketingNotification,
      });
    }
  };

  const notificationSettings: NotificationSettingItem[] = [
    {
      id: 'push',
      title: t('settings.pushNotifications'),
      description: t('settings.pushNotificationsDesc'),
      value: settings?.pushNotification ?? false,
      onToggle: togglePushNotification,
    },
    {
      id: 'email',
      title: t('settings.emailNotifications'),
      description: t('settings.emailNotificationsDesc'),
      value: settings?.emailNotification ?? false,
      onToggle: handleToggleEmail,
    },
    {
      id: 'marketing',
      title: t('settings.marketingNotifications'),
      description: t('settings.marketingNotificationsDesc'),
      value: settings?.marketingNotification ?? false,
      onToggle: handleToggleMarketing,
    },
  ];

  const renderNotificationSetting = (item: NotificationSettingItem) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingItemTitle}>{item.title}</Text>
        <Text style={styles.settingItemDescription}>{item.description}</Text>
      </View>
      <View style={styles.settingItemRight}>
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false: colors.gray[300],
            true: colors.primary[300],
          }}
          thumbColor={item.value ? colors.primary[500] : colors.white}
          ios_backgroundColor={colors.gray[300]}
        />
      </View>
    </View>
  );

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.notifications')}</Text>
          <Text style={styles.subtitle}>{t('settings.notificationsDesc')}</Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Card style={styles.settingsCard}>
            {notificationSettings.map((item, index) => (
              <View key={item.id}>
                {renderNotificationSetting(item)}
                {index < notificationSettings.length - 1 && (
                  <View style={styles.settingItemDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {t('settings.notificationInfo')}
            </Text>
            <Text style={styles.infoText}>
              {t('settings.notificationInfoDesc')}
            </Text>
          </View>
        </View>

        {/* Permission Info */}
        <View style={styles.permissionSection}>
          <Text style={styles.permissionTitle}>
            {t('settings.permissionsTitle')}
          </Text>
          <Text style={styles.permissionText}>
            {t('settings.permissionsDesc')}
          </Text>
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
  settingsCard: {
    marginHorizontal: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingItemLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingItemTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingItemDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  settingItemRight: {
    alignItems: 'flex-end',
  },
  settingItemDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginLeft: spacing.md,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoBox: {
    backgroundColor: colors.info[50],
    borderRadius: 8,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info[500],
  },
  infoTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.info[900],
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.info[700],
    lineHeight: 20,
  },
  permissionSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  permissionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  permissionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
});
