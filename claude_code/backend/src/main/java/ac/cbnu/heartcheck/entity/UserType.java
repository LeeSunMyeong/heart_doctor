package ac.cbnu.heartcheck.entity;

import lombok.Getter;

/**
 * 사용자 타입 정의
 * 계층화된 인가 시스템을 위한 사용자 분류
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
public enum UserType {

    /**
     * 일반 사용자 (비결제)
     * - 총 1회만 검사 가능
     * - 일일 제한 없음 (총 제한이 우선)
     */
    FREE_USER(
        0,    // dailyTestLimit: 일일 제한 없음
        1,    // totalTestLimit: 총 1회만
        "일반 사용자 (비결제) - 총 1회 검사 가능"
    ),

    /**
     * 구독 사용자 (결제)
     * - 일일 3-5회 검사 가능
     * - 총 제한 없음 (무제한)
     */
    PREMIUM_USER(
        5,    // dailyTestLimit: 일일 최대 5회
        -1,   // totalTestLimit: 무제한 (-1)
        "구독 사용자 (결제) - 일일 3-5회 검사 가능"
    );

    private final int dailyTestLimit;
    private final int totalTestLimit;
    private final String description;

    UserType(int dailyTestLimit, int totalTestLimit, String description) {
        this.dailyTestLimit = dailyTestLimit;
        this.totalTestLimit = totalTestLimit;
        this.description = description;
    }

    /**
     * 일일 사용 가능 여부 검증
     *
     * @param currentUsage 현재 일일 사용 횟수
     * @return 사용 가능 여부
     */
    public boolean canUseServiceDaily(int currentUsage) {
        if (this == FREE_USER) {
            // FREE_USER는 총 사용량으로 제한
            return currentUsage < totalTestLimit;
        } else {
            // PREMIUM_USER는 일일 사용량으로 제한
            return currentUsage < dailyTestLimit;
        }
    }

    /**
     * 총 사용 가능 여부 검증
     *
     * @param totalUsage 총 사용 횟수
     * @return 사용 가능 여부
     */
    public boolean canUseServiceTotal(int totalUsage) {
        if (totalTestLimit == -1) {
            return true; // 무제한
        }
        return totalUsage < totalTestLimit;
    }

    /**
     * 사용자 타입별 제한 설명
     *
     * @return 제한 설명 문자열
     */
    public String getLimitDescription() {
        if (this == FREE_USER) {
            return "총 " + totalTestLimit + "회 사용 가능";
        } else {
            return "일일 최대 " + dailyTestLimit + "회 사용 가능";
        }
    }
}