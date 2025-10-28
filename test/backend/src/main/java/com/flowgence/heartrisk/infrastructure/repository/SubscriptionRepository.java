package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.subscription.Subscription;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserId(Long userId);
}
