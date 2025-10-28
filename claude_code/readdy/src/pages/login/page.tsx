
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 로그인 로직 구현 예정
    console.log('로그인 시도:', formData);
    setTimeout(() => {
      setIsLoading(false);
      window.REACT_APP_NAVIGATE('/');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인');
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
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
          <Link to="/login" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-login-box-line text-xl text-gray-700"></i>
          </Link>
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
          <h1 className="text-lg font-bold text-black mb-1">로그인</h1>
          <p className="text-sm text-gray-600">심장 건강지표 분석 도구에 오신 것을 환영합니다</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-heart-pulse-line text-3xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "Pacifico, serif" }}>
              심장 건강지표 분석 도구
            </h2>
            <p className="text-gray-600">심장관련 건강지표를 간편하게 확인하세요</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors pr-12"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <Link to="/account-recovery" className="text-sm text-red-600 hover:text-red-700">
                비밀번호 찾기
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="ri-google-line text-xl text-red-500 mr-3"></i>
                <span className="text-gray-700">Google로 로그인</span>
              </button>

              <button
                onClick={handleKakaoLogin}
                className="w-full flex items-center justify-center px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <i className="ri-kakao-talk-line text-xl mr-3"></i>
                <span>카카오로 로그인</span>
              </button>
            </div>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-red-600 hover:text-red-700 font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
