
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalAssessments: number;
  todayAssessments: number;
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 12450000,
    monthlyRevenue: 2340000,
    totalAssessments: 5678,
    todayAssessments: 23
  });

  const menuItems = [
    {
      title: '사용자 관리',
      description: '사용자 생성, 수정, 삭제, 조회 및 권한 관리',
      icon: 'ri-user-settings-line',
      path: '/admin/users',
      color: 'from-blue-500 to-blue-600',
      stats: '1,247명'
    },
    {
      title: '알림 관리',
      description: '전체 사용자 대상 일괄 알림 발송 및 읽음 현황 관리',
      icon: 'ri-notification-3-line',
      path: '/admin/notifications',
      color: 'from-teal-500 to-teal-600',
      stats: '12건 발송'
    },
    {
      title: '결제 관리',
      description: '결제 내역 조회, 환불 처리 및 결제 시스템 관리',
      icon: 'ri-bank-card-line',
      path: '/admin/payments',
      color: 'from-green-500 to-green-600',
      stats: '₩234만'
    },
    {
      title: '매출 분석',
      description: '일/월/분기/연도별 매출 통계 및 트렌드 분석',
      icon: 'ri-line-chart-line',
      path: '/admin/revenue',
      color: 'from-purple-500 to-purple-600',
      stats: '₩1,245만'
    },
    {
      title: '검사 관리',
      description: '검사 결과 조회, 통계 분석 및 데이터 내보내기',
      icon: 'ri-file-list-3-line',
      path: '/admin/assessments',
      color: 'from-orange-500 to-orange-600',
      stats: '5,678건'
    },
    {
      title: '진단 데이터',
      description: '진단 알고리즘 관리 및 정확도 분석',
      icon: 'ri-health-book-line',
      path: '/admin/diagnoses',
      color: 'from-red-500 to-red-600',
      stats: '98.5%'
    },
    {
      title: '시스템 관리',
      description: '공지사항, 버전 관리 및 시스템 모니터링',
      icon: 'ri-settings-3-line',
      path: '/admin/system',
      color: 'from-indigo-500 to-indigo-600',
      stats: '정상'
    }
  ];

  const recentActivities = [
    {
      type: 'notification',
      title: '일괄 알림 발송',
      description: '시스템 점검 안내 알림이 전체 사용자에게 발송되었습니다.',
      time: '3분 전',
      icon: 'ri-notification-3-line',
      color: 'bg-teal-500'
    },
    {
      type: 'user',
      title: '새 사용자 가입',
      description: '김철수님이 프리미엄 계정으로 가입했습니다.',
      time: '5분 전',
      icon: 'ri-user-add-line',
      color: 'bg-green-500'
    },
    {
      type: 'assessment',
      title: '검사 완료',
      description: '우울증 검사 23건이 완료되었습니다.',
      time: '12분 전',
      icon: 'ri-file-chart-line',
      color: 'bg-blue-500'
    },
    {
      type: 'payment',
      title: '결제 완료',
      description: '월간 구독 결제 12건이 처리되었습니다.',
      time: '1시간 전',
      icon: 'ri-bank-card-line',
      color: 'bg-purple-500'
    }
  ];

  const handleLogout = () => {
    console.log('로그아웃');
    // 로그아웃 로직 구현 예정
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
            logo
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-900 bg-gray-100 rounded-lg">
              <i className="ri-dashboard-line mr-3"></i>
              대시보드
            </Link>
            <Link to="/admin/users" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-user-settings-line mr-3"></i>
              사용자 관리
            </Link>
            <Link to="/admin/notifications" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-notification-3-line mr-3"></i>
              알림 관리
            </Link>
            <Link to="/admin/payments" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-bank-card-line mr-3"></i>
              결제 관리
            </Link>
            <Link to="/admin/assessments" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-file-list-3-line mr-3"></i>
              검사 관리
            </Link>
          </div>
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="ml-64">
        {/* 상단 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
                <p className="text-gray-600 mt-1">시스템 전체 현황을 모니터링하고 관리하세요</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <i className="ri-time-line"></i>
                  <span>마지막 업데이트: 방금 전</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <i className="ri-logout-circle-line mr-2"></i>
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 대시보드 콘텐츠 */}
        <div className="px-8 py-8">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <i className="ri-arrow-up-line mr-1"></i>
                    활성: {stats.activeUsers.toLocaleString()}명
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 매출</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">₩{(stats.totalRevenue / 10000).toFixed(0)}만</p>
                  <p className="text-sm text-green-600 mt-1">
                    <i className="ri-arrow-up-line mr-1"></i>
                    이번 달: ₩{(stats.monthlyRevenue / 10000).toFixed(0)}만
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 검사 수</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAssessments.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    <i className="ri-arrow-up-line mr-1"></i>
                    오늘: {stats.todayAssessments}건
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i className="ri-file-chart-line text-2xl text-purple-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">시스템 상태</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">정상</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <i className="ri-check-line mr-1"></i>
                    모든 서비스 가동중
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="ri-shield-check-line text-2xl text-green-600"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 관리 메뉴 */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">관리 메뉴</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item, index) => (
                  <Link key={index} to={item.path}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                          <i className={`${item.icon} text-xl text-white`}></i>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">{item.stats}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <span>관리하기</span>
                        <i className="ri-arrow-right-line ml-2"></i>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 최근 활동 */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <i className={`${activity.icon} text-white`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link to="/admin/activities" className="flex items-center justify-center text-sm text-blue-600 font-medium hover:text-blue-700">
                    <span>모든 활동 보기</span>
                    <i className="ri-arrow-right-line ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
