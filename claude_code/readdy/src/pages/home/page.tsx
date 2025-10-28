
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AssessmentData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  bodyTemperature: string;
  breathing: string;
  pulse: string;
  chestPain: string;
  flankPain: string;
  footPain: string;
  edemaLegs: string;
  dyspnea: string;
  syncope: string;
  weakness: string;
  vomiting: string;
  palpitation: string;
  dizziness: string;
}

const initialData: AssessmentData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  bodyTemperature: '',
  breathing: '',
  pulse: '',
  chestPain: '',
  flankPain: '',
  footPain: '',
  edemaLegs: '',
  dyspnea: '',
  syncope: '',
  weakness: '',
  vomiting: '',
  palpitation: '',
  dizziness: ''
};

export default function Home() {
  // 로그인 상태 관리 (실제로는 인증 시스템에서 가져올 예정)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // 구독 상태 관리 (실제로는 사용자 데이터에서 가져올 예정)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'premium'>('premium');
  
  // 무료 사용자의 사용량 데이터 - 최초 1회만 가능
  const [usageData] = useState({
    dailyUsed: 0, // 0: 미사용, 1: 1회 사용 완료
    dailyLimit: 1 // 무료 사용자는 1회만 가능
  });

  // 검사 데이터 상태
  const [data, setData] = useState<AssessmentData>(initialData);
  
  // 맥박 측정 관련 상태
  const [pulseTimer, setPulseTimer] = useState({
    isRunning: false,
    seconds: 60,
    count: 0
  });

  // 맥박 모달 상태
  const [showPulseModal, setShowPulseModal] = useState(false);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      // 로그아웃 로직
    } else {
      // 로그인 페이지로 이동
      if (window.REACT_APP_NAVIGATE) {
        window.REACT_APP_NAVIGATE('/login');
      } else {
        console.error('REACT_APP_NAVIGATE is not defined');
      }
    }
  };

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateBMI = () => {
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const weightKg = parseFloat(data.weight);
      if (heightM > 0) {
        return (weightKg / (heightM * heightM)).toFixed(1);
      }
    }
    return '';
  };

  const isFormValid = () => {
    return Object.values(data).every(value => value.trim() !== '');
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const bmi = calculateBMI();
      console.log('검사 완료:', { ...data, bmi });
      if (window.REACT_APP_NAVIGATE) {
        window.REACT_APP_NAVIGATE('/result');
      } else {
        console.error('REACT_APP_NAVIGATE is not defined');
      }
    }
  };

  // 맥박 측정 타이머 시작/정지
  const togglePulseTimer = () => {
    if (pulseTimer.isRunning) {
      // 타이머 정지
      setPulseTimer(prev => ({ ...prev, isRunning: false }));
    } else {
      // 타이머 시작
      setPulseTimer({ isRunning: true, seconds: 60, count: 0 });
      
      const interval = setInterval(() => {
        setPulseTimer(prev => {
          if (prev.seconds <= 1) {
            clearInterval(interval);
            // 1분 완료 시 맥박수 자동 입력
            handleInputChange('pulse', prev.count.toString());
            setShowPulseModal(false); // 모달 닫기
            return { isRunning: false, seconds: 60, count: prev.count };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    }
  };

  // 맥박 카운트 증가
  const incrementPulseCount = () => {
    if (pulseTimer.isRunning) {
      setPulseTimer(prev => ({ ...prev, count: prev.count + 1 }));
    }
  };

  // 맥박 측정 리셋
  const resetPulseTimer = () => {
    setPulseTimer({ isRunning: false, seconds: 60, count: 0 });
    handleInputChange('pulse', '');
  };

  const canStartAssessment = subscriptionStatus === 'premium' || usageData.dailyUsed < usageData.dailyLimit;

  const renderSelectField = (
    label: string,
    field: keyof AssessmentData,
    options: { value: string; label: string }[]
  ) => (
    <div className="flex items-center space-x-2">
      <label className="text-xs font-medium text-gray-800 w-12 flex-shrink-0">{label}</label>
      <div className="flex space-x-1 flex-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleInputChange(field, option.value)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-1 ${
              data[field] === option.value
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderYesNoField = (label: string, field: keyof AssessmentData) => (
    <div className="flex items-center space-x-2">
      <label className="text-xs font-medium text-gray-800 w-16 flex-shrink-0">{label}</label>
      <div className="flex space-x-1 flex-1">
        {[
          { value: 'yes', label: '예' },
          { value: 'no', label: '아니오' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleInputChange(field, option.value)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-1 ${
              data[field] === option.value
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!canStartAssessment) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
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

        {/* 프리미엄 구독 필요 메시지 */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-vip-crown-line text-2xl text-orange-600"></i>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">프리미엄 구독 필요</h3>
            <p className="text-sm text-gray-600 mb-4">무료 체험이 완료되었습니다</p>
            <Link 
              to="/pricing"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              프리미엄 구독하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      {/* 메인 콘텐츠 - 한 화면에 모든 검사 항목 */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        
        {/* 검사 진행 영역 */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          
          {/* 기본 정보 섹션 */}
          <div className="bg-white rounded-lg p-3 space-y-2">
            <h3 className="text-sm font-bold text-black mb-2">기본 정보</h3>

            {renderSelectField('성별', 'gender', [
              { value: 'male', label: '남' },
              { value: 'female', label: '여' }
            ])}

            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-gray-800 w-12 flex-shrink-0">나이</label>
              <input
                type="number"
                value={data.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="나이"
                className="flex-1 p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                min="1"
                max="120"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-gray-800 w-12 flex-shrink-0">키</label>
              <input
                type="number"
                value={data.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="cm"
                className="flex-1 p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                min="100"
                max="250"
              />
              <span className="text-xs text-gray-500">cm</span>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-gray-800 w-12 flex-shrink-0">몸무게</label>
              <input
                type="number"
                value={data.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="kg"
                className="flex-1 p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                min="20"
                max="300"
              />
              <span className="text-xs text-gray-500">kg</span>
            </div>

            {data.height && data.weight && (
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-800">BMI</span>
                  <span className="text-xs font-semibold text-blue-900">{calculateBMI()}</span>
                </div>
              </div>
            )}
          </div>

          {/* 생체 정보 섹션 */}
          <div className="bg-white rounded-lg p-3 space-y-2">
            <h3 className="text-sm font-bold text-black mb-2">생체 정보</h3>

            {renderSelectField('체온', 'bodyTemperature', [
              { value: 'low', label: '낮음' },
              { value: 'normal', label: '보통' },
              { value: 'high', label: '높음' }
            ])}

            {renderSelectField('호흡상태', 'breathing', [
              { value: 'slow', label: '느림' },
              { value: 'normal', label: '보통' },
              { value: 'fast', label: '빠름' }
            ])}

            {/* 맥박 입력 */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-gray-800 w-12 flex-shrink-0">맥박</label>
              <input
                type="number"
                value={data.pulse}
                onChange={(e) => handleInputChange('pulse', e.target.value)}
                placeholder="분당 맥박수"
                className="flex-1 p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                min="30"
                max="200"
              />
              <button
                onClick={() => setShowPulseModal(true)}
                className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="맥박 측정 타이머"
              >
                <i className="ri-timer-line text-sm"></i>
              </button>
              <span className="text-xs text-gray-500">분당</span>
            </div>
          </div>

          {/* 증상 체크 섹션 */}
          <div className="bg-white rounded-lg p-3">
            <h3 className="text-sm font-bold text-black mb-2">증상 체크</h3>
            <div className="space-y-2">
              {renderYesNoField('가슴 통증', 'chestPain')}
              {renderYesNoField('옆구리 통증', 'flankPain')}
              {renderYesNoField('발 통증', 'footPain')}
              {renderYesNoField('발 부종', 'edemaLegs')}
              {renderYesNoField('호흡곤란', 'dyspnea')}
              {renderYesNoField('어지러움(실신)', 'syncope')}
              {renderYesNoField('피로감', 'weakness')}
              {renderYesNoField('구토', 'vomiting')}
              {renderYesNoField('심장 두근거림', 'palpitation')}
              {renderYesNoField('어지러움', 'dizziness')}
            </div>
          </div>

          {/* 검사 완료 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full h-10 rounded-lg text-sm font-medium transition-colors ${
              isFormValid()
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            분석하다
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="h-4"></div>
      </div>

      {/* 맥박 측정 모달 */}
      {showPulseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">맥박 측정</h3>
              <button
                onClick={() => setShowPulseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-center flex-1 mb-4">
                <div className="text-4xl font-bold text-black">{pulseTimer.seconds}초</div>
                <div className="text-sm text-gray-600">남은 시간</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-4xl font-bold text-red-500">{pulseTimer.count}회</div>
                <div className="text-sm text-gray-600">맥박 수</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={togglePulseTimer}
                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                  pulseTimer.isRunning
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {pulseTimer.isRunning ? '정지' : '1분 타이머 시작'}
              </button>
              
              {pulseTimer.isRunning && (
                <button
                  onClick={incrementPulseCount}
                  className="w-full py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  맥박 카운트 +1
                </button>
              )}
              
              <button
                onClick={resetPulseTimer}
                className="w-full py-3 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
              >
                리셋
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
