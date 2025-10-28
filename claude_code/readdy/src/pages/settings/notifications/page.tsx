
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    push: true,
    assessment: true
  });

  const [selectedLimit, setSelectedLimit] = useState(5);

  const usageLimits = [
    { value: 3, label: '3회', description: '하루 최대 3회까지 검사 가능' },
    { value: 4, label: '4회', description: '하루 최대 4회까지 검사 가능' },
    { value: 5, label: '5회', description: '하루 최대 5회까지 검사 가능' }
  ];

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLimitSelect = (limitValue: number) => {
    setSelectedLimit(limitValue);
  };

  const handleSave = () => {
    console.log('알림 설정 저장:', notifications);
    console.log('사용 횟수 설정 저장:', selectedLimit);
    // 저장 로직 구현 예정
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/settings">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">알림 및 사용 설정</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        <div className="space-y-6">
          {/* 현재 사용량 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">오늘 사용량</h4>
              <span className="text-sm text-gray-600">2/5회</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">오늘 3회 더 검사를 진행할 수 있습니다</p>
          </div>

          {/* 사용 횟수 설정 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">일일 사용 횟수</h4>
              <p className="text-xs text-gray-500 mt-1">하루에 사용할 수 있는 검사 횟수를 설정하세요</p>
            </div>
            <div className="divide-y divide-gray-200">
              {usageLimits.map((limit) => (
                <button
                  key={limit.value}
                  onClick={() => handleLimitSelect(limit.value)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <i className="ri-time-line text-lg text-gray-600 mr-3"></i>
                    <div className="text-left">
                      <div className="flex items-center">
                        <span className="text-gray-800">{limit.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">{limit.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedLimit === limit.value && (
                      <i className="ri-check-line text-black mr-2"></i>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedLimit === limit.value 
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedLimit === limit.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 푸시 알림 섹션 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">푸시 알림</h4>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  <i className="ri-notification-3-line text-lg text-gray-600 mr-3"></i>
                  <div>
                    <span className="text-gray-800">푸시 알림</span>
                    <p className="text-xs text-gray-500">모든 푸시 알림 활성화</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  <i className="ri-file-list-3-line text-lg text-gray-600 mr-3"></i>
                  <div>
                    <span className="text-gray-800">검사 알림</span>
                    <p className="text-xs text-gray-500">검사 시작/완료 알림</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('assessment')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.assessment ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.assessment ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 프리미엄 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-vip-crown-line text-blue-600 mr-3 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">프리미엄 구독 혜택</h4>
                <p className="text-xs text-blue-700 mb-3">
                  프리미엄 구독 시 무제한으로 검사를 진행할 수 있으며, 
                  고급 분석 결과와 상세한 리포트를 제공받을 수 있습니다.
                </p>
                <Link 
                  to="/pricing"
                  className="inline-flex items-center text-xs text-blue-600 font-medium"
                >
                  프리미엄 구독하기
                  <i className="ri-arrow-right-s-line ml-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}