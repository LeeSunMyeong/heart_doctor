package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.dto.request.PredictionRequest;
import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.Prediction;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CheckRepository;
import ac.cbnu.heartcheck.repository.PredictionRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

/**
 * Prediction Service
 * Heart Doctor AI 진단 결과 비즈니스 로직 서비스
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final CheckRepository checkRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    /**
     * AI 진단 결과 저장 (DTO 기반, Mock 데이터 생성)
     * @param request 진단 요청 DTO
     * @param userId 사용자 ID (JWT에서 추출)
     * @return 저장된 진단 결과
     */
    @Transactional
    public Prediction savePrediction(PredictionRequest request, Long userId) {
        log.info("Creating mock prediction for user: {} (from JWT), checkId: {}", userId, request.getCheckId());

        // User 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Check 조회
        Check check = checkRepository.findById(request.getCheckId())
            .orElseThrow(() -> new IllegalArgumentException("Check not found: " + request.getCheckId()));

        // Check의 user와 JWT user가 일치하는지 검증
        if (!check.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Check does not belong to the authenticated user");
        }

        // Mock 데이터 생성
        Prediction prediction = generateMockPrediction(user, check);

        validatePredictionData(prediction);

        Prediction savedPrediction = predictionRepository.save(prediction);

        log.info("Mock prediction saved successfully with ID: {} diagnosis: {}",
                savedPrediction.getId(), savedPrediction.getHighestProbabilityDiagnosis());
        return savedPrediction;
    }

    /**
     * AI 진단 결과 저장 (기존 Entity 기반 - 하위 호환성)
     * @param prediction 진단 결과
     * @return 저장된 진단 결과
     */
    @Transactional
    public Prediction savePrediction(Prediction prediction) {
        log.info("Saving prediction for user: {} check: {}",
                prediction.getUser().getUserId(), prediction.getCheck().getId());

        validatePredictionData(prediction);

        Prediction savedPrediction = predictionRepository.save(prediction);

        log.info("Prediction saved successfully with ID: {}", savedPrediction.getId());
        return savedPrediction;
    }

    /**
     * Mock 진단 데이터 생성
     * 증상 개수에 따라 질환 확률을 조정
     * @param user 사용자
     * @param check 검사 데이터
     * @return Mock Prediction
     */
    private Prediction generateMockPrediction(User user, Check check) {
        int symptomCount = check.getSymptomCount();

        // 증상 개수에 따라 정상 vs 질환 확률 결정
        BigDecimal normalProb;

        if (symptomCount <= 2) {
            // 증상 적음 -> 정상 확률 높음 (60-80%)
            normalProb = BigDecimal.valueOf(60 + random.nextInt(21)).setScale(2, RoundingMode.HALF_UP);
        } else if (symptomCount <= 5) {
            // 증상 중간 -> 정상 확률 중간 (40-60%)
            normalProb = BigDecimal.valueOf(40 + random.nextInt(21)).setScale(2, RoundingMode.HALF_UP);
        } else {
            // 증상 많음 -> 정상 확률 낮음 (10-40%)
            normalProb = BigDecimal.valueOf(10 + random.nextInt(31)).setScale(2, RoundingMode.HALF_UP);
        }

        // 나머지 확률을 5개 질환에 분배
        BigDecimal remainingProb = BigDecimal.valueOf(100).subtract(normalProb);

        // 각 질환에 무작위로 확률 분배
        BigDecimal angina = randomProbability(remainingProb, 0.25);
        BigDecimal mi = randomProbability(remainingProb, 0.20);
        BigDecimal hf = randomProbability(remainingProb, 0.20);
        BigDecimal af = randomProbability(remainingProb, 0.20);
        BigDecimal other = remainingProb.subtract(angina).subtract(mi).subtract(hf).subtract(af);

        // 합계가 정확히 100이 되도록 조정
        BigDecimal total = normalProb.add(angina).add(mi).add(hf).add(af).add(other);
        BigDecimal adjustment = BigDecimal.valueOf(100).subtract(total);
        normalProb = normalProb.add(adjustment);

        String comment = generateComment(symptomCount);

        return Prediction.builder()
                .user(user)
                .check(check)
                .angina(angina)
                .mi(mi)
                .hf(hf)
                .af(af)
                .other(other)
                .normal(normalProb)
                .comment(comment)
                .build();
    }

    /**
     * 무작위 확률 생성
     * @param maxProb 최대 확률
     * @param ratio 비율
     * @return 생성된 확률
     */
    private BigDecimal randomProbability(BigDecimal maxProb, double ratio) {
        double max = maxProb.doubleValue() * ratio;
        double value = random.nextDouble() * max;
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 증상 개수에 따른 코멘트 생성
     * @param symptomCount 증상 개수
     * @return 코멘트
     */
    private String generateComment(int symptomCount) {
        if (symptomCount <= 2) {
            return "정상 범위입니다. 정기적인 건강 검진을 권장합니다.";
        } else if (symptomCount <= 5) {
            return "일부 증상이 관찰됩니다. 지속적인 관찰이 필요합니다.";
        } else if (symptomCount <= 8) {
            return "다수의 증상이 관찰됩니다. 의료진 상담을 권장합니다.";
        } else {
            return "심각한 증상이 관찰됩니다. 즉시 의료진 검토가 필요합니다.";
        }
    }

    /**
     * 검사별 진단 결과 조회
     * @param check 검사
     * @return 진단 결과
     */
    public Optional<Prediction> findByCheck(Check check) {
        return predictionRepository.findByCheck(check);
    }

    /**
     * 사용자별 진단 결과 조회 (페이징)
     * @param user 사용자
     * @param pageable 페이징 정보
     * @return 진단 결과 페이지
     */
    public Page<Prediction> findUserPredictions(User user, Pageable pageable) {
        return predictionRepository.findByUserOrderByPredictTimeDesc(user, pageable);
    }

    /**
     * 사용자의 최근 진단 결과 조회
     * @param user 사용자
     * @return 최근 진단 결과 목록 (최대 10개)
     */
    public List<Prediction> findRecentPredictions(User user) {
        return predictionRepository.findTop10ByUserOrderByPredictTimeDesc(user);
    }

    /**
     * 특정 기간 내 진단 결과 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 진단 결과 목록
     */
    public List<Prediction> findPredictionsByDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        return predictionRepository.findByUserAndDateRange(user, startDate, endDate);
    }

    /**
     * 높은 위험도 진단 결과 조회
     * @param user 사용자
     * @return 높은 위험도 진단 목록
     */
    public List<Prediction> findHighRiskPredictions(User user) {
        return predictionRepository.findHighRiskPredictionsByUser(user.getUserId());
    }

    /**
     * 의료진 검토 권장 진단 결과 조회
     * @param user 사용자
     * @return 의료진 검토 권장 진단 목록
     */
    public List<Prediction> findMedicalReviewRecommended(User user) {
        return predictionRepository.findMedicalReviewRecommendedByUser(user.getUserId());
    }

    /**
     * 특정 질환 확률이 높은 진단 결과 조회
     * @param user 사용자
     * @param diseaseType 질환 타입
     * @param minProbability 최소 확률
     * @return 해당 질환 고확률 진단 목록
     */
    public List<Prediction> findHighDiseaseProb(User user, String diseaseType, BigDecimal minProbability) {
        return predictionRepository.findByUserAndHighDiseaseProb(user, diseaseType, minProbability);
    }

    /**
     * 정상 진단 결과 조회
     * @param user 사용자
     * @param minNormalProb 최소 정상 확률
     * @return 정상 진단 목록
     */
    public List<Prediction> findNormalPredictions(User user, BigDecimal minNormalProb) {
        return predictionRepository.findNormalPredictionsByUser(user, minNormalProb);
    }

    /**
     * 오늘의 진단 결과 조회
     * @param user 사용자
     * @return 오늘 진단 결과 목록
     */
    public List<Prediction> findTodayPredictions(User user) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

        return predictionRepository.findTodayPredictionsByUser(user, startOfDay, endOfDay);
    }

    /**
     * 사용자별 질환 통계 조회
     * @param user 사용자
     * @return 질환별 평균 확률 맵
     */
    public Map<String, Double> getDiseaseStatistics(User user) {
        return Map.of(
            "angina", predictionRepository.getAverageAnginaProbByUser(user),
            "mi", predictionRepository.getAverageMiProbByUser(user),
            "hf", predictionRepository.getAverageHfProbByUser(user),
            "normal", predictionRepository.getAverageNormalProbByUser(user)
        );
    }

    /**
     * 사용자의 가장 최근 진단 결과 조회
     * @param user 사용자
     * @return 최근 진단 결과
     */
    public Optional<Prediction> findLatestPrediction(User user) {
        return predictionRepository.findFirstByUserOrderByPredictTimeDesc(user);
    }

    /**
     * 진단 데이터 유효성 검증
     * @param prediction 진단 결과
     */
    private void validatePredictionData(Prediction prediction) {
        if (prediction.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (prediction.getCheck() == null) {
            throw new IllegalArgumentException("Check cannot be null");
        }

        // 확률 값 유효성 검증 (0-100 범위)
        validateProbability("angina", prediction.getAngina());
        validateProbability("mi", prediction.getMi());
        validateProbability("hf", prediction.getHf());
        validateProbability("af", prediction.getAf());
        validateProbability("other", prediction.getOther());
        validateProbability("normal", prediction.getNormal());

        // 확률 합계 검증 (100%에 가까운지)
        BigDecimal totalProbability = prediction.getAngina()
                .add(prediction.getMi())
                .add(prediction.getHf())
                .add(prediction.getAf())
                .add(prediction.getOther())
                .add(prediction.getNormal());

        BigDecimal difference = totalProbability.subtract(new BigDecimal("100.00")).abs();
        if (difference.compareTo(new BigDecimal("1.00")) > 0) {
            throw new IllegalArgumentException("Total probability should be close to 100%");
        }

        log.debug("Prediction data validation passed for user: {}", prediction.getUser().getUserId());
    }

    /**
     * 개별 확률 값 유효성 검증
     * @param diseaseType 질환 타입
     * @param probability 확률 값
     */
    private void validateProbability(String diseaseType, BigDecimal probability) {
        if (probability == null) {
            throw new IllegalArgumentException(diseaseType + " probability cannot be null");
        }

        if (probability.compareTo(BigDecimal.ZERO) < 0 || probability.compareTo(new BigDecimal("100.00")) > 0) {
            throw new IllegalArgumentException(diseaseType + " probability must be between 0 and 100");
        }
    }

    /**
     * 진단 결과 위험도 평가
     * @param prediction 진단 결과
     * @return 위험도 (LOW, MEDIUM, HIGH, CRITICAL)
     */
    public String assessRiskLevel(Prediction prediction) {
        BigDecimal highestProbability = prediction.getHighestProbability();
        String diagnosis = prediction.getHighestProbabilityDiagnosis();

        if ("NORMAL".equals(diagnosis)) {
            return "LOW";
        }

        if (highestProbability.compareTo(new BigDecimal("80.00")) >= 0) {
            return "CRITICAL";
        } else if (highestProbability.compareTo(new BigDecimal("60.00")) >= 0) {
            return "HIGH";
        } else if (highestProbability.compareTo(new BigDecimal("40.00")) >= 0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    /**
     * 의료진 검토 권장 여부 판정
     * @param prediction 진단 결과
     * @return 의료진 검토 권장 여부
     */
    public boolean isRecommendMedicalReview(Prediction prediction) {
        return prediction.isRecommendMedicalReview();
    }

    /**
     * 진단 통계 - 전체 진단 수
     * @return 전체 진단 수
     */
    public long countAllPredictions() {
        return predictionRepository.countAllPredictions();
    }

    /**
     * 진단 통계 - 특정 기간 진단 수
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 해당 기간 진단 수
     */
    public long countPredictionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return predictionRepository.countPredictionsByDateRange(startDate, endDate);
    }

    /**
     * 질환별 진단 통계 - 높은 확률 진단 수
     * @param diseaseType 질환 타입
     * @param minProbability 최소 확률
     * @return 해당 질환 고확률 진단 수
     */
    public long countHighProbabilityPredictions(String diseaseType, BigDecimal minProbability) {
        return predictionRepository.countHighProbabilityPredictions(diseaseType, minProbability);
    }

    /**
     * 가장 높은 확률의 진단명별 통계
     * @param diagnosisType 진단명
     * @return 해당 진단의 개수
     */
    public long countByHighestProbabilityDiagnosis(String diagnosisType) {
        return predictionRepository.countByHighestProbabilityDiagnosis(diagnosisType);
    }

    /**
     * 심각한 진단 결과 알림 생성
     * @param prediction 진단 결과
     * @return 알림 메시지
     */
    public String generateAlertMessage(Prediction prediction) {
        String diagnosis = prediction.getDiagnosisKoreanName();
        BigDecimal probability = prediction.getHighestProbability();

        if (prediction.isRecommendMedicalReview()) {
            return String.format("%s 확률이 %.1f%%입니다. 의료진 검토를 권장합니다.",
                               diagnosis, probability);
        } else if (!"정상".equals(diagnosis)) {
            return String.format("%s 가능성이 %.1f%%입니다. 지속적인 관찰이 필요합니다.",
                               diagnosis, probability);
        } else {
            return "정상 범위입니다. 정기적인 건강 검진을 권장합니다.";
        }
    }

    /**
     * 개인별 건강 트렌드 분석
     * @param user 사용자
     * @param months 분석 기간 (개월)
     * @return 건강 트렌드 분석 결과
     */
    public Map<String, Object> analyzeHealthTrend(User user, int months) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(months);

        List<Prediction> predictions = findPredictionsByDateRange(user, startDate, endDate);

        if (predictions.isEmpty()) {
            return Map.of("trend", "NO_DATA", "message", "분석할 데이터가 충분하지 않습니다.");
        }

        // 최근 vs 이전 평균 비교
        int recentCount = Math.min(5, predictions.size());
        List<Prediction> recentPredictions = predictions.subList(0, recentCount);

        double recentAvgRisk = recentPredictions.stream()
                .mapToDouble(p -> p.getHighestProbability().doubleValue())
                .average()
                .orElse(0.0);

        double overallAvgRisk = predictions.stream()
                .mapToDouble(p -> p.getHighestProbability().doubleValue())
                .average()
                .orElse(0.0);

        String trend;
        String message;

        if (recentAvgRisk > overallAvgRisk + 10) {
            trend = "WORSENING";
            message = "최근 건강 상태가 악화되고 있습니다. 의료진 상담을 권장합니다.";
        } else if (recentAvgRisk < overallAvgRisk - 10) {
            trend = "IMPROVING";
            message = "건강 상태가 개선되고 있습니다. 현재 관리 방법을 유지하세요.";
        } else {
            trend = "STABLE";
            message = "건강 상태가 안정적입니다. 정기적인 검진을 계속하세요.";
        }

        return Map.of(
            "trend", trend,
            "message", message,
            "recentAvgRisk", recentAvgRisk,
            "overallAvgRisk", overallAvgRisk,
            "totalPredictions", predictions.size()
        );
    }
}