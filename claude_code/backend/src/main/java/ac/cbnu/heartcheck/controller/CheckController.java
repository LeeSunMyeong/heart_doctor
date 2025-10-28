package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.entity.Check;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.service.CheckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Check Controller
 * Heart Doctor 검사 REST API 컨트롤러
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/checks")
@RequiredArgsConstructor
public class CheckController {

    private final CheckService checkService;

    /**
     * 검사 결과 저장
     * POST /api/checks
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCheck(@Valid @RequestBody Check check) {
        try {
            log.info("Creating new check for user: {}", check.getUser().getUserId());

            Check savedCheck = checkService.saveCheck(check);
            String riskLevel = checkService.assessRiskLevel(savedCheck);
            boolean medicalReviewRecommended = checkService.isRecommendMedicalReview(savedCheck);

            Map<String, Object> response = Map.of(
                "success", true,
                "message", "검사가 성공적으로 저장되었습니다.",
                "data", Map.of(
                    "checkId", savedCheck.getId(),
                    "assessmentTime", savedCheck.getAssessmentTime(),
                    "symptomCount", savedCheck.getSymptomCount(),
                    "bmi", savedCheck.getBmi(),
                    "riskLevel", riskLevel,
                    "medicalReviewRecommended", medicalReviewRecommended
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
            log.error("Error creating check", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "검사 저장 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 검사 조회
     * GET /api/checks/{checkId}
     */
    @GetMapping("/{checkId}")
    public ResponseEntity<Map<String, Object>> getCheck(@PathVariable Long checkId) {
        try {
            Optional<Check> checkOpt = checkService.findById(checkId);

            if (checkOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Check check = checkOpt.get();
            String riskLevel = checkService.assessRiskLevel(check);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "check", check,
                    "riskLevel", riskLevel,
                    "medicalReviewRecommended", checkService.isRecommendMedicalReview(check)
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving check: {}", checkId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자별 검사 이력 조회 (페이징)
     * GET /api/checks/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserChecks(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "assessmentTime", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            User user = User.builder().userId(userId).build();
            Page<Check> checksPage = checkService.findUserChecks(user, pageable);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", checksPage.getContent(),
                    "totalElements", checksPage.getTotalElements(),
                    "totalPages", checksPage.getTotalPages(),
                    "currentPage", checksPage.getNumber(),
                    "size", checksPage.getSize()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving user checks: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "검사 이력 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자의 최근 검사 조회
     * GET /api/checks/user/{userId}/recent
     */
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<Map<String, Object>> getRecentChecks(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Check> recentChecks = checkService.findRecentChecks(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", recentChecks,
                    "count", recentChecks.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving recent checks for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "최근 검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자의 오늘 검사 조회
     * GET /api/checks/user/{userId}/today
     */
    @GetMapping("/user/{userId}/today")
    public ResponseEntity<Map<String, Object>> getTodayChecks(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Check> todayChecks = checkService.findTodayChecks(user);
            long todayCount = checkService.countTodayChecks(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", todayChecks,
                    "count", todayCount
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving today checks for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "오늘 검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 특정 기간 검사 조회
     * GET /api/checks/user/{userId}/range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
     */
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<Map<String, Object>> getChecksByDateRange(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            User user = User.builder().userId(userId).build();

            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);

            List<Check> checks = checkService.findChecksByDateRange(user, start, end);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", checks,
                    "count", checks.size(),
                    "period", Map.of(
                        "startDate", start,
                        "endDate", end
                    )
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving checks by date range for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "기간별 검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 높은 위험도 검사 조회
     * GET /api/checks/user/{userId}/high-risk
     */
    @GetMapping("/user/{userId}/high-risk")
    public ResponseEntity<Map<String, Object>> getHighRiskChecks(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            List<Check> highRiskChecks = checkService.findHighRiskChecks(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", highRiskChecks,
                    "count", highRiskChecks.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving high risk checks for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "높은 위험도 검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 특정 증상을 가진 검사 조회
     * GET /api/checks/user/{userId}/symptom/{symptomName}
     */
    @GetMapping("/user/{userId}/symptom/{symptomName}")
    public ResponseEntity<Map<String, Object>> getChecksBySymptom(
            @PathVariable Long userId,
            @PathVariable String symptomName) {
        try {
            User user = User.builder().userId(userId).build();
            List<Check> checks = checkService.findChecksBySymptom(user, symptomName);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "checks", checks,
                    "symptom", symptomName,
                    "count", checks.size()
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving checks by symptom for user: {} symptom: {}", userId, symptomName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "증상별 검사 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자 검사 통계 조회
     * GET /api/checks/user/{userId}/statistics
     */
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserCheckStatistics(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();

            Double avgSymptomCount = checkService.getAverageSymptomCount(user);
            Optional<Check> latestCheck = checkService.findLatestCheck(user);
            long todayCount = checkService.countTodayChecks(user);

            Map<String, Object> statistics = Map.of(
                "averageSymptomCount", avgSymptomCount != null ? avgSymptomCount : 0.0,
                "todayCheckCount", todayCount,
                "hasLatestCheck", latestCheck.isPresent(),
                "latestCheckTime", latestCheck.map(Check::getAssessmentTime).orElse(null),
                "latestRiskLevel", latestCheck.map(checkService::assessRiskLevel).orElse("UNKNOWN")
            );

            Map<String, Object> response = Map.of(
                "success", true,
                "data", statistics
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving check statistics for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "검사 통계 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 시스템 전체 검사 통계
     * GET /api/checks/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSystemStatistics() {
        try {
            long totalChecks = checkService.countAllChecks();

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime todayStart = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime todayEnd = todayStart.plusDays(1).minusNanos(1);
            long todayChecks = checkService.countChecksByDateRange(todayStart, todayEnd);

            LocalDateTime weekStart = now.minusWeeks(1);
            long weekChecks = checkService.countChecksByDateRange(weekStart, now);

            Map<String, Object> statistics = Map.of(
                "totalChecks", totalChecks,
                "todayChecks", todayChecks,
                "weekChecks", weekChecks
            );

            Map<String, Object> response = Map.of(
                "success", true,
                "data", statistics
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving system statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "시스템 통계 조회 중 오류가 발생했습니다."
            ));
        }
    }
}