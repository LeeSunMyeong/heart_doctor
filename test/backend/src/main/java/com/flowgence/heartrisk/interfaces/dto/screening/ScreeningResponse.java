package com.flowgence.heartrisk.interfaces.dto.screening;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ScreeningResponse(
    Long id,
    String resultLabel,
    BigDecimal riskScore,
    String recommendation,
    String sdkVersion,
    OffsetDateTime createdAt
) {}
