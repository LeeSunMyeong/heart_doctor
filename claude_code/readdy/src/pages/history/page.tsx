
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: number;
  date: string;
  type: string;
  isNormal: boolean;
  inputData: {
    gender: string;
    age: number;
    height: number;
    weight: number;
    temperature: string;
    breathing: string;
    pulse: number;
  };
}

interface PaymentHistoryItem {
  id: number;
  date: string;
  plan: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  period: string; // 사용기간 추가
}

export default function History() {
  // 로그인 상태 관리
  const [isLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'assessment' | 'payment'>('assessment');
  const navigate = useNavigate(); // 올바른 네비게이션 훅 사용

  const [historyData] = useState<HistoryItem[]>([
    {
      id: 1,
      date: '2024-01-15',
      type: '심장관련 건강지표 검사',
      isNormal: false,
      inputData: {
        gender: '남성',
        age: 45,
        height: 175,
        weight: 80,
        temperature: '높음',
        breathing: '빠름',
        pulse: 95
      }
    },
    {
      id: 2,
      date: '2024-01-08',
      type: '심장관련 건강지표 검사',
      isNormal: true,
      inputData: {
        gender: '여성',
        age: 32,
        height: 162,
        weight: 55,
        temperature: '보통',
        breathing: '보통',
        pulse: 72
      }
    },
    {
      id: 3,
      date: '2024-01-01',
      type: '심장관련 건강지표 검사',
      isNormal: false,
      inputData: {
        gender: '남성',
        age: 58,
        height: 170,
        weight: 85,
        temperature: '높음',
        breathing: '빠름',
        pulse: 105
      }
    }
  ]);

  const [paymentHistoryData] = useState<PaymentHistoryItem[]>([
    {
      id: 1,
      date: '2024-01-10',
      plan: '프리미엄 월간',
      amount: '₩9,900',
      status: 'completed',
      period: '2024.01.10 ~ 2024.02.09'
    },
    {
      id: 2,
      date: '2023-12-10',
      plan: '프리미엄 월간',
      amount: '₩9,900',
      status: 'completed',
      period: '2023.12.10 ~ 2024.01.09'
    },
    {
      id: 3,
      date: '2023-11-10',
      plan: '프리미엄 월간',
      amount: '₩9,900',
      status: 'completed',
      period: '2023.11.10 ~ 2023.12.09'
    }
  ]);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 로직
      console.log('로그아웃');
    } else {
      // 올바른 라우팅 사용
      navigate('/login');
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '대기중';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  /** Helper for assessment status */
  const getAssessmentStatusColor = (isNormal: boolean) =>
    isNormal ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  const getAssessmentStatusText = (isNormal: boolean) =>
    isNormal ? '정상' : '비정상';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 pt-12 pb-2 shadow-sm">
        {/* 상단 아이콘 메뉴 */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Link to="/settings" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-settings-3-line text-xl text-gray-700"></i>
          </Link>
          <Link to="/pricing" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-bank-card-line text-xl text-gray-700"></i>
          </Link>
          <Link to="/notifications" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative">
            <i className="ri-notification-3-line text-xl text-gray-700"></i>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
          </Link>
          <Link to="/history" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-history-line text-xl text-gray-700"></i>
          </Link>
          <button
            onClick={handleLoginLogout}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <i className={`text-xl text-gray-700 ${isLoggedIn ? 'ri-logout-box-line' : 'ri-login-box-line'}`}></i>
          </button>
        </div>

        {/* 제목 */}
        <div className="text-center mb-4">
          <div className="text-xl font-bold text-black" style={{ fontFamily: "Pacifico, serif" }}>
            심장 건강지표 분석 도구
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-arrow-left-line text-lg text-gray-700"></i>
          </Link>
          <div></div>
          <div></div>
        </div>

        <div>
          <h1 className="text-lg font-bold text-black mb-1">이력 관리</h1>
          <p className="text-sm text-gray-600">검사 결과와 결제 내역을 확인하세요</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assessment'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            검사 이력
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'payment'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            결제 이력
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-4 py-4">
        {activeTab === 'assessment' ? (
          /* 검사 이력 탭 */
          historyData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-heart-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검사 이력이 없습니다</h3>
              <p className="text-gray-500 mb-6">첫 번째 심장관련 건강지표 검사를 시작해보세요</p>
              <Link to="/">
                <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  검사 시작하기
                </button>
              </Link>
            </div>
          ) : (
            /* 검사 이력 테이블 */
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
                  <div className="col-span-4">일자</div>
                  <div className="col-span-5">검사 종류</div>
                  <div className="col-span-3">상태</div>
                </div>
              </div>

              {/* 테이블 내용 */}
              <div className="divide-y divide-gray-200">
                {historyData.map((item) => (
                  <div key={item.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4 text-sm text-gray-900">{item.date}</div>
                      <div className="col-span-5 text-sm text-gray-600">{item.type}</div>
                      <div className="col-span-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAssessmentStatusColor(
                            item.isNormal
                          )}`}
                        >
                          {getAssessmentStatusText(item.isNormal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          /* 결제 이력 탭 */
          paymentHistoryData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-bank-card-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">결제 이력이 없습니다</h3>
              <p className="text-gray-500 mb-6">프리미엄 요금제를 구독해보세요</p>
              <Link to="/pricing">
                <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  요금제 보기
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">결제 이력</h3>
              </div>

              {/* 테이블 헤더 */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3 text-xs font-medium text-gray-600">일자</div>
                  <div className="col-span-4 text-xs font-medium text-gray-600">사용기간</div>
                  <div className="col-span-2 text-center text-xs font-medium text-gray-600">금액</div>
                  <div className="col-span-3 text-center text-xs font-medium text-gray-600">상태</div>
                </div>
              </div>

              {/* 결제 내역 */}
              <div className="divide-y divide-gray-100">
                {paymentHistoryData.map((pay) => (
                  <div key={pay.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-3">
                        <div className="text-xs text-gray-900 font-medium">{pay.date.split('-')[1]}/{pay.date.split('-')[2]}</div>
                        <div className="text-xs text-gray-500">{pay.date.split('-')[0]}</div>
                      </div>
                      <div className="col-span-4">
                        <div className="text-xs text-gray-900 font-medium">{pay.period}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm text-gray-900">{pay.amount}</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            pay.status
                          )}`}
                        >
                          {getPaymentStatusText(pay.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-6 pb-6">
        {activeTab === 'assessment' && historyData.length > 0 && (
          <Link to="/">
            <button className="w-full h-12 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors">
              새 검사 시작하기
            </button>
          </Link>
        )}
        {activeTab === 'payment' && (
          <Link to="/pricing">
            <button className="w-full h-12 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors">
              요금제 보기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
