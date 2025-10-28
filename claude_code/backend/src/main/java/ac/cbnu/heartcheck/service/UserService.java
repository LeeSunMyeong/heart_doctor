package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.UserNotFoundException;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 사용자 관리 서비스
 * 사용자 정보 조회, 수정, 관리 등의 비즈니스 로직 처리
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /**
     * 사용자 ID로 사용자 조회
     */
    @Transactional(readOnly = true)
    public User findById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("사용자 ID: " + userId));
    }

    /**
     * 전화번호로 사용자 조회
     */
    @Transactional(readOnly = true)
    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    /**
     * 활성화된 사용자만 전화번호로 조회
     */
    @Transactional(readOnly = true)
    public Optional<User> findByPhoneAndActive(String phone) {
        return userRepository.findByPhoneAndActive(phone);
    }

    /**
     * 전화번호 존재 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    /**
     * SNS 로그인 사용자 조회
     */
    @Transactional(readOnly = true)
    public Optional<User> findBySocialLogin(String provider, String providerUid) {
        return userRepository.findByProviderAndProviderUid(provider, providerUid);
    }

    /**
     * 전체 활성 사용자 수 조회
     */
    @Transactional(readOnly = true)
    public long countActiveUsers() {
        return userRepository.countActiveUsers();
    }

    /**
     * 사용자 정보 저장/업데이트
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * 사용자 활성화 상태 변경
     */
    public void updateEnabled(Long userId, boolean enabled) {
        User user = findById(userId);
        if (enabled) {
            user.activate();
        } else {
            user.deactivate();
        }
        userRepository.save(user);

        log.info("사용자 활성화 상태 변경: ID={}, enabled={}", userId, enabled);
    }
}