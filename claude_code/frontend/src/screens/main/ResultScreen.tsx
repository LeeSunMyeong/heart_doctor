import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {CheckResponse, PredictionResponse} from '../../api/types';
import {AssessmentData} from '../../services/checkService';
import {AppHeader} from '../../components/common/AppHeader';

const {width} = Dimensions.get('window');

type RootStackParamList = {
  Result: {
    checkData: {check: CheckResponse; prediction: PredictionResponse};
    assessmentData: AssessmentData;
  };
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

export const ResultScreen: React.FC<ResultScreenProps> = ({
  navigation,
  route,
}) => {
  const {checkData, assessmentData} = route.params || {};

  if (!checkData) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>검사 결과가 없습니다</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>검사 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const {check, prediction} = checkData;

  // 정상 여부 판단: normal 확률이 가장 높으면 정상
  const isNormal = prediction.diagnosis === 'NORMAL';

  return (
    <View style={styles.container}>
      <AppHeader />

      {/* 뒤로가기 + 타이틀 */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>분석 결과</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* 심장 이미지 카드 */}
        <View style={styles.heartCard}>
          <Image
            source={require('../../assets/images/heart.png')}
            style={styles.heartImage}
            resizeMode="contain"
          />
        </View>

        {/* 결과 메시지 */}
        <View style={styles.resultMessage}>
          <Text style={styles.resultText}>
            {isNormal
              ? '고객의 심장 관련 건강지표는\n일반적인 경향을 보입니다.'
              : '고객의 심장 관련 건강지표는\n일반적인 경향과 차이를 보입니다.'}
          </Text>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              ※ 본 결과는 참고용 자동 분석 결과이며, 질병 진단이나 치료를 위한 것이 아닙니다. 건강 관련 진단이나 판단은 전문가와 상담하시기 바랍니다.
            </Text>
          </View>
        </View>

        {/* 이전으로 돌아가기 버튼 */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.returnButtonText}>이전으로 돌아가기</Text>
        </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 30,
    color: '#111827',
    lineHeight: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  heartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heartImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heartImage: {
    width: width - 120,
    height: (width - 120) * 0.6,
    borderRadius: 16,
  },
  resultMessage: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  resultText: {
    fontSize: 18,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    marginBottom: 24,
  },
  disclaimerBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
