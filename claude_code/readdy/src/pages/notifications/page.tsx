
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  receivedAt: string;
  isRead: boolean;
}

export default function Notifications() {
  // 로그인 상태 관리
  const [isLoggedIn] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '시스템 점검 안내',
      message: '2024년 3월 15일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다. 이용에 불편을 드려 죄송합니다.',
      type: 'warning',
      receivedAt: '2024-03-10 14:30:00',
      isRead: false
    },
    {
      id: '2',
      title: '새로운 기능 업데이트',
      message: '음성 검사 기능이 추가되었습니다. 더욱 편리한 검사를 경험해보세요!',
      type: 'success',
      receivedAt: '2024-03-08 10:15:00',
      isRead: true
    },
    {
      id: '3',
      title: '보안 업데이트 완료',
      message: '사용자 데이터 보안 강화를 위한 업데이트가 완료되었습니다.',
      type: 'info',
      receivedAt: '2024-03-05 16:45:00',
      isRead: true
    },
    {
      id: '4',
      title: '프리미엄 구독 혜택 안내',
      message: '프리미엄 구독 시 무제한 검사와 상세한 분석 리포트를 받아보실 수 있습니다.',
      type: 'info',
      receivedAt: '2024-03-03 09:20:00',
      isRead: false
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 로직
      console.log('로그아웃');
    } else {
      window.REACT_APP_NAVIGATE('/login');
    }
  };

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

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 pt-12 pb-2 shadow-sm">
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

        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="ri-arrow-left-line text-lg text-gray-700"></i>
          </Link>
          <div></div>
          <div></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-black mb-1">알림</h1>
            <p className="text-sm text-gray-600">새로운 소식을 확인하세요</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 font-medium"
            >
              모두 읽음
            </button>
          )}
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            전체 ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            읽지 않음 ({unreadCount})
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <i className="ri-notification-off-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </h3>
            <p className="text-gray-500 text-center">
              {filter === 'unread' 
                ? '모든 알림을 확인했습니다' 
                : '새로운 알림이 있으면 여기에 표시됩니다'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)} mr-4 flex-shrink-0`}>
                    <i className={`${getTypeIcon(notification.type)} text-lg`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-base font-semibold ${!notification.isRead ? 'text-black' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2 flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(notification.receivedAt)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 font-medium hover:text-blue-700"
                          >
                            읽음 표시
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs text-gray-400 hover:text-red-600"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
