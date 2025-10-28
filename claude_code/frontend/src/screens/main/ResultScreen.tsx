import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useAssessmentStore} from '../../store/assessmentStore';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {Divider} from '../../components/ui/Divider';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useTranslation} from 'react-i18next';

type RootStackParamList = {
  Result: {resultId?: string};
  Home: undefined;
  History: undefined;
};

type ResultScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Result'
>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {latestResult} = useAssessmentStore();

  if (!latestResult) {
    return (
      <Container padding="lg">
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('result.noResult')}</Text>
          <Button onPress={() => navigation.navigate('Home')}>
            {t('result.goToAssessment')}
          </Button>
        </View>
      </Container>
    );
  }

  const {predictions, riskLevel, confidence, recommendations} = latestResult;

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

  return (
    <ScrollView style={styles.container}>
      <Container padding="lg">
        <View style={styles.header}>
          <Text style={styles.title}>{t('result.title')}</Text>
          <Text style={styles.subtitle}>{t('result.subtitle')}</Text>
        </View>

        <Card variant="elevated" style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={styles.riskLabel}>{t('result.riskLevel')}</Text>
            <View
              style={[
                styles.riskBadge,
                {backgroundColor: getRiskColor(riskLevel)},
              ]}>
              <Text style={styles.riskText}>
                {t(`result.riskLevel.${riskLevel}`)}
              </Text>
            </View>
          </View>
          <Text style={styles.confidence}>
            {t('result.confidence')}: {(confidence * 100).toFixed(1)}%
          </Text>
        </Card>

        <Card variant="elevated" style={styles.predictionsCard}>
          <Text style={styles.sectionTitle}>{t('result.predictions')}</Text>
          <Divider style={styles.divider} />

          {Object.entries(predictions).map(([key, value]) => (
            <View key={key} style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>
                {t(`result.prediction.${key}`)}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${value * 100}%`},
                  ]}
                />
              </View>
              <Text style={styles.predictionValue}>
                {(value * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </Card>

        <Card variant="elevated" style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>{t('result.recommendations')}</Text>
          <Divider style={styles.divider} />

          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('Home')}
            style={styles.button}>
            {t('result.newAssessment')}
          </Button>
          <Button
            variant="primary"
            onPress={() => navigation.navigate('History')}
            style={styles.button}>
            {t('result.viewHistory')}
          </Button>
        </View>
      </Container>
    </ScrollView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  riskCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  riskLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  riskBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  riskText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  confidence: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  predictionsCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  divider: {
    marginBottom: spacing.md,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  predictionLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  progressBar: {
    flex: 2,
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    marginHorizontal: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  predictionValue: {
    width: 50,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'right',
  },
  recommendationsCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: typography.fontSize.base,
    color: colors.primary[500],
    marginRight: spacing.sm,
  },
  recommendationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  button: {
    flex: 1,
  },
});
