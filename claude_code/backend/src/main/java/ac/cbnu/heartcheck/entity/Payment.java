package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Payment entity for Heart Doctor system
 * 사용자 결제 정보 및 상태 기록
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_user", columnList = "user_id"),
    @Index(name = "idx_payment_subscription", columnList = "subscription_id"),
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_transaction", columnList = "transaction_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription; // 연결된 구독

    @NotNull(message = "요금제는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cost_id", nullable = false)
    private CostModel costModel; // 요금제 참조

    @NotNull(message = "결제 상태는 필수입니다")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    @NotNull(message = "결제 완료 시간은 필수입니다")
    @Column(name = "pay_time", nullable = false)
    private LocalDateTime payTime; // 결제 완료 시간

    @NotBlank(message = "결제 스토어 정보는 필수입니다")
    @Size(min = 1, max = 1, message = "결제 스토어 정보는 1자여야 합니다")
    @Column(name = "store_info", length = 1, nullable = false)
    private String storeInfo; // G/A (구글/애플)

    @Size(max = 100, message = "트랜잭션 ID는 100자를 초과할 수 없습니다")
    @Column(name = "transaction_id", length = 100, unique = true)
    private String transactionId; // 트랜잭션 식별자

    @CreationTimestamp
    @Column(name = "create_time")
    private LocalDateTime createTime; // 생성 시간

    /**
     * 결제 상태 ENUM
     */
    public enum PaymentStatus {
        PENDING("대기중"),
        SUCCESS("성공"),
        FAIL("실패"),
        CANCELED("취소"),
        REFUNDED("환불");

        private final String description;

        PaymentStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 결제 스토어 ENUM
     */
    public enum StoreType {
        GOOGLE("G", "구글 플레이 스토어"),
        APPLE("A", "애플 앱 스토어");

        private final String code;
        private final String description;

        StoreType(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }

        public static StoreType fromCode(String code) {
            for (StoreType type : values()) {
                if (type.code.equals(code)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown store code: " + code);
        }
    }

    /**
     * 결제가 성공했는지 확인
     * @return 성공 여부
     */
    public boolean isSuccess() {
        return PaymentStatus.SUCCESS.equals(status);
    }

    /**
     * 결제가 실패했는지 확인
     * @return 실패 여부
     */
    public boolean isFailed() {
        return PaymentStatus.FAIL.equals(status);
    }

    /**
     * 결제가 취소되었는지 확인
     * @return 취소 여부
     */
    public boolean isCanceled() {
        return PaymentStatus.CANCELED.equals(status);
    }

    /**
     * 결제가 환불되었는지 확인
     * @return 환불 여부
     */
    public boolean isRefunded() {
        return PaymentStatus.REFUNDED.equals(status);
    }

    /**
     * 결제가 대기 중인지 확인
     * @return 대기 중 여부
     */
    public boolean isPending() {
        return PaymentStatus.PENDING.equals(status);
    }

    /**
     * 구글 플레이 스토어 결제인지 확인
     * @return 구글 플레이 스토어 여부
     */
    public boolean isGooglePlay() {
        return "G".equals(storeInfo);
    }

    /**
     * 애플 앱 스토어 결제인지 확인
     * @return 애플 앱 스토어 여부
     */
    public boolean isAppStore() {
        return "A".equals(storeInfo);
    }

    /**
     * 스토어 타입 반환
     * @return 스토어 타입
     */
    public StoreType getStoreType() {
        try {
            return StoreType.fromCode(storeInfo);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * 스토어 설명 반환
     * @return 스토어 설명
     */
    public String getStoreDescription() {
        StoreType storeType = getStoreType();
        return storeType != null ? storeType.getDescription() : "알 수 없는 스토어";
    }

    /**
     * 결제 금액 반환 (요금제에서)
     * @return 결제 금액
     */
    public Integer getPaymentAmount() {
        return costModel != null ? costModel.getCost() : 0;
    }

    /**
     * 요금제 타입 반환
     * @return 요금제 타입
     */
    public CostModel.CostType getCostType() {
        return costModel != null ? costModel.getType() : null;
    }

    /**
     * 포맷된 결제 금액 반환
     * @return 포맷된 금액 문자열
     */
    public String getFormattedAmount() {
        Integer amount = getPaymentAmount();
        return String.format("%,d원", amount);
    }

    /**
     * 결제 완료 처리
     * @param transactionId 트랜잭션 ID
     */
    public void markAsSuccess(String transactionId) {
        this.status = PaymentStatus.SUCCESS;
        this.transactionId = transactionId;
        this.payTime = LocalDateTime.now();
    }

    /**
     * 결제 실패 처리
     */
    public void markAsFailed() {
        this.status = PaymentStatus.FAIL;
        this.payTime = LocalDateTime.now();
    }

    /**
     * 결제 취소 처리
     */
    public void markAsCanceled() {
        this.status = PaymentStatus.CANCELED;
        this.payTime = LocalDateTime.now();
    }

    /**
     * 환불 처리
     */
    public void markAsRefunded() {
        this.status = PaymentStatus.REFUNDED;
    }
}