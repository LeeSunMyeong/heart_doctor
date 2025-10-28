package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

/**
 * DailyUsageQuota entity for Heart Doctor system
 * 사용자 일일 사용량 제한 관리
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "daily_usage_quotas", indexes = {
    @Index(name = "idx_quota_user_day", columnList = "user_id, day", unique = true),
    @Index(name = "idx_quota_day", columnList = "day")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyUsageQuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "날짜는 필수입니다")
    @Column(name = "day", nullable = false)
    private LocalDate day; // 기준일

    @Builder.Default
    @Min(value = 0, message = "사용 횟수는 0 이상이어야 합니다")
    @Column(name = "count", nullable = false)
    private Integer count = 0; // 당일 사용 횟수

    @NotNull(message = "허용 횟수는 필수입니다")
    @Min(value = 1, message = "허용 횟수는 1 이상이어야 합니다")
    @Column(name = "quota_limit", nullable = false)
    private Integer limit; // 허용 횟수 (무료:1, 유료:5)

    /**
     * 사용 가능한 횟수가 있는지 확인
     * @return 사용 가능 여부
     */
    public boolean hasRemainingUsage() {
        return count < limit;
    }

    /**
     * 남은 사용 가능 횟수 반환
     * @return 남은 횟수
     */
    public int getRemainingUsage() {
        return Math.max(0, limit - count);
    }

    /**
     * 사용 횟수 증가
     * @return 증가 후 사용 횟수
     */
    public int incrementUsage() {
        if (hasRemainingUsage()) {
            this.count++;
        }
        return this.count;
    }

    /**
     * 사용률(%) 계산
     * @return 사용률 (0-100)
     */
    public double getUsagePercentage() {
        if (limit <= 0) {
            return 0.0;
        }
        return (double) count / limit * 100.0;
    }

    /**
     * 제한에 도달했는지 확인
     * @return 제한 도달 여부
     */
    public boolean isLimitReached() {
        return count >= limit;
    }

    /**
     * 제한 임박 여부 확인 (80% 이상 사용)
     * @return 제한 임박 여부
     */
    public boolean isNearLimit() {
        return getUsagePercentage() >= 80.0;
    }

    /**
     * 무료 사용자 제한인지 확인
     * @return 무료 사용자 여부
     */
    public boolean isFreeUserLimit() {
        return limit == 1;
    }

    /**
     * 프리미엄 사용자 제한인지 확인
     * @return 프리미엄 사용자 여부
     */
    public boolean isPremiumUserLimit() {
        return limit == 5;
    }

    /**
     * 사용 횟수 리셋 (새로운 날짜용)
     */
    public void resetUsage() {
        this.count = 0;
    }

    /**
     * 제한 변경 (구독 상태 변경 시)
     * @param newLimit 새로운 제한
     */
    public void updateLimit(int newLimit) {
        if (newLimit > 0) {
            this.limit = newLimit;
        }
    }

    /**
     * 오늘 날짜인지 확인
     * @return 오늘 날짜 여부
     */
    public boolean isToday() {
        return LocalDate.now().equals(day);
    }

    /**
     * 특정 날짜인지 확인
     * @param targetDate 대상 날짜
     * @return 특정 날짜 여부
     */
    public boolean isDate(LocalDate targetDate) {
        return targetDate != null && targetDate.equals(day);
    }
}