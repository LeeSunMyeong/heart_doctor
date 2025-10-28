import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {colors, typography, spacing} from '../../theme';
import {useAuthStore} from '../../store/authStore';
import {useSettingsStore} from '../../store/settingsStore';
import type {SettingsMenuItem} from '../../types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<any>;

export const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {user, logout} = useAuthStore();
  const {settings, setSettings} = useSettingsStore();

  // Initialize mock settings
  useEffect(() => {
    if (!settings) {
      const mockSettings = {
        id: 1,
        user: user!,
        pushNotification: true,
        emailNotification: true,
        marketingNotification: false,
        darkMode: false,
        language: 'ko',
        privacyLevel: 2,
        sessionTimeout: 30,
        autoBackup: true,
        dataSaveMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSettings(mockSettings);
    }
  }, [settings, setSettings, user]);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('settings.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: () => {
            logout();
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const appMenuItems: SettingsMenuItem[] = [
    {
      id: 'theme',
      title: t('settings.theme'),
      subtitle: settings?.darkMode
        ? t('settings.themeOptions.dark')
        : t('settings.themeOptions.light'),
      screen: 'ThemeSettings',
      showArrow: true,
    },
    {
      id: 'language',
      title: t('settings.language'),
      subtitle:
        settings?.language === 'ko'
          ? t('settings.languageOptions.korean')
          : t('settings.languageOptions.english'),
      screen: 'LanguageSettings',
      showArrow: true,
    },
    {
      id: 'notifications',
      title: t('settings.notifications'),
      subtitle: t('settings.notificationsDesc'),
      screen: 'NotificationSettings',
      showArrow: true,
    },
    {
      id: 'inputMethod',
      title: t('settings.inputMethod'),
      subtitle: t('settings.inputMethodDesc'),
      screen: 'InputMethodSettings',
      showArrow: true,
    },
    {
      id: 'usageLimit',
      title: t('settings.usageLimit'),
      subtitle: t('settings.usageLimitDesc'),
      screen: 'UsageLimit',
      showArrow: true,
    },
  ];

  const aboutMenuItems: SettingsMenuItem[] = [
    {
      id: 'privacy',
      title: t('settings.privacy'),
      screen: 'Privacy',
      showArrow: true,
    },
    {
      id: 'terms',
      title: t('settings.termsOfService'),
      screen: 'Terms',
      showArrow: true,
    },
    {
      id: 'about',
      title: t('settings.about'),
      screen: 'About',
      showArrow: true,
    },
    {
      id: 'version',
      title: t('settings.version'),
      value: '1.0.0',
      showArrow: false,
    },
  ];

  const renderMenuItem = (item: SettingsMenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => item.screen && navigation.navigate(item.screen)}
      disabled={!item.screen}>
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      <View style={styles.menuItemRight}>
        {item.value && <Text style={styles.menuItemValue}>{item.value}</Text>}
        {item.showArrow && (
          <Text style={styles.menuItemArrow}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.title')}</Text>
          <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
        </View>

        {/* User Profile Section */}
        {user && (
          <Card style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appSettings')}</Text>
          <Card style={styles.menuCard}>
            {appMenuItems.map((item, index) => (
              <View key={item.id}>
                {renderMenuItem(item)}
                {index < appMenuItems.length - 1 && (
                  <View style={styles.menuItemDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.aboutApp')}</Text>
          <Card style={styles.menuCard}>
            {aboutMenuItems.map((item, index) => (
              <View key={item.id}>
                {renderMenuItem(item)}
                {index < aboutMenuItems.length - 1 && (
                  <View style={styles.menuItemDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  profileAvatarText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
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
  menuCard: {
    marginHorizontal: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  menuItemArrow: {
    fontSize: typography.fontSize['2xl'],
    color: colors.text.tertiary,
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginLeft: spacing.md,
  },
  logoutSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  logoutButton: {
    borderColor: colors.error[500],
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
