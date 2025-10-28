import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Payment() {
  const [selectedPlan] = useState({
    name: '연간 이용권',
    price: 99000,
    originalPrice: 118800,
    period: '년'
  });

  const [paymentMethod, setPaymentMethod] = useState<'google' | 'apple' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);
    
    try {
      // 결제 처리 로직
      console.log('결제 진행:', { plan: selectedPlan, method: paymentMethod });
      
      // 실제 결제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 결제 성공 시 처리
      console.log('결제 완료');
      
    } catch (error) {
      console.error('결제 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const discount = selectedPlan.originalPrice ? selectedPlan.originalPrice - selectedPlan.price : 0;
  const discountRate = selectedPlan.originalPrice ? Math.round((discount / selectedPlan.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/pricing">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">결제</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        {/* 선택된 요금제 정보 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">주문 내역</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{selectedPlan.name}</span>
              <span className="font-medium text-black">
                {selectedPlan.price.toLocaleString()}원
              </span>
            </div>
            
            {selectedPlan.originalPrice && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">정가</span>
                <span className="text-gray-500 line-through">
                  {selectedPlan.originalPrice.toLocaleString()}원
                </span>
              </div>
            )}
            
            {discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600">할인 ({discountRate}%)</span>
                <span className="text-green-600 font-medium">
                  -{discount.toLocaleString()}원
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-black">총 결제금액</span>
                <span className="text-xl font-bold text-black">
                  {selectedPlan.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">결제 수단</h3>
          
          <div className="space-y-3">
            {/* Google Pay */}
            <button
              onClick={() => setPaymentMethod('google')}
              className={`w-full p-4 border-2 rounded-lg flex items-center transition-all ${
                paymentMethod === 'google'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                <i className="ri-google-play-fill text-2xl text-green-600"></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-black">Google Pay</div>
                <div className="text-sm text-gray-500">Google Play 스토어를 통한 결제</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'google'
                  ? 'border-black bg-black'
                  : 'border-gray-300'
              }`}>
                {paymentMethod === 'google' && (
                  <i className="ri-check-line text-white text-sm"></i>
                )}
              </div>
            </button>

            {/* Apple Pay */}
            <button
              onClick={() => setPaymentMethod('apple')}
              className={`w-full p-4 border-2 rounded-lg flex items-center transition-all ${
                paymentMethod === 'apple'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                <i className="ri-apple-fill text-2xl text-white"></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-black">Apple Pay</div>
                <div className="text-sm text-gray-500">App Store를 통한 결제</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'apple'
                  ? 'border-black bg-black'
                  : 'border-gray-300'
              }`}>
                {paymentMethod === 'apple' && (
                  <i className="ri-check-line text-white text-sm"></i>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 결제 안내 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <i className="ri-information-line text-blue-600 mr-3 mt-0.5"></i>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">결제 안내</p>
              <ul className="space-y-1 text-xs">
                <li>• 결제는 선택하신 플랫폼의 결제 시스템을 통해 안전하게 처리됩니다</li>
                <li>• 구독은 언제든지 해당 플랫폼에서 취소할 수 있습니다</li>
                <li>• 결제 완료 후 즉시 서비스를 이용하실 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className={`w-full h-12 rounded-lg text-base font-medium transition-colors ${
            paymentMethod && !isProcessing
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              결제 진행 중...
            </div>
          ) : (
            `${selectedPlan.price.toLocaleString()}원 결제하기`
          )}
        </button>
      </div>
    </div>
  );
}