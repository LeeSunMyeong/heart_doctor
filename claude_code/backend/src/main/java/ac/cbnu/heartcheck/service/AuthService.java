package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.dto.request.LoginRequest;
import ac.cbnu.heartcheck.dto.request.UserRegistrationRequest;
import ac.cbnu.heartcheck.dto.response.LoginResponse;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.UserRepository;
import ac.cbnu.heartcheck.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        try {
            String identifier = request.getPhone(); // phone 필드가 이제 identifier 역할
            log.info("Login attempt: identifier={}", identifier);

            // identifier가 휴대폰 번호인지 로그인 ID인지 판단
            boolean isPhone = identifier.matches("^01[0-9]{9}$");
            String usernameForAuth = identifier; // Spring Security에 전달할 username

            log.debug("Identifier type: {}", isPhone ? "phone" : "loginId");

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    usernameForAuth,
                    request.getPassword()
                )
            );

            // identifier 타입에 따라 사용자 조회
            User user;
            if (isPhone) {
                user = userRepository.findByPhone(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            } else {
                user = userRepository.findByLoginId(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }

            if (!user.isActive()) {
                throw new BadCredentialsException("Account is disabled");
            }

            user.updateLastLoginTime();
            userRepository.save(user);

            String accessToken = jwtUtil.generateTokenForUser(user);
            String refreshToken = jwtUtil.generateRefreshTokenForUser(user);

            log.info("Login successful: userId={}, loginId={}, phone={}",
                user.getUserId(), user.getLoginId(), user.getPhone());

            return LoginResponse.builder()
                .user(LoginResponse.UserInfo.builder()
                    .userId(user.getUserId())
                    .name(user.getUserName())
                    .email(null) // User 엔티티에 email 필드 없음 (phone 사용)
                    .profileImageUrl(null)
                    .userType(null)
                    .subscriptionStatus(null)
                    .remainingFreeTests(null)
                    .dailyTestLimit(null)
                    .subscriptionExpiry(null)
                    .build())
                .tokens(LoginResponse.TokenInfo.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L)
                    .build())
                .build();

        } catch (AuthenticationException e) {
            log.error("Login failed: identifier={}, reason={}", request.getPhone(), e.getMessage());
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    public Long register(UserRegistrationRequest request) {
        log.info("Register attempt: phone={}, name={}, loginId={}", request.getPhone(), request.getName(), request.getUserId());

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Phone number already registered");
        }

        if (userRepository.existsByLoginId(request.getUserId())) {
            throw new IllegalArgumentException("Login ID already exists");
        }

        // Default userDob to 19900101 since we no longer collect age
        String userDob = "19900101";

        User user = User.builder()
            .userName(request.getName())
            .userDob(userDob)
            .loginId(request.getUserId())
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(User.Role.USER)
            .isActive(true)
            .build();

        User savedUser = userRepository.save(user);
        log.info("Registration successful: userId={}, loginId={}, phone={}", savedUser.getUserId(), savedUser.getLoginId(), savedUser.getPhone());

        return savedUser.getUserId();
    }

    public LoginResponse refreshToken(String refreshToken) {
        try {
            if (!jwtUtil.validateToken(refreshToken)) {
                throw new BadCredentialsException("Invalid refresh token");
            }

            if (!jwtUtil.isRefreshToken(refreshToken)) {
                throw new BadCredentialsException("Not a refresh token");
            }

            Long userId = jwtUtil.extractUserId(refreshToken);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String newAccessToken = jwtUtil.generateTokenForUser(user);
            String newRefreshToken = jwtUtil.generateRefreshTokenForUser(user);

            log.info("Token refresh successful: userId={}", userId);

            return LoginResponse.builder()
                .user(LoginResponse.UserInfo.builder()
                    .userId(user.getUserId())
                    .name(user.getUserName())
                    .build())
                .tokens(LoginResponse.TokenInfo.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L)
                    .build())
                .build();

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new BadCredentialsException("Token refresh failed");
        }
    }

    public void logout(String phone) {
        log.info("Logout: phone={}", phone);
    }

    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return userRepository.findByPhone(phone).isPresent();
    }
}
