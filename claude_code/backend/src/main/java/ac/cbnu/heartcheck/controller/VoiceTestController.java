package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.voice.TokenResponse;
import ac.cbnu.heartcheck.service.OpenAIRealtimeService;
import ac.cbnu.heartcheck.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for voice test operations.
 * Handles OpenAI Realtime API token generation for client-side voice interactions.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/voice")
@RequiredArgsConstructor
public class VoiceTestController {

    private final OpenAIRealtimeService openAIRealtimeService;
    private final JwtUtil jwtUtil;

    /**
     * Generates an ephemeral token for OpenAI Realtime API access.
     * This endpoint requires authentication and returns a short-lived token
     * that is safe to use in client environments.
     *
     * @param authHeader The Authorization header with Bearer token
     * @return TokenResponse containing the ephemeral token
     */
    @PostMapping("/token")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TokenResponse> generateToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        log.info("[Voice Test] Token generation requested");

        try {
            // Extract user from JWT token (optional - for session tracking)
            String jwt = extractJwtFromHeader(authHeader);
            String username = jwtUtil.extractUsername(jwt);
            log.debug("[Voice Test] Token requested by user: {}", username);

            // Generate ephemeral token from OpenAI
            String ephemeralToken = openAIRealtimeService.generateClientSecret();

            // Create response
            TokenResponse response = new TokenResponse(ephemeralToken);

            log.info("[Voice Test] Token generated successfully for user: {}", username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("[Voice Test] Failed to generate token", e);
            return ResponseEntity.internalServerError()
                    .body(new TokenResponse());
        }
    }

    /**
     * Health check endpoint for voice test service.
     *
     * @return Service status
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        boolean isConfigured = openAIRealtimeService.isConfigured();
        if (isConfigured) {
            return ResponseEntity.ok("Voice test service is operational");
        } else {
            return ResponseEntity.status(503)
                    .body("Voice test service is not properly configured");
        }
    }

    /**
     * Extracts JWT token from Authorization header.
     *
     * @param authHeader The Authorization header value
     * @return The JWT token without "Bearer " prefix
     */
    private String extractJwtFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new IllegalArgumentException("Invalid Authorization header");
    }
}
