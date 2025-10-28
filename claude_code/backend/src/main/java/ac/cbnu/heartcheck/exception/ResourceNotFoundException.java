package ac.cbnu.heartcheck.exception;

/**
 * 리소스를 찾을 수 없는 예외
 * 일반적인 리소스(설정, 알림 등)가 존재하지 않을 때 발생
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
