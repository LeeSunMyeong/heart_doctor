package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * CostModel entity for Heart Doctor system
 * 구독 요금제 모델 정의
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "cost_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cost_id")
    private Short costId;

    @NotNull(message = "구독 타입은 필수입니다")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CostType type;

    @NotNull(message = "가격은 필수입니다")
    @Min(value = 0, message = "가격은 0원 이상이어야 합니다")
    @Column(name = "cost", nullable = false)
    private Integer cost; // 가격 (단위: 원)

    // 관계 매핑
    @Builder.Default
    @OneToMany(mappedBy = "costModel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Subscription> subscriptions = new ArrayList<>();

    /**
     * 구독 타입 ENUM
     */
    public enum CostType {
        MONTHLY("월간"),
        YEARLY("연간"),
        LIFETIME("평생");

        private final String description;

        CostType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        /**
         * 일일 사용 제한 반환
         * @return 일일 허용 검사 횟수
         */
        public int getDailyLimit() {
            switch (this) {
                case MONTHLY:
                case YEARLY:
                case LIFETIME:
                    return 5; // 유료 사용자는 하루 5회
                default:
                    return 1; // 기본값 (무료 사용자)
            }
        }

        /**
         * 구독 기간(일) 반환
         * @return 구독 기간
         */
        public int getSubscriptionDays() {
            switch (this) {
                case MONTHLY:
                    return 30;
                case YEARLY:
                    return 365;
                case LIFETIME:
                    return Integer.MAX_VALUE; // 평생
                default:
                    return 0;
            }
        }
    }

    /**
     * 가격 포맷팅 (원화)
     * @return 포맷된 가격 문자열
     */
    public String getFormattedPrice() {
        return String.format("%,d원", cost);
    }

    /**
     * 구독 타입 설명 반환
     * @return 타입 설명
     */
    public String getTypeDescription() {
        return type != null ? type.getDescription() : "";
    }

    /**
     * 일일 사용 제한 반환
     * @return 일일 허용 검사 횟수
     */
    public int getDailyLimit() {
        return type != null ? type.getDailyLimit() : 1;
    }

    /**
     * 구독 기간(일) 반환
     * @return 구독 기간
     */
    public int getSubscriptionDays() {
        return type != null ? type.getSubscriptionDays() : 0;
    }

    /**
     * 월간 요금제인지 확인
     * @return 월간 요금제 여부
     */
    public boolean isMonthly() {
        return CostType.MONTHLY.equals(type);
    }

    /**
     * 연간 요금제인지 확인
     * @return 연간 요금제 여부
     */
    public boolean isYearly() {
        return CostType.YEARLY.equals(type);
    }

    /**
     * 평생 요금제인지 확인
     * @return 평생 요금제 여부
     */
    public boolean isLifetime() {
        return CostType.LIFETIME.equals(type);
    }

    /**
     * 가격 대비 일일 비용 계산
     * @return 일일 비용 (원)
     */
    public double getDailyCost() {
        if (type == null || cost == null) {
            return 0.0;
        }

        int days = getSubscriptionDays();
        if (days == Integer.MAX_VALUE) {
            // 평생 요금제의 경우 10년 기준으로 계산
            return cost / (365.0 * 10);
        }

        return cost / (double) days;
    }
}