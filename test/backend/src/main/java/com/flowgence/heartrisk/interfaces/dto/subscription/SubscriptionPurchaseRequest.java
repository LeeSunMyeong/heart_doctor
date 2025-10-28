package com.flowgence.heartrisk.interfaces.dto.subscription;

import com.flowgence.heartrisk.domain.subscription.SubscriptionPlan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record SubscriptionPurchaseRequest(
    @NotNull SubscriptionPlan plan,
    @NotBlank String platform,
    @NotBlank String providerTransactionId,
    @NotNull @Positive BigDecimal amount,
    @NotBlank String currency,
    @NotNull OffsetDateTime purchasedAt
) {}
