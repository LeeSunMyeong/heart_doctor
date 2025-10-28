import React from 'react';
import {View, StyleSheet, TouchableOpacity, Platform, StatusBar} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from '../../styles';

interface TopNavigationProps {
  hasNotificationBadge?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  hasNotificationBadge = true,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentScreen = route.name;
  const isSettings = currentScreen === 'Settings';

  return (
    <View style={styles.container}>
      {/* Icon Menu Container */}
      <View style={styles.iconMenuContainer}>
        {/* Settings */}
        <TouchableOpacity
        style={[
          styles.iconButton,
          isSettings && styles.iconButtonActive,
        ]}
        onPress={() => navigation.navigate('Settings' as never)}>
        <Icon
          name="settings-outline"
          size={24}
          color={isSettings ? colors.background : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Payment/Pricing */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Pricing' as never)}>
        <Icon name="card-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Notifications' as never)}>
        <Icon
          name="notifications-outline"
          size={24}
          color={colors.textSecondary}
        />
        {hasNotificationBadge && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* History */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('History' as never)}>
        <Icon name="time-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Profile/User */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Profile' as never)}>
        <Icon name="person-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacing.md : spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.containerPadding,
    backgroundColor: colors.background,
  },

  iconMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  iconButtonActive: {
    backgroundColor: colors.text, // Black background for active icon
  },

  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
