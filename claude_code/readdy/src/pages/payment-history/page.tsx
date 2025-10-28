import { useState } from 'react';
import { Link } from 'react-router-dom';

interface PaymentRecord {
  id: number;
  date: string;
  planName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  period: string;
}

export default function PaymentHistory() {
  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: 1,
      date: '2024-01-15',
      planName: '연간 이용권',
      amount: 99000,
      status: 'completed',
      paymentMethod: 'Google Pay',
      period: '2024.01.15 ~ 2025.01.14'
    },
    {
      id: 2,
      date: '2023-12-15',
      planName: '월간 이용권',
      amount: 9900,
      status: 'completed',
      paymentMethod: 'Apple Pay',
      period: '2023.12.15 ~ 2024.01.14'
    },
    {
      id: 3,
      date: '2023-11-15',
      planName: '월간 이용권',
      amount: 9900,
      status: 'refunded',
      paymentMethod: 'Google Pay',
      period: '2023.11.15 ~ 2023.12.14'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '결제완료';
      case 'pending': return '결제대기';
      case 'failed': return '결제실패';
      case 'refunded': return '환불완료';
      default: return '알 수 없음';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'ri-check-circle-line';
      case 'pending': return 'ri-time-line';
      case 'failed': return 'ri-close-circle-line';
      case 'refunded': return 'ri-refund-line';
      default: return 'ri-question-line';
    }
  };

  const totalAmount = paymentHistory
    .filter(record => record.status === 'completed')
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/settings">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">결제 내역</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-6">
        {/* 결제 요약 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">결제 요약</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">
                {paymentHistory.length}
              </div>
              <div className="text-sm text-gray-600">총 결제 건수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">
                {totalAmount.toLocaleString()}원
              </div>
              <div className="text-sm text-gray-600">총 결제 금액</div>
            </div>
          </div>
        </div>

        {paymentHistory.length === 0 ? (
          /* 빈 상태 */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="ri-bill-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">결제 내역이 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 구독을 시작해보세요</p>
            <Link to="/pricing">
              <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                요금제 보기
              </button>
            </Link>
          </div>
        ) : (
          /* 결제 내역 목록 */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">결제 내역</h3>
            
            {paymentHistory.map((record) => (
              <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getStatusColor(record.status)}`}>
                      <i className={`${getStatusIcon(record.status)} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-black">{record.planName}</h4>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black">
                      {record.amount.toLocaleString()}원
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusText(record.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>결제 수단:</span>
                    <span>{record.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이용 기간:</span>
                    <span>{record.period}</span>
                  </div>
                </div>
                
                {record.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className="text-sm text-gray-500 hover:text-black transition-colors">
                      영수증 보기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 새 구독 버튼 */}
      {paymentHistory.length > 0 && (
        <div className="px-6 pb-6">
          <Link to="/pricing">
            <button className="w-full h-12 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors">
              새 구독 시작하기
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}