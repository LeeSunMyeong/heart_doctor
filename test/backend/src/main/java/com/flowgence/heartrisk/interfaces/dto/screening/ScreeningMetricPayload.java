package com.flowgence.heartrisk.interfaces.dto.screening;

import jakarta.validation.constraints.NotBlank;

public record ScreeningMetricPayload(
    @NotBlank String key,
    @NotBlank String value,
    String unit
) {}
