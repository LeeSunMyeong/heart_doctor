package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.Prediction;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Prediction Repository
 * Heart Doctor AI 진단 결과 데이터 접근 계층
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    /**
     * 검사별 진단 결과 조회
     * @param check 검사
     * @return 진단 결과 Optional
     */
    Optional<Prediction> findByCheck(Check check);

    /**
     * 사용자별 진단 결과 조회 (페이징)
     * @param user 사용자
     * @param pageable 페이징 정보
     * @return 진단 결과 페이지
     */
    Page<Prediction> findByUserOrderByPredictTimeDesc(User user, Pageable pageable);

    /**
     * 사용자의 최근 진단 결과 조회
     * @param user 사용자
     * @return 최근 진단 결과 목록
     */
    List<Prediction> findTop10ByUserOrderByPredictTimeDesc(User user);

    /**
     * 특정 기간 내 진단 결과 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 진단 결과 목록
     */
    @Query("SELECT p FROM Prediction p WHERE p.user = :user AND p.predictTime BETWEEN :startDate AND :endDate ORDER BY p.predictTime DESC")
    List<Prediction> findByUserAndDateRange(@Param("user") User user,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    /**
     * 높은 위험도 진단 결과 조회 (HIGH, CRITICAL)
     * @param user 사용자
     * @return 높은 위험도 진단 목록
     */
    @Query(value = """
        SELECT p.* FROM predictions p WHERE p.user_id = :userId
        AND (
            GREATEST(p.angina, p.mi, p.hf, p.af, p.other) >= 60.0
            AND GREATEST(p.angina, p.mi, p.hf, p.af, p.other) > p.normal
        )
        ORDER BY p.predict_time DESC
        """, nativeQuery = true)
    List<Prediction> findHighRiskPredictionsByUser(@Param("userId") Long userId);

    /**
     * 의료진 검토 권장 진단 결과 조회
     * @param user 사용자
     * @return 의료진 검토 권장 진단 목록
     */
    @Query(value = """
        SELECT p.* FROM predictions p WHERE p.user_id = :userId
        AND GREATEST(p.angina, p.mi, p.hf, p.af, p.other) >= 60.0
        ORDER BY p.predict_time DESC
        """, nativeQuery = true)
    List<Prediction> findMedicalReviewRecommendedByUser(@Param("userId") Long userId);

    /**
     * 특정 질환 확률이 높은 진단 결과 조회
     * @param user 사용자
     * @param diseaseType 질환 타입 (angina, mi, hf, af, other)
     * @param minProbability 최소 확률
     * @return 해당 질환 고확률 진단 목록
     */
    @Query("SELECT p FROM Prediction p WHERE p.user = :user AND " +
           "(:diseaseType = 'angina' AND p.angina >= :minProbability) OR " +
           "(:diseaseType = 'mi' AND p.mi >= :minProbability) OR " +
           "(:diseaseType = 'hf' AND p.hf >= :minProbability) OR " +
           "(:diseaseType = 'af' AND p.af >= :minProbability) OR " +
           "(:diseaseType = 'other' AND p.other >= :minProbability)")
    List<Prediction> findByUserAndHighDiseaseProb(@Param("user") User user,
                                                   @Param("diseaseType") String diseaseType,
                                                   @Param("minProbability") BigDecimal minProbability);

    /**
     * 정상 진단 결과 조회
     * @param user 사용자
     * @param minNormalProb 최소 정상 확률
     * @return 정상 진단 목록
     */
    @Query("SELECT p FROM Prediction p WHERE p.user = :user AND p.normal >= :minNormalProb ORDER BY p.predictTime DESC")
    List<Prediction> findNormalPredictionsByUser(@Param("user") User user,
                                                  @Param("minNormalProb") BigDecimal minNormalProb);

    /**
     * 오늘의 진단 결과 조회
     * @param user 사용자
     * @param startOfDay 오늘 시작 시간
     * @param endOfDay 오늘 종료 시간
     * @return 오늘 진단 결과 목록
     */
    @Query("SELECT p FROM Prediction p WHERE p.user = :user AND p.predictTime BETWEEN :startOfDay AND :endOfDay ORDER BY p.predictTime DESC")
    List<Prediction> findTodayPredictionsByUser(@Param("user") User user,
                                                 @Param("startOfDay") LocalDateTime startOfDay,
                                                 @Param("endOfDay") LocalDateTime endOfDay);

    /**
     * 사용자별 질환 통계 조회 - 협심증
     * @param user 사용자
     * @return 평균 협심증 확률
     */
    @Query("SELECT AVG(p.angina) FROM Prediction p WHERE p.user = :user")
    Double getAverageAnginaProbByUser(@Param("user") User user);

    /**
     * 사용자별 질환 통계 조회 - 심근경색
     * @param user 사용자
     * @return 평균 심근경색 확률
     */
    @Query("SELECT AVG(p.mi) FROM Prediction p WHERE p.user = :user")
    Double getAverageMiProbByUser(@Param("user") User user);

    /**
     * 사용자별 질환 통계 조회 - 심부전
     * @param user 사용자
     * @return 평균 심부전 확률
     */
    @Query("SELECT AVG(p.hf) FROM Prediction p WHERE p.user = :user")
    Double getAverageHfProbByUser(@Param("user") User user);

    /**
     * 사용자별 정상 확률 평균
     * @param user 사용자
     * @return 평균 정상 확률
     */
    @Query("SELECT AVG(p.normal) FROM Prediction p WHERE p.user = :user")
    Double getAverageNormalProbByUser(@Param("user") User user);

    /**
     * 진단 통계 - 전체 진단 수
     * @return 전체 진단 수
     */
    @Query("SELECT COUNT(p) FROM Prediction p")
    long countAllPredictions();

    /**
     * 진단 통계 - 특정 기간 진단 수
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 진단 수
     */
    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.predictTime BETWEEN :startDate AND :endDate")
    long countPredictionsByDateRange(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    /**
     * 질환별 진단 통계 - 높은 확률 진단 수
     * @param diseaseType 질환 타입
     * @param minProbability 최소 확률
     * @return 해당 질환 고확률 진단 수
     */
    @Query(value = """
        SELECT COUNT(*) FROM predictions p WHERE
        (:diseaseType = 'angina' AND p.angina >= :minProbability) OR
        (:diseaseType = 'mi' AND p.mi >= :minProbability) OR
        (:diseaseType = 'hf' AND p.hf >= :minProbability) OR
        (:diseaseType = 'af' AND p.af >= :minProbability) OR
        (:diseaseType = 'other' AND p.other >= :minProbability)
        """, nativeQuery = true)
    long countHighProbabilityPredictions(@Param("diseaseType") String diseaseType,
                                          @Param("minProbability") BigDecimal minProbability);

    /**
     * 사용자의 가장 최근 진단 결과 조회
     * @param user 사용자
     * @return 최근 진단 결과 Optional
     */
    Optional<Prediction> findFirstByUserOrderByPredictTimeDesc(User user);

    /**
     * 가장 높은 확률의 진단명별 통계
     * @param diagnosisType 진단명 (ANGINA, MYOCARDIAL_INFARCTION 등)
     * @return 해당 진단의 개수
     */
    @Query(value = """
        SELECT COUNT(*) FROM predictions p WHERE
        CASE
            WHEN p.angina = GREATEST(p.angina, p.mi, p.hf, p.af, p.other, p.normal) THEN 'ANGINA'
            WHEN p.mi = GREATEST(p.angina, p.mi, p.hf, p.af, p.other, p.normal) THEN 'MYOCARDIAL_INFARCTION'
            WHEN p.hf = GREATEST(p.angina, p.mi, p.hf, p.af, p.other, p.normal) THEN 'HEART_FAILURE'
            WHEN p.af = GREATEST(p.angina, p.mi, p.hf, p.af, p.other, p.normal) THEN 'ATRIAL_FIBRILLATION'
            WHEN p.other = GREATEST(p.angina, p.mi, p.hf, p.af, p.other, p.normal) THEN 'OTHER'
            ELSE 'NORMAL'
        END = :diagnosisType
        """, nativeQuery = true)
    long countByHighestProbabilityDiagnosis(@Param("diagnosisType") String diagnosisType);
}