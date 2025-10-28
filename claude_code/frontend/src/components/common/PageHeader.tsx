import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '../../styles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  centered?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  centered = false,
}) => {
  const navigation = useNavigation();

  if (centered) {
    return (
      <View style={styles.centeredContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButtonAbsolute}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.centeredTextContainer}>
          <Text style={styles.titleCentered}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.rightSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },

  rightSection: {
    width: 40,
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...typography.subtitleLarge,
    color: colors.text,
    fontWeight: '600',
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Centered layout styles
  centeredContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
    position: 'relative',
  },

  backButtonAbsolute: {
    position: 'absolute',
    left: spacing.containerPadding,
    top: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  centeredTextContainer: {
    alignItems: 'center',
  },

  titleCentered: {
    ...typography.titleLarge,
    color: colors.text,
    textAlign: 'center',
  },
});
