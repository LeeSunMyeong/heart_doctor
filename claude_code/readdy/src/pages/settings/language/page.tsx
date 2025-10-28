import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  const languages = [
    { code: 'ko', name: '한국어', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleSave = () => {
    console.log('언어 설정 저장:', selectedLanguage);
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
          <h1 className="text-lg font-semibold text-black">언어 설정</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        <div className="space-y-6">
          {/* 언어 선택 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">언어 선택</h4>
              <p className="text-xs text-gray-500 mt-1">앱에서 사용할 언어를 선택하세요</p>
            </div>
            <div className="divide-y divide-gray-200">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <i className="ri-global-line text-lg text-gray-600 mr-3"></i>
                    <div className="text-left">
                      <span className="text-gray-800 block">{language.nativeName}</span>
                      <span className="text-xs text-gray-500">{language.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedLanguage === language.code && (
                      <i className="ri-check-line text-black mr-2"></i>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedLanguage === language.code 
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedLanguage === language.code && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 언어 변경 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-600 mr-3 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">언어 변경 안내</h4>
                <p className="text-xs text-blue-700">
                  언어를 변경하면 앱의 모든 텍스트가 선택한 언어로 표시됩니다. 
                  변경사항은 앱을 재시작한 후 적용됩니다.
                </p>
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