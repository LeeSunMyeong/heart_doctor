package ac.cbnu.heartcheck.entity;

/**
 * OAuth 제공자 정의
 * 지원되는 소셜 로그인 제공자들
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public enum OAuthProvider {

    /**
     * 카카오톡 로그인
     */
    KAKAO,

    /**
     * 구글 로그인
     */
    GOOGLE,

    /**
     * 애플 로그인
     */
    APPLE
}