import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import {Toast} from '../../components/ui/Toast';
import {colors, typography, spacing} from '../../theme';
import type {AdminNotification} from '../../types';

export const AdminNotificationsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<
    'all' | 'premium' | 'free' | 'high_risk'
  >('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [sentNotifications, setSentNotifications] = useState<
    AdminNotification[]
  >([
    {
      id: '1',
      title: '건강 검진 알림',
      message: '정기 건강 검진을 받으세요.',
      recipients: 'all',
      sentDate: '2025-10-20',
      status: 'sent',
      createdAt: '2025-10-20T09:00:00Z',
      updatedAt: '2025-10-20T09:00:00Z',
    },
    {
      id: '2',
      title: '프리미엄 혜택 안내',
      message: '프리미엄 사용자 전용 혜택을 확인하세요.',
      recipients: 'premium',
      sentDate: '2025-10-18',
      status: 'sent',
      createdAt: '2025-10-18T10:00:00Z',
      updatedAt: '2025-10-18T10:00:00Z',
    },
  ]);

  const recipientOptions: Array<{
    value: 'all' | 'premium' | 'free' | 'high_risk';
    label: string;
    icon: string;
    description: string;
  }> = [
    {
      value: 'all',
      label: t('admin.allUsers'),
      icon: '👥',
      description: t('admin.allUsersDesc'),
    },
    {
      value: 'premium',
      label: t('admin.premiumUsers'),
      icon: '⭐',
      description: t('admin.premiumUsersDesc'),
    },
    {
      value: 'free',
      label: t('admin.freeUsers'),
      icon: '🆓',
      description: t('admin.freeUsersDesc'),
    },
    {
      value: 'high_risk',
      label: t('admin.highRiskUsers'),
      icon: '⚠️',
      description: t('admin.highRiskUsersDesc'),
    },
  ];

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setToastType('error');
      setToastMessage(t('admin.fillAllFields'));
      setShowToast(true);
      return;
    }

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newNotification: AdminNotification = {
      id: Date.now().toString(),
      title,
      message,
      recipients: selectedRecipients,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSentNotifications([newNotification, ...sentNotifications]);

    // Clear form
    setTitle('');
    setMessage('');
    setSelectedRecipients('all');

    setToastType('success');
    setToastMessage(t('admin.notificationSent'));
    setShowToast(true);
  };

  const renderRecipientOption = (option: (typeof recipientOptions)[0]) => {
    const isSelected = selectedRecipients === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.recipientOption,
          isSelected && styles.recipientOptionSelected,
        ]}
        onPress={() => setSelectedRecipients(option.value)}>
        <View style={styles.recipientOptionContent}>
          <View style={styles.recipientOptionLeft}>
            <Text style={styles.recipientIcon}>{option.icon}</Text>
            <View style={styles.recipientInfo}>
              <Text
                style={[
                  styles.recipientLabel,
                  isSelected && styles.recipientLabelSelected,
                ]}>
                {option.label}
              </Text>
              <Text style={styles.recipientDescription}>
                {option.description}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
            ]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotificationItem = (notification: AdminNotification) => {
    const recipientOption = recipientOptions.find(
      opt => opt.value === notification.recipients,
    );

    return (
      <Card key={notification.id} style={styles.notificationCard}>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationDate}>{notification.sentDate}</Text>
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <View style={styles.notificationFooter}>
            <View style={styles.recipientBadge}>
              <Text style={styles.recipientBadgeIcon}>
                {recipientOption?.icon}
              </Text>
              <Text style={styles.recipientBadgeText}>
                {recipientOption?.label}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                notification.status === 'sent' && styles.statusBadgeSent,
              ]}>
              <Text style={styles.statusBadgeText}>
                {t(`admin.status.${notification.status}`)}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('admin.sendNotification')}</Text>
          <Text style={styles.subtitle}>{t('admin.notificationDesc')}</Text>
        </View>

        {/* Notification Form */}
        <Card style={styles.formCard}>
          <View style={styles.formContent}>
            <TextInput
              label={t('admin.notificationTitle')}
              value={title}
              onChangeText={setTitle}
              placeholder={t('admin.titlePlaceholder')}
              style={styles.input}
            />

            <TextInput
              label={t('admin.notificationMessage')}
              value={message}
              onChangeText={setMessage}
              placeholder={t('admin.messagePlaceholder')}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.messageInput]}
            />

            {/* Recipients Selection */}
            <View style={styles.recipientsSection}>
              <Text style={styles.recipientsLabel}>
                {t('admin.selectRecipients')}
              </Text>
              <View style={styles.recipientsList}>
                {recipientOptions.map(option => renderRecipientOption(option))}
              </View>
            </View>

            <Button
              title={t('admin.sendNow')}
              onPress={handleSendNotification}
              variant="primary"
              style={styles.sendButton}
            />
          </View>
        </Card>

        {/* Sent Notifications History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>{t('admin.sentHistory')}</Text>
          <View style={styles.notificationsList}>
            {sentNotifications.map(notification =>
              renderNotificationItem(notification),
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Toast */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setShowToast(false)}
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
  formCard: {
    marginHorizontal: spacing.lg,
  },
  formContent: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  recipientsSection: {
    marginBottom: spacing.lg,
  },
  recipientsLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  recipientsList: {
    gap: spacing.sm,
  },
  recipientOption: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
  },
  recipientOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  recipientOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipientOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recipientIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recipientLabelSelected: {
    color: colors.primary[700],
  },
  recipientDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
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
  sendButton: {
    backgroundColor: colors.primary[500],
  },
  historySection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  historyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  notificationsList: {
    gap: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  notificationContent: {
    padding: spacing.md,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  notificationTitle: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  notificationDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  notificationMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  recipientBadgeIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  recipientBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  statusBadgeSent: {
    backgroundColor: colors.success[100],
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.success[700],
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
