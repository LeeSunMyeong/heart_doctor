
import { useState, useEffect, useRef } from 'react';
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

interface VoiceAssessmentState {
  isConnected: boolean;
  isListening: boolean;
  currentField: number;
  data: AssessmentData;
  aiSpeaking: boolean;
  userSpeaking: boolean;
  conversationLog: Array<{
    type: 'ai' | 'user';
    text: string;
    timestamp: Date;
  }>;
}

const assessmentFields = [
  { key: 'gender', question: '성별을 알려주세요. 남성인지 여성인지 말씀해주세요.', type: 'select' },
  { key: 'age', question: '나이를 알려주세요.', type: 'number' },
  { key: 'height', question: '키를 센티미터 단위로 알려주세요.', type: 'number' },
  { key: 'weight', question: '몸무게를 킬로그램 단위로 알려주세요.', type: 'number' },
  { key: 'bodyTemperature', question: '현재 체온 상태는 어떠신가요? 낮음, 보통, 높음 중에서 말씀해주세요.', type: 'select' },
  { key: 'breathing', question: '호흡상태는 어떠신가요? 느림, 보통, 빠름 중에서 말씀해주세요.', type: 'select' },
  { key: 'pulse', question: '분당 맥박수를 세어서 알려주세요.', type: 'number' },
  { key: 'chestPain', question: '가슴 통증이 있으신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'flankPain', question: '옆구리나 등 쪽에 통증이 있으신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'footPain', question: '발에 통증이 있으신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'edemaLegs', question: '발이나 다리에 부종이 있으신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'dyspnea', question: '호흡곤란을 느끼고 계신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'syncope', question: '어지러움이나 실신을 경험하신 적이 있나요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'weakness', question: '피로감을 느끼고 계신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'vomiting', question: '구토 증상이 있으신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'palpitation', question: '심장이 두근거리는 증상이 있나요? 예 또는 아니오로 답변해주세요.', type: 'yesno' },
  { key: 'dizziness', question: '어지러움을 느끼고 계신가요? 예 또는 아니오로 답변해주세요.', type: 'yesno' }
];

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

export default function VoiceAssessment() {
  const [state, setState] = useState<VoiceAssessmentState>({
    isConnected: false,
    isListening: false,
    currentField: 0,
    data: initialData,
    aiSpeaking: false,
    userSpeaking: false,
    conversationLog: []
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // 연결 시뮬레이션
    setTimeout(() => {
      setConnectionStatus('connected');
      addToConversationLog('ai', '안녕하세요! 심장관련 건강지표 검사를 시작하겠습니다. 총 17개의 항목에 대해 질문드리겠습니다. 편안하게 답변해주세요.');
    }, 2000);

    // 텍스트 검사에서 넘어온 데이터 복원
    const savedData = localStorage.getItem('assessmentData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setState(prev => ({
        ...prev,
        data: parsedData
      }));
      localStorage.removeItem('assessmentData');
    }

    // OpenAI Realtime API 연결 시뮬레이션
    if (state.isConnected) {
      // 첫 질문 자동 시작
      setTimeout(() => {
        askCurrentQuestion();
      }, 1000);
    }
  }, []);

  const connectToRealtimeAPI = async () => {
    setConnectionStatus('connecting');
    console.log('OpenAI Realtime API 연결 중...');
    
    // 시뮬레이션
    setTimeout(() => {
      setState(prev => ({ ...prev, isConnected: true }));
      setConnectionStatus('connected');
      addToConversationLog('ai', '안녕하세요! 심장질환 검사를 시작하겠습니다. 총 17개의 항목에 대해 질문드리겠습니다. 편안하게 답변해주세요.');
    }, 2000);
  };

  const disconnectFromAPI = () => {
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isListening: false,
      aiSpeaking: false,
      userSpeaking: false
    }));
    setConnectionStatus('disconnected');
  };

  const askCurrentQuestion = () => {
    const currentFieldData = assessmentFields[state.currentField];
    setState(prev => ({ ...prev, aiSpeaking: true }));
    addToConversationLog('ai', currentFieldData.question);
    
    // TTS 시뮬레이션
    setTimeout(() => {
      setState(prev => ({ ...prev, aiSpeaking: false, isListening: true }));
    }, 3000);
  };

  const handleUserResponse = (response: string) => {
    const currentFieldData = assessmentFields[state.currentField];
    const newData = { ...state.data };
    
    // 응답 처리 및 변환
    let processedResponse = response.toLowerCase().trim();
    
    if (currentFieldData.type === 'yesno') {
      if (processedResponse.includes('예') || processedResponse.includes('네') || processedResponse.includes('있') || processedResponse.includes('yes')) {
        processedResponse = 'yes';
      } else if (processedResponse.includes('아니') || processedResponse.includes('없') || processedResponse.includes('no')) {
        processedResponse = 'no';
      }
    } else if (currentFieldData.type === 'select') {
      if (currentFieldData.key === 'gender') {
        if (processedResponse.includes('남') || processedResponse.includes('male')) {
          processedResponse = 'male';
        } else if (processedResponse.includes('여') || processedResponse.includes('female')) {
          processedResponse = 'female';
        }
      } else if (currentFieldData.key === 'bodyTemperature') {
        if (processedResponse.includes('높') || processedResponse.includes('high')) {
          processedResponse = 'high';
        } else if (processedResponse.includes('낮') || processedResponse.includes('low')) {
          processedResponse = 'low';
        } else {
          processedResponse = 'normal';
        }
      } else if (currentFieldData.key === 'breathing') {
        if (processedResponse.includes('빠') || processedResponse.includes('fast')) {
          processedResponse = 'fast';
        } else if (processedResponse.includes('느') || processedResponse.includes('slow')) {
          processedResponse = 'slow';
        } else {
          processedResponse = 'normal';
        }
      }
    }
    
    newData[currentFieldData.key as keyof AssessmentData] = processedResponse;
    
    setState(prev => ({ 
      ...prev, 
      data: newData,
      userSpeaking: false,
      isListening: false
    }));
    
    addToConversationLog('user', response);

    // 다음 질문으로 진행
    setTimeout(() => {
      if (state.currentField < assessmentFields.length - 1) {
        setState(prev => ({ ...prev, currentField: prev.currentField + 1 }));
        setTimeout(() => {
          askCurrentQuestion();
        }, 500);
      } else {
        // 검사 완료
        const bmi = calculateBMI(newData);
        addToConversationLog('ai', `검사가 완료되었습니다. BMI는 ${bmi}입니다. 결과를 분석 중입니다...`);
        setTimeout(() => {
          window.REACT_APP_NAVIGATE('/result');
        }, 2000);
      }
    }, 1000);
  };

  const calculateBMI = (data: AssessmentData) => {
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const weightKg = parseFloat(data.weight);
      return (weightKg / (heightM * heightM)).toFixed(1);
    }
    return '';
  };

  const addToConversationLog = (type: 'ai' | 'user', text: string) => {
    setState(prev => ({
      ...prev,
      conversationLog: [...prev.conversationLog, {
        type,
        text,
        timestamp: new Date()
      }]
    }));
  };

  const switchToTextMode = () => {
    // 현재 진행 상황을 저장
    localStorage.setItem('assessmentData', JSON.stringify(state.data));
    window.REACT_APP_NAVIGATE('/assessment');
  };

  const generateTestResponse = () => {
    const currentFieldData = assessmentFields[state.currentField];
    let testResponse = '';
    
    switch (currentFieldData.type) {
      case 'yesno':
        testResponse = Math.random() > 0.5 ? '예' : '아니오';
        break;
      case 'select':
        if (currentFieldData.key === 'gender') {
          testResponse = Math.random() > 0.5 ? '남성' : '여성';
        } else if (currentFieldData.key === 'bodyTemperature') {
          testResponse = ['낮음', '보통', '높음'][Math.floor(Math.random() * 3)];
        } else if (currentFieldData.key === 'breathing') {
          testResponse = ['느림', '보통', '빠름'][Math.floor(Math.random() * 3)];
        }
        break;
      case 'number':
        if (currentFieldData.key === 'age') {
          testResponse = (Math.floor(Math.random() * 50) + 20).toString();
        } else if (currentFieldData.key === 'height') {
          testResponse = (Math.floor(Math.random() * 40) + 150).toString();
        } else if (currentFieldData.key === 'weight') {
          testResponse = (Math.floor(Math.random() * 50) + 50).toString();
        } else if (currentFieldData.key === 'pulse') {
          testResponse = (Math.floor(Math.random() * 60) + 60).toString();
        }
        break;
    }
    
    return testResponse;
  };

  const simulateUserResponse = () => {
    const testResponse = generateTestResponse();
    handleUserResponse(testResponse);
  };

  const progress = ((state.currentField + 1) / assessmentFields.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-12 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <i className="ri-arrow-left-line text-2xl text-black"></i>
          </Link>
          <h1 className="text-lg font-semibold text-black">심장관련 건강지표 검사</h1>
          <div className="flex items-center space-x-2">
            <Link to="/settings" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="ri-settings-3-line text-xl text-gray-700"></i>
            </Link>
            <Link to="/pricing" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="ri-bank-card-line text-xl text-gray-700"></i>
            </Link>
            <Link to="/notifications" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative">
              <i className="ri-notification-3-line text-xl text-gray-700"></i>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </Link>
            <Link to="/history" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="ri-history-line text-xl text-gray-700"></i>
            </Link>
            <button
              onClick={switchToTextMode}
              className="text-black hover:text-gray-600 transition-colors"
              title="텍스트 검사로 전환"
            >
              <i className="ri-file-text-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-32">
        {connectionStatus === 'connecting' ? (
          /* 연결 중 화면 */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <i className="ri-mic-line text-3xl text-blue-600"></i>
            </div>
            <h2 className="text-xl font-bold text-black mb-4">AI 연결 중...</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              AI와 실시간 대화를 통해 심장관련 건강지표 검사를 진행합니다.<br/>
              총 17개의 항목에 대해 질문드리겠습니다.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          /* 대화 화면 */
          <div className="flex flex-col h-full">
            {/* 대화 내역 */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4">
              {state.conversationLog.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-black'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 음성 컨트롤 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <button
                  onClick={() => simulateUserResponse()}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    state.isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <i className={`text-2xl ${state.isListening ? 'ri-stop-line' : 'ri-mic-line'}`}></i>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-black mb-1">
                  {state.isListening ? '녹음 중...' : '말하기 버튼을 눌러주세요'}
                </p>
                <p className="text-xs text-gray-600">
                  {state.isListening ? '답변을 말씀해주세요' : 'AI가 질문을 기다리고 있습니다'}
                </p>
              </div>

              {/* 진행률 표시 */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">검사 진행률</span>
                  <span className="text-xs font-medium text-black">{Math.round((state.conversationLog.filter(log => log.type === 'user').length / 17) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(state.conversationLog.filter(log => log.type === 'user').length / 17) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 모드 전환 안내 */}
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-center mb-2">
                <i className="ri-arrow-left-right-line text-blue-600 mr-2"></i>
                <span className="text-sm font-medium text-blue-800">검사 방식 전환</span>
              </div>
              <p className="text-xs text-blue-600 mb-3 text-center">
                언제든지 텍스트와 음성 검사를 전환할 수 있습니다
              </p>
              <button
                onClick={switchToTextMode}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                텍스트 입력 모드로 전환
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 완료 버튼 (대화가 충분히 진행된 경우) */}
      {state.conversationLog.filter(log => log.type === 'user').length >= 10 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={() => window.REACT_APP_NAVIGATE('/result')}
            className="w-full h-12 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
          >
            분석하다
          </button>
        </div>
      )}
    </div>
  );
}
