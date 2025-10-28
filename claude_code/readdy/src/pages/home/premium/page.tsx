
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PremiumHome() {
  const [user] = useState({
    name: '김건강',
    premiumStartDate: '2024.01.15',
    totalTests: 47,
    thisMonthTests: 12
  });

  const [recentActivity] = useState([
    { date: '2024.03.15', result: '정상', score: 85 },
    { date: '2024.03.12', result: '주의', score: 72 },
    { date: '2024.03.08', result: '정상', score: 88 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 헤더 - 더 큰 패딩과 심플한 디자인 */}
      <div className="bg-white px-6 pt-16 pb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-black" style={{ fontFamily: "Pacifico, serif" }}>
            심장 건강지표 분석 도구
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/settings" className="p-3 bg-gray-100 rounded-full">
              <i className="ri-settings-3-line text-2xl text-gray-700"></i>
            </Link>
            <Link to="/history" className="p-3 bg-gray-100 rounded-full">
              <i className="ri-history-line text-2xl text-gray-700"></i>
            </Link>
            <Link to="/notifications" className="p-3 bg-gray-100 rounded-full">
              <i className="ri-notification-3-line text-2xl text-gray-700"></i>
            </Link>
            <Link to="/pricing" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="ri-bank-card-line text-lg text-gray-700"></i>
            </Link>
          </div>
        </div>
        
        {/* 프리미엄 환영 메시지 */}
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <h1 className="text-2xl font-bold text-black mr-3">{user.name}님</h1>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-bold">프리미엄</span>
            </div>
          </div>
          <p className="text-lg text-gray-600">무제한 검사로 건강을 관리하세요</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8">

        {/* 메인 검사 버튼 - 매우 크고 눈에 띄게 */}
        <div className="mb-8">
          <Link to="/assessment">
            <div className="bg-red-500 text-white rounded-2xl p-8 hover:bg-red-600 transition-all duration-200 shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-pulse-line text-4xl"></i>
                </div>
                <h2 className="text-2xl font-bold mb-3">심장 검사 시작</h2>
                <p className="text-lg opacity-90">무제한 검사 및 상세 분석</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 간단한 메뉴 - 큰 버튼으로 */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Link to="/history">
            <div className="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-history-line text-3xl text-green-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-1">검사 기록</h3>
                  <p className="text-lg text-gray-600">상세 분석 리포트</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/assessment/voice">
            <div className="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-mic-line text-3xl text-purple-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-1">음성 검사</h3>
                  <p className="text-lg text-gray-600">말로 간편하게</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/payment-history">
            <div className="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-bill-line text-3xl text-blue-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-1">결제 내역</h3>
                  <p className="text-lg text-gray-600">구독 관리</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 최근 검사 결과 - 더 큰 텍스트 */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">최근 검사</h3>
            <Link to="/history" className="text-lg text-blue-600 font-medium">전체 보기</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-4 ${
                      activity.result === '정상' ? 'bg-green-500' : 
                      activity.result === '주의' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-lg font-medium text-gray-800">{activity.date}</p>
                      <p className="text-base text-gray-600">결과: {activity.result}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-black">{activity.score}</p>
                    <p className="text-sm text-gray-500">점</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 건강 팁 - 더 큰 텍스트 */}
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <i className="ri-lightbulb-line text-2xl text-yellow-600"></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-2">오늘의 건강 팁</h4>
              <p className="text-base text-yellow-700 leading-relaxed">
                하루 30분 걷기와 계단 오르기는 심혈관 건강을 크게 개선시킵니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 - 더 큰 아이콘과 텍스트 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          <Link to="/home/premium" className="flex flex-col items-center py-3 px-1">
            <i className="ri-home-fill text-2xl text-red-500 mb-2"></i>
            <span className="text-sm text-red-500 font-bold">홈</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center py-3 px-1">
            <i className="ri-history-line text-2xl text-gray-500 mb-2"></i>
            <span className="text-sm text-gray-500">기록</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center py-3 px-1 relative">
            <i className="ri-notification-3-line text-2xl text-gray-500 mb-2"></i>
            <span className="text-sm text-gray-500">알림</span>
            <div className="absolute top-2 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
          </Link>
          <Link to="/settings" className="flex flex-col items-center py-3 px-1">
            <i className="ri-settings-3-line text-2xl text-gray-500 mb-2"></i>
            <span className="text-sm text-gray-500">설정</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
