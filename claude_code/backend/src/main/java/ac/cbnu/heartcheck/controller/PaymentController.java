package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.response.ApiResponse;
import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * PaymentController for Heart Doctor system
 * 결제 관리 REST API 엔드포인트
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 생성
     * POST /api/v1/payments
     *
     * @param request 결제 요청
     * @return 생성된 결제 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Payment>> createPayment(@RequestBody PaymentRequest request) {
        log.info("Creating payment: userId={}, planId={}, store={}",
                request.getUserId(), request.getPlanId(), request.getStoreInfo());

        try {
            Payment payment = paymentService.createPayment(
                    request.getUserId(),
                    request.getPlanId(),
                    request.getStoreInfo()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 생성 실패: " + e.getMessage()));
        }
    }

    /**
     * 결제 완료 처리
     * PUT /api/v1/payments/{paymentId}/complete
     *
     * @param paymentId 결제 ID
     * @param request 결제 완료 요청
     * @return 완료된 결제 정보
     */
    @PutMapping("/{paymentId}/complete")
    public ResponseEntity<ApiResponse<Payment>> completePayment(
            @PathVariable Long paymentId,
            @RequestBody PaymentCompleteRequest request) {
        log.info("Completing payment: paymentId={}, transactionId={}",
                paymentId, request.getTransactionId());

        try {
            Payment payment = paymentService.completePayment(paymentId, request.getTransactionId());
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid payment state", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error completing payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 완료 실패: " + e.getMessage()));
        }
    }

    /**
     * 결제 실패 처리
     * PUT /api/v1/payments/{paymentId}/fail
     *
     * @param paymentId 결제 ID
     * @return 실패 처리된 결제 정보
     */
    @PutMapping("/{paymentId}/fail")
    public ResponseEntity<ApiResponse<Payment>> failPayment(@PathVariable Long paymentId) {
        log.info("Failing payment: paymentId={}", paymentId);

        try {
            Payment payment = paymentService.failPayment(paymentId);
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid payment state", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error failing payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 실패 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 결제 취소
     * PUT /api/v1/payments/{paymentId}/cancel
     *
     * @param paymentId 결제 ID
     * @return 취소된 결제 정보
     */
    @PutMapping("/{paymentId}/cancel")
    public ResponseEntity<ApiResponse<Payment>> cancelPayment(@PathVariable Long paymentId) {
        log.info("Canceling payment: paymentId={}", paymentId);

        try {
            Payment payment = paymentService.cancelPayment(paymentId);
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid payment state", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error canceling payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 취소 실패: " + e.getMessage()));
        }
    }

    /**
     * 환불 처리
     * POST /api/v1/payments/{paymentId}/refund
     *
     * @param paymentId 결제 ID
     * @return 환불된 결제 정보
     */
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<Payment>> refundPayment(@PathVariable Long paymentId) {
        log.info("Refunding payment: paymentId={}", paymentId);

        try {
            Payment payment = paymentService.refundPayment(paymentId);
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid payment state", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error refunding payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("환불 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 결제 조회
     * GET /api/v1/payments/{paymentId}
     *
     * @param paymentId 결제 ID
     * @return 결제 정보
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Payment>> getPayment(@PathVariable Long paymentId) {
        log.info("Fetching payment: paymentId={}", paymentId);

        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 트랜잭션 ID로 결제 조회
     * GET /api/v1/payments/transaction/{transactionId}
     *
     * @param transactionId 트랜잭션 ID
     * @return 결제 정보
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentByTransaction(@PathVariable String transactionId) {
        log.info("Fetching payment by transaction ID: {}", transactionId);

        try {
            Payment payment = paymentService.getPaymentByTransactionId(transactionId);
            return ResponseEntity.ok(ApiResponse.success(payment));
        } catch (IllegalArgumentException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자 결제 이력 조회
     * GET /api/v1/payments/history/{userId}
     *
     * @param userId 사용자 ID
     * @param pageable 페이지 정보
     * @return 결제 이력
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<Page<Payment>>> getUserPaymentHistory(
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "createTime", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching payment history for user: userId={}", userId);

        try {
            Page<Payment> payments = paymentService.getUserPaymentHistory(userId, pageable);
            return ResponseEntity.ok(ApiResponse.success(payments));
        } catch (IllegalArgumentException e) {
            log.error("User not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching payment history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("결제 이력 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자 성공 결제 목록 조회
     * GET /api/v1/payments/successful/{userId}
     *
     * @param userId 사용자 ID
     * @return 성공한 결제 목록
     */
    @GetMapping("/successful/{userId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getUserSuccessfulPayments(@PathVariable Long userId) {
        log.info("Fetching successful payments for user: userId={}", userId);

        try {
            List<Payment> payments = paymentService.getUserSuccessfulPayments(userId);
            return ResponseEntity.ok(ApiResponse.success(payments));
        } catch (IllegalArgumentException e) {
            log.error("User not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching successful payments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("성공 결제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자 최근 결제 조회
     * GET /api/v1/payments/latest/{userId}
     *
     * @param userId 사용자 ID
     * @return 최근 결제 정보
     */
    @GetMapping("/latest/{userId}")
    public ResponseEntity<ApiResponse<Payment>> getUserLatestPayment(@PathVariable Long userId) {
        log.info("Fetching latest payment for user: userId={}", userId);

        try {
            Payment payment = paymentService.getUserLatestPayment(userId);
            if (payment != null) {
                return ResponseEntity.ok(ApiResponse.success(payment));
            } else {
                return ResponseEntity.ok(ApiResponse.success(null, "결제 이력이 없습니다"));
            }
        } catch (IllegalArgumentException e) {
            log.error("User not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching latest payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("최근 결제 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 매출 통계 조회 (관리자)
     * GET /api/v1/payments/stats/revenue
     *
     * @param startDate 시작일 (선택)
     * @param endDate 종료일 (선택)
     * @return 매출 통계
     */
    @GetMapping("/stats/revenue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueStats(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        log.info("Fetching revenue stats: startDate={}, endDate={}", startDate, endDate);

        try {
            // 기본값 설정: 최근 30일
            if (startDate == null) {
                startDate = LocalDateTime.now().minusDays(30);
            }
            if (endDate == null) {
                endDate = LocalDateTime.now();
            }

            BigDecimal revenue = paymentService.calculateRevenue(startDate, endDate);

            Map<String, Object> stats = new HashMap<>();
            stats.put("startDate", startDate);
            stats.put("endDate", endDate);
            stats.put("totalRevenue", revenue);
            stats.put("formattedRevenue", String.format("%,d원", revenue.intValue()));

            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Error fetching revenue stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("매출 통계 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 요금제별 결제 통계 조회 (관리자)
     * GET /api/v1/payments/stats/by-plan
     *
     * @return 요금제별 통계
     */
    @GetMapping("/stats/by-plan")
    public ResponseEntity<ApiResponse<List<Object[]>>> getPaymentStatsByPlan() {
        log.info("Fetching payment stats by plan");

        try {
            List<Object[]> stats = paymentService.getPaymentStatsByPlan();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Error fetching payment stats by plan", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("요금제별 통계 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 결제 요청 DTO
     */
    public static class PaymentRequest {
        private Long userId;
        private Short planId;
        private String storeInfo; // G/A

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

        public String getStoreInfo() {
            return storeInfo;
        }

        public void setStoreInfo(String storeInfo) {
            this.storeInfo = storeInfo;
        }
    }

    /**
     * 결제 완료 요청 DTO
     */
    public static class PaymentCompleteRequest {
        private String transactionId;

        public String getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }
    }
}
