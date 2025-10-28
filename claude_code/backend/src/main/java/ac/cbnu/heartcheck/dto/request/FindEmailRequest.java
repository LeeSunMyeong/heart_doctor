package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 이메일 찾기 요청 DTO
 * 사용자 이름과 전화번호를 통한 이메일 찾기
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Setter
public class FindEmailRequest {

    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하여야 합니다")
    private String fullName;

    @NotBlank(message = "전화번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]-?[0-9]{4}-?[0-9]{4}$",
            message = "올바른 휴대폰 번호 형식이어야 합니다 (예: 010-1234-5678)")
    private String phoneNumber;

    @Override
    public String toString() {
        return String.format("FindEmailRequest{fullName='%s', phoneNumber='%s'}",
                fullName, phoneNumber);
    }
}