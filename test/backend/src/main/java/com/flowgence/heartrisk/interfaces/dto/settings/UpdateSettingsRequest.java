package com.flowgence.heartrisk.interfaces.dto.settings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateSettingsRequest(
    @NotBlank String locale,
    @NotBlank String inputMode,
    @NotNull @Positive Integer timeoutSec,
    @NotNull Boolean notificationsEnabled
) {}
