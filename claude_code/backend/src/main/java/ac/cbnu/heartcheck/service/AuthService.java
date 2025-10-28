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
            log.info("Login attempt: phone={}", request.getPhone());

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getPhone(),
                    request.getPassword()
                )
            );

            User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!user.isActive()) {
                throw new BadCredentialsException("Account is disabled");
            }

            user.updateLastLoginTime();
            userRepository.save(user);

            String accessToken = jwtUtil.generateTokenForUser(user);
            String refreshToken = jwtUtil.generateRefreshTokenForUser(user);

            log.info("Login successful: userId={}, phone={}", user.getUserId(), user.getPhone());

            return LoginResponse.builder()
                .user(LoginResponse.UserInfo.builder()
                    .userId(user.getUserId())
                    .name(user.getUserName())
                    .build())
                .tokens(LoginResponse.TokenInfo.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L)
                    .build())
                .build();

        } catch (AuthenticationException e) {
            log.error("Login failed: phone={}, reason={}", request.getPhone(), e.getMessage());
            throw new BadCredentialsException("Invalid phone or password");
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
