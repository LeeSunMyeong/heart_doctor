
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 관리자 로그인 로직 구현 예정
      console.log('관리자 로그인 시도:', formData);
      
      // 로그인 성공 시 대시보드로 이동
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* 로고 영역 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
            <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
              logo
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">관리자 로그인</h1>
          <p className="text-gray-300 text-lg">시스템 관리를 위한 관리자 전용 로그인</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 관리자 ID */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-white mb-3">
                관리자 ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-admin-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="관리자 ID를 입력하세요"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-3">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 rounded-xl text-lg font-semibold transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ri-login-circle-line mr-2"></i>
                  로그인
                </div>
              )}
            </button>
          </form>

          {/* 보안 안내 */}
          <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start">
              <i className="ri-shield-check-line text-yellow-400 text-xl mr-3 mt-0.5"></i>
              <div className="text-sm text-yellow-100">
                <p className="font-semibold mb-2">보안 안내</p>
                <p>관리자 계정은 높은 수준의 보안이 필요합니다. 안전한 네트워크 환경에서만 로그인하세요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2024 Mental Health App Admin Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
