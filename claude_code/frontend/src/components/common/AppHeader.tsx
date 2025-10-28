import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../../styles';
import {TopNavigation} from './TopNavigation';

export const AppHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top Navigation Icons */}
      <TopNavigation />

      {/* App Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>심장 건강지표 분석 도구</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },

  titleContainer: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: spacing.md,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'System',
  },
});
