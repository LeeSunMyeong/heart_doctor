package ac.cbnu.heartcheck.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO from OpenAI Realtime API for client secret generation.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAITokenResponse {

    /**
     * The ephemeral client secret token.
     * Format: ek_xxxxx...
     */
    @JsonProperty("value")
    private String value;

    /**
     * Token expiration time in seconds.
     */
    @JsonProperty("expires_in")
    private Integer expiresIn;

    /**
     * Session ID from OpenAI (if provided).
     */
    @JsonProperty("session_id")
    private String sessionId;
}
