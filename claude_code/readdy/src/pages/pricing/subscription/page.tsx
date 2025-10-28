
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SubscriptionInfo {
  plan: string;
  planName: string;
  price: number;
  period: string;
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

export default function Subscription() {
  const [subscription] = useState<SubscriptionInfo>({
    plan: 'yearly',
    planName: '연간 이용권',
    price: 99000,
    period: '년',
    startDate: '2024.01.15',
    nextBillingDate: '2025.01.15',
    status: 'active'
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    // 실제로는 API 호출
    console.log('구독 취소 요청');
    setShowCancelModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-orange-600 bg-orange-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'cancelled':
        return '취소됨';
      case 'expired':
        return '만료됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/settings">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">구독 관리</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        {/* 현재 구독 정보 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <i className="ri-vip-crown-line text-2xl mr-3"></i>
              <div>
                <h2 className="text-lg font-bold">{subscription.planName}</h2>
                <p className="text-blue-100 text-sm">프리미엄 구독</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              subscription.status === 'active' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
            }`}>
              {getStatusText(subscription.status)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-100">요금</span>
              <span className="font-semibold">{subscription.price.toLocaleString()}원/{subscription.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">구독 시작일</span>
              <span className="font-semibold">{subscription.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">다음 결제일</span>
              <span className="font-semibold">{subscription.nextBillingDate}</span>
            </div>
          </div>
        </div>

        {/* 구독 혜택 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">현재 이용 중인 혜택</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <i className="ri-check-line text-green-600 mr-3"></i>
              <span className="text-gray-700 text-sm">무제한 정신건강 검사</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-600 mr-3"></i>
              <span className="text-gray-700 text-sm">상세한 분석 리포트</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-600 mr-3"></i>
              <span className="text-gray-700 text-sm">검사 이력 관리</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-600 mr-3"></i>
              <span className="text-gray-700 text-sm">개인 맞춤 권장사항</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-600 mr-3"></i>
              <span className="text-gray-700 text-sm">우선 고객지원</span>
            </div>
          </div>
        </div>

        {/* 구독 설정 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">구독 설정</h3>
          
          {/* 요금제 변경 */}
          <div className="py-3 border-b border-gray-100">
            <Link to="/pricing" className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">요금제 변경</p>
                <p className="text-xs text-gray-500">다른 요금제로 변경하기</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </Link>
          </div>

          {/* 결제 내역 */}
          <div className="py-3">
            <Link to="/payment-history" className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">결제 내역</p>
                <p className="text-xs text-gray-500">과거 결제 내역 확인</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </Link>
          </div>
        </div>

        {/* 구독 취소 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">구독 취소</h3>
          <p className="text-sm text-red-700 mb-4">
            구독을 취소하면 다음 결제일부터 서비스 이용이 제한됩니다.
            현재 결제 기간 동안은 계속 이용하실 수 있습니다.
          </p>
          <button
            onClick={handleCancelSubscription}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            구독 취소하기
          </button>
        </div>
      </div>

      {/* 구독 취소 확인 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">구독을 취소하시겠습니까?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                구독을 취소하면 {subscription.nextBillingDate}부터 프리미엄 기능을 이용할 수 없습니다.
                <br/><br/>
                현재 결제 기간 동안은 계속 이용하실 수 있습니다.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmCancelSubscription}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                구독 취소하기
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                계속 이용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}