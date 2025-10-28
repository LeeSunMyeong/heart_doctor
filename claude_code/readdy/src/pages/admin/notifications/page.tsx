
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  sentAt: string;
  readCount: number;
  totalUsers: number;
  status: 'draft' | 'sent';
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '시스템 점검 안내',
      message: '2024년 3월 15일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.',
      type: 'warning',
      sentAt: '2024-03-10 14:30:00',
      readCount: 892,
      totalUsers: 1247,
      status: 'sent'
    },
    {
      id: '2',
      title: '새로운 기능 업데이트',
      message: '음성 검사 기능이 추가되었습니다. 더욱 편리한 검사를 경험해보세요!',
      type: 'success',
      sentAt: '2024-03-08 10:15:00',
      readCount: 1156,
      totalUsers: 1247,
      status: 'sent'
    },
    {
      id: '3',
      title: '보안 업데이트 완료',
      message: '사용자 데이터 보안 강화를 위한 업데이트가 완료되었습니다.',
      type: 'info',
      sentAt: '2024-03-05 16:45:00',
      readCount: 1023,
      totalUsers: 1200,
      status: 'sent'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ri-information-line';
      case 'warning': return 'ri-alert-line';
      case 'success': return 'ri-check-line';
      case 'urgent': return 'ri-error-warning-line';
      default: return 'ri-information-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'success': return 'bg-green-100 text-green-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) return;

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      sentAt: new Date().toLocaleString('ko-KR'),
      readCount: 0,
      totalUsers: 1247,
      status: 'sent'
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info' });
    setShowCreateModal(false);
    
    console.log('알림 발송:', notification);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
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
            <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-dashboard-line mr-3"></i>
              대시보드
            </Link>
            <Link to="/admin/users" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-user-settings-line mr-3"></i>
              사용자 관리
            </Link>
            <Link to="/admin/notifications" className="flex items-center px-4 py-3 text-gray-900 bg-gray-100 rounded-lg">
              <i className="ri-notification-3-line mr-3"></i>
              알림 관리
            </Link>
            <Link to="/admin/payments" className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-bank-card-line mr-3"></i>
              결제 관리
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
                <h1 className="text-3xl font-bold text-gray-900">알림 관리</h1>
                <p className="text-gray-600 mt-1">전체 사용자에게 일괄 알림을 발송하고 관리하세요</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                새 알림 만들기
              </button>
            </div>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">발송된 알림</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)} mr-3`}>
                          <i className={`${getTypeIcon(notification.type)} text-sm`}></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        <div className={`ml-3 w-2 h-2 rounded-full ${getTypeBadge(notification.type)}`}></div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 ml-11">{notification.message}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 ml-11">
                        <div className="flex items-center mr-6">
                          <i className="ri-time-line mr-1"></i>
                          <span>{notification.sentAt}</span>
                        </div>
                        <div className="flex items-center mr-6">
                          <i className="ri-eye-line mr-1"></i>
                          <span>{notification.readCount}/{notification.totalUsers} 읽음</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(notification.readCount / notification.totalUsers) * 100}%` }}
                            ></div>
                          </div>
                          <span>{Math.round((notification.readCount / notification.totalUsers) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 새 알림 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">새 알림 만들기</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">알림 제목</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="알림 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">알림 내용</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="알림 내용을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">알림 유형</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'info', label: '정보', icon: 'ri-information-line', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                    { value: 'success', label: '성공', icon: 'ri-check-line', color: 'border-green-500 bg-green-50 text-green-700' },
                    { value: 'warning', label: '경고', icon: 'ri-alert-line', color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
                    { value: 'urgent', label: '긴급', icon: 'ri-error-warning-line', color: 'border-red-500 bg-red-50 text-red-700' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewNotification({ ...newNotification, type: type.value as any })}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        newNotification.type === type.value
                          ? type.color
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`${type.icon} mr-2`}></i>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message}
                className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                발송하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
