import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';
import {AppHeader} from '../../components/common/AppHeader';

interface SettingItem {
  id: string;
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  screen?: string;
}

export const SettingsScreen = () => {
  const navigation = useNavigation();

  const environmentSettings: SettingItem[] = [
    {
      id: 'language',
      icon: 'globe-outline',
      iconBg: '#C8E6C9',
      label: '언어 설정',
      value: '한국어',
      screen: 'LanguageSettings',
    },
    {
      id: 'inputMethod',
      icon: 'grid-outline',
      iconBg: '#E1BEE7',
      label: '입력 방식',
      value: '텍스트',
      screen: 'InputMethodSettings',
    },
    {
      id: 'theme',
      icon: 'color-palette-outline',
      iconBg: '#BBDEFB',
      label: '테마 설정',
      value: '라이트',
      screen: 'ThemeSettings',
    },
    {
      id: 'notification',
      icon: 'notifications-outline',
      iconBg: '#FFE0B2',
      label: '알림',
      value: '켜짐',
      screen: 'NotificationSettings',
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'logout',
      icon: 'log-out-outline',
      iconBg: '#FFCDD2',
      label: '로그아웃',
      value: '',
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => item.screen && navigation.navigate(item.screen as never)}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, {backgroundColor: item.iconBg}]}>
          <Icon
            name={item.icon}
            size={24}
            color={item.id === 'logout' ? colors.error : colors.text}
          />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 공통 헤더 컴포넌트 */}
      <AppHeader showNotificationDot={true} />

      {/* 페이지 헤더 */}
      <View style={styles.pageHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>환경 설정</Text>
        <View style={styles.backButton} />
      </View>

      {/* 메인 콘텐츠 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* 환경 설정 섹션 */}
        <View style={styles.section}>
          {environmentSettings.map(item => renderSettingItem(item))}
        </View>

        {/* 계정 관리 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
        </View>
        <View style={styles.section}>
          {accountSettings.map(item => renderSettingItem(item))}
        </View>

        {/* 하단 앱 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>심장 건강지표 분석 도구 v1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2024 All rights reserved</Text>
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
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundDark,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    ...typography.heading,
    fontSize: 18,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.lg,
  },
  section: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 16,
    padding: 8,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
