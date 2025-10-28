package com.flowgence.heartrisk.application.auth;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class TokenService {

    public String issueAccessToken(Long userId) {
        return "access-" + UUID.randomUUID();
    }

    public String issueRefreshToken(Long userId) {
        return "refresh-" + UUID.randomUUID();
    }
}
