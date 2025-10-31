package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.dto.voice.OpenAITokenRequest;
import ac.cbnu.heartcheck.dto.voice.OpenAITokenResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Service for interacting with OpenAI Realtime API.
 * Handles generation of ephemeral tokens for client-side voice interactions.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Slf4j
@Service
public class OpenAIRealtimeService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.realtime.token.url}")
    private String tokenUrl;

    @Value("${openai.realtime.model}")
    private String model;

    private final RestTemplate restTemplate;

    /**
     * Constructor with RestTemplate injection.
     *
     * @param restTemplate REST client for API calls
     */
    public OpenAIRealtimeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Generates an ephemeral client secret for OpenAI Realtime API access.
     * This token is safe to use in client environments and has a short lifespan.
     *
     * @return The ephemeral token value
     * @throws RestClientException if the API call fails
     */
    public String generateClientSecret() {
        log.info("[OpenAI] Generating ephemeral token for realtime session");

        try {
            // Build request with heart health testing instructions
            OpenAITokenRequest request = OpenAITokenRequest.createRealtimeSession(
                    model,
                    buildInstructions()
            );

            // Setup headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Make API call
            HttpEntity<OpenAITokenRequest> entity = new HttpEntity<>(request, headers);

            log.debug("[OpenAI] Requesting token from: {}", tokenUrl);
            ResponseEntity<OpenAITokenResponse> response = restTemplate.postForEntity(
                    tokenUrl,
                    entity,
                    OpenAITokenResponse.class
            );

            // Extract token from response
            OpenAITokenResponse responseBody = response.getBody();
            if (responseBody == null || responseBody.getValue() == null) {
                log.error("[OpenAI] Invalid response from token API: {}", response);
                throw new RuntimeException("Failed to generate OpenAI token: Invalid response");
            }

            String token = responseBody.getValue();
            log.info("[OpenAI] Token generated successfully: {}...",
                    token.substring(0, Math.min(10, token.length())));

            return token;

        } catch (RestClientException e) {
            log.error("[OpenAI] Failed to generate token", e);
            throw new RuntimeException("Failed to generate OpenAI token: " + e.getMessage(), e);
        }
    }

    /**
     * Builds system instructions for the voice assistant conducting heart health tests.
     * These instructions guide the AI in asking questions appropriately and handling responses.
     *
     * @return The instruction text for the AI assistant
     */
    private String buildInstructions() {
        return """
                당신은 심장 건강 검사를 진행하는 친절한 의료 도우미입니다.

                규칙:
                1. 항상 정중하고 친절하게 대화하세요
                2. 한 번에 하나의 질문만 하세요
                3. 사용자 답변을 명확하게 이해하지 못한 경우, 다시 질문하세요
                4. 숫자는 정확하게 파악하세요 (예: "스물다섯" → 25)
                5. 예/아니오 질문에는 명확한 답변을 요청하세요
                6. 각 질문 전에 짧은 호흡을 두세요

                진행 방식:
                - 제공된 질문 스크립트를 순서대로 따라가세요
                - 각 답변을 정확하게 듣고 확인하세요
                - 불분명한 답변은 재질문하세요
                - 사용자가 불편해하지 않도록 배려하세요

                검사 절차:
                1. 준비 확인 ("심장 닥터의 심장 건강 분석 시간입니다. 고객님 지금 준비되셨나요?")
                2. 기본 정보 수집 (성별, 나이, 몸무게, 키, 체온, 호흡)
                3. 증상 확인 (가슴 통증, 옆구리 통증, 발 통증 등 10가지)
                4. 완료 인사 ("모든 질문에 대한 답변이 끝났습니다. 대단히 감사합니다.")
                """;
    }

    /**
     * Validates the OpenAI API configuration.
     *
     * @return true if configuration is valid
     */
    public boolean isConfigured() {
        boolean isValid = apiKey != null && !apiKey.isEmpty()
                && tokenUrl != null && !tokenUrl.isEmpty()
                && model != null && !model.isEmpty();

        if (!isValid) {
            log.warn("[OpenAI] Configuration is incomplete. Check application.properties");
        }

        return isValid;
    }
}
