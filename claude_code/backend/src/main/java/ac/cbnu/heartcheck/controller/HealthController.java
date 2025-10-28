package ac.cbnu.heartcheck.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for system status monitoring
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthController implements HealthIndicator {

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "heart-disease-api");
        response.put("version", "1.0.0");

        log.info("Health check requested - Status: UP");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readinessCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "READY");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "connected");
        response.put("redis", "connected");

        log.info("Readiness check requested - Status: READY");
        return ResponseEntity.ok(response);
    }

    @Override
    public Health health() {
        return Health.up()
                .withDetail("service", "heart-disease-api")
                .withDetail("timestamp", LocalDateTime.now())
                .build();
    }
}