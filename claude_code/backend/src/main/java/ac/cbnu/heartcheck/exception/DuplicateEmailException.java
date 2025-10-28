package ac.cbnu.heartcheck.exception;

/**
 * 중복된 이메일 예외
 * 이미 존재하는 이메일로 사용자 등록을 시도할 때 발생
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("이미 사용 중인 이메일입니다: " + email);
    }

    public DuplicateEmailException(String email, Throwable cause) {
        super("이미 사용 중인 이메일입니다: " + email, cause);
    }
}