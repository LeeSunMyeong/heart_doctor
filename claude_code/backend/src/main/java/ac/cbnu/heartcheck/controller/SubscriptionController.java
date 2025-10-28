package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.response.ApiResponse;
import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.service.CostModelService;
import ac.cbnu.heartcheck.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SubscriptionController for Heart Doctor system
 * 구독 관리 REST API 엔드포인트
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final CostModelService costModelService;

    /**
     * 모든 요금제 조회
     * GET /api/v1/subscriptions/plans
     *
     * @return 요금제 목록
     */
    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<CostModel>>> getAllPlans() {
        log.info("Fetching all subscription plans");

        try {
            List<CostModel> plans = costModelService.getAllPlans();
            return ResponseEntity.ok(ApiResponse.success(plans));
        } catch (Exception e) {
            log.error("Error fetching plans", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("요금제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 특정 요금제 조회
     * GET /api/v1/subscriptions/plans/{planId}
     *
     * @param planId 요금제 ID
     * @return 요금제 정보
     */
    @GetMapping("/plans/{planId}")
    public ResponseEntity<ApiResponse<CostModel>> getPlanById(@PathVariable Short planId) {
        log.info("Fetching plan by ID: {}", planId);

        try {
            CostModel plan = costModelService.getPlanById(planId);
            return ResponseEntity.ok(ApiResponse.success(plan));
        } catch (IllegalArgumentException e) {
            log.error("Plan not found: {}", planId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching plan", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("요금제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자의 모든 구독 조회
     * GET /api/v1/subscriptions/user/{userId}
     *
     * @param userId 사용자 ID
     * @return 구독 목록
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Subscription>>> getUserSubscriptions(@PathVariable Long userId) {
        log.info("Fetching subscriptions for user: {}", userId);

        try {
            List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
            return ResponseEntity.ok(ApiResponse.success(subscriptions));
        } catch (Exception e) {
            log.error("Error fetching user subscriptions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("구독 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자의 활성 구독 조회
     * GET /api/v1/subscriptions/user/{userId}/active
     *
     * @param userId 사용자 ID
     * @return 활성 구독 정보
     */
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getActiveSubscription(@PathVariable Long userId) {
        log.info("Fetching active subscription for user: {}", userId);

        try {
            Subscription subscription = subscriptionService.getValidSubscription(userId);
            Map<String, Object> result = new HashMap<>();

            if (subscription != null) {
                result.put("hasActiveSubscription", true);
                result.put("subscription", subscription);
                result.put("remainingDays", subscription.getRemainingDays());
                result.put("dailyLimit", subscription.getDailyLimit());
            } else {
                result.put("hasActiveSubscription", false);
                result.put("subscription", null);
                result.put("dailyLimit", 1); // 무료 사용자는 1회
            }

            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            log.error("Error fetching active subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("활성 구독 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 새로운 구독 신청
     * POST /api/v1/subscriptions
     *
     * @param request 구독 신청 요청
     * @return 생성된 구독 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Subscription>> createSubscription(@RequestBody SubscriptionRequest request) {
        log.info("Creating subscription: userId={}, planId={}", request.getUserId(), request.getPlanId());

        try {
            Subscription subscription = subscriptionService.createSubscription(
                    request.getUserId(),
                    request.getPlanId()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(subscription));
        } catch (IllegalArgumentException e) {
            log.error("Invalid subscription request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Subscription already exists", e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("구독 생성 실패: " + e.getMessage()));
        }
    }

    /**
     * 구독 취소
     * PUT /api/v1/subscriptions/{subscriptionId}/cancel
     *
     * @param subscriptionId 구독 ID
     * @return 취소된 구독 정보
     */
    @PutMapping("/{subscriptionId}/cancel")
    public ResponseEntity<ApiResponse<Subscription>> cancelSubscription(@PathVariable Long subscriptionId) {
        log.info("Canceling subscription: {}", subscriptionId);

        try {
            Subscription subscription = subscriptionService.cancelSubscription(subscriptionId);
            return ResponseEntity.ok(ApiResponse.success(subscription));
        } catch (IllegalArgumentException e) {
            log.error("Subscription not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid subscription state", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error canceling subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("구독 취소 실패: " + e.getMessage()));
        }
    }

    /**
     * 구독 조회
     * GET /api/v1/subscriptions/{subscriptionId}
     *
     * @param subscriptionId 구독 ID
     * @return 구독 정보
     */
    @GetMapping("/{subscriptionId}")
    public ResponseEntity<ApiResponse<Subscription>> getSubscription(@PathVariable Long subscriptionId) {
        log.info("Fetching subscription: {}", subscriptionId);

        try {
            Subscription subscription = subscriptionService.getSubscriptionById(subscriptionId);
            return ResponseEntity.ok(ApiResponse.success(subscription));
        } catch (IllegalArgumentException e) {
            log.error("Subscription not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("구독 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 구독 신청 요청 DTO
     */
    public static class SubscriptionRequest {
        private Long userId;
        private Short planId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Short getPlanId() {
            return planId;
        }

        public void setPlanId(Short planId) {
            this.planId = planId;
        }
    }
}
