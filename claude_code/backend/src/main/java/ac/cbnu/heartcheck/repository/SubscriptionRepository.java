package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.Subscription.SubscriptionStatus;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * SubscriptionRepository for Heart Doctor system
 * 구독 데이터 접근 레이어
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * 사용자의 모든 구독 조회
     * @param user 사용자
     * @return 구독 목록
     */
    List<Subscription> findByUser(User user);

    /**
     * 사용자 ID로 모든 구독 조회
     * @param userId 사용자 ID
     * @return 구독 목록
     */
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId ORDER BY s.fromDate DESC")
    List<Subscription> findByUserId(@Param("userId") Long userId);

    /**
     * 사용자의 활성 구독 조회
     * @param user 사용자
     * @param status 구독 상태
     * @return 활성 구독
     */
    Optional<Subscription> findByUserAndStatus(User user, SubscriptionStatus status);

    /**
     * 사용자의 활성 구독 조회 (User ID로)
     * @param userId 사용자 ID
     * @param status 구독 상태
     * @return 활성 구독
     */
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.status = :status")
    Optional<Subscription> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") SubscriptionStatus status);

    /**
     * 사용자의 유효한 구독 조회 (활성 + 만료되지 않음)
     * @param userId 사용자 ID
     * @return 유효한 구독
     */
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.status = 'ACTIVE' AND (s.toDate IS NULL OR s.toDate > :now)")
    Optional<Subscription> findValidSubscriptionByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    /**
     * 만료된 구독 조회
     * @param now 현재 시각
     * @return 만료된 구독 목록
     */
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.toDate IS NOT NULL AND s.toDate <= :now")
    List<Subscription> findExpiredSubscriptions(@Param("now") LocalDateTime now);

    /**
     * 곧 만료될 구독 조회 (7일 이내)
     * @param now 현재 시각
     * @param sevenDaysLater 7일 후
     * @return 만료 예정 구독 목록
     */
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.toDate > :now AND s.toDate <= :sevenDaysLater")
    List<Subscription> findExpiringSoonSubscriptions(@Param("now") LocalDateTime now, @Param("sevenDaysLater") LocalDateTime sevenDaysLater);

    /**
     * 특정 상태의 구독 조회
     * @param status 구독 상태
     * @return 구독 목록
     */
    List<Subscription> findByStatus(SubscriptionStatus status);

    /**
     * 사용자가 활성 구독을 가지고 있는지 확인
     * @param userId 사용자 ID
     * @return 활성 구독 존재 여부
     */
    @Query("SELECT COUNT(s) > 0 FROM Subscription s WHERE s.user.id = :userId AND s.status = 'ACTIVE' AND (s.toDate IS NULL OR s.toDate > :now)")
    boolean hasActiveSubscription(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    /**
     * 특정 기간 내의 신규 구독 수 조회
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 신규 구독 수
     */
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.fromDate >= :startDate AND s.fromDate < :endDate")
    long countNewSubscriptions(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * 사용자의 최근 구독 조회
     * @param userId 사용자 ID
     * @return 최근 구독
     */
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId ORDER BY s.fromDate DESC LIMIT 1")
    Optional<Subscription> findLatestByUserId(@Param("userId") Long userId);
}
