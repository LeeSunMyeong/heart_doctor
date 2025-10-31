package ac.cbnu.heartcheck.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OAuth2 User Information DTO
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2UserInfo {

    private String providerId;      // Google의 고유 ID (sub)
    private String email;
    private String name;
    private String picture;
    private String provider;        // "google"
    private Boolean emailVerified;
}
