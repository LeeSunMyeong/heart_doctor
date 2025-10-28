package com.flowgence.heartrisk.interfaces.controller;

import com.flowgence.heartrisk.application.auth.AuthService;
import com.flowgence.heartrisk.application.settings.SettingsService;
import com.flowgence.heartrisk.interfaces.dto.settings.UpdateSettingsRequest;
import com.flowgence.heartrisk.interfaces.dto.settings.UserSettingsResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    private final SettingsService settingsService;
    private final AuthService authService;

    public SettingsController(SettingsService settingsService, AuthService authService) {
        this.settingsService = settingsService;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserSettingsResponse> getSettings(@RequestHeader("X-User-Email") String userEmail) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var settings = settingsService.findByUser(user.getId())
            .orElseGet(() -> settingsService.updateSettings(user, "ko", "TEXT", 60, true));
        var response = new UserSettingsResponse(settings.getLocale(), settings.getInputMode(),
            settings.getTimeoutSec(), settings.getNotificationsEnabled());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserSettingsResponse> updateSettings(@RequestHeader("X-User-Email") String userEmail,
                                                               @Valid @RequestBody UpdateSettingsRequest request) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var updated = settingsService.updateSettings(user, request.locale(), request.inputMode(),
            request.timeoutSec(), request.notificationsEnabled());
        var response = new UserSettingsResponse(updated.getLocale(), updated.getInputMode(),
            updated.getTimeoutSec(), updated.getNotificationsEnabled());
        return ResponseEntity.ok(response);
    }
}
