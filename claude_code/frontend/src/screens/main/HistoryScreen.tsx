import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAssessmentStore} from '../../store/assessmentStore';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {AssessmentResult} from '../../types';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useTranslation} from 'react-i18next';

type HistoryScreenNavigationProp = NativeStackNavigationProp<any, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {results, setLatestResult} = useAssessmentStore();

  const handleResultPress = (result: AssessmentResult) => {
    setLatestResult(result);
    navigation.navigate('Result', {resultId: result.id});
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return colors.success[500];
      case 'medium':
        return colors.warning[500];
      case 'high':
        return colors.error[500];
      case 'critical':
        return colors.error[700];
      default:
        return colors.text.secondary;
    }
  };

  const renderHistoryItem = ({item}: {item: AssessmentResult}) => (
    <TouchableOpacity onPress={() => handleResultPress(item)}>
      <Card variant="outlined" style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          <View
            style={[
              styles.riskBadge,
              {backgroundColor: getRiskColor(item.riskLevel)},
            ]}>
            <Text style={styles.riskText}>
              {t(`result.riskLevel.${item.riskLevel}`)}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('history.age')}:</Text>
            <Text style={styles.metricValue}>{item.formData.age}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('history.sex')}:</Text>
            <Text style={styles.metricValue}>
              {item.formData.sex === 'M' ? t('assessment.male') : t('assessment.female')}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('history.confidence')}:</Text>
            <Text style={styles.metricValue}>
              {(item.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        <Text style={styles.viewDetails}>{t('history.viewDetails')} →</Text>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{t('history.noHistory')}</Text>
      <Text style={styles.emptySubtext}>{t('history.noHistoryDesc')}</Text>
      <Button
        onPress={() => navigation.navigate('Home')}
        style={styles.emptyButton}>
        {t('history.startAssessment')}
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Container padding="lg">
        <View style={styles.header}>
          <Text style={styles.title}>{t('history.title')}</Text>
          <Text style={styles.subtitle}>{t('history.subtitle')}</Text>
        </View>

        {results.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={results}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  historyCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  riskBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  riskText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  metricValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  viewDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
  },
});
