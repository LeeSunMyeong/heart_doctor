
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ResultData {
  id: number;
  date: string;
  type: string;
  isNormal: boolean;
  summary: string;
  recommendations: string[];
}

export default function Result() {
  const { id } = useParams();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  
  // 로그인 상태 관리
  const [isLoggedIn] = useState(true);

  // 모든 검사 결과 데이터
  const allResults: ResultData[] = [
    {
      id: 1,
      date: '2024-01-15',
      type: '심장질환 종합 검사',
      isNormal: false,
      summary: '심장관련 건강지표에서 이상 소견이 발견되었습니다. 전문의 상담을 받으시기 바랍니다.',
      recommendations: [
        '심장내과 전문의 진료를 받으시기 바랍니다',
        '심전도 및 심장초음파 검사를 권합니다',
        '금연과 금주를 실천하세요',
        '저염식 식단과 규칙적인 운동을 시작하세요',
        '스트레스 관리와 충분한 휴식을 취하세요'
      ]
    },
    {
      id: 2,
      date: '2024-01-08',
      type: '심장질환 종합 검사',
      isNormal: true,
      summary: '고객의 심장 관련 건강지표는 일반적인 경향을 보입니다.',
      recommendations: [
        '현재의 건강한 생활습관을 유지하세요',
        '정기적인 건강검진을 받으시기 바랍니다',
        '균형잡힌 식단과 적절한 운동을 계속하세요',
        '금연과 절주를 실천하세요',
        '스트레스를 적절히 관리하세요'
      ]
    },
    {
      id: 3,
      date: '2024-01-01',
      type: '심장질환 종합 검사',
      isNormal: false,
      summary: '심장관련 건강지표에서 높은 위험도가 감지되었습니다. 즉시 전문의 진료를 받으시기 바랍니다.',
      recommendations: [
        '즉시 심장내과 응급진료를 받으세요',
        '관상동맥조영술 등 정밀검사가 필요합니다',
        '약물치료나 시술이 필요할 수 있습니다',
        '절대 금연과 금주를 실천하세요',
        '응급상황 시 119에 즉시 신고하세요'
      ]
    }
  ];

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 로직
      console.log('로그아웃');
    } else {
      window.REACT_APP_NAVIGATE('/login');
    }
  };

  useEffect(() => {
    if (id) {
      const result = allResults.find(r => r.id === parseInt(id));
      setResultData(result || null);
    } else {
      // ID가 없으면 가장 최근 결과 표시
      setResultData(allResults[0]);
    }
  }, [id]);

  if (!resultData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-heart-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-500">검사 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm px-4 pt-12 pb-2 shadow-sm">
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
          <Link to="/" className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm">
            <i className="ri-arrow-left-line text-lg text-gray-700"></i>
          </Link>
          
          <h1 className="text-lg font-semibold text-black">검사 결과</h1>
          
          <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center text-center">
        {/* 심장 이미지 */}
        <div className="mb-8">
          <img 
            src={resultData.isNormal 
              ? "https://readdy.ai/api/search-image?query=Digital%20heart%20with%20glowing%20red%20and%20blue%20particles%2C%20futuristic%20medical%20visualization%2C%203D%20rendered%20heart%20with%20data%20streams%20and%20light%20effects%2C%20dark%20blue%20background%20with%20floating%20particles%2C%20high-tech%20medical%20concept%2C%20realistic%203D%20rendering&width=300&height=200&seq=heart-result&orientation=landscape"
              : "https://readdy.ai/api/search-image?query=Digital%20heart%20with%20warning%20red%20glow%20and%20alert%20particles%2C%20medical%20emergency%20visualization%2C%203D%20rendered%20heart%20with%20danger%20signals%20and%20warning%20effects%2C%20dark%20red%20background%20with%20floating%20warning%20particles%2C%20urgent%20medical%20concept%2C%20realistic%203D%20rendering&width=300&height=200&seq=heart-abnormal&orientation=landscape"
            }
            alt="Heart Analysis"
            className="w-80 h-52 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* 결과 텍스트 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-4">
            고객의 심장 관련 건강지표는<br />
            {resultData.isNormal ? '일반적인 경향을 보입니다.' : '일반적인 경향과 차이를 보입니다.'}
          </h1>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">
              ※ 본 결과는 참고용 자동 분석<br />
              결과이며, 질병 진단이나 치료를<br />
              위한 것이 아닙니다. 건강 관련<br />
              진단이나 판단은 전문가와<br />
              상담하시기 바랍니다.
            </p>
          </div>
        </div>

      </div>

      {/* 하단 액션 버튼 */}
      <div className="px-6 pb-8">
        <Link to="/">
          <button className="w-full h-12 bg-black text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors shadow-lg">
            새 검사 시작하기
          </button>
        </Link>
      </div>
    </div>
  );
}