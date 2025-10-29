package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 로그인 요청 DTO
 * 사용자 로그인을 위한 식별자(휴대폰 번호 또는 로그인 ID)와 비밀번호 정보
 *
 * @author CBNU Development Team
 * @version 1.2.0
 * @since 2024
 */
@Getter
@Setter
public class LoginRequest {

    /**
     * 로그인 식별자 (휴대폰 번호 또는 로그인 ID)
     * - 휴대폰 번호 형식: 01012345678 (11자리 숫자)
     * - 로그인 ID 형식: 4-20자의 영문자, 숫자, 언더스코어
     */
    @NotBlank(message = "휴대폰 번호 또는 로그인 ID는 필수입니다")
    @Size(min = 4, max = 20, message = "휴대폰 번호 또는 로그인 ID는 4자 이상 20자 이하여야 합니다")
    private String phone; // 필드명은 phone으로 유지 (프론트엔드 호환성)

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 4, max = 100, message = "비밀번호는 4자 이상 100자 이하여야 합니다")
    private String password;

    @Override
    public String toString() {
        return String.format("LoginRequest{identifier='%s', password='[PROTECTED]'}", phone);
    }
}