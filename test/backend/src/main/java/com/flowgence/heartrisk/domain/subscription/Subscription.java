package com.flowgence.heartrisk.domain.subscription;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 20)
    private SubscriptionPlan planType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SubscriptionStatus status;

    @Column(name = "renewal_date")
    private OffsetDateTime renewalDate;

    @Column(name = "platform", length = 20)
    private String platform;

    protected Subscription() {
    }

    public Subscription(User user, SubscriptionPlan planType, SubscriptionStatus status, String platform) {
        this.user = user;
        this.planType = planType;
        this.status = status;
        this.platform = platform;
    }

    public User getUser() {
        return user;
    }

    public SubscriptionPlan getPlanType() {
        return planType;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public OffsetDateTime getRenewalDate() {
        return renewalDate;
    }

    public String getPlatform() {
        return platform;
    }

    public void updateRenewalDate(OffsetDateTime renewalDate) {
        this.renewalDate = renewalDate;
    }

    public void updateStatus(SubscriptionStatus status) {
        this.status = status;
    }
}
