import React, {useState} from 'react';
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
import {Button} from '../../components/common';

type Props = NativeStackScreenProps<any, 'Pricing'>;

interface PricingPlan {
  id: 'free' | 'monthly' | 'yearly' | 'lifetime';
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  badge?: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  features: Array<{text: string; included: boolean}>;
}

export const PricingScreen: React.FC<Props> = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [currentPlan] = useState<'free' | 'premium'>('free');
  const [freeUsageLeft] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: '무료 체험',
      description: '3회 무료 검사',
      price: 0,
      period: '',
      badge: '',
      badgeColor: colors.textSecondary,
      borderColor: colors.border,
      bgColor: '#FAFAFA', // 매우 연한 회색
      features: [
        {text: '3회 심장관련 건강지표 검사', included: true},
        {text: '기본 위험도 분석', included: true},
        {text: '검사 이력 관리', included: false},
      ],
    },
    {
      id: 'monthly',
      name: '프리미엄 월간',
      description: '무제한 검사 + 이력 관리',
      price: 9900,
      period: '월',
      badge: '추천',
      badgeColor: colors.info,
      borderColor: colors.info,
      bgColor: '#EBF5FF', // 매우 연한 파란색 (Figma 색상)
      features: [
        {text: '무제한 심장관련 건강지표 검사', included: true},
        {text: '검사 이력 무제한 저장', included: true},
        {text: '음성 검사 기능', included: true},
        {text: '알림 서비스', included: true},
      ],
    },
    {
      id: 'yearly',
      name: '연간 이용권',
      description: '2개월 무료 혜택',
      price: 99000,
      originalPrice: 118800,
      period: '연 (월 8,250원)',
      badge: '17% 할인',
      badgeColor: colors.success,
      borderColor: colors.success,
      bgColor: '#ECFDF5', // 매우 연한 초록색 (Figma 색상)
      features: [
        {text: '월간 이용권의 모든 기능', included: true},
        {text: '2개월 무료 (17% 할인)', included: true},
        {text: '우선 고객 지원', included: true},
      ],
    },
    {
      id: 'lifetime',
      name: '종신 이용권',
      description: '평생 이용 혜택',
      price: 299000,
      originalPrice: 990000,
      period: '평생',
      badge: '최고 할인',
      badgeColor: colors.premium,
      borderColor: colors.premium,
      bgColor: '#F5F3FF', // 매우 연한 보라색 (Figma 색상)
      features: [
        {text: '연간 이용권의 모든 기능', included: true},
        {text: '평생 무료 업데이트', included: true},
        {text: '우선 고객 지원', included: true},
      ],
    },
  ];

  const handleSubscribe = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Payment', {planId: selectedPlan});
    }, 500);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  const getPlanButtonColor = (planId: string): string => {
    switch (planId) {
      case 'monthly':
        return colors.info;
      case 'yearly':
        return colors.success;
      case 'lifetime':
        return colors.premium;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 상단 아이콘 메뉴 - HomeScreen과 동일 */}
        <View style={styles.header}>
          <View style={styles.iconMenu}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.iconButtonActive]}
              onPress={() => navigation.navigate('Pricing')}>
              <Icon name="card-outline" size={24} color={colors.background} />
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
            <Text style={styles.pageTitle}>요금제 선택</Text>
          </View>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>심장 건강지표 분석 도구 프리미엄 구독</Text>
        </View>

        {/* Current Subscription Status */}
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanRow}>
            <View>
              <Text style={styles.currentPlanLabel}>현재 구독</Text>
              <Text style={styles.currentPlanType}>
                {currentPlan === 'free' ? '무료 체험' : '프리미엄'}
              </Text>
            </View>
            <View style={styles.currentPlanPriceContainer}>
              <Text style={styles.currentPlanPrice}>
                {currentPlan === 'free' ? '0원' : '9,900원'}
              </Text>
              <Text style={styles.currentPlanPeriod}>
                {currentPlan === 'free' ? '체험 중' : '월 구독'}
              </Text>
            </View>
          </View>

          {currentPlan === 'free' && (
            <View style={styles.usageSection}>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>남은 무료 검사</Text>
                <Text style={styles.usageCount}>{freeUsageLeft}회</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {width: `${(freeUsageLeft / 3) * 100}%`},
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.plansSectionTitle}>요금제 선택</Text>

          {plans.map(plan => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && {
                  borderColor: plan.borderColor,
                  borderWidth: 2,
                  backgroundColor: plan.bgColor,
                },
              ]}>
              {plan.badge && (
                <View style={[styles.badge, {backgroundColor: plan.badgeColor}]}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>

                <View style={styles.planPriceContainer}>
                  {plan.originalPrice && (
                    <View style={styles.originalPriceRow}>
                      <Text style={styles.originalPrice}>
                        {formatPrice(plan.originalPrice)}원
                      </Text>
                    </View>
                  )}
                  <View style={styles.priceRow}>
                    {plan.price === 0 ? (
                      <Text style={styles.freePrice}>무료</Text>
                    ) : (
                      <>
                        <Text style={styles.price}>{formatPrice(plan.price)}원</Text>
                      </>
                    )}
                  </View>
                  {plan.period && (
                    <Text style={styles.period}>{plan.period}</Text>
                  )}

                  <TouchableOpacity
                    onPress={() => setSelectedPlan(plan.id)}
                    style={[
                      styles.selectButton,
                      selectedPlan === plan.id && {
                        backgroundColor: getPlanButtonColor(plan.id),
                      },
                    ]}>
                    <Text
                      style={[
                        styles.selectButtonText,
                        selectedPlan === plan.id && styles.selectButtonTextActive,
                      ]}>
                      {currentPlan === 'premium' && plan.id === 'monthly'
                        ? '현재 플랜'
                        : '선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Features List */}
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Icon
                      name={feature.included ? 'checkmark' : 'close'}
                      size={16}
                      color={feature.included ? colors.success : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.featureText,
                        !feature.included && styles.featureTextDisabled,
                      ]}>
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>자주 묻는 질문</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              검사 결과는 의료진 진단을 대체하나요?
            </Text>
            <Text style={styles.faqAnswer}>
              아니요. 심장닥터는 참고용 건강 정보를 제공하며, 정확한 진단은
              의료진과 상담하세요.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              구독은 언제든지 취소할 수 있나요?
            </Text>
            <Text style={styles.faqAnswer}>
              네, 설정에서 언제든지 구독을 취소할 수 있습니다.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Subscribe Button */}
      {selectedPlan !== (currentPlan === 'free' ? 'free' : 'monthly') && (
        <View style={styles.subscribeButtonContainer}>
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={isLoading}
            style={[
              styles.subscribeButton,
              {backgroundColor: getPlanButtonColor(selectedPlan)},
              isLoading && styles.subscribeButtonDisabled,
            ]}>
            <Text style={styles.subscribeButtonText}>
              {isLoading
                ? '처리 중...'
                : selectedPlan === 'free'
                ? '무료 체험 시작'
                : selectedPlan === 'monthly'
                ? '월간 구독 시작'
                : selectedPlan === 'yearly'
                ? '연간 구독 시작 (17% 할인)'
                : '종신 이용권 구매'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
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

  subtitleContainer: {
    paddingHorizontal: spacing.containerPadding,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },

  currentPlanCard: {
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.info,
    backgroundColor: '#EBF5FF', // 연한 파란색 (Figma 색상)
  },

  currentPlanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  currentPlanLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  currentPlanType: {
    ...typography.body,
    color: colors.info,
    fontWeight: '600',
  },

  currentPlanPriceContainer: {
    alignItems: 'flex-end',
  },

  currentPlanPrice: {
    ...typography.titleLarge,
    color: colors.text,
  },

  currentPlanPeriod: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  usageSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.info + '40',
  },

  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  usageLabel: {
    ...typography.body,
    color: colors.info,
  },

  usageCount: {
    ...typography.body,
    color: colors.info,
    fontWeight: '600',
  },

  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.info + '40',
    borderRadius: spacing.radiusFull,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.info,
    borderRadius: spacing.radiusFull,
  },

  plansSection: {
    marginBottom: spacing.xl,
  },

  plansSectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  planCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -6,
    left: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
  },

  badgeText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },

  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  planInfo: {
    flex: 1,
  },

  planName: {
    ...typography.subtitleMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  planDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },

  planPriceContainer: {
    alignItems: 'flex-end',
  },

  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  originalPrice: {
    ...typography.body,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  price: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: 'bold',
  },

  freePrice: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: 'bold',
  },

  period: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  selectButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
    backgroundColor: colors.borderLight,
    marginTop: spacing.xs,
  },

  selectButtonText: {
    ...typography.buttonSmall,
    color: colors.textSecondary,
  },

  selectButtonTextActive: {
    color: colors.background,
  },

  featuresContainer: {
    gap: spacing.sm,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },

  featureTextDisabled: {
    color: colors.textTertiary,
  },

  faqSection: {
    backgroundColor: colors.backgroundDark,
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
  },

  faqTitle: {
    ...typography.subtitleMedium,
    color: colors.text,
    marginBottom: spacing.md,
  },

  faqItem: {
    marginBottom: spacing.md,
  },

  faqQuestion: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },

  faqAnswer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  subscribeButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.containerPadding,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  subscribeButton: {
    height: spacing.buttonLarge,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subscribeButtonDisabled: {
    opacity: 0.5,
  },

  subscribeButtonText: {
    ...typography.button,
    color: colors.background,
    fontWeight: '600',
  },
});
