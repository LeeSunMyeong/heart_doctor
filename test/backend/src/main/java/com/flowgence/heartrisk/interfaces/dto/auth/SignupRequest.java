package com.flowgence.heartrisk.interfaces.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @Email @NotBlank String email,
    @NotBlank @Size(min = 8, max = 64) String password,
    @NotBlank @Size(max = 30) String phone
) {}
