package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.dto.request.GoogleLoginRequest;
import ac.cbnu.heartcheck.dto.response.LoginResponse;
import ac.cbnu.heartcheck.dto.response.OAuth2UserInfo;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.UserRepository;
import ac.cbnu.heartcheck.util.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

/**
 * Google OAuth2 Authentication Service
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2025
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${google.oauth2.client-id}")
    private String googleClientId;

    /**
     * Google ID Token을 검증하고 사용자 정보 추출
     */
    public OAuth2UserInfo verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();

            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = token.getPayload();

            return OAuth2UserInfo.builder()
                .providerId(payload.getSubject())
                .email(payload.getEmail())
                .name((String) payload.get("name"))
                .picture((String) payload.get("picture"))
                .provider("google")
                .emailVerified(payload.getEmailVerified())
                .build();

        } catch (Exception e) {
            log.error("Failed to verify Google ID token", e);
            throw new IllegalArgumentException("Invalid Google ID token: " + e.getMessage());
        }
    }

    /**
     * Google 로그인 처리
     */
    @Transactional
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        // 1. ID Token 검증 및 사용자 정보 추출
        OAuth2UserInfo userInfo = verifyGoogleToken(request.getIdToken());

        // 2. 기존 사용자 찾기 또는 신규 생성
        User user = userRepository.findByProviderAndProviderUid("google", userInfo.getProviderId())
            .orElseGet(() -> createGoogleUser(userInfo));

        // 3. 로그인 시간 업데이트
        user.updateLastLoginTime();
        userRepository.save(user);

        // 4. JWT 토큰 생성
        String accessToken = jwtUtil.generateTokenForUser(user);
        String refreshToken = jwtUtil.generateRefreshTokenForUser(user);

        log.info("Google login successful for user: {}", user.getPhone());

        return LoginResponse.builder()
            .user(LoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .provider(user.getProvider())
                .build())
            .tokens(LoginResponse.TokenInfo.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build())
            .build();
    }

    /**
     * Google 사용자 정보로 신규 User 생성
     */
    private User createGoogleUser(OAuth2UserInfo userInfo) {
        // Google 로그인 사용자는 휴대폰 번호를 email로 대체
        String phone = generatePhoneFromEmail(userInfo.getEmail());

        User user = User.builder()
            .userName(userInfo.getName())
            .userDob("19900101") // 기본값 - 나중에 추가 정보 입력 받을 수 있음
            .phone(phone)
            .password(passwordEncoder.encode(UUID.randomUUID().toString())) // 랜덤 비밀번호
            .provider("google")
            .providerUid(userInfo.getProviderId())
            .role(User.Role.USER)
            .isActive(true)
            .build();

        User savedUser = userRepository.save(user);
        log.info("Created new Google user: {}", savedUser.getPhone());

        return savedUser;
    }

    /**
     * Email에서 휴대폰 번호 형식 생성
     * (Google 사용자는 실제 휴대폰이 없으므로 email 기반으로 고유 ID 생성)
     */
    private String generatePhoneFromEmail(String email) {
        // Email을 해시하여 11자리 숫자로 변환
        int hash = Math.abs(email.hashCode());
        String phoneNumber = String.format("99%09d", hash % 1000000000);

        // 이미 존재하는지 확인
        if (userRepository.existsByPhone(phoneNumber)) {
            // 중복이면 UUID 기반으로 재생성
            phoneNumber = String.format("99%09d", Math.abs(UUID.randomUUID().hashCode()) % 1000000000);
        }

        return phoneNumber;
    }
}
