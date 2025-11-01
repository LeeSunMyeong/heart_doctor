import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, typography, spacing} from '../../styles';
import {TopNavigation} from './TopNavigation';

interface AppHeaderProps {
  showNotificationDot?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showNotificationDot = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top + spacing.sm}]}>
      {/* Top Navigation Icons */}
      <TopNavigation hasNotificationBadge={showNotificationDot} />

      {/* App Title */}
      <Text style={styles.title}>심장 건강지표 분석 도구</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'serif',
  },
});
