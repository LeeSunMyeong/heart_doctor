package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.DailyUsageQuota;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Daily Usage Quota Repository
 * Heart Doctor 일일 사용량 제한 데이터 접근 계층
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Repository
public interface DailyUsageQuotaRepository extends JpaRepository<DailyUsageQuota, Long> {

    /**
     * 사용자와 날짜로 사용량 조회
     * @param user 사용자
     * @param usageDate 사용 날짜
     * @return 해당 날짜 사용량 Optional
     */
    Optional<DailyUsageQuota> findByUserAndDay(User user, LocalDate day);

    /**
     * 사용자의 특정 기간 사용량 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 사용량 목록
     */
    @Query("SELECT d FROM DailyUsageQuota d WHERE d.user = :user AND d.day BETWEEN :startDate AND :endDate ORDER BY d.day DESC")
    List<DailyUsageQuota> findByUserAndDateRange(@Param("user") User user,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    /**
     * 사용자의 최근 사용량 기록 조회
     * @param user 사용자
     * @return 최근 사용량 목록 (최대 30일)
     */
    List<DailyUsageQuota> findTop30ByUserOrderByDayDesc(User user);

    /**
     * 특정 날짜의 전체 사용량 통계
     * @param usageDate 날짜
     * @return 해당 날짜 전체 사용량
     */
    @Query("SELECT SUM(d.count) FROM DailyUsageQuota d WHERE d.day = :usageDate")
    Long getTotalUsageByDate(@Param("usageDate") LocalDate usageDate);

    /**
     * 특정 기간의 일별 사용량 통계
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 기간별 일별 사용량 목록
     */
    @Query("SELECT d.day, SUM(d.count) FROM DailyUsageQuota d WHERE d.day BETWEEN :startDate AND :endDate GROUP BY d.day ORDER BY d.day")
    List<Object[]> getDailyUsageStatistics(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    /**
     * 제한량을 초과한 사용자 조회
     * @param usageDate 날짜
     * @param maxUsage 최대 사용량
     * @return 초과 사용자의 사용량 목록
     */
    @Query("SELECT d FROM DailyUsageQuota d WHERE d.day = :usageDate AND d.count > :maxUsage ORDER BY d.count DESC")
    List<DailyUsageQuota> findExceededUsage(@Param("usageDate") LocalDate usageDate,
                                           @Param("maxUsage") int maxUsage);

    /**
     * 사용자별 월간 사용량 통계
     * @param user 사용자
     * @param year 년도
     * @param month 월
     * @return 월간 총 사용량
     */
    @Query("SELECT SUM(d.count) FROM DailyUsageQuota d WHERE d.user = :user AND YEAR(d.day) = :year AND MONTH(d.day) = :month")
    Long getMonthlyUsageByUser(@Param("user") User user,
                              @Param("year") int year,
                              @Param("month") int month);

    /**
     * 활성 사용자 수 조회 (특정 날짜)
     * @param usageDate 날짜
     * @return 해당 날짜 활성 사용자 수
     */
    @Query("SELECT COUNT(DISTINCT d.user) FROM DailyUsageQuota d WHERE d.day = :usageDate AND d.count > 0")
    Long getActiveUserCount(@Param("usageDate") LocalDate usageDate);

    /**
     * 평균 일일 사용량 조회 (특정 기간)
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 평균 일일 사용량
     */
    @Query("SELECT AVG(d.count) FROM DailyUsageQuota d WHERE d.day BETWEEN :startDate AND :endDate")
    Double getAverageDailyUsage(@Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);

    /**
     * 사용량이 0인 기록 삭제 (정리용)
     * @param beforeDate 기준일 (이전 기록 삭제)
     */
    @Query("DELETE FROM DailyUsageQuota d WHERE d.count = 0 AND d.day < :beforeDate")
    void deleteZeroUsageRecords(@Param("beforeDate") LocalDate beforeDate);

    /**
     * 사용자의 연속 사용일 조회
     * @param user 사용자
     * @param startDate 시작일
     * @return 연속 사용일 목록
     */
    @Query("SELECT d FROM DailyUsageQuota d WHERE d.user = :user AND d.day >= :startDate AND d.count > 0 ORDER BY d.day")
    List<DailyUsageQuota> findConsecutiveUsageDays(@Param("user") User user,
                                                   @Param("startDate") LocalDate startDate);

    /**
     * 최대 사용량 기록 조회
     * @param usageDate 날짜
     * @return 해당 날짜 최대 사용량 기록
     */
    @Query("SELECT d FROM DailyUsageQuota d WHERE d.day = :usageDate ORDER BY d.count DESC LIMIT 1")
    Optional<DailyUsageQuota> findMaxUsageByDate(@Param("usageDate") LocalDate usageDate);

    /**
     * 사용량 순위 조회 (특정 날짜)
     * @param usageDate 날짜
     * @param limit 조회할 순위 수
     * @return 사용량 순위 목록
     */
    @Query("SELECT d FROM DailyUsageQuota d WHERE d.day = :usageDate ORDER BY d.count DESC LIMIT :limit")
    List<DailyUsageQuota> findTopUsageByDate(@Param("usageDate") LocalDate usageDate,
                                            @Param("limit") int limit);
}