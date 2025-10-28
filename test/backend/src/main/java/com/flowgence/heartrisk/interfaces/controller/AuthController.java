package com.flowgence.heartrisk.interfaces.controller;

import com.flowgence.heartrisk.application.auth.AuthService;
import com.flowgence.heartrisk.application.auth.TokenService;
import com.flowgence.heartrisk.interfaces.dto.auth.AuthResponse;
import com.flowgence.heartrisk.interfaces.dto.auth.LoginRequest;
import com.flowgence.heartrisk.interfaces.dto.auth.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        var user = authService.registerUser(request.email(), request.password(), request.phone());
        var accessToken = tokenService.issueAccessToken(user.getId());
        var refreshToken = tokenService.issueRefreshToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var user = authService.findByEmail(request.email())
            .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        var accessToken = tokenService.issueAccessToken(user.getId());
        var refreshToken = tokenService.issueRefreshToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }
}
