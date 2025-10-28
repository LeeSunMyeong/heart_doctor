package com.flowgence.heartrisk.interfaces.controller;

import com.flowgence.heartrisk.application.auth.AuthService;
import com.flowgence.heartrisk.application.screening.ScreeningMetricInput;
import com.flowgence.heartrisk.application.screening.ScreeningService;
import com.flowgence.heartrisk.interfaces.dto.screening.ScreeningDetailResponse;
import com.flowgence.heartrisk.interfaces.dto.screening.ScreeningMetricPayload;
import com.flowgence.heartrisk.interfaces.dto.screening.ScreeningResponse;
import com.flowgence.heartrisk.interfaces.dto.screening.SubmitScreeningRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/screenings")
public class ScreeningController {

    private final ScreeningService screeningService;
    private final AuthService authService;

    public ScreeningController(ScreeningService screeningService, AuthService authService) {
        this.screeningService = screeningService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Void> submitScreening(@RequestHeader("X-User-Email") String userEmail,
                                                @Valid @RequestBody SubmitScreeningRequest request) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var metricInputs = request.metrics() == null ? List.<ScreeningMetricInput>of()
            : request.metrics().stream()
                .map(metric -> new ScreeningMetricInput(metric.key(), metric.value(), metric.unit()))
                .toList();
        screeningService.recordScreening(user, request.resultLabel(), request.riskScore(),
            request.recommendation(), request.sdkVersion(), metricInputs);
        return ResponseEntity.accepted().build();
    }

    @GetMapping
    public ResponseEntity<List<ScreeningResponse>> listScreenings(@RequestHeader("X-User-Email") String userEmail) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var responses = screeningService.findByUser(user.getId()).stream()
            .map(screening -> new ScreeningResponse(screening.getId(), screening.getResultLabel(),
                screening.getRiskScore(), screening.getRecommendation(), screening.getSdkVersion(),
                screening.getCreatedAt()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScreeningDetailResponse> getScreening(@PathVariable Long id) {
        return screeningService.getById(id)
            .map(screening -> {
                var metrics = screening.getMetrics().stream()
                    .map(metric -> new ScreeningMetricPayload(metric.getMetricKey(), metric.getMetricValue(),
                        metric.getUnit()))
                    .toList();
                return new ScreeningDetailResponse(screening.getId(), screening.getResultLabel(),
                    screening.getRiskScore(), screening.getRecommendation(), screening.getSdkVersion(), metrics);
            })
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
