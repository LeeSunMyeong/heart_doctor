package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 로그인 요청 DTO
 * 사용자 로그인을 위한 휴대폰 번호와 비밀번호 정보
 *
 * @author CBNU Development Team
 * @version 1.1.0
 * @since 2024
 */
@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]{9}$", message = "올바른 휴대폰 번호 형식이어야 합니다 (숫자만 11자리)")
    private String phone;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 4, max = 100, message = "비밀번호는 4자 이상 100자 이하여야 합니다")
    private String password;

    @Override
    public String toString() {
        return String.format("LoginRequest{phone='%s', password='[PROTECTED]'}", phone);
    }
}