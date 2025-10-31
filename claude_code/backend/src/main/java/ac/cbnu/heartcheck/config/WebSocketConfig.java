package ac.cbnu.heartcheck.config;

import ac.cbnu.heartcheck.websocket.VoiceProxyHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket configuration for OpenAI Realtime API proxy
 */
@Slf4j
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final VoiceProxyHandler voiceProxyHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        log.info("[WebSocket] Registering WebSocket handlers");

        registry
            .addHandler(voiceProxyHandler, "/api/v1/voice/realtime")
            .setAllowedOrigins("*"); // Allow all origins for development
    }
}
