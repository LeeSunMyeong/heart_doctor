package ac.cbnu.heartcheck.dto.response;

import ac.cbnu.heartcheck.entity.SubscriptionStatus;
import ac.cbnu.heartcheck.entity.UserType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 사용자 등록 응답 DTO
 * 사용자 등록 성공 시 사용자 정보와 토큰 정보를 포함
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Builder
public class UserRegistrationResponse {

    /**
     * 사용자 정보
     */
    private UserInfo user;

    /**
     * 토큰 정보
     */
    private TokenInfo tokens;

    /**
     * 신규 사용자 여부
     */
    private boolean isNewUser;

    /**
     * 사용자 정보 클래스
     */
    @Getter
    @Builder
    public static class UserInfo {
        private Long userId;
        private String email;
        private String name;
        private String profileImageUrl;
        private UserType userType;
        private SubscriptionStatus subscriptionStatus;
        private Integer remainingFreeTests;
        private Integer dailyTestLimit;
        private LocalDateTime registrationDate;
    }

    /**
     * 토큰 정보 클래스
     */
    @Getter
    @Builder
    public static class TokenInfo {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private Long expiresIn; // 초 단위
    }
}