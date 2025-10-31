package ac.cbnu.heartcheck.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for OpenAI Realtime API ephemeral token generation.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {

    @JsonProperty("client_secret")
    private ClientSecret clientSecret;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientSecret {
        private String value;

        @JsonProperty("expires_at")
        private long expiresAt;
    }

    /**
     * Constructor with just the token value.
     *
     * @param value The ephemeral token
     */
    public TokenResponse(String value) {
        this.clientSecret = new ClientSecret(value, System.currentTimeMillis() + 60000);
    }
}
