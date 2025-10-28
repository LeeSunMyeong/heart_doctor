package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.entity.DailyUsageQuota;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.service.DailyUsageQuotaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Daily Usage Quota Controller
 * Heart Doctor 일일 사용량 제한 REST API 컨트롤러
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
public class DailyUsageQuotaController {

    private final DailyUsageQuotaService dailyUsageQuotaService;

    /**
     * 사용자의 오늘 사용량 정보 조회
     * GET /api/usage/user/{userId}/today
     */
    @GetMapping("/user/{userId}/today")
    public ResponseEntity<Map<String, Object>> getTodayUsageInfo(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            DailyUsageQuotaService.DailyUsageInfo usageInfo = dailyUsageQuotaService.getUsageInfo(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "userId", usageInfo.getUserId(),
                    "date", usageInfo.getDate(),
                    "currentUsage", usageInfo.getCurrentUsage(),
                    "dailyLimit", usageInfo.getDailyLimit(),
                    "remainingUsage", usageInfo.getRemainingUsage(),
                    "canUse", usageInfo.isCanUse(),
                    "usagePercentage", usageInfo.getDailyLimit() > 0 ?
                        (double) usageInfo.getCurrentUsage() / usageInfo.getDailyLimit() * 100.0 : 0.0
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving today usage info for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "오늘 사용량 정보 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용 가능 여부 확인
     * GET /api/usage/user/{userId}/can-use
     */
    @GetMapping("/user/{userId}/can-use")
    public ResponseEntity<Map<String, Object>> checkCanUse(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();
            boolean canUse = dailyUsageQuotaService.canUseService(user);
            int currentUsage = dailyUsageQuotaService.getTodayUsageCount(user);
            int dailyLimit = dailyUsageQuotaService.getDailyLimit(user);
            int remaining = dailyUsageQuotaService.getRemainingUsage(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "canUse", canUse,
                    "currentUsage", currentUsage,
                    "dailyLimit", dailyLimit,
                    "remainingUsage", remaining,
                    "message", canUse ? "사용 가능합니다." : "일일 사용량 제한에 도달했습니다."
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error checking usage availability for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "사용 가능 여부 확인 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용량 증가
     * POST /api/usage/user/{userId}/increment
     */
    @PostMapping("/user/{userId}/increment")
    public ResponseEntity<Map<String, Object>> incrementUsage(@PathVariable Long userId) {
        try {
            User user = User.builder().userId(userId).build();

            // 사용 가능 여부 먼저 확인
            if (!dailyUsageQuotaService.canUseService(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", "일일 사용량 제한에 도달했습니다.",
                    "data", Map.of(
                        "currentUsage", dailyUsageQuotaService.getTodayUsageCount(user),
                        "dailyLimit", dailyUsageQuotaService.getDailyLimit(user)
                    )
                ));
            }

            int newUsageCount = dailyUsageQuotaService.incrementUsage(user);
            int remainingUsage = dailyUsageQuotaService.getRemainingUsage(user);
            boolean canStillUse = dailyUsageQuotaService.canUseService(user);

            Map<String, Object> response = Map.of(
                "success", true,
                "message", "사용량이 증가되었습니다.",
                "data", Map.of(
                    "newUsageCount", newUsageCount,
                    "remainingUsage", remainingUsage,
                    "canStillUse", canStillUse,
                    "dailyLimit", dailyUsageQuotaService.getDailyLimit(user)
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error incrementing usage for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "사용량 증가 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 특정 기간 사용량 조회
     * GET /api/usage/user/{userId}/range?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<Map<String, Object>> getUsageByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            User user = User.builder().userId(userId).build();
            List<DailyUsageQuota> usageList = dailyUsageQuotaService.getUsageByDateRange(user, startDate, endDate);

            int totalUsage = usageList.stream().mapToInt(DailyUsageQuota::getCount).sum();
            double avgUsage = usageList.isEmpty() ? 0.0 :
                (double) totalUsage / usageList.size();

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "usageList", usageList,
                    "period", Map.of(
                        "startDate", startDate,
                        "endDate", endDate,
                        "days", usageList.size()
                    ),
                    "statistics", Map.of(
                        "totalUsage", totalUsage,
                        "averageUsage", avgUsage,
                        "maxUsage", usageList.stream().mapToInt(DailyUsageQuota::getCount).max().orElse(0)
                    )
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving usage by date range for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "기간별 사용량 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용량 초기화 (관리자용)
     * DELETE /api/usage/user/{userId}/reset?date=2024-01-01
     */
    @DeleteMapping("/user/{userId}/reset")
    public ResponseEntity<Map<String, Object>> resetUsage(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            User user = User.builder().userId(userId).build();
            LocalDate resetDate = date != null ? date : LocalDate.now();

            dailyUsageQuotaService.resetUsage(user, resetDate);

            Map<String, Object> response = Map.of(
                "success", true,
                "message", "사용량이 초기화되었습니다.",
                "data", Map.of(
                    "userId", userId,
                    "resetDate", resetDate
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error resetting usage for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "사용량 초기화 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용량 현황 대시보드 (관리자용)
     * GET /api/usage/dashboard?date=2024-01-01
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUsageDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            // TODO: 관리자 권한 확인 필요

            // 현재는 기본 통계만 제공
            LocalDate targetDate = date != null ? date : LocalDate.now();

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "date", targetDate,
                    "message", "사용량 대시보드 기능은 추후 구현 예정입니다."
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving usage dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "사용량 대시보드 조회 중 오류가 발생했습니다."
            ));
        }
    }

    /**
     * 사용자별 월간 사용량 통계
     * GET /api/usage/user/{userId}/monthly?year=2024&month=1
     */
    @GetMapping("/user/{userId}/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyUsage(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        try {
            User user = User.builder().userId(userId).build();

            LocalDate now = LocalDate.now();
            int targetYear = year != null ? year : now.getYear();
            int targetMonth = month != null ? month : now.getMonthValue();

            LocalDate startOfMonth = LocalDate.of(targetYear, targetMonth, 1);
            LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

            List<DailyUsageQuota> monthlyUsage = dailyUsageQuotaService.getUsageByDateRange(user, startOfMonth, endOfMonth);

            int totalUsage = monthlyUsage.stream().mapToInt(DailyUsageQuota::getCount).sum();
            long activeDays = monthlyUsage.stream().filter(q -> q.getCount() > 0).count();

            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "year", targetYear,
                    "month", targetMonth,
                    "totalUsage", totalUsage,
                    "activeDays", activeDays,
                    "totalDays", monthlyUsage.size(),
                    "dailyUsage", monthlyUsage
                )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error retrieving monthly usage for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "월간 사용량 조회 중 오류가 발생했습니다."
            ));
        }
    }
}