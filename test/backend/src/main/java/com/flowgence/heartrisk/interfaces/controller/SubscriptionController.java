package com.flowgence.heartrisk.interfaces.controller;

import com.flowgence.heartrisk.application.auth.AuthService;
import com.flowgence.heartrisk.application.subscription.SubscriptionService;
import com.flowgence.heartrisk.interfaces.dto.subscription.SubscriptionPurchaseRequest;
import com.flowgence.heartrisk.interfaces.dto.subscription.SubscriptionResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final AuthService authService;

    public SubscriptionController(SubscriptionService subscriptionService, AuthService authService) {
        this.subscriptionService = subscriptionService;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<SubscriptionResponse> getSubscription(@RequestHeader("X-User-Email") String userEmail) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return subscriptionService.findByUser(user.getId())
            .map(sub -> new SubscriptionResponse(sub.getPlanType(), sub.getStatus(), sub.getRenewalDate(), sub.getPlatform()))
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("/purchase")
    public ResponseEntity<SubscriptionResponse> purchase(@RequestHeader("X-User-Email") String userEmail,
                                                         @Valid @RequestBody SubscriptionPurchaseRequest request) {
        var user = authService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var subscription = subscriptionService.recordPurchase(user, request.plan(), request.platform(),
            request.providerTransactionId(), request.amount(), request.currency(), request.purchasedAt());
        var response = new SubscriptionResponse(subscription.getPlanType(), subscription.getStatus(),
            subscription.getRenewalDate(), subscription.getPlatform());
        return ResponseEntity.ok(response);
    }
}
