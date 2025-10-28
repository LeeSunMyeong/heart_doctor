package com.flowgence.heartrisk.interfaces.dto.auth;

public record AuthResponse(
    String accessToken,
    String refreshToken
) {}
