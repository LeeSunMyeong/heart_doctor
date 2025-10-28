package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.Notification;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.ResourceNotFoundException;
import ac.cbnu.heartcheck.repository.NotificationRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification Service
 * 알림 관리 비즈니스 로직 처리
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * 알림 생성 및 발송
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param title 제목
     * @param message 메시지
     * @return 생성된 알림
     */
    public Notification createNotification(Long userId, Notification.NotificationType type,
                                          String title, String message) {
        log.info("알림 생성: userId={}, type={}, title={}", userId, type, title);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        Notification notification = Notification.builder()
            .user(user)
            .type(type)
            .title(title)
            .message(message)
            .isRead(false)
            .priority(Notification.Priority.NORMAL.getLevel())
            .sentTime(LocalDateTime.now())
            .build();

        Notification savedNotification = notificationRepository.save(notification);
        log.info("알림 생성 완료: notificationId={}", savedNotification.getId());
        return savedNotification;
    }

    /**
     * 알림 생성 (전체 옵션)
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param title 제목
     * @param message 메시지
     * @param url 액션 URL
     * @param priority 우선순위
     * @param scheduledTime 예약 시간
     * @return 생성된 알림
     */
    public Notification createNotificationWithOptions(Long userId, Notification.NotificationType type,
                                                     String title, String message, String url,
                                                     Notification.Priority priority, LocalDateTime scheduledTime) {
        log.info("알림 생성(옵션): userId={}, type={}, priority={}", userId, type, priority);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        Notification notification = Notification.builder()
            .user(user)
            .type(type)
            .title(title)
            .message(message)
            .url(url)
            .isRead(false)
            .priority(priority != null ? priority.getLevel() : Notification.Priority.NORMAL.getLevel())
            .scheduledTime(scheduledTime)
            .sentTime(scheduledTime == null ? LocalDateTime.now() : null)
            .build();

        return notificationRepository.save(notification);
    }

    /**
     * 알림 ID로 조회
     * @param notificationId 알림 ID
     * @return 알림
     */
    @Transactional(readOnly = true)
    public Notification getNotificationById(Long notificationId) {
        log.info("알림 조회: notificationId={}", notificationId);
        return notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("알림을 찾을 수 없습니다: " + notificationId));
    }

    /**
     * 사용자 알림 목록 조회 (페이징)
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        log.info("사용자 알림 목록 조회: userId={}, page={}, size={}",
            userId, pageable.getPageNumber(), pageable.getPageSize());
        return notificationRepository.findByUserId(userId, pageable);
    }

    /**
     * 사용자의 읽지 않은 알림 조회
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 읽지 않은 알림 페이지
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUnreadNotifications(Long userId, Pageable pageable) {
        log.info("읽지 않은 알림 조회: userId={}", userId);
        return notificationRepository.findUnreadByUserId(userId, pageable);
    }

    /**
     * 사용자의 읽지 않은 알림 개수 조회
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 개수
     */
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(Long userId) {
        log.info("읽지 않은 알림 개수 조회: userId={}", userId);
        return notificationRepository.countUnreadByUserId(userId);
    }

    /**
     * 알림 타입별 조회
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsByType(Long userId, Notification.NotificationType type,
                                                     Pageable pageable) {
        log.info("타입별 알림 조회: userId={}, type={}", userId, type);
        return notificationRepository.findByUserIdAndType(userId, type, pageable);
    }

    /**
     * 긴급 알림 조회
     * @param userId 사용자 ID
     * @return 긴급 알림 목록
     */
    @Transactional(readOnly = true)
    public List<Notification> getUrgentNotifications(Long userId) {
        log.info("긴급 알림 조회: userId={}", userId);
        return notificationRepository.findUrgentByUserId(userId, Notification.Priority.URGENT.getLevel());
    }

    /**
     * 특정 기간의 알림 조회
     * @param userId 사용자 ID
     * @param startTime 시작 시간
     * @param endTime 종료 시간
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsByPeriod(Long userId, LocalDateTime startTime,
                                                       LocalDateTime endTime, Pageable pageable) {
        log.info("기간별 알림 조회: userId={}, start={}, end={}", userId, startTime, endTime);
        return notificationRepository.findByUserIdAndSentTimeBetween(userId, startTime, endTime, pageable);
    }

    /**
     * 알림 읽음 처리
     * @param notificationId 알림 ID
     * @return 업데이트된 알림
     */
    public Notification markAsRead(Long notificationId) {
        log.info("알림 읽음 처리: notificationId={}", notificationId);
        Notification notification = getNotificationById(notificationId);
        notification.markAsRead();
        return notificationRepository.save(notification);
    }

    /**
     * 알림 미읽음 처리
     * @param notificationId 알림 ID
     * @return 업데이트된 알림
     */
    public Notification markAsUnread(Long notificationId) {
        log.info("알림 미읽음 처리: notificationId={}", notificationId);
        Notification notification = getNotificationById(notificationId);
        notification.markAsUnread();
        return notificationRepository.save(notification);
    }

    /**
     * 사용자의 모든 알림 읽음 처리
     * @param userId 사용자 ID
     */
    public void markAllAsRead(Long userId) {
        log.info("모든 알림 읽음 처리: userId={}", userId);
        notificationRepository.markAllAsReadByUserId(userId, LocalDateTime.now());
    }

    /**
     * 특정 타입의 알림 모두 읽음 처리
     * @param userId 사용자 ID
     * @param type 알림 타입
     */
    public void markAllAsReadByType(Long userId, Notification.NotificationType type) {
        log.info("타입별 알림 읽음 처리: userId={}, type={}", userId, type);
        notificationRepository.markAsReadByTypeAndUserId(userId, type, LocalDateTime.now());
    }

    /**
     * 알림 삭제
     * @param notificationId 알림 ID
     */
    public void deleteNotification(Long notificationId) {
        log.info("알림 삭제: notificationId={}", notificationId);
        Notification notification = getNotificationById(notificationId);
        notificationRepository.delete(notification);
    }

    /**
     * 사용자의 오래된 읽은 알림 삭제 (30일 이상)
     * @param userId 사용자 ID
     */
    public void deleteOldReadNotifications(Long userId) {
        log.info("오래된 읽은 알림 삭제: userId={}", userId);
        LocalDateTime beforeDate = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldReadNotificationsByUserId(userId, beforeDate);
    }

    /**
     * 예약된 알림 발송 (스케줄러용)
     * @return 발송된 알림 수
     */
    public int sendScheduledNotifications() {
        log.info("예약된 알림 발송 시작");
        List<Notification> scheduledNotifications = notificationRepository.findScheduledNotifications(LocalDateTime.now());

        int sentCount = 0;
        for (Notification notification : scheduledNotifications) {
            notification.setSentTime(LocalDateTime.now());
            notificationRepository.save(notification);
            sentCount++;
        }

        log.info("예약된 알림 발송 완료: {}건", sentCount);
        return sentCount;
    }

    /**
     * 오래된 읽은 알림 자동 삭제 (스케줄러용)
     * @param days 보관 기간 (일)
     * @return 삭제된 알림 수
     */
    public int cleanupOldReadNotifications(int days) {
        log.info("오래된 읽은 알림 정리 시작: {}일 이전", days);
        LocalDateTime beforeDate = LocalDateTime.now().minusDays(days);
        List<Notification> oldNotifications = notificationRepository.findOldReadNotifications(beforeDate);

        int deletedCount = oldNotifications.size();
        notificationRepository.deleteAll(oldNotifications);

        log.info("오래된 읽은 알림 정리 완료: {}건 삭제", deletedCount);
        return deletedCount;
    }

    /**
     * 사용자의 알림 타입별 통계 조회
     * @param userId 사용자 ID
     * @return 타입별 알림 개수 목록
     */
    @Transactional(readOnly = true)
    public List<Object[]> getNotificationStatsByType(Long userId) {
        log.info("알림 타입별 통계 조회: userId={}", userId);
        return notificationRepository.countByTypeAndUserId(userId);
    }
}
