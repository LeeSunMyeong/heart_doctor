package com.flowgence.heartrisk.interfaces.dto.screening;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;

public record SubmitScreeningRequest(
    @NotBlank String resultLabel,
    @NotNull @PositiveOrZero BigDecimal riskScore,
    String recommendation,
    @NotBlank String sdkVersion,
    @Valid List<ScreeningMetricPayload> metrics
) {}
