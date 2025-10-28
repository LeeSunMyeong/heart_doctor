package ac.cbnu.heartcheck.entity;

/**
 * 구독 상태 정의
 * 사용자의 결제 및 구독 상태를 관리
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public enum SubscriptionStatus {

    /**
     * 무료 사용자
     */
    FREE,

    /**
     * 프리미엄 구독 중 (활성)
     */
    PREMIUM,

    /**
     * 구독 만료됨
     */
    EXPIRED,

    /**
     * 구독 취소됨
     */
    CANCELLED,

    /**
     * 구독 일시정지
     */
    SUSPENDED
}