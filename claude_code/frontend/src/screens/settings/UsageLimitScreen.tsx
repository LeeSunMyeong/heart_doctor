import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {colors, typography, spacing} from '../../theme';
import {useSubscriptionStore} from '../../store/subscriptionStore';

type UsageLimitScreenNavigationProp = NativeStackNavigationProp<any>;

export const UsageLimitScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<UsageLimitScreenNavigationProp>();
  const {subscription} = useSubscriptionStore();

  // Mock usage data
  const usageData = {
    used: 2,
    limit: subscription?.type === 'premium' ? -1 : 3,
    resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(
      'ko-KR',
    ),
  };

  const isPremium = subscription?.type === 'premium';
  const isUnlimited = usageData.limit === -1;
  const usagePercentage = isUnlimited
    ? 0
    : Math.min((usageData.used / usageData.limit) * 100, 100);

  const handleUpgrade = () => {
    navigation.navigate('Pricing');
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.usageLimit')}</Text>
          <Text style={styles.subtitle}>{t('settings.usageLimitDesc')}</Text>
        </View>

        {/* Current Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.currentUsage')}</Text>
          <Card style={styles.usageCard}>
            <View style={styles.usageContent}>
              {/* Usage Bar */}
              <View style={styles.usageHeader}>
                <Text style={styles.usageTitle}>
                  {isPremium
                    ? t('subscription.unlimitedUsage')
                    : t('subscription.dailyLimit')}
                </Text>
                {!isUnlimited && (
                  <Text style={styles.usageCount}>
                    {usageData.used} / {usageData.limit}
                  </Text>
                )}
              </View>

              {!isUnlimited && (
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {width: `${usagePercentage}%`},
                        usagePercentage >= 100 && styles.progressBarFillFull,
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Usage Info */}
              <View style={styles.usageInfo}>
                {isPremium ? (
                  <Text style={styles.usageInfoText}>
                    {t('settings.unlimitedAssessments')}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.usageInfoText}>
                      {t('settings.remainingAssessments', {
                        count: Math.max(usageData.limit - usageData.used, 0),
                      })}
                    </Text>
                    <Text style={styles.usageInfoSubtext}>
                      {t('settings.resetsOn', {date: usageData.resetDate})}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Card>
        </View>

        {/* Plan Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.planComparison')}</Text>

          {/* Free Plan */}
          <Card style={styles.planCard}>
            <View style={styles.planContent}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{t('subscription.free')}</Text>
                {!isPremium && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>
                      {t('subscription.currentPlan')}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.planFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.dailyLimit')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.basicAnalysis')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.resultHistory')}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Premium Plan */}
          <Card style={[styles.planCard, styles.premiumPlanCard]}>
            <View style={styles.planContent}>
              <View style={styles.planHeader}>
                <Text style={[styles.planTitle, styles.premiumPlanTitle]}>
                  {t('subscription.premium')}
                </Text>
                {isPremium && (
                  <View style={[styles.currentBadge, styles.premiumCurrentBadge]}>
                    <Text style={[styles.currentBadgeText, styles.premiumCurrentBadgeText]}>
                      {t('subscription.currentPlan')}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.planFeatures}>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureBullet, styles.premiumFeatureBullet]}>
                    •
                  </Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.unlimitedUsage')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureBullet, styles.premiumFeatureBullet]}>
                    •
                  </Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.advancedAnalysis')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureBullet, styles.premiumFeatureBullet]}>
                    •
                  </Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.detailedReports')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureBullet, styles.premiumFeatureBullet]}>
                    •
                  </Text>
                  <Text style={styles.featureText}>
                    {t('subscription.features.prioritySupport')}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Upgrade Button */}
        {!isPremium && (
          <View style={styles.upgradeSection}>
            <Button
              title={t('subscription.upgradeToPremium')}
              onPress={handleUpgrade}
              variant="primary"
              style={styles.upgradeButton}
            />
          </View>
        )}

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
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
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
  usageCard: {
    marginHorizontal: spacing.lg,
  },
  usageContent: {
    padding: spacing.lg,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  usageTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
  },
  usageCount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.primary[600],
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  progressBarFillFull: {
    backgroundColor: colors.error[500],
  },
  usageInfo: {
    gap: spacing.xs,
  },
  usageInfoText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  usageInfoSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  planCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  premiumPlanCard: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  planContent: {
    padding: spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  planTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
  },
  premiumPlanTitle: {
    color: colors.primary[700],
  },
  currentBadge: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  premiumCurrentBadge: {
    backgroundColor: colors.primary[100],
  },
  currentBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.gray[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumCurrentBadgeText: {
    color: colors.primary[700],
  },
  planFeatures: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  premiumFeatureBullet: {
    color: colors.primary[500],
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  upgradeSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  upgradeButton: {
    backgroundColor: colors.primary[500],
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
