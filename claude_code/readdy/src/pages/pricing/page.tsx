
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  
  // 로그인 상태 관리
  const [isLoggedIn] = useState(true);
  
  // 현재 구독 상태 관리
  const [currentPlan] = useState<'free' | 'premium'>('free');
  const [freeUsageLeft] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'monthly',
      name: '월간 이용권',
      price: 9900,
      period: '월',
      features: [
        '무제한 정신건강 검사',
        '검사 이력 관리',
        '알림 서비스'
      ]
    },
    {
      id: 'yearly',
      name: '연간 이용권',
      price: 99000,
      originalPrice: 118800,
      period: '년',
      popular: true,
      features: [
        '무제한 정신건강 검사',
        '검사 이력 관리',
        '알림 서비스',
        '우선 고객지원',
        '2개월 무료 혜택'
      ]
    },
    {
      id: 'lifetime',
      name: '종신 이용권',
      price: 299000,
      originalPrice: 990000,
      period: '평생',
      features: [
        '무제한 정신건강 검사',
        '검사 이력 관리',
        '알림 서비스',
        '우선 고객지원',
        '평생 무료 업데이트'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    console.log('구매 진행:', plan);
    // 결제 페이지로 이동
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 로직
      console.log('로그아웃');
    } else {
      window.REACT_APP_NAVIGATE('/login');
    }
  };

  const handleSubscribe = () => {
    setIsLoading(true);
    // 결제 페이지로 이동
    setTimeout(() => {
      setIsLoading(false);
      window.REACT_APP_NAVIGATE('/payment');
    }, 500);
  };

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
          <h1 className="text-lg font-bold text-black mb-1">요금제 선택</h1>
          <p className="text-sm text-gray-600">심장 건강지표 분석 도구 프리미엄 구독</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-4">
        {/* 현재 구독 상태 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-black mb-1">현재 구독</h3>
              <p className="text-sm text-blue-800">
                {currentPlan === 'free' ? '무료 체험' : '프리미엄'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-black">
                {currentPlan === 'free' ? '0원' : '9,900원'}
              </div>
              <p className="text-xs text-gray-600">
                {currentPlan === 'free' ? '체험 중' : '월 구독'}
              </p>
            </div>
          </div>
          
          {currentPlan === 'free' && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-800">남은 무료 검사</span>
                <span className="text-sm font-medium text-blue-900">{freeUsageLeft}회</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(freeUsageLeft / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 요금제 옵션 */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-bold text-black">요금제 선택</h3>
          {/* 무료 체험 */}
          <div className={`border-2 rounded-lg p-4 transition-all ${
            selectedPlan === 'free' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-black">무료 체험</h4>
                <p className="text-sm text-gray-600">3회 무료 검사</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-black">무료</div>
                <button
                  onClick={() => setSelectedPlan('free')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedPlan === 'free' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {currentPlan === 'free' ? '현재 플랜' : '선택'}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>3회 심장관련 건강지표 검사</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>기본 위험도 분석</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <i className="ri-close-line text-gray-400 mr-2"></i>
                <span>검사 이력 관리</span>
              </div>
            </div>
          </div>

          {/* 프리미엄 월간 */}
          <div className={`border-2 rounded-lg p-4 transition-all relative ${
            selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}>
            <div className="absolute -top-2 left-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                추천
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-black">프리미엄 월간</h4>
                <p className="text-sm text-gray-600">무제한 검사 + 이력 관리</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-black">9,900원</div>
                <p className="text-xs text-gray-600">월</p>
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedPlan === 'monthly' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {currentPlan === 'premium' ? '현재 플랜' : '선택'}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>무제한 심장관련 건강지표 검사</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>검사 이력 무제한 저장</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>음성 검사 기능</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>알림 서비스</span>
              </div>
            </div>
          </div>

          {/* 프리미엄 연간 */}
          <div className={`border-2 rounded-lg p-4 transition-all relative ${
            selectedPlan === 'yearly' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
          }`}>
            <div className="absolute -top-2 left-4">
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                17% 할인
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-black">연간 이용권</h4>
                <p className="text-sm text-gray-600">2개월 무료 혜택</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 line-through mr-2">118,800원</span>
                  <div className="text-xl font-bold text-black">99,000원</div>
                </div>
                <p className="text-xs text-gray-600">연 (월 8,250원)</p>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedPlan === 'yearly' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  선택
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>월간 이용권의 모든 기능</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>2개월 무료 (17% 할인)</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>우선 고객 지원</span>
              </div>
            </div>
          </div>

          {/* 종신 이용권 */}
          <div className={`border-2 rounded-lg p-4 transition-all relative ${
            selectedPlan === 'lifetime' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
          }`}>
            <div className="absolute -top-2 left-4">
              <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                최고 할인
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-black">종신 이용권</h4>
                <p className="text-sm text-gray-600">평생 이용 혜택</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 line-through mr-2">990,000원</span>
                  <div className="text-xl font-bold text-black">299,000원</div>
                </div>
                <p className="text-xs text-gray-600">평생</p>
                <button
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedPlan === 'lifetime' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  선택
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>연간 이용권의 모든 기능</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>평생 무료 업데이트</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                <span>우선 고객 지원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 자주 묻는 질문 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-black mb-3">자주 묻는 질문</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-black mb-1">검사 결과는 의료진 진단을 대체하나요?</h4>
              <p className="text-xs text-gray-600">아니요. 삼장닥터는 참고용 건강 정보를 제공하며, 정확한 진단은 의료진과 상담하세요.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-black mb-1">구독은 언제든지 취소할 수 있나요?</h4>
              <p className="text-xs text-gray-600">네, 설정에서 언제든지 구독을 취소할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 구독 버튼 */}
      <div className="px-6 pb-6">
        {selectedPlan !== currentPlan && (
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className={`w-full h-12 rounded-lg text-base font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : selectedPlan === 'monthly'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : selectedPlan === 'yearly'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : selectedPlan === 'lifetime'
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {isLoading ? '처리 중...' : 
             selectedPlan === 'free' ? '무료 체험 시작' :
             selectedPlan === 'monthly' ? '월간 구독 시작' :
             selectedPlan === 'yearly' ? '연간 구독 시작 (17% 할인)' :
             '종신 이용권 구매'}
          </button>
        )}
      </div>
    </div>
  );
}
