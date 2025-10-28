package com.flowgence.heartrisk.interfaces.dto.screening;

import java.math.BigDecimal;
import java.util.List;

public record ScreeningDetailResponse(
    Long id,
    String resultLabel,
    BigDecimal riskScore,
    String recommendation,
    String sdkVersion,
    List<ScreeningMetricPayload> metrics
) {}
