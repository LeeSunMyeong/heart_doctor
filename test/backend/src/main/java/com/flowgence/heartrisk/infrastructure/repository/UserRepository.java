package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.auth.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
