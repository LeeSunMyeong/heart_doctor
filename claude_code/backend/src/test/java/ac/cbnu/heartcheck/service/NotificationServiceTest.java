package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.Notification;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.ResourceNotFoundException;
import ac.cbnu.heartcheck.repository.NotificationRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * NotificationService 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService 테스트")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User testUser;
    private Notification testNotification;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();

        testNotification = Notification.builder()
                .id(1L)
                .user(testUser)
                .type(Notification.NotificationType.HEALTH)
                .title("건강 검진 알림")
                .message("정기 건강 검진을 받으세요")
                .isRead(false)
                .priority(Notification.Priority.NORMAL.getLevel())
                .sentTime(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("알림 생성")
    void createNotification_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.createNotification(
                1L, Notification.NotificationType.HEALTH, "건강 검진 알림", "정기 건강 검진을 받으세요");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("알림 생성 - 사용자 없음")
    void createNotification_UserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> notificationService.createNotification(
                1L, Notification.NotificationType.HEALTH, "제목", "메시지"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("알림 생성 (전체 옵션)")
    void createNotificationWithOptions_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
        LocalDateTime scheduledTime = LocalDateTime.now().plusHours(1);

        // When
        Notification result = notificationService.createNotificationWithOptions(
                1L, Notification.NotificationType.HEALTH, "제목", "메시지",
                "/health-check", Notification.Priority.HIGH, scheduledTime);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("알림 ID로 조회")
    void getNotificationById_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));

        // When
        Notification result = notificationService.getNotificationById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(notificationRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("알림 ID로 조회 - 없음")
    void getNotificationById_NotFound() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> notificationService.getNotificationById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("알림을 찾을 수 없습니다");
    }

    @Test
    @DisplayName("사용자 알림 목록 조회")
    void getUserNotifications_Success() {
        // Given
        Page<Notification> page = new PageImpl<>(Arrays.asList(testNotification));
        when(notificationRepository.findByUserId(eq(1L), any(Pageable.class))).thenReturn(page);

        // When
        Page<Notification> result = notificationService.getUserNotifications(1L, PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(notificationRepository, times(1)).findByUserId(eq(1L), any(Pageable.class));
    }

    @Test
    @DisplayName("읽지 않은 알림 조회")
    void getUnreadNotifications_Success() {
        // Given
        Page<Notification> page = new PageImpl<>(Arrays.asList(testNotification));
        when(notificationRepository.findUnreadByUserId(eq(1L), any(Pageable.class))).thenReturn(page);

        // When
        Page<Notification> result = notificationService.getUnreadNotifications(1L, PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(notificationRepository, times(1)).findUnreadByUserId(eq(1L), any(Pageable.class));
    }

    @Test
    @DisplayName("읽지 않은 알림 개수 조회")
    void getUnreadNotificationCount_Success() {
        // Given
        when(notificationRepository.countUnreadByUserId(1L)).thenReturn(5L);

        // When
        long result = notificationService.getUnreadNotificationCount(1L);

        // Then
        assertThat(result).isEqualTo(5L);
        verify(notificationRepository, times(1)).countUnreadByUserId(1L);
    }

    @Test
    @DisplayName("타입별 알림 조회")
    void getNotificationsByType_Success() {
        // Given
        Page<Notification> page = new PageImpl<>(Arrays.asList(testNotification));
        when(notificationRepository.findByUserIdAndType(eq(1L), eq(Notification.NotificationType.HEALTH),
                any(Pageable.class))).thenReturn(page);

        // When
        Page<Notification> result = notificationService.getNotificationsByType(
                1L, Notification.NotificationType.HEALTH, PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(notificationRepository, times(1)).findByUserIdAndType(
                eq(1L), eq(Notification.NotificationType.HEALTH), any(Pageable.class));
    }

    @Test
    @DisplayName("긴급 알림 조회")
    void getUrgentNotifications_Success() {
        // Given
        when(notificationRepository.findUrgentByUserId(eq(1L), anyInt())).thenReturn(Arrays.asList(testNotification));

        // When
        List<Notification> result = notificationService.getUrgentNotifications(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(notificationRepository, times(1)).findUrgentByUserId(eq(1L), anyInt());
    }

    @Test
    @DisplayName("기간별 알림 조회")
    void getNotificationsByPeriod_Success() {
        // Given
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();
        Page<Notification> page = new PageImpl<>(Arrays.asList(testNotification));
        when(notificationRepository.findByUserIdAndSentTimeBetween(eq(1L), eq(start), eq(end),
                any(Pageable.class))).thenReturn(page);

        // When
        Page<Notification> result = notificationService.getNotificationsByPeriod(
                1L, start, end, PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(notificationRepository, times(1)).findByUserIdAndSentTimeBetween(
                eq(1L), eq(start), eq(end), any(Pageable.class));
    }

    @Test
    @DisplayName("알림 읽음 처리")
    void markAsRead_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.markAsRead(1L);

        // Then
        assertThat(result).isNotNull();
        verify(notificationRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("알림 미읽음 처리")
    void markAsUnread_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.markAsUnread(1L);

        // Then
        assertThat(result).isNotNull();
        verify(notificationRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("모든 알림 읽음 처리")
    void markAllAsRead_Success() {
        // Given
        doNothing().when(notificationRepository).markAllAsReadByUserId(eq(1L), any(LocalDateTime.class));

        // When
        notificationService.markAllAsRead(1L);

        // Then
        verify(notificationRepository, times(1)).markAllAsReadByUserId(eq(1L), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("타입별 알림 읽음 처리")
    void markAllAsReadByType_Success() {
        // Given
        doNothing().when(notificationRepository).markAsReadByTypeAndUserId(
                eq(1L), eq(Notification.NotificationType.HEALTH), any(LocalDateTime.class));

        // When
        notificationService.markAllAsReadByType(1L, Notification.NotificationType.HEALTH);

        // Then
        verify(notificationRepository, times(1)).markAsReadByTypeAndUserId(
                eq(1L), eq(Notification.NotificationType.HEALTH), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("알림 삭제")
    void deleteNotification_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
        doNothing().when(notificationRepository).delete(any(Notification.class));

        // When
        notificationService.deleteNotification(1L);

        // Then
        verify(notificationRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).delete(any(Notification.class));
    }

    @Test
    @DisplayName("오래된 읽은 알림 삭제")
    void deleteOldReadNotifications_Success() {
        // Given
        doNothing().when(notificationRepository).deleteOldReadNotificationsByUserId(
                eq(1L), any(LocalDateTime.class));

        // When
        notificationService.deleteOldReadNotifications(1L);

        // Then
        verify(notificationRepository, times(1)).deleteOldReadNotificationsByUserId(
                eq(1L), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("예약된 알림 발송")
    void sendScheduledNotifications_Success() {
        // Given
        Notification scheduled = Notification.builder()
                .id(2L)
                .user(testUser)
                .type(Notification.NotificationType.REMINDER)
                .title("예약 알림")
                .message("예약된 알림입니다")
                .scheduledTime(LocalDateTime.now().minusHours(1))
                .build();

        when(notificationRepository.findScheduledNotifications(any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(scheduled));
        when(notificationRepository.save(any(Notification.class))).thenReturn(scheduled);

        // When
        int result = notificationService.sendScheduledNotifications();

        // Then
        assertThat(result).isEqualTo(1);
        verify(notificationRepository, times(1)).findScheduledNotifications(any(LocalDateTime.class));
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("오래된 알림 자동 정리")
    void cleanupOldReadNotifications_Success() {
        // Given
        when(notificationRepository.findOldReadNotifications(any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(testNotification));
        doNothing().when(notificationRepository).deleteAll(anyList());

        // When
        int result = notificationService.cleanupOldReadNotifications(30);

        // Then
        assertThat(result).isEqualTo(1);
        verify(notificationRepository, times(1)).findOldReadNotifications(any(LocalDateTime.class));
        verify(notificationRepository, times(1)).deleteAll(anyList());
    }

    @Test
    @DisplayName("알림 타입별 통계 조회")
    void getNotificationStatsByType_Success() {
        // Given
        Object[] stat1 = {Notification.NotificationType.HEALTH, 10L};
        Object[] stat2 = {Notification.NotificationType.PAYMENT, 5L};
        when(notificationRepository.countByTypeAndUserId(1L)).thenReturn(Arrays.asList(stat1, stat2));

        // When
        List<Object[]> result = notificationService.getNotificationStatsByType(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        verify(notificationRepository, times(1)).countByTypeAndUserId(1L);
    }
}
