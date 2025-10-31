package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Google Login Request DTO
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {

    @NotBlank(message = "ID Token is required")
    private String idToken;

    private String accessToken;

    private String serverAuthCode;
}
