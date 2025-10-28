package ac.cbnu.heartcheck.exception;

/**
 * 잘못된 인증 정보 예외
 * 로그인 시 이메일 또는 비밀번호가 올바르지 않을 때 발생
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("이메일 또는 비밀번호가 올바르지 않습니다");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}