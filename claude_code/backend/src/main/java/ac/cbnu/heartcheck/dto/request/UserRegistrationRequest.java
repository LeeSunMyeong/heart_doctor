package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 사용자 등록 요청 DTO
 * 새로운 사용자 계정 생성을 위한 필수 정보
 * 간소화된 회원가입: 이름, 휴대폰 번호, 아이디, 비밀번호만 입력
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Setter
public class UserRegistrationRequest {

    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하여야 합니다")
    private String name;

    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]{9}$",
            message = "올바른 휴대폰 번호 형식이어야 합니다 (숫자만 11자리)")
    private String phone;

    @NotBlank(message = "아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문자, 숫자, 언더스코어만 사용 가능합니다")
    private String userId;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 4, max = 100, message = "비밀번호는 4자 이상 100자 이하여야 합니다")
    private String password;

    @Override
    public String toString() {
        return String.format("UserRegistrationRequest{name='%s', phone='%s', userId='%s', password='[PROTECTED]'}",
                name, phone, userId);
    }
}