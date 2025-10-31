package ac.cbnu.heartcheck.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for OpenAI Realtime API client secret generation.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenAITokenRequest {

    @JsonProperty("session")
    private SessionConfig session;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionConfig {
        @JsonProperty("type")
        private String type; // "realtime" or "transcription"

        @JsonProperty("model")
        private String model; // e.g., "gpt-realtime-mini-2025-10-06"

        @JsonProperty("audio")
        private AudioConfig audio;

        @JsonProperty("instructions")
        private String instructions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AudioConfig {
        @JsonProperty("output")
        private OutputConfig output;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OutputConfig {
        @JsonProperty("voice")
        private String voice; // e.g., "alloy", "echo", "shimmer"
    }

    /**
     * Create a default realtime session configuration for heart health testing.
     *
     * @param model The OpenAI model to use
     * @param instructions The system instructions for the assistant
     * @return Configured request object
     */
    public static OpenAITokenRequest createRealtimeSession(String model, String instructions) {
        return OpenAITokenRequest.builder()
                .session(SessionConfig.builder()
                        .type("realtime")
                        .model(model)
                        .audio(AudioConfig.builder()
                                .output(OutputConfig.builder()
                                        .voice("alloy")
                                        .build())
                                .build())
                        .instructions(instructions)
                        .build())
                .build();
    }
}
