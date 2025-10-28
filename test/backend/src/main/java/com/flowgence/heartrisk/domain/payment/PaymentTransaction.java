package com.flowgence.heartrisk.domain.payment;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.common.BaseEntity;
import com.flowgence.heartrisk.domain.subscription.Subscription;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @Column(name = "provider", length = 20)
    private String provider;

    @Column(name = "provider_tx_id", length = 120, unique = true)
    private String providerTransactionId;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "purchased_at")
    private OffsetDateTime purchasedAt;

    protected PaymentTransaction() {
    }

    public PaymentTransaction(User user, Subscription subscription, String provider, String providerTransactionId,
                              BigDecimal amount, String currency, OffsetDateTime purchasedAt) {
        this.user = user;
        this.subscription = subscription;
        this.provider = provider;
        this.providerTransactionId = providerTransactionId;
        this.amount = amount;
        this.currency = currency;
        this.purchasedAt = purchasedAt;
    }

    public User getUser() {
        return user;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public String getProvider() {
        return provider;
    }

    public String getProviderTransactionId() {
        return providerTransactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public OffsetDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public void updateStatus(PaymentStatus status) {
        this.status = status;
    }
}
