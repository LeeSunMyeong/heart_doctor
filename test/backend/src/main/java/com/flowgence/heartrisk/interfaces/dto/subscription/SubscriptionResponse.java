package com.flowgence.heartrisk.interfaces.dto.subscription;

import com.flowgence.heartrisk.domain.subscription.SubscriptionPlan;
import com.flowgence.heartrisk.domain.subscription.SubscriptionStatus;
import java.time.OffsetDateTime;

public record SubscriptionResponse(
    SubscriptionPlan plan,
    SubscriptionStatus status,
    OffsetDateTime renewalDate,
    String platform
) {}
