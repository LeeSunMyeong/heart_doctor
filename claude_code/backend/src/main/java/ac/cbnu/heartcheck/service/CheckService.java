package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Check Service
 * Heart Doctor 검사 비즈니스 로직 서비스
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckService {

    private final CheckRepository checkRepository;

    /**
     * 검사 결과 저장
     * @param check 검사 정보
     * @return 저장된 검사
     */
    @Transactional
    public Check saveCheck(Check check) {
        log.info("Saving new check for user: {}", check.getUser().getUserId());

        validateCheckData(check);

        Check savedCheck = checkRepository.save(check);

        log.info("Check saved successfully with ID: {}", savedCheck.getId());
        return savedCheck;
    }

    /**
     * 검사 ID로 조회
     * @param checkId 검사 ID
     * @return 검사 정보
     */
    public Optional<Check> findById(Long checkId) {
        return checkRepository.findById(checkId);
    }

    /**
     * 사용자별 검사 이력 조회 (페이징)
     * @param user 사용자
     * @param pageable 페이징 정보
     * @return 검사 이력 페이지
     */
    public Page<Check> findUserChecks(User user, Pageable pageable) {
        return checkRepository.findByUserOrderByAssessmentTimeDesc(user, pageable);
    }

    /**
     * 사용자의 최근 검사 조회
     * @param user 사용자
     * @return 최근 검사 목록 (최대 10개)
     */
    public List<Check> findRecentChecks(User user) {
        return checkRepository.findTop10ByUserOrderByAssessmentTimeDesc(user);
    }

    /**
     * 사용자의 오늘 검사 조회
     * @param user 사용자
     * @return 오늘 검사 목록
     */
    public List<Check> findTodayChecks(User user) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

        return checkRepository.findTodayChecksByUser(user, startOfDay, endOfDay);
    }

    /**
     * 사용자의 오늘 검사 개수 조회
     * @param user 사용자
     * @return 오늘 검사 개수
     */
    public long countTodayChecks(User user) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

        return checkRepository.countTodayChecksByUser(user, startOfDay, endOfDay);
    }

    /**
     * 특정 기간 검사 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 검사 목록
     */
    public List<Check> findChecksByDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        return checkRepository.findByUserAndDateRange(user, startDate, endDate);
    }

    /**
     * 높은 위험도 검사 조회
     * @param user 사용자
     * @return 높은 위험도 검사 목록
     */
    public List<Check> findHighRiskChecks(User user) {
        return checkRepository.findHighRiskChecksByUser(user.getUserId());
    }

    /**
     * 특정 증상을 가진 검사 조회
     * @param user 사용자
     * @param symptomName 증상명
     * @return 해당 증상 검사 목록
     */
    public List<Check> findChecksBySymptom(User user, String symptomName) {
        return checkRepository.findByUserAndSymptom(user, symptomName);
    }

    /**
     * BMI 범위별 검사 조회
     * @param user 사용자
     * @param minBmi 최소 BMI
     * @param maxBmi 최대 BMI
     * @return 해당 BMI 범위 검사 목록
     */
    public List<Check> findChecksByBmiRange(User user, Double minBmi, Double maxBmi) {
        return checkRepository.findByUserAndBmiRange(user, minBmi, maxBmi);
    }

    /**
     * 나이대별 검사 조회
     * @param user 사용자
     * @param minAge 최소 나이
     * @param maxAge 최대 나이
     * @return 해당 나이대 검사 목록
     */
    public List<Check> findChecksByAgeRange(User user, Short minAge, Short maxAge) {
        return checkRepository.findByUserAndAgeRange(user, minAge, maxAge);
    }

    /**
     * 성별별 검사 조회
     * @param user 사용자
     * @param gender 성별
     * @return 해당 성별 검사 목록
     */
    public List<Check> findChecksByGender(User user, Boolean gender) {
        return checkRepository.findByUserAndGenderOrderByAssessmentTimeDesc(user, gender);
    }

    /**
     * 사용자의 평균 증상 개수 조회
     * @param user 사용자
     * @return 평균 증상 개수
     */
    public Double getAverageSymptomCount(User user) {
        return checkRepository.getAverageSymptomCountByUser(user.getUserId());
    }

    /**
     * 사용자의 가장 최근 검사 조회
     * @param user 사용자
     * @return 최근 검사
     */
    public Optional<Check> findLatestCheck(User user) {
        return checkRepository.findFirstByUserOrderByAssessmentTimeDesc(user);
    }

    /**
     * 검사 데이터 유효성 검증
     * @param check 검사 정보
     */
    private void validateCheckData(Check check) {
        if (check.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (check.getAge() == null || check.getAge() < 0 || check.getAge() > 150) {
            throw new IllegalArgumentException("Age must be between 0 and 150");
        }

        if (check.getHeight() == null || check.getHeight() < 50 || check.getHeight() > 250) {
            throw new IllegalArgumentException("Height must be between 50 and 250 cm");
        }

        if (check.getWeight() == null || check.getWeight() < 10 || check.getWeight() > 300) {
            throw new IllegalArgumentException("Weight must be between 10 and 300 kg");
        }

        log.debug("Check data validation passed for user: {}", check.getUser().getUserId());
    }

    /**
     * 검사 위험도 평가
     * @param check 검사 정보
     * @return 위험도 (LOW, MEDIUM, HIGH, CRITICAL)
     */
    public String assessRiskLevel(Check check) {
        int symptomCount = check.getSymptomCount();
        BigDecimal bmi = check.getBmi();

        if (symptomCount >= 10 || bmi.compareTo(new BigDecimal("35.0")) >= 0) {
            return "CRITICAL";
        } else if (symptomCount >= 7 || bmi.compareTo(new BigDecimal("30.0")) >= 0) {
            return "HIGH";
        } else if (symptomCount >= 4 || bmi.compareTo(new BigDecimal("25.0")) >= 0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    /**
     * 의료진 검토 권장 여부 판정
     * @param check 검사 정보
     * @return 의료진 검토 권장 여부
     */
    public boolean isRecommendMedicalReview(Check check) {
        int symptomCount = check.getSymptomCount();

        return symptomCount >= 8 ||
               check.getBmi().compareTo(new BigDecimal("35.0")) >= 0 ||
               (Boolean.TRUE.equals(check.getChestPain()) && Boolean.TRUE.equals(check.getDyspnea()));
    }

    /**
     * 검사 통계 - 전체 검사 수
     * @return 전체 검사 수
     */
    public long countAllChecks() {
        return checkRepository.countAllChecks();
    }

    /**
     * 검사 통계 - 특정 기간 검사 수
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 검사 수
     */
    public long countChecksByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return checkRepository.countChecksByDateRange(startDate, endDate);
    }
}