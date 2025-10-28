import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState('light');

  const themes = [
    { 
      code: 'light', 
      name: '라이트 테마', 
      description: '밝은 배경의 기본 테마',
      preview: 'bg-white border-gray-200'
    },
    { 
      code: 'dark', 
      name: '다크 테마', 
      description: '어두운 배경의 테마 (준비 중)',
      preview: 'bg-gray-900 border-gray-700',
      disabled: true
    },
    { 
      code: 'auto', 
      name: '시스템 설정', 
      description: '기기 설정에 따라 자동 변경 (준비 중)',
      preview: 'bg-gradient-to-br from-white to-gray-900 border-gray-400',
      disabled: true
    }
  ];

  const handleThemeSelect = (themeCode: string) => {
    if (themes.find(t => t.code === themeCode)?.disabled) return;
    setSelectedTheme(themeCode);
  };

  const handleSave = () => {
    console.log('테마 설정 저장:', selectedTheme);
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
          <h1 className="text-lg font-semibold text-black">테마 설정</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 pt-24 pb-24">
        <div className="space-y-6">
          {/* 테마 선택 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">테마 선택</h4>
              <p className="text-xs text-gray-500 mt-1">앱의 외관을 선택하세요</p>
            </div>
            <div className="divide-y divide-gray-200">
              {themes.map((theme) => (
                <button
                  key={theme.code}
                  onClick={() => handleThemeSelect(theme.code)}
                  className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${
                    theme.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
                  }`}
                  disabled={theme.disabled}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg border-2 mr-3 ${theme.preview}`}></div>
                    <div className="text-left">
                      <div className="flex items-center">
                        <span className="text-gray-800">{theme.name}</span>
                        {theme.disabled && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            준비중
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{theme.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedTheme === theme.code && !theme.disabled && (
                      <i className="ri-check-line text-black mr-2"></i>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedTheme === theme.code && !theme.disabled
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedTheme === theme.code && !theme.disabled && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 테마 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-600 mr-3 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">테마 안내</h4>
                <p className="text-xs text-blue-700">
                  다크 테마와 시스템 설정 테마는 현재 개발 중입니다. 
                  곧 업데이트를 통해 제공될 예정입니다.
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
