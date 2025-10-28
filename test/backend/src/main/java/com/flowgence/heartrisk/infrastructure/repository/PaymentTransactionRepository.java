package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.payment.PaymentTransaction;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);
}
