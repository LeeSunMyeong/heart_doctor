package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 비밀번호 재설정 요청 DTO
 * 비밀번호 재설정을 위한 이메일 정보
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Setter
public class PasswordResetRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이어야 합니다")
    private String email;

    @Override
    public String toString() {
        return String.format("PasswordResetRequest{email='%s'}", email);
    }
}