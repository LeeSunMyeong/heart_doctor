
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAgreeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked
    });
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword &&
           formData.phone &&
           formData.birthDate &&
           formData.gender &&
           agreements.terms && 
           agreements.privacy;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsLoading(true);
      console.log('회원가입 진행:', formData);
      setTimeout(() => {
        setIsLoading(false);
        window.REACT_APP_NAVIGATE('/login');
      }, 1000);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google 회원가입');
  };

  const handleKakaoSignup = () => {
    console.log('카카오 회원가입');
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
          <Link to="/login" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-arrow-left-line text-lg text-gray-700"></i>
          </Link>
          <div></div>
          <div></div>
        </div>
        
        <div>
          <h1 className="text-lg font-bold text-black mb-1">회원가입</h1>
          <p className="text-sm text-gray-600">심장 건강지표 분석 도구와 함께 건강을 관리하세요</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="max-w-sm mx-auto">
          {/* 로고 */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-heart-pulse-line text-2xl text-red-600"></i>
            </div>
            <p className="text-gray-600 text-sm">심장관련 건강지표를 간편하게 확인하세요</p>
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

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
              <p className="text-xs text-gray-500 mt-1">8자 이상, 영문/숫자/특수문자 포함</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors pr-12"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="010-0000-0000"
                required
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">남성</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">여성</span>
                </label>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeAll"
                  checked={agreements.all}
                  onChange={handleAgreeAll}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                />
                <label htmlFor="agreeAll" className="ml-2 text-sm font-medium text-gray-900">
                  전체 동의
                </label>
              </div>
              
              <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={(e) => setAgreements({ ...agreements, terms: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">[필수] 이용약관 동의</span>
                  </label>
                  <button type="button" className="text-xs text-gray-500 underline">
                    보기
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={(e) => setAgreements({ ...agreements, privacy: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">[필수] 개인정보 처리방침 동의</span>
                  </label>
                  <button type="button" className="text-xs text-gray-500 underline">
                    보기
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreements.marketing}
                      onChange={(e) => setAgreements({ ...agreements, marketing: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">[선택] 마케팅 정보 수신 동의</span>
                  </label>
                  <button type="button" className="text-xs text-gray-500 underline">
                    보기
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading || !isFormValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 소셜 회원가입 */}
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
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="ri-google-line text-xl text-red-500 mr-3"></i>
                <span className="text-gray-700">Google로 가입</span>
              </button>

              <button
                onClick={handleKakaoSignup}
                className="w-full flex items-center justify-center px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <i className="ri-kakao-talk-line text-xl mr-3"></i>
                <span>카카오로 가입</span>
              </button>
            </div>
          </div>

          {/* 로그인 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
