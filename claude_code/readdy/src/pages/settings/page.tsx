
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [user] = useState({
    name: '김건강',
    email: 'health@example.com',
    phone: '010-1234-5678',
    joinDate: '2024.01.15'
  });

  // 로그인 상태 관리
  const [isLoggedIn] = useState(true);

  // 알림 설정
  const [notifications, setNotifications] = useState({
    push: true,
    assessment: true
  });

  // 사용 횟수 설정
  const [selectedLimit, setSelectedLimit] = useState(5);

  // 언어 설정
  const [language, setLanguage] = useState('ko');

  // 입력 방식 설정
  const [selectedInputMethod, setSelectedInputMethod] = useState('text');

  // 테마 설정
  const [selectedTheme, setSelectedTheme] = useState('light');

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    console.log('로그아웃');
    setShowLogoutModal(false);
    // 로그아웃 로직 구현 예정
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      window.REACT_APP_NAVIGATE('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 아이콘 메뉴 */}
      <div className="px-4 pt-12 pb-4">
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
        <div className="text-center">
          <div className="text-xl font-bold text-black" style={{ fontFamily: "Pacifico, serif" }}>
            심장 건강지표 분석 도구
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link to="/">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">환경 설정</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg border border-gray-100">
          {/* 언어 설정 */}
          <Link to="/settings/language" className="block px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-global-line text-lg text-green-600"></i>
                </div>
                <span className="text-base text-gray-900">언어</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">한국어</span>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </div>
          </Link>

          {/* 입력 방식 설정 */}
          <Link to="/settings/input-method" className="block px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-keyboard-line text-lg text-purple-600"></i>
                </div>
                <span className="text-base text-gray-900">입력 방식</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">텍스트</span>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </div>
          </Link>

          {/* 테마 설정 */}
          <Link to="/settings/theme" className="block px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-palette-line text-lg text-blue-600"></i>
                </div>
                <span className="text-base text-gray-900">테마</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">라이트</span>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </div>
          </Link>

          {/* 알림 설정 */}
          <Link to="/settings/notifications" className="block px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-notification-3-line text-lg text-orange-600"></i>
                </div>
                <span className="text-base text-gray-900">알림</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">켜짐</span>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 계정 관리 섹션 */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-3 px-2">계정 관리</h2>
        <div className="bg-white rounded-lg border border-gray-100">
          {/* 로그아웃 */}
          <button 
            onClick={handleLoginLogout}
            className="w-full px-4 py-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <i className={`text-lg text-red-600 ${isLoggedIn ? 'ri-logout-box-line' : 'ri-login-box-line'}`}></i>
                </div>
                <span className="text-base text-gray-900">{isLoggedIn ? '로그아웃' : '로그인'}</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </button>
        </div>
      </div>

      {/* 앱 정보 */}
      <div className="px-4 py-4">
        <div className="text-center text-xs text-gray-500">
          <p>심장 건강지표 분석 도구 v1.0.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
