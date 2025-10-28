import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';

type Props = NativeStackScreenProps<any, 'Settings'>;

interface SettingItem {
  id: string;
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  onPress: () => void;
}

const SettingsScreen: React.FC<Props> = ({navigation}) => {
  const [isLoggedIn] = React.useState(true);

  const settingItems: SettingItem[] = [
    {
      id: 'language',
      title: '언어 설정',
      value: '한국어',
      icon: 'globe-outline',
      iconBg: '#D1FAE5', // green-100
      iconColor: '#059669', // green-600
      onPress: () => console.log('Language settings'),
    },
    {
      id: 'inputMethod',
      title: '입력 방식',
      value: '텍스트',
      icon: 'keypad-outline',
      iconBg: '#EDE9FE', // purple-100
      iconColor: '#7C3AED', // purple-600
      onPress: () => console.log('Input method settings'),
    },
    {
      id: 'theme',
      title: '테마 설정',
      value: '라이트',
      icon: 'color-palette-outline',
      iconBg: '#DBEAFE', // blue-100
      iconColor: '#2563EB', // blue-600
      onPress: () => console.log('Theme settings'),
    },
    {
      id: 'notifications',
      title: '알림',
      value: '켜짐',
      icon: 'notifications-outline',
      iconBg: '#FED7AA', // orange-100
      iconColor: '#EA580C', // orange-600
      onPress: () => console.log('Notification settings'),
    },
  ];

  const handleLogout = () => {
    if (isLoggedIn) {
      console.log('Logout');
      // TODO: Implement logout logic
    } else {
      navigation.navigate('Login');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 상단 아이콘 메뉴 - HomeScreen과 동일 */}
        <View style={styles.header}>
          <View style={styles.iconMenu}>
            <TouchableOpacity
              style={[styles.iconButton, styles.iconButtonActive]}
              onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings-outline" size={24} color={colors.background} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Pricing')}>
              <Icon name="card-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}>
              <Icon name="notifications-outline" size={24} color={colors.textSecondary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('History')}>
              <Icon name="time-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Login')}>
              <Icon name="log-in-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>심장 건강지표 분석 도구</Text>
        </View>

        {/* 페이지 제목과 뒤로가기 버튼 */}
        <View style={styles.pageHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>환경 설정</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            {settingItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < settingItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}>
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.iconBg},
                    ]}>
                    <Icon name={item.icon} size={20} color={item.iconColor} />
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  <Text style={styles.menuItemValue}>{item.value}</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color={colors.textTertiary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Management Section */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: colors.errorLight},
                  ]}>
                  <Icon
                    name={isLoggedIn ? 'log-out-outline' : 'log-in-outline'}
                    size={20}
                    color={colors.error}
                  />
                </View>
                <Text style={styles.menuItemTitle}>
                  {isLoggedIn ? '로그아웃' : '로그인'}
                </Text>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>심장 건강지표 분석 도구 v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: 48,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  iconMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: 24,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconButtonActive: {
    backgroundColor: colors.text,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'serif',
  },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  pageTitle: {
    ...typography.subtitleLarge,
    color: colors.text,
    fontWeight: '600',
  },



  menuSection: {
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
  },

  menuCard: {
    backgroundColor: colors.background,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  menuItemTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },

  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },

  accountSection: {
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
  },

  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default SettingsScreen;
