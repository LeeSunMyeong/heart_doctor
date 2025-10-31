import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {AppHeader} from '../../components/common/AppHeader';
import {getAssessmentHistory} from '../../api/services/assessmentService';
import {getPredictionByCheckId} from '../../api/services/predictionService';
import {CheckResponse, PredictionResponse} from '../../api/types';

type RootStackParamList = {
  History: undefined;
  Result: {
    checkData: {check: CheckResponse; prediction: PredictionResponse};
    assessmentData: any;
  };
  Home: undefined;
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'History'
>;
type HistoryScreenRouteProp = RouteProp<RootStackParamList, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
  route: HistoryScreenRouteProp;
}

interface HistoryItemData extends CheckResponse {
  prediction?: PredictionResponse;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'check' | 'payment'>('check');
  const [historyData, setHistoryData] = useState<HistoryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[HistoryScreen] 이력 조회 시작...');

      const checks = await getAssessmentHistory();
      console.log('[HistoryScreen] 검사 이력:', checks);

      // 각 검사에 대한 prediction 조회
      const historyWithPredictions = await Promise.all(
        checks.map(async check => {
          try {
            const prediction = await getPredictionByCheckId(check.checkId);
            return {...check, prediction};
          } catch (err) {
            console.warn(
              `[HistoryScreen] Prediction 조회 실패 (checkId: ${check.checkId}):`,
              err,
            );
            return check;
          }
        }),
      );

      setHistoryData(historyWithPredictions);
    } catch (err) {
      console.error('[HistoryScreen] 이력 조회 실패:', err);
      setError('이력을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 화면에 포커스될 때마다 이력 새로고침
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusLabel = (diagnosis: string): string => {
    return diagnosis === 'NORMAL' ? '정상' : '비정상';
  };

  const getStatusColor = (diagnosis: string): string => {
    return diagnosis === 'NORMAL' ? '#10B981' : '#EF4444';
  };

  const handleItemPress = async (item: HistoryItemData) => {
    if (!item.prediction) {
      console.warn('[HistoryScreen] Prediction 데이터 없음');
      return;
    }

    navigation.navigate('Result', {
      checkData: {
        check: item,
        prediction: item.prediction,
      },
      assessmentData: {
        gender: item.gender ? '여' : '남',
        age: String(item.age),
        height: String(item.height),
        weight: String(item.weight),
        bodyTemperature:
          item.temperature === '0'
            ? '보통'
            : item.temperature === '1'
            ? '낮음'
            : '높음',
        breathing:
          item.breathing === '0'
            ? '보통'
            : item.breathing === '1'
            ? '낮음'
            : '빠름',
        pulse: String(item.pulse),
        chestPain: item.chestPain ? 'yes' : 'no',
        flankPain: item.flankPain ? 'yes' : 'no',
        footPain: item.footPain ? 'yes' : 'no',
        edemaLegs: item.footEdema ? 'yes' : 'no',
        dyspnea: item.dyspnea ? 'yes' : 'no',
        syncope: item.syncope ? 'yes' : 'no',
        weakness: item.weakness ? 'yes' : 'no',
        vomiting: item.vomitting ? 'yes' : 'no',
        palpitation: item.palpitation ? 'yes' : 'no',
        dizziness: item.dizziness ? 'yes' : 'no',
      },
    });
  };

  const renderHistoryItem = ({item}: {item: HistoryItemData}) => {
    if (!item.prediction) {
      return null;
    }

    const statusLabel = getStatusLabel(item.prediction.diagnosis);
    const statusColor = getStatusColor(item.prediction.diagnosis);

    return (
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() => handleItemPress(item)}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{formatDate(item.assessmentTime)}</Text>
        </View>
        <View style={[styles.cell, styles.middleCell]}>
          <Text style={styles.cellText}>심장관련 건강지표 검사</Text>
        </View>
        <View style={styles.cell}>
          <View style={[styles.statusBadge, {backgroundColor: statusColor}]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView style={styles.scrollContainer}>
        {/* 제목 영역 */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>심장 건강지표 분석 도구</Text>
        </View>

        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>이력 관리</Text>
          <Text style={styles.subtitle}>분석 결과와 결제 내역을 확인하세요</Text>
        </View>

        {/* 탭 버튼 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'check' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('check')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'check' && styles.activeTabText,
              ]}>
              검사 이력
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'payment' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('payment')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'payment' && styles.activeTabText,
              ]}>
              결제 이력
            </Text>
          </TouchableOpacity>
        </View>

        {/* 테이블 */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === 'check' ? (
          <View style={styles.tableContainer}>
            {/* 테이블 헤더 */}
            <View style={styles.tableHeader}>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>일자</Text>
              </View>
              <View style={[styles.headerCell, styles.middleCell]}>
                <Text style={styles.headerText}>검사 종류</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>상태</Text>
              </View>
            </View>

            {/* 테이블 바디 */}
            {historyData.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>검사 이력이 없습니다.</Text>
              </View>
            ) : (
              <FlatList
                data={historyData}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.checkId.toString()}
                scrollEnabled={false}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>결제 이력이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scrollContainer: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTabButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tableContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  middleCell: {
    flex: 2,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
