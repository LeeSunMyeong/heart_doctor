package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.settings.UserSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUserId(Long userId);
}
