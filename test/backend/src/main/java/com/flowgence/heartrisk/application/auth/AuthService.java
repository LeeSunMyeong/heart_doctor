package com.flowgence.heartrisk.application.auth;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.infrastructure.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(String email, String rawPassword, String phone) {
        userRepository.findByEmail(email).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already in use");
        });
        var user = new User(email, passwordEncoder.encode(rawPassword), phone);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
