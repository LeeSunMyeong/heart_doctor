import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {usePaymentStore} from '../../store/paymentStore';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {Payment} from '../../types';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useTranslation} from 'react-i18next';

type PaymentHistoryScreenNavigationProp = NativeStackNavigationProp<
  any,
  'PaymentHistory'
>;

interface PaymentHistoryScreenProps {
  navigation: PaymentHistoryScreenNavigationProp;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const {payments, setPayments} = usePaymentStore();

  useEffect(() => {
    // Mock data - Replace with actual API call
    const mockPayments: Payment[] = [
      {
        id: 1,
        user: {} as any,
        costModel: {
          costId: 1,
          type: 'MONTHLY',
          cost: 9900,
          description: 'Premium Monthly Plan',
        },
        status: 'SUCCESS',
        storeInfo: 'A',
        transactionId: 'TXN-1234567890',
        payTime: '2025-10-23T10:30:00Z',
      },
      {
        id: 2,
        user: {} as any,
        costModel: {
          costId: 2,
          type: 'YEARLY',
          cost: 99000,
          description: 'Premium Yearly Plan',
        },
        status: 'SUCCESS',
        storeInfo: 'G',
        transactionId: 'TXN-0987654321',
        payTime: '2025-09-15T14:20:00Z',
      },
      {
        id: 3,
        user: {} as any,
        costModel: {
          costId: 1,
          type: 'MONTHLY',
          cost: 9900,
          description: 'Premium Monthly Plan',
        },
        status: 'FAIL',
        storeInfo: 'A',
        payTime: '2025-08-20T09:15:00Z',
      },
    ];

    setPayments(mockPayments);
  }, [setPayments]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return colors.success[500];
      case 'PENDING':
        return colors.warning[500];
      case 'FAIL':
      case 'CANCELED':
        return colors.error[500];
      case 'REFUNDED':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    return t(`payment.status.${status.toLowerCase()}`);
  };

  const getStoreIcon = (storeInfo: string) => {
    return storeInfo === 'A' ? '🍎' : '🤖';
  };

  const renderPaymentItem = ({item}: {item: Payment}) => (
    <Card variant="outlined" style={styles.paymentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.planName}>{item.costModel.description}</Text>
          <Text style={styles.date}>{formatDate(item.payTime)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('payment.amount')}:</Text>
          <Text style={styles.amount}>
            {formatPrice(item.costModel.cost)}
          </Text>
        </View>

        {item.transactionId && (
          <View style={styles.row}>
            <Text style={styles.label}>{t('payment.transactionId')}:</Text>
            <Text style={styles.value}>{item.transactionId}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>{t('payment.store')}:</Text>
          <Text style={styles.value}>
            {getStoreIcon(item.storeInfo)}{' '}
            {item.storeInfo === 'A' ? 'App Store' : 'Google Play'}
          </Text>
        </View>

        {item.refundTime && (
          <View style={styles.row}>
            <Text style={styles.label}>{t('payment.refundDate')}:</Text>
            <Text style={styles.value}>{formatDate(item.refundTime)}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.receiptLink}>{t('payment.viewReceipt')} →</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{t('payment.noPayments')}</Text>
      <Text style={styles.emptySubtext}>{t('payment.noPaymentsDesc')}</Text>
      <Button
        onPress={() => navigation.navigate('Pricing')}
        style={styles.emptyButton}>
        {t('payment.viewPlans')}
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Container padding="lg">
        <View style={styles.header}>
          <Text style={styles.title}>{t('payment.paymentHistory')}</Text>
          <Text style={styles.subtitle}>
            {t('payment.paymentHistoryDesc')}
          </Text>
        </View>

        {payments.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={payments}
            renderItem={renderPaymentItem}
            keyExtractor={item => item.id.toString()}
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
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  paymentCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  planName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  cardContent: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  value: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  amount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  receiptLink: {
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
