package com.flowgence.heartrisk.application.subscription;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.payment.PaymentStatus;
import com.flowgence.heartrisk.domain.payment.PaymentTransaction;
import com.flowgence.heartrisk.domain.subscription.Subscription;
import com.flowgence.heartrisk.domain.subscription.SubscriptionPlan;
import com.flowgence.heartrisk.domain.subscription.SubscriptionStatus;
import com.flowgence.heartrisk.infrastructure.repository.PaymentTransactionRepository;
import com.flowgence.heartrisk.infrastructure.repository.SubscriptionRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               PaymentTransactionRepository paymentTransactionRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    public Optional<Subscription> findByUser(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @Transactional
    public Subscription recordPurchase(User user, SubscriptionPlan plan, String platform, String providerTxId,
                                       BigDecimal amount, String currency, OffsetDateTime purchasedAt) {
        var subscription = subscriptionRepository.findByUserId(user.getId())
            .orElseGet(() -> subscriptionRepository.save(
                new Subscription(user, plan, SubscriptionStatus.ACTIVE, platform)));
        subscription.updateStatus(SubscriptionStatus.ACTIVE);
        switch (plan) {
            case MONTHLY -> subscription.updateRenewalDate(purchasedAt.plusMonths(1));
            case YEARLY -> subscription.updateRenewalDate(purchasedAt.plusYears(1));
            case LIFETIME -> subscription.updateRenewalDate(null);
        }

        paymentTransactionRepository.findByProviderTransactionId(providerTxId)
            .ifPresent(existing -> {
                throw new IllegalArgumentException("Duplicate transaction id");
            });

        var transaction = new PaymentTransaction(user, subscription, platform, providerTxId,
            amount, currency, purchasedAt);
        transaction.updateStatus(PaymentStatus.SUCCESS);
        paymentTransactionRepository.save(transaction);
        return subscriptionRepository.save(subscription);
    }
}
