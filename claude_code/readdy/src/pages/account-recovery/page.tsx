
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AccountRecovery() {
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [formData, setFormData] = useState({
    phone: '',
    username: '',
    verificationCode: ''
  });
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendVerification = () => {
    if (formData.phone) {
      setIsVerificationSent(true);
      console.log('인증번호 발송:', formData.phone);
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode) {
      setIsVerified(true);
      console.log('인증 완료');
    }
  };

  const handleFindId = () => {
    if (isVerified) {
      console.log('아이디 찾기 진행');
    }
  };

  const handleResetPassword = () => {
    if (isVerified && formData.username) {
      console.log('비밀번호 재설정 진행');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between pt-12 pb-8">
        <Link to="/login">
          <i className="ri-arrow-left-line text-2xl text-black"></i>
        </Link>
        <h1 className="text-xl font-semibold text-black">계정 복구</h1>
        <div className="w-6"></div>
      </div>

      {/* 탭 선택 */}
      <div className="flex mb-8">
        <button
          onClick={() => setActiveTab('id')}
          className={`flex-1 py-3 text-center text-base font-medium border-b-2 ${
            activeTab === 'id'
              ? 'text-black border-black'
              : 'text-gray-400 border-gray-200'
          }`}
        >
          아이디 찾기
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-3 text-center text-base font-medium border-b-2 ${
            activeTab === 'password'
              ? 'text-black border-black'
              : 'text-gray-400 border-gray-200'
          }`}
        >
          비밀번호 재설정
        </button>
      </div>

      {/* 아이디 찾기 탭 */}
      {activeTab === 'id' && (
        <div className="flex-1">
          <div className="space-y-6">
            {/* 휴대폰 번호 입력 */}
            <div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="휴대폰 번호"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 h-14 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="px-6 h-14 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  인증하기
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            {isVerificationSent && (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="verificationCode"
                    placeholder="인증번호 입력"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className="flex-1 h-14 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-6 h-14 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    확인
                  </button>
                </div>
                {isVerified && (
                  <p className="text-green-600 text-sm mt-2">✓ 인증이 완료되었습니다</p>
                )}
              </div>
            )}

            {/* 아이디 찾기 버튼 */}
            <button
              onClick={handleFindId}
              disabled={!isVerified}
              className={`w-full h-14 rounded-lg text-base font-medium transition-colors mt-8 ${
                isVerified
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              아이디 찾기
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 재설정 탭 */}
      {activeTab === 'password' && (
        <div className="flex-1">
          <div className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="아이디"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full h-14 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
              />
            </div>

            {/* 휴대폰 번호 입력 */}
            <div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="휴대폰 번호"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 h-14 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="px-6 h-14 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  인증하기
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            {isVerificationSent && (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="verificationCode"
                    placeholder="인증번호 입력"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className="flex-1 h-14 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-6 h-14 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    확인
                  </button>
                </div>
                {isVerified && (
                  <p className="text-green-600 text-sm mt-2">✓ 인증이 완료되었습니다</p>
                )}
              </div>
            )}

            {/* 비밀번호 재설정 버튼 */}
            <button
              onClick={handleResetPassword}
              disabled={!isVerified || !formData.username}
              className={`w-full h-14 rounded-lg text-base font-medium transition-colors mt-8 ${
                isVerified && formData.username
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              비밀번호 재설정
            </button>
          </div>
        </div>
      )}

      {/* 하단 여백 */}
      <div className="pb-8"></div>
    </div>
  );
}
