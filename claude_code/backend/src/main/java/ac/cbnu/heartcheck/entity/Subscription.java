package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Subscription entity for Heart Doctor system
 * 사용자 구독 상태
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "subscriptions", indexes = {
    @Index(name = "idx_subscription_user", columnList = "user_id"),
    @Index(name = "idx_subscription_status", columnList = "status"),
    @Index(name = "idx_subscription_dates", columnList = "from_date, to_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "요금제는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cost_id", nullable = false)
    private CostModel costModel;

    @Column(name = "from_date")
    private LocalDateTime fromDate; // 시작일

    @Column(name = "to_date")
    private LocalDateTime toDate; // 종료일

    @NotNull(message = "구독 상태는 필수입니다")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubscriptionStatus status;

    // 관계 매핑
    @Builder.Default
    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    /**
     * 구독 상태 ENUM
     */
    public enum SubscriptionStatus {
        ACTIVE("활성"),
        PENDING("대기중"),
        EXPIRED("만료"),
        CANCELED("취소");

        private final String description;

        SubscriptionStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 구독이 활성 상태인지 확인
     * @return 활성 상태 여부
     */
    public boolean isActive() {
        return SubscriptionStatus.ACTIVE.equals(status);
    }

    /**
     * 구독이 만료되었는지 확인
     * @return 만료 여부
     */
    public boolean isExpired() {
        if (toDate == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(toDate) || SubscriptionStatus.EXPIRED.equals(status);
    }

    /**
     * 구독이 취소되었는지 확인
     * @return 취소 여부
     */
    public boolean isCanceled() {
        return SubscriptionStatus.CANCELED.equals(status);
    }

    /**
     * 구독이 대기 중인지 확인
     * @return 대기 중 여부
     */
    public boolean isPending() {
        return SubscriptionStatus.PENDING.equals(status);
    }

    /**
     * 구독이 유효한지 확인 (활성 + 만료되지 않음)
     * @return 유효 여부
     */
    public boolean isValid() {
        return isActive() && !isExpired();
    }

    /**
     * 남은 구독 기간(일) 계산
     * @return 남은 일수 (만료된 경우 0)
     */
    public long getRemainingDays() {
        if (toDate == null || isExpired()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(now, toDate).toDays();
    }

    /**
     * 구독 총 기간(일) 계산
     * @return 총 구독 기간
     */
    public long getTotalDays() {
        if (fromDate == null || toDate == null) {
            return 0;
        }

        return java.time.Duration.between(fromDate, toDate).toDays();
    }

    /**
     * 구독 진행률(%) 계산
     * @return 진행률 (0-100)
     */
    public double getProgressPercentage() {
        if (fromDate == null || toDate == null) {
            return 0.0;
        }

        LocalDateTime now = LocalDateTime.now();
        long totalDays = getTotalDays();
        long elapsedDays = java.time.Duration.between(fromDate, now).toDays();

        if (totalDays <= 0) {
            return 0.0;
        }

        double progress = (double) elapsedDays / totalDays * 100;
        return Math.max(0, Math.min(100, progress));
    }

    /**
     * 구독 만료 예정 확인 (7일 이내)
     * @return 만료 예정 여부
     */
    public boolean isExpiringsoon() {
        if (toDate == null || isExpired()) {
            return false;
        }

        long remainingDays = getRemainingDays();
        return remainingDays <= 7 && remainingDays > 0;
    }

    /**
     * 구독 상태 업데이트 (자동 만료 처리)
     */
    public void updateStatus() {
        if (isExpired() && !SubscriptionStatus.CANCELED.equals(status)) {
            this.status = SubscriptionStatus.EXPIRED;
        }
    }

    /**
     * 구독 활성화
     */
    public void activate() {
        this.status = SubscriptionStatus.ACTIVE;
        if (this.fromDate == null) {
            this.fromDate = LocalDateTime.now();
        }
    }

    /**
     * 구독 취소
     */
    public void cancel() {
        this.status = SubscriptionStatus.CANCELED;
    }

    /**
     * 구독 연장
     * @param additionalDays 연장할 일수
     */
    public void extend(int additionalDays) {
        if (this.toDate != null) {
            this.toDate = this.toDate.plusDays(additionalDays);
        }
    }

    /**
     * 일일 사용 제한 반환
     * @return 일일 허용 검사 횟수
     */
    public int getDailyLimit() {
        return costModel != null ? costModel.getDailyLimit() : 1;
    }
}