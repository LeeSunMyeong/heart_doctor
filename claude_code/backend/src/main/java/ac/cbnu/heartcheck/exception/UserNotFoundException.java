package ac.cbnu.heartcheck.exception;

/**
 * 사용자를 찾을 수 없는 예외
 * 이메일 찾기, 비밀번호 재설정 등에서 사용자가 존재하지 않을 때 발생
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String identifier) {
        super("사용자를 찾을 수 없습니다: " + identifier);
    }

    public UserNotFoundException(String identifier, Throwable cause) {
        super("사용자를 찾을 수 없습니다: " + identifier, cause);
    }
}