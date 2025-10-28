import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {usePaymentStore} from '../../store/paymentStore';
import {useSubscriptionStore} from '../../store/subscriptionStore';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {LoadingSpinner} from '../../components/ui/LoadingSpinner';
import {Toast} from '../../components/ui/Toast';
import {Modal} from '../../components/ui/Modal';
import {PaymentMethod, SubscriptionPlan} from '../../types';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useTranslation} from 'react-i18next';

type PaymentScreenNavigationProp = NativeStackNavigationProp<any, 'Payment'>;
type PaymentScreenRouteProp = RouteProp<{Payment: {planId: string}}, 'Payment'>;

interface PaymentScreenProps {
  navigation: PaymentScreenNavigationProp;
  route: PaymentScreenRouteProp;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const {planId} = route.params;
  const {plans} = useSubscriptionStore();
  const {
    paymentMethods,
    selectedMethod,
    isProcessing,
    setPaymentMethods,
    setSelectedMethod,
    startPayment,
    completePayment,
    failPayment,
  } = usePaymentStore();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Find selected plan
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan || null);

    // Mock payment methods - Replace with actual API call
    const mockMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        name: 'Visa ending in 1234',
        lastFour: '1234',
        expiryDate: '12/25',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'card',
        name: 'Mastercard ending in 5678',
        lastFour: '5678',
        expiryDate: '06/26',
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setPaymentMethods(mockMethods);
    setSelectedMethod(mockMethods[0]);
  }, [planId, plans, setPaymentMethods, setSelectedMethod]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handlePayment = () => {
    if (!selectedMethod || !agreeToTerms) {
      setToastMessage(t('payment.pleaseAgreeToTerms'));
      setShowToast(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    startPayment();

    // Mock payment processing - Replace with actual payment SDK
    setTimeout(() => {
      const mockPayment = {
        id: Date.now(),
        user: {} as any,
        costModel: {} as any,
        status: 'SUCCESS' as const,
        storeInfo: 'A',
        transactionId: `TXN-${Date.now()}`,
        payTime: new Date().toISOString(),
      };

      completePayment(mockPayment);
      setToastMessage(t('payment.paymentSuccess'));
      setShowToast(true);

      // Navigate to success screen or back
      setTimeout(() => {
        navigation.navigate('PaymentHistory');
      }, 2000);
    }, 2000);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'bank':
        return '🏦';
      case 'paypal':
        return '💰';
      case 'google_pay':
        return 'G';
      case 'apple_pay':
        return '🍎';
      default:
        return '💳';
    }
  };

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  if (!selectedPlan) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container padding="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('payment.title')}</Text>
            <Text style={styles.subtitle}>{t('payment.subtitle')}</Text>
          </View>

          {/* Order Summary */}
          <Card variant="outlined" style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>
              {t('payment.orderSummary')}
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('payment.plan')}:</Text>
              <Text style={styles.summaryValue}>{selectedPlan.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('payment.duration')}:</Text>
              <Text style={styles.summaryValue}>
                {selectedPlan.duration}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('payment.total')}:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(selectedPlan.price)}
              </Text>
            </View>
          </Card>

          {/* Payment Method Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('payment.paymentMethod')}
            </Text>
            <View style={styles.methodsContainer}>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handlePaymentMethodSelect(method)}
                  activeOpacity={0.7}>
                  <Card
                    variant={
                      selectedMethod?.id === method.id ? 'elevated' : 'outlined'
                    }
                    style={[
                      styles.methodCard,
                      selectedMethod?.id === method.id &&
                        styles.selectedMethodCard,
                    ]}>
                    <View style={styles.methodContent}>
                      <Text style={styles.methodIcon}>
                        {getPaymentMethodIcon(method.type)}
                      </Text>
                      <View style={styles.methodInfo}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        {method.expiryDate && (
                          <Text style={styles.methodExpiry}>
                            {t('payment.expires')}: {method.expiryDate}
                          </Text>
                        )}
                      </View>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>
                            {t('payment.default')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              variant="outline"
              onPress={() => {}}
              style={styles.addMethodButton}>
              {t('payment.addPaymentMethod')}
            </Button>
          </View>

          {/* Terms Agreement */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            activeOpacity={0.7}>
            <View
              style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              {t('payment.agreeToTerms')}{' '}
              <Text style={styles.termsLink}>{t('payment.termsOfService')}</Text>
            </Text>
          </TouchableOpacity>

          {/* Payment Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handlePayment}
              disabled={!selectedMethod || !agreeToTerms || isProcessing}
              style={styles.paymentButton}>
              {isProcessing
                ? t('payment.processing')
                : `${t('payment.pay')} ${formatPrice(selectedPlan.price)}`}
            </Button>
          </View>
        </ScrollView>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t('payment.confirmPayment')}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {t('payment.confirmMessage', {
              amount: formatPrice(selectedPlan.price),
              plan: selectedPlan.name,
            })}
          </Text>
          <View style={styles.modalButtons}>
            <Button
              variant="outline"
              onPress={() => setShowConfirmModal(false)}
              style={styles.modalButton}>
              {t('common.cancel')}
            </Button>
            <Button onPress={handleConfirmPayment} style={styles.modalButton}>
              {t('common.confirm')}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      <Toast
        visible={showToast}
        message={toastMessage}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  summaryCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  section: {
    marginBottom: spacing.xl,
  },
  methodsContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  methodCard: {
    padding: spacing.md,
  },
  selectedMethodCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: typography.fontSize['2xl'],
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  methodExpiry: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
  },
  addMethodButton: {
    marginTop: spacing.sm,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  termsText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  paymentButton: {
    paddingHorizontal: spacing.xl,
  },
  modalContent: {
    padding: spacing.md,
  },
  modalText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
