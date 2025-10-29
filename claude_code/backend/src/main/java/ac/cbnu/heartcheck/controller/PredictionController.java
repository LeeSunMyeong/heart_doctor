package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.request.PredictionRequest;
import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.Prediction;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.service.PredictionService;
import ac.cbnu.heartcheck.service.UserDetailsServiceImpl.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Prediction Controller
 * Heart Doctor AI 진단 결과 REST API 컨트롤러
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    /**
     * AI 진단 결과 저장 (Mock 데이터 생성)
     * POST /api/predictions
     * User data is extracted from JWT token via @AuthenticationPrincipal
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPrediction(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PredictionRequest request) {
        try {
            // JWT 토큰에서 userId 추출
            Long userId = userDetails.getUser().getUserId();
            log.info("Creating new prediction for user: {} (from JWT), checkId: {}", userId, request.getCheckId());

            Prediction savedPrediction = predictionService.savePrediction(request, userId);
            String riskLevel = predictionService.assessRiskLevel(savedPrediction);
            boolean medicalReviewRecommended = predictionService.isRecommendMedicalReview(savedPrediction);
            String alertMessage = predictionService.generateAlertMessage(savedPrediction);

            Map<String, Object> response = Map.of(
                "success", true,
                "message", "AI 진단 결과가 성공적으로 저장되었습니다.",
                "data", Map.of(
                    "predictionId", savedPrediction.getId(),
                    "predictTime", savedPrediction.getPredictTime(),
                    "diagnosis", savedPrediction.getHighestProbabilityDiagnosis(),
                    "diagnosisKorean", savedPrediction.getDiagnosisKoreanName(),
                    "highestProbability", savedPrediction.getHighestProbability(),
                    "probabilities", Map.of(
                        "normal", savedPrediction.getNormal(),
                        "angina", savedPrediction.getAngina(),
                        "mi", savedPrediction.getMi(),
                        "hf", savedPrediction.getHf(),
                        "af", savedPrediction.getAf(),
                        "other", savedPrediction.getOther()
                    ),
                    "riskLevel", riskLevel,
                    "medicalReviewRecommended", medicalReviewRecommended,
                    "alertMessage", alertMessage,
                    "comment", savedPrediction.getComment()
                )
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Error creating prediction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "AI 진단 결과 저장 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 검사별 진단 결과 조회
     * GET /api/predictions/check/{checkId}
     */
    @GetMapping("/check/{checkId}")
    public ResponseEntity<Map<String, Object>> getPredictionByCheck(@PathVariable Long checkId) {
        try {
            Check check = Check.builder().id(checkId).build();
            Optional<Prediction> predictionOpt = predictionService.findByCheck(check);

            if (predictionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Prediction prediction = predictionOpt.get();
            String riskLevel = predictionService.assessRiskLevel(prediction);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "prediction", prediction,
                    "diagnosis", prediction.getHighestProbabilityDiagnosis(),
                    "diagnosisKorean", prediction.getDiagnosisKoreanName(),
                    "riskLevel", riskLevel,
                    "medicalReviewRecommended", predictionService.isRecommendMedicalReview(prediction)
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving prediction for check: {}", checkId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자별 진단 결과 조회 (페이징)
     * GET /api/predictions/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPredictions(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "predictTime", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            User user = User.builder().userId(userId).build();
            Page<Prediction> predictionsPage = predictionService.findUserPredictions(user, pageable);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", predictionsPage.getContent(),
                    "totalElements", predictionsPage.getTotalElements(),
                    "totalPages", predictionsPage.getTotalPages(),
                    "currentPage", predictionsPage.getNumber(),
                    "size", predictionsPage.getSize()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving user predictions: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "진단 결과 이력 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자의 최근 진단 결과 조회
     * GET /api/predictions/user/{userId}/recent
     */
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<Map<String, Object>> getRecentPredictions(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> recentPredictions = predictionService.findRecentPredictions(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", recentPredictions,
                    "count", recentPredictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving recent predictions for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "최근 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자의 오늘 진단 결과 조회
     * GET /api/predictions/user/{userId}/today
     */
    @GetMapping("/user/{userId}/today")
    public ResponseEntity<Map<String, Object>> getTodayPredictions(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> todayPredictions = predictionService.findTodayPredictions(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", todayPredictions,
                    "count", todayPredictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving today predictions for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "오늘 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 특정 기간 진단 결과 조회
     * GET /api/predictions/user/{userId}/range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
     */
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<Map<String, Object>> getPredictionsByDateRange(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            User user = User.builder().userId(userId).build();

            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);

            List<Prediction> predictions = predictionService.findPredictionsByDateRange(user, start, end);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", predictions,
                    "count", predictions.size(),
                    "period", Map.of(
                        "startDate", start,
                        "endDate", end
                    )
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving predictions by date range for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "기간별 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 높은 위험도 진단 결과 조회
     * GET /api/predictions/user/{userId}/high-risk
     */
    @GetMapping("/user/{userId}/high-risk")
    public ResponseEntity<Map<String, Object>> getHighRiskPredictions(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> highRiskPredictions = predictionService.findHighRiskPredictions(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", highRiskPredictions,
                    "count", highRiskPredictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving high risk predictions for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "높은 위험도 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 의료진 검토 권장 진단 결과 조회
     * GET /api/predictions/user/{userId}/medical-review
     */
    @GetMapping("/user/{userId}/medical-review")
    public ResponseEntity<Map<String, Object>> getMedicalReviewRecommended(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> medicalReviewPredictions = predictionService.findMedicalReviewRecommended(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", medicalReviewPredictions,
                    "count", medicalReviewPredictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving medical review recommended predictions for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "의료진 검토 권장 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 특정 질환 고확률 진단 결과 조회
     * GET /api/predictions/user/{userId}/disease/{diseaseType}?minProbability=60.0
     */
    @GetMapping("/user/{userId}/disease/{diseaseType}")
    public ResponseEntity<Map<String, Object>> getHighDiseaseProb(
            @PathVariable Long userId,
            @PathVariable String diseaseType,
            @RequestParam(defaultValue = "60.0") BigDecimal minProbability) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> predictions = predictionService.findHighDiseaseProb(user, diseaseType, minProbability);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", predictions,
                    "diseaseType", diseaseType,
                    "minProbability", minProbability,
                    "count", predictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving high disease probability predictions for user: {} disease: {}", userId, diseaseType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "특정 질환 고확률 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 정상 진단 결과 조회
     * GET /api/predictions/user/{userId}/normal?minNormalProb=70.0
     */
    @GetMapping("/user/{userId}/normal")
    public ResponseEntity<Map<String, Object>> getNormalPredictions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "70.0") BigDecimal minNormalProb) {
        try {
            User user = User.builder().userId(userId).build();
            List<Prediction> normalPredictions = predictionService.findNormalPredictions(user, minNormalProb);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "predictions", normalPredictions,
                    "minNormalProbability", minNormalProb,
                    "count", normalPredictions.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving normal predictions for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "정상 진단 결과 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자별 질환 통계 조회
     * GET /api/predictions/user/{userId}/statistics
     */
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserPredictionStatistics(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();

            Map<String, Double> diseaseStatistics = predictionService.getDiseaseStatistics(user);
            Optional<Prediction> latestPrediction = predictionService.findLatestPrediction(user);

            Map<String, Object> statistics = Map.of(
                "diseaseStatistics", diseaseStatistics,
                "hasLatestPrediction", latestPrediction.isPresent(),
                "latestPredictionTime", latestPrediction.map(Prediction::getPredictTime).orElse(null),
                "latestDiagnosis", latestPrediction.map(Prediction::getDiagnosisKoreanName).orElse("없음"),
                "latestRiskLevel", latestPrediction.map(predictionService::assessRiskLevel).orElse("UNKNOWN")
            );

            Map<String, Object> response = Map.of(
                "success", true,
                "data", statistics
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving prediction statistics for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "진단 통계 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 개인별 건강 트렌드 분석
     * GET /api/predictions/user/{userId}/trend?months=6
     */
    @GetMapping("/user/{userId}/trend")
    public ResponseEntity<Map<String, Object>> getHealthTrend(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "6") int months) {
        try {
            User user = User.builder().userId(userId).build();
            Map<String, Object> trendAnalysis = predictionService.analyzeHealthTrend(user, months);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", trendAnalysis
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error analyzing health trend for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "건강 트렌드 분석 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 시스템 전체 진단 통계
     * GET /api/predictions/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSystemStatistics() {
        try {
            long totalPredictions = predictionService.countAllPredictions();

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime todayStart = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime todayEnd = todayStart.plusDays(1).minusNanos(1);
            long todayPredictions = predictionService.countPredictionsByDateRange(todayStart, todayEnd);

            LocalDateTime weekStart = now.minusWeeks(1);
            long weekPredictions = predictionService.countPredictionsByDateRange(weekStart, now);

            // 질환별 통계
            long anginaCount = predictionService.countByHighestProbabilityDiagnosis("ANGINA");
            long miCount = predictionService.countByHighestProbabilityDiagnosis("MYOCARDIAL_INFARCTION");
            long hfCount = predictionService.countByHighestProbabilityDiagnosis("HEART_FAILURE");
            long afCount = predictionService.countByHighestProbabilityDiagnosis("ATRIAL_FIBRILLATION");
            long otherCount = predictionService.countByHighestProbabilityDiagnosis("OTHER");
            long normalCount = predictionService.countByHighestProbabilityDiagnosis("NORMAL");

            Map<String, Object> statistics = Map.of(
                "totalPredictions", totalPredictions,
                "todayPredictions", todayPredictions,
                "weekPredictions", weekPredictions,
                "diagnosisDistribution", Map.of(
                    "ANGINA", anginaCount,
                    "MYOCARDIAL_INFARCTION", miCount,
                    "HEART_FAILURE", hfCount,
                    "ATRIAL_FIBRILLATION", afCount,
                    "OTHER", otherCount,
                    "NORMAL", normalCount
                )
            );

            Map<String, Object> response = Map.of(
                "success", true,
                "data", statistics
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving system prediction statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "시스템 진단 통계 조회 중 오류가 발생했습니다."
            ));
        }
    }
}