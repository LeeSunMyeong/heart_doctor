package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

/**
 * UserDetailsService implementation for Spring Security authentication
 * Supports authentication with both phone number and loginId
 *
 * @author CBNU Development Team
 * @version 1.1.0
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        log.debug("Loading user by identifier: {}", identifier);

        // identifier가 휴대폰 번호인지 로그인 ID인지 판단
        boolean isPhone = identifier.matches("^01[0-9]{9}$");

        User user;
        if (isPhone) {
            log.debug("Identifier is phone number");
            user = userRepository.findByPhone(identifier)
                .orElseThrow(() -> {
                    log.warn("User not found by phone: {}", identifier);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + identifier);
                });
        } else {
            log.debug("Identifier is loginId");
            user = userRepository.findByLoginId(identifier)
                .orElseThrow(() -> {
                    log.warn("User not found by loginId: {}", identifier);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + identifier);
                });
        }

        if (!user.isActive()) {
            throw new UsernameNotFoundException("비활성화된 계정입니다: " + identifier);
        }

        log.debug("User loaded successfully: userId={}, phone={}, loginId={}",
            user.getUserId(), user.getPhone(), user.getLoginId());

        return new CustomUserDetails(user);
    }

    /**
     * User 엔티티를 UserDetails로 래핑하는 클래스
     */
    @RequiredArgsConstructor
    public static class CustomUserDetails implements UserDetails {
        private final User user;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );
        }

        @Override
        public String getPassword() {
            return user.getPassword();
        }

        @Override
        public String getUsername() {
            return user.getPhone();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return user.isActive();
        }

        public User getUser() {
            return user;
        }
    }
}