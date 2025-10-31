package ac.cbnu.heartcheck.websocket;

import ac.cbnu.heartcheck.service.OpenAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket proxy handler for OpenAI Realtime API
 * Relays messages between React Native frontend and OpenAI
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class VoiceProxyHandler extends TextWebSocketHandler {

    private final OpenAIService openAIService;
    private final Map<String, OpenAIWebSocketClient> openAIClients = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("[Voice Proxy] Client connected: {}", session.getId());

        // Get JWT token from query parameter
        String token = UriComponentsBuilder.fromUri(session.getUri())
                .build()
                .getQueryParams()
                .getFirst("token");

        if (token == null || token.isEmpty()) {
            log.error("[Voice Proxy] No authentication token provided");
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        try {
            // Get ephemeral token from OpenAI
            String ephemeralToken = openAIService.generateEphemeralToken();
            log.info("[Voice Proxy] Generated ephemeral token");

            // Create WebSocket client to OpenAI
            OpenAIWebSocketClient openAIClient = new OpenAIWebSocketClient(
                    new URI("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"),
                    ephemeralToken,
                    session
            );

            openAIClients.put(session.getId(), openAIClient);
            openAIClient.connect();

            log.info("[Voice Proxy] Connected to OpenAI for session: {}", session.getId());
        } catch (Exception e) {
            log.error("[Voice Proxy] Failed to connect to OpenAI", e);
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.debug("[Voice Proxy] Received message from client: {} bytes", message.getPayloadLength());

        OpenAIWebSocketClient openAIClient = openAIClients.get(session.getId());
        if (openAIClient != null && openAIClient.isOpen()) {
            openAIClient.send(message.getPayload());
        } else {
            log.warn("[Voice Proxy] OpenAI client not connected for session: {}", session.getId());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("[Voice Proxy] Client disconnected: {}, status: {}", session.getId(), status);

        OpenAIWebSocketClient openAIClient = openAIClients.remove(session.getId());
        if (openAIClient != null) {
            openAIClient.close();
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("[Voice Proxy] Transport error for session: " + session.getId(), exception);

        OpenAIWebSocketClient openAIClient = openAIClients.remove(session.getId());
        if (openAIClient != null) {
            openAIClient.close();
        }
    }

    /**
     * WebSocket client for connecting to OpenAI Realtime API
     */
    private static class OpenAIWebSocketClient extends WebSocketClient {
        private final String ephemeralToken;
        private final WebSocketSession frontendSession;

        public OpenAIWebSocketClient(URI serverUri, String ephemeralToken, WebSocketSession frontendSession) {
            super(serverUri, Map.of(
                    "Authorization", "Bearer " + ephemeralToken,
                    "OpenAI-Beta", "realtime=v1"
            ));
            this.ephemeralToken = ephemeralToken;
            this.frontendSession = frontendSession;
        }

        @Override
        public void onOpen(ServerHandshake handshakedata) {
            log.info("[OpenAI Client] Connected to OpenAI Realtime API");
        }

        @Override
        public void onMessage(String message) {
            try {
                log.debug("[OpenAI Client] Received message: {} bytes", message.length());
                if (frontendSession.isOpen()) {
                    frontendSession.sendMessage(new TextMessage(message));
                }
            } catch (Exception e) {
                log.error("[OpenAI Client] Failed to relay message to frontend", e);
            }
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
            log.info("[OpenAI Client] Connection closed: code={}, reason={}, remote={}", code, reason, remote);
            try {
                if (frontendSession.isOpen()) {
                    frontendSession.close(new CloseStatus(code, reason));
                }
            } catch (Exception e) {
                log.error("[OpenAI Client] Failed to close frontend session", e);
            }
        }

        @Override
        public void onError(Exception ex) {
            log.error("[OpenAI Client] Error occurred", ex);
            try {
                if (frontendSession.isOpen()) {
                    frontendSession.close(CloseStatus.SERVER_ERROR);
                }
            } catch (Exception e) {
                log.error("[OpenAI Client] Failed to close frontend session", e);
            }
        }
    }
}
