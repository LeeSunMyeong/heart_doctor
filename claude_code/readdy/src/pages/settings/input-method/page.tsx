
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function InputMethodSettings() {
  const [selectedMethod, setSelectedMethod] = useState('text');

  const inputMethods = [
    { 
      code: 'text', 
      name: '텍스트 입력', 
      description: '키보드로 직접 텍스트를 입력합니다',
      icon: 'ri-keyboard-line'
    },
    { 
      code: 'voice', 
      name: '음성 입력', 
      description: 'AI와 실시간 대화를 통해 검사를 진행합니다',
      icon: 'ri-mic-line'
    }
  ];

  const handleMethodSelect = (methodCode: string) => {
    setSelectedMethod(methodCode);
  };

  const handleSave = () => {
    console.log('입력 방식 설정 저장:', selectedMethod);
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
          <h1 className="text-lg font-semibold text-black">입력 방식</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        <div className="space-y-6">
          {/* 입력 방식 선택 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">입력 방식 선택</h4>
              <p className="text-xs text-gray-500 mt-1">검사 질문에 답변할 방식을 선택하세요</p>
            </div>
            <div className="divide-y divide-gray-200">
              {inputMethods.map((method) => (
                <button
                  key={method.code}
                  onClick={() => handleMethodSelect(method.code)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <i className={`${method.icon} text-lg text-gray-600 mr-3`}></i>
                    <div className="text-left">
                      <span className="text-gray-800 block">{method.name}</span>
                      <span className="text-xs text-gray-500">{method.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedMethod === method.code && (
                      <i className="ri-check-line text-black mr-2"></i>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === method.code 
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.code && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 입력 방식별 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-lightbulb-line text-blue-600 mr-3 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-2">입력 방식 안내</h4>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">텍스트:</span>
                    <span>정확한 답변이 가능하지만 입력 시간이 소요됩니다</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">음성:</span>
                    <span>AI와 실시간 대화로 빠르고 자연스러운 검사가 가능합니다</span>
                  </div>
                </div>
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
