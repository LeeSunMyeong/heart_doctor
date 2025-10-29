package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 토큰 갱신 요청 DTO
 * Refresh token을 이용한 access token 갱신 요청
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Setter
public class RefreshTokenRequest {

    /**
     * Refresh token
     * JWT refresh token for obtaining new access token
     */
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    @Override
    public String toString() {
        return "RefreshTokenRequest{refreshToken='[PROTECTED]'}";
    }
}
