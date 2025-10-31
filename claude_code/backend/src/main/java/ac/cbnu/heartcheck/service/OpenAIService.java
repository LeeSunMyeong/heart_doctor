package ac.cbnu.heartcheck.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Service for OpenAI API interactions
 */
@Slf4j
@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate ephemeral token for OpenAI Realtime API
     */
    public String generateEphemeralToken() {
        try {
            log.info("[OpenAI Service] Generating ephemeral token");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                    Map.of(
                            "model", "gpt-4o-realtime-preview-2024-10-01",
                            "voice", "alloy"
                    ),
                    headers
            );

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.openai.com/v1/realtime/sessions",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> clientSecret = (Map<String, Object>) response.getBody().get("client_secret");
                String token = (String) clientSecret.get("value");

                log.info("[OpenAI Service] Ephemeral token generated successfully");
                return token;
            }

            throw new RuntimeException("Failed to generate ephemeral token: " + response.getStatusCode());
        } catch (Exception e) {
            log.error("[OpenAI Service] Error generating ephemeral token", e);
            throw new RuntimeException("Failed to generate ephemeral token", e);
        }
    }
}
