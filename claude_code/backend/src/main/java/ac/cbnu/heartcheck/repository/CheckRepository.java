package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Check Repository
 * Heart Doctor 검사 데이터 접근 계층
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Repository
public interface CheckRepository extends JpaRepository<Check, Long> {

    /**
     * 사용자별 검사 이력 조회 (페이징)
     * @param user 사용자
     * @param pageable 페이징 정보
     * @return 검사 이력 페이지
     */
    Page<Check> findByUserOrderByAssessmentTimeDesc(User user, Pageable pageable);

    /**
     * 사용자의 최근 검사 조회
     * @param user 사용자
     * @param pageable 페이징 정보 (limit 용도)
     * @return 최근 검사 목록
     */
    List<Check> findTop10ByUserOrderByAssessmentTimeDesc(User user);

    /**
     * 사용자의 오늘 검사 조회
     * @param user 사용자
     * @param startOfDay 오늘 시작 시간
     * @param endOfDay 오늘 종료 시간
     * @return 오늘 검사 목록
     */
    @Query("SELECT c FROM Check c WHERE c.user = :user AND c.assessmentTime BETWEEN :startOfDay AND :endOfDay ORDER BY c.assessmentTime DESC")
    List<Check> findTodayChecksByUser(@Param("user") User user,
                                      @Param("startOfDay") LocalDateTime startOfDay,
                                      @Param("endOfDay") LocalDateTime endOfDay);

    /**
     * 사용자의 오늘 검사 개수 조회
     * @param user 사용자
     * @param startOfDay 오늘 시작 시간
     * @param endOfDay 오늘 종료 시간
     * @return 오늘 검사 개수
     */
    @Query("SELECT COUNT(c) FROM Check c WHERE c.user = :user AND c.assessmentTime BETWEEN :startOfDay AND :endOfDay")
    long countTodayChecksByUser(@Param("user") User user,
                                @Param("startOfDay") LocalDateTime startOfDay,
                                @Param("endOfDay") LocalDateTime endOfDay);

    /**
     * 특정 기간 내 검사 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 검사 목록
     */
    @Query("SELECT c FROM Check c WHERE c.user = :user AND c.assessmentTime BETWEEN :startDate AND :endDate ORDER BY c.assessmentTime DESC")
    List<Check> findByUserAndDateRange(@Param("user") User user,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    /**
     * 높은 위험도 검사 조회 (증상 개수 기준)
     * @param user 사용자
     * @return 높은 위험도 검사 목록
     */
    @Query(value = """
        SELECT c.* FROM checks c WHERE c.user_id = :userId
        AND (
            (COALESCE(c.chest_pain, false)::int + COALESCE(c.flank_pain, false)::int +
             COALESCE(c.foot_pain, false)::int + COALESCE(c.foot_edema, false)::int +
             COALESCE(c.dyspnea, false)::int + COALESCE(c.syncope, false)::int +
             COALESCE(c.weakness, false)::int + COALESCE(c.vomitting, false)::int +
             COALESCE(c.palpitation, false)::int + COALESCE(c.dizziness, false)::int +
             COALESCE(c.chest_tightness, false)::int + COALESCE(c.sweating, false)::int +
             COALESCE(c.headache, false)::int + COALESCE(c.nausea, false)::int +
             COALESCE(c.edema, false)::int + COALESCE(c.insomnia, false)::int) > 8
        )
        ORDER BY c.assessment_time DESC
        """, nativeQuery = true)
    List<Check> findHighRiskChecksByUser(@Param("userId") Long userId);

    /**
     * 특정 증상을 가진 검사 조회
     * @param user 사용자
     * @param symptomName 증상명 (chestPain, dyspnea 등)
     * @return 해당 증상 검사 목록
     */
    @Query("SELECT c FROM Check c WHERE c.user = :user AND " +
           "(:symptomName = 'chestPain' AND c.chestPain = true) OR " +
           "(:symptomName = 'dyspnea' AND c.dyspnea = true) OR " +
           "(:symptomName = 'palpitation' AND c.palpitation = true)")
    List<Check> findByUserAndSymptom(@Param("user") User user, @Param("symptomName") String symptomName);

    /**
     * BMI 범위별 검사 조회
     * @param user 사용자
     * @param minBmi 최소 BMI
     * @param maxBmi 최대 BMI
     * @return 해당 BMI 범위 검사 목록
     */
    @Query("SELECT c FROM Check c WHERE c.user = :user AND c.bmi BETWEEN :minBmi AND :maxBmi ORDER BY c.assessmentTime DESC")
    List<Check> findByUserAndBmiRange(@Param("user") User user,
                                      @Param("minBmi") Double minBmi,
                                      @Param("maxBmi") Double maxBmi);

    /**
     * 나이대별 검사 조회
     * @param user 사용자
     * @param minAge 최소 나이
     * @param maxAge 최대 나이
     * @return 해당 나이대 검사 목록
     */
    @Query("SELECT c FROM Check c WHERE c.user = :user AND c.age BETWEEN :minAge AND :maxAge ORDER BY c.assessmentTime DESC")
    List<Check> findByUserAndAgeRange(@Param("user") User user,
                                      @Param("minAge") Short minAge,
                                      @Param("maxAge") Short maxAge);

    /**
     * 성별별 검사 조회
     * @param user 사용자
     * @param gender 성별 (false: 남성, true: 여성)
     * @return 해당 성별 검사 목록
     */
    List<Check> findByUserAndGenderOrderByAssessmentTimeDesc(User user, Boolean gender);

    /**
     * 검사 통계 - 전체 검사 수
     * @return 전체 검사 수
     */
    @Query("SELECT COUNT(c) FROM Check c")
    long countAllChecks();

    /**
     * 검사 통계 - 특정 기간 검사 수
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 검사 수
     */
    @Query("SELECT COUNT(c) FROM Check c WHERE c.assessmentTime BETWEEN :startDate AND :endDate")
    long countChecksByDateRange(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    /**
     * 평균 증상 개수 조회
     * @param user 사용자
     * @return 평균 증상 개수
     */
    @Query(value = """
        SELECT AVG(
            COALESCE(c.chest_pain, false)::int + COALESCE(c.flank_pain, false)::int +
            COALESCE(c.foot_pain, false)::int + COALESCE(c.foot_edema, false)::int +
            COALESCE(c.dyspnea, false)::int + COALESCE(c.syncope, false)::int +
            COALESCE(c.weakness, false)::int + COALESCE(c.vomitting, false)::int +
            COALESCE(c.palpitation, false)::int + COALESCE(c.dizziness, false)::int +
            COALESCE(c.chest_tightness, false)::int + COALESCE(c.sweating, false)::int +
            COALESCE(c.headache, false)::int + COALESCE(c.nausea, false)::int +
            COALESCE(c.edema, false)::int + COALESCE(c.insomnia, false)::int
        ) FROM checks c WHERE c.user_id = :userId
        """, nativeQuery = true)
    Double getAverageSymptomCountByUser(@Param("userId") Long userId);

    /**
     * 사용자의 가장 최근 검사 조회
     * @param user 사용자
     * @return 최근 검사 Optional
     */
    Optional<Check> findFirstByUserOrderByAssessmentTimeDesc(User user);
}