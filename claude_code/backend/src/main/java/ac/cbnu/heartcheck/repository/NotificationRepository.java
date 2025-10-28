package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Notification;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification Repository
 * 알림 데이터 접근 레이어
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * 사용자 ID로 알림 목록 조회 (페이징)
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId ORDER BY n.sentTime DESC")
    Page<Notification> findByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 사용자로 알림 목록 조회 (페이징)
     * @param user 사용자
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    Page<Notification> findByUser(User user, Pageable pageable);

    /**
     * 사용자의 읽지 않은 알림 개수 조회
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 개수
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.userId = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") Long userId);

    /**
     * 사용자의 읽지 않은 알림 목록 조회
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 읽지 않은 알림 페이지
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND n.isRead = false ORDER BY n.sentTime DESC")
    Page<Notification> findUnreadByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 사용자의 읽은 알림 목록 조회
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 읽은 알림 페이지
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND n.isRead = true ORDER BY n.sentTime DESC")
    Page<Notification> findReadByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 사용자와 알림 타입으로 알림 조회
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND n.type = :type ORDER BY n.sentTime DESC")
    Page<Notification> findByUserIdAndType(@Param("userId") Long userId,
                                            @Param("type") Notification.NotificationType type,
                                            Pageable pageable);

    /**
     * 사용자의 긴급 알림 조회
     * @param userId 사용자 ID
     * @param urgentPriority 긴급 우선순위 레벨
     * @return 긴급 알림 목록
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND n.priority >= :urgentPriority ORDER BY n.priority DESC, n.sentTime DESC")
    List<Notification> findUrgentByUserId(@Param("userId") Long userId, @Param("urgentPriority") Integer urgentPriority);

    /**
     * 특정 기간 동안의 알림 조회
     * @param userId 사용자 ID
     * @param startTime 시작 시간
     * @param endTime 종료 시간
     * @param pageable 페이징 정보
     * @return 알림 페이지
     */
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND n.sentTime BETWEEN :startTime AND :endTime ORDER BY n.sentTime DESC")
    Page<Notification> findByUserIdAndSentTimeBetween(@Param("userId") Long userId,
                                                       @Param("startTime") LocalDateTime startTime,
                                                       @Param("endTime") LocalDateTime endTime,
                                                       Pageable pageable);

    /**
     * 발송 예약된 알림 목록 조회
     * @param now 현재 시간
     * @return 발송 가능한 예약 알림 목록
     */
    @Query("SELECT n FROM Notification n WHERE n.scheduledTime IS NOT NULL AND n.scheduledTime <= :now AND n.sentTime IS NULL")
    List<Notification> findScheduledNotifications(@Param("now") LocalDateTime now);

    /**
     * 오래된 읽은 알림 조회 (자동 삭제용)
     * @param beforeDate 기준 날짜
     * @return 오래된 읽은 알림 목록
     */
    @Query("SELECT n FROM Notification n WHERE n.isRead = true AND n.readTime < :beforeDate")
    List<Notification> findOldReadNotifications(@Param("beforeDate") LocalDateTime beforeDate);

    /**
     * 사용자의 모든 알림을 읽음으로 표시
     * @param userId 사용자 ID
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readTime = :readTime WHERE n.user.userId = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId, @Param("readTime") LocalDateTime readTime);

    /**
     * 특정 타입의 알림을 읽음으로 표시
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param readTime 읽은 시간
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readTime = :readTime WHERE n.user.userId = :userId AND n.type = :type AND n.isRead = false")
    void markAsReadByTypeAndUserId(@Param("userId") Long userId,
                                    @Param("type") Notification.NotificationType type,
                                    @Param("readTime") LocalDateTime readTime);

    /**
     * 사용자의 오래된 알림 삭제
     * @param userId 사용자 ID
     * @param beforeDate 기준 날짜
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.userId = :userId AND n.isRead = true AND n.readTime < :beforeDate")
    void deleteOldReadNotificationsByUserId(@Param("userId") Long userId, @Param("beforeDate") LocalDateTime beforeDate);

    /**
     * 사용자 ID로 모든 알림 삭제
     * @param userId 사용자 ID
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    /**
     * 사용자의 알림 타입별 개수 조회
     * @param userId 사용자 ID
     * @return [타입, 개수] 배열 목록
     */
    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.user.userId = :userId GROUP BY n.type")
    List<Object[]> countByTypeAndUserId(@Param("userId") Long userId);
}
