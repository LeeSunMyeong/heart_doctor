package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 사용자 등록 요청 DTO
 * 새로운 사용자 계정 생성을 위한 필수 정보
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Setter
public class UserRegistrationRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이어야 합니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].*$",
            message = "비밀번호는 대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String confirmPassword;

    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하여야 합니다")
    private String fullName;

    @NotBlank(message = "전화번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]-?[0-9]{4}-?[0-9]{4}$",
            message = "올바른 휴대폰 번호 형식이어야 합니다 (예: 010-1234-5678)")
    private String phoneNumber;

    @NotNull(message = "나이는 필수입니다")
    @Min(value = 18, message = "18세 이상만 가입할 수 있습니다")
    @Max(value = 120, message = "올바른 나이를 입력해주세요")
    private Integer age;

    @NotBlank(message = "성별은 필수입니다")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "성별은 MALE, FEMALE, OTHER 중 하나여야 합니다")
    private String gender;

    /**
     * 비밀번호와 확인 비밀번호가 일치하는지 검증
     */
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }

    @Override
    public String toString() {
        return String.format("UserRegistrationRequest{email='%s', fullName='%s', phoneNumber='%s', " +
                "age=%d, gender='%s', password='[PROTECTED]', confirmPassword='[PROTECTED]'}",
                email, fullName, phoneNumber, age, gender);
    }
}