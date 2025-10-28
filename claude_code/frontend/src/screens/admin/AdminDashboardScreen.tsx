import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/ui/Container';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {colors, typography, spacing} from '../../theme';
import {useAuthStore} from '../../store/authStore';
import type {AdminStats, UserManagementItem} from '../../types';

type AdminDashboardScreenNavigationProp = NativeStackNavigationProp<any>;

export const AdminDashboardScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const {user, logout} = useAuthStore();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data - in real app, this would call API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock statistics
    const mockStats: AdminStats = {
      totalUsers: 1247,
      activeUsers: 892,
      totalAssessments: 3456,
      premiumUsers: 234,
      totalRevenue: 2340000,
      averageRiskScore: 42.5,
      newUsersToday: 15,
      assessmentsToday: 48,
    };

    // Mock user list
    const mockUsers: UserManagementItem[] = [
      {
        userId: 1,
        email: 'user1@example.com',
        name: 'Kim Minho',
        role: 'USER',
        subscriptionType: 'premium',
        assessmentCount: 12,
        lastAssessment: '2025-10-23',
        riskLevel: 'medium',
        createdAt: '2025-09-01',
      },
      {
        userId: 2,
        email: 'user2@example.com',
        name: 'Lee Sora',
        role: 'USER',
        subscriptionType: 'free',
        assessmentCount: 3,
        lastAssessment: '2025-10-22',
        riskLevel: 'low',
        createdAt: '2025-10-10',
      },
      {
        userId: 3,
        email: 'user3@example.com',
        name: 'Park Jihoon',
        role: 'USER',
        subscriptionType: 'premium',
        assessmentCount: 25,
        lastAssessment: '2025-10-23',
        riskLevel: 'high',
        createdAt: '2025-08-15',
      },
    ];

    setStats(mockStats);
    setUsers(mockUsers);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleNavigateToNotifications = () => {
    navigation.navigate('AdminNotifications');
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'AdminLogin'}],
    });
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return colors.error[500];
      case 'medium':
        return colors.warning[500];
      case 'low':
        return colors.success[500];
      default:
        return colors.gray[500];
    }
  };

  const renderStatCard = (
    icon: string,
    label: string,
    value: string | number,
    change?: string,
  ) => (
    <Card style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {change && <Text style={styles.statChange}>{change}</Text>}
      </View>
    </Card>
  );

  const renderUserItem = ({item}: {item: UserManagementItem}) => (
    <Card style={styles.userCard}>
      <View style={styles.userContent}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View
            style={[
              styles.riskBadge,
              {backgroundColor: getRiskColor(item.riskLevel)},
            ]}>
            <Text style={styles.riskBadgeText}>
              {item.riskLevel?.toUpperCase() || 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.userDetailItem}>
            <Text style={styles.userDetailLabel}>
              {t('admin.subscription')}:
            </Text>
            <Text style={styles.userDetailValue}>
              {item.subscriptionType === 'premium'
                ? t('subscription.premium')
                : t('subscription.free')}
            </Text>
          </View>
          <View style={styles.userDetailItem}>
            <Text style={styles.userDetailLabel}>
              {t('admin.assessments')}:
            </Text>
            <Text style={styles.userDetailValue}>{item.assessmentCount}</Text>
          </View>
          <View style={styles.userDetailItem}>
            <Text style={styles.userDetailLabel}>
              {t('admin.lastAssessment')}:
            </Text>
            <Text style={styles.userDetailValue}>
              {item.lastAssessment || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <Container>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('admin.dashboard')}</Text>
            <Text style={styles.subtitle}>
              {t('admin.welcome')}, {user?.name}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              {renderStatCard(
                '👥',
                t('admin.totalUsers'),
                stats.totalUsers.toLocaleString(),
                `+${stats.newUsersToday} ${t('admin.today')}`,
              )}
              {renderStatCard(
                '✅',
                t('admin.activeUsers'),
                stats.activeUsers.toLocaleString(),
              )}
            </View>
            <View style={styles.statsRow}>
              {renderStatCard(
                '📊',
                t('admin.totalAssessments'),
                stats.totalAssessments.toLocaleString(),
                `+${stats.assessmentsToday} ${t('admin.today')}`,
              )}
              {renderStatCard(
                '⭐',
                t('admin.premiumUsers'),
                stats.premiumUsers.toLocaleString(),
              )}
            </View>
            <View style={styles.statsRow}>
              {renderStatCard(
                '💰',
                t('admin.revenue'),
                `₩${(stats.totalRevenue / 10000).toFixed(0)}${t(
                  'common.tenThousand',
                )}`,
              )}
              {renderStatCard(
                '❤️',
                t('admin.avgRiskScore'),
                `${stats.averageRiskScore}%`,
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title={t('admin.sendNotification')}
            onPress={handleNavigateToNotifications}
            variant="primary"
            style={styles.actionButton}
          />
        </View>

        {/* User Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.userManagement')}</Text>
          <View style={styles.userList}>
            {users.map(user => (
              <View key={user.userId}>{renderUserItem({item: user})}</View>
            ))}
          </View>
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  logoutButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.error[600],
  },
  statsGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
  },
  statChange: {
    fontSize: typography.fontSize.xs,
    color: colors.success[600],
    marginTop: spacing.xs,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.primary[500],
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  userList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userContent: {
    padding: spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  riskBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.white,
  },
  userDetails: {
    gap: spacing.xs,
  },
  userDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  userDetailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium as any,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
