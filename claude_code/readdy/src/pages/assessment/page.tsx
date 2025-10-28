
import { useState, useEffect } from 'react';
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

export default function Assessment() {
  const [data, setData] = useState<AssessmentData>(initialData);
  const [inputMethod, setInputMethod] = useState<'text' | 'voice' | 'both'>('text');
  
  // 맥박 측정 관련 상태
  const [pulseTimer, setPulseTimer] = useState({
    isRunning: false,
    seconds: 60,
    count: 0
  });

  useEffect(() => {
    // 설정에서 입력 방식 가져오기
    const savedInputMethod = localStorage.getItem('inputMethod') || 'text';
    setInputMethod(savedInputMethod as 'text' | 'voice' | 'both');

    // 음성 입력 방식이면 음성 검사 페이지로 리다이렉트
    if (savedInputMethod === 'voice') {
      window.REACT_APP_NAVIGATE('/assessment/voice');
    }
  }, []);

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
      return (weightKg / (heightM * heightM)).toFixed(1);
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
      window.REACT_APP_NAVIGATE('/result');
    }
  };

  const switchToVoiceMode = () => {
    // 현재 진행 상황을 저장
    localStorage.setItem('assessmentData', JSON.stringify(data));
    window.REACT_APP_NAVIGATE('/assessment/voice');
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

  const renderSelectField = (
    label: string,
    field: keyof AssessmentData,
    options: { value: string; label: string }[]
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleInputChange(field, option.value)}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              data[field] === option.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderYesNoField = (label: string, field: keyof AssessmentData) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: 'yes', label: '예' },
          { value: 'no', label: '아니오' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleInputChange(field, option.value)}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              data[field] === option.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-gray-200">
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
          <button 
            onClick={handleLoginLogout}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <i className={`text-xl text-gray-700 ${isLoggedIn ? 'ri-logout-box-line' : 'ri-login-box-line'}`}></i>
          </button>
        </div>
        
        {/* 제목 */}
        <div className="text-center mb-4">
          <div className="text-xl font-bold text-black" style={{ fontFamily: "Pacifico, serif" }}>
            심장 건강지표 분석 도구
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">심장관련 건강지표 검사</h1>
          <button
            onClick={switchToVoiceMode}
            className="text-black hover:text-gray-600 transition-colors"
            title="음성 검사로 전환"
          >
            <i className="ri-mic-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-32 pb-32">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-black mb-4">기본 정보</h3>
            <div className="space-y-4">
              {/* 성별 */}
              {renderSelectField('성별', 'gender', [
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' }
              ])}

              {/* 나이 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">나이</label>
                <input
                  type="number"
                  value={data.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="나이를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  min="1"
                  max="120"
                />
              </div>

              {/* 키/몸무게 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">키 (cm)</label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="키"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                    min="100"
                    max="250"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">몸무게 (kg)</label>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="몸무게"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                    min="20"
                    max="300"
                  />
                </div>
              </div>

              {/* BMI 표시 */}
              {data.height && data.weight && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">BMI</span>
                    <span className="text-sm font-semibold text-blue-900">{calculateBMI()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 생체 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-black mb-4">생체 정보</h3>
            <div className="space-y-4">
              {/* 체온 상태 */}
              {renderSelectField('체온', 'bodyTemperature', [
                { value: 'low', label: '낮음' },
                { value: 'normal', label: '보통' },
                { value: 'high', label: '높음' }
              ])}

              {/* 호흡 상태 */}
              {renderSelectField('호흡상태', 'breathing', [
                { value: 'slow', label: '느림' },
                { value: 'normal', label: '보통' },
                { value: 'fast', label: '빠름' }
              ])}

              {/* 맥박수 측정 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">맥박수 (분당)</label>
                
                {/* 맥박 측정 도구 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-black">{pulseTimer.seconds}초</div>
                      <div className="text-sm text-gray-600">남은 시간</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-red-500">{pulseTimer.count}회</div>
                      <div className="text-sm text-gray-600">맥박 수</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={togglePulseTimer}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
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
                        className="flex-1 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        맥박 카운트 +1
                      </button>
                    )}
                    
                    <button
                      onClick={resetPulseTimer}
                      className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                    >
                      리셋
                    </button>
                  </div>
                </div>

                {/* 수동 입력 */}
                <input
                  type="number"
                  value={data.pulse}
                  onChange={(e) => handleInputChange('pulse', e.target.value)}
                  placeholder="분당 맥박수를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  min="30"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* 증상 체크 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-black mb-4">증상 체크</h3>
            <div className="space-y-4">
              {renderYesNoField('가슴 통증', 'chestPain')}
              {renderYesNoField('옆구리(등) 통증', 'flankPain')}
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

          {/* 모드 전환 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <i className="ri-arrow-left-right-line text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-800">검사 방식 전환</span>
            </div>
            <p className="text-xs text-blue-600 mb-3 text-center">
              언제든지 텍스트와 음성 검사를 전환할 수 있습니다
            </p>
            <button
              onClick={switchToVoiceMode}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              음성 대화 모드로 전환
            </button>
          </div>
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`w-full h-12 rounded-lg text-base font-medium transition-colors ${
            isFormValid()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          분석하다
        </button>
        
        {!isFormValid() && (
          <p className="text-xs text-gray-500 text-center mt-2">
            모든 항목을 입력해주세요
          </p>
        )}
      </div>
    </div>
  );
}
