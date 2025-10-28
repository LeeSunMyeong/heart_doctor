package com.flowgence.heartrisk.application.settings;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.settings.UserSettings;
import com.flowgence.heartrisk.infrastructure.repository.UserSettingsRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final UserSettingsRepository userSettingsRepository;

    public SettingsService(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }

    public Optional<UserSettings> findByUser(Long userId) {
        return userSettingsRepository.findByUserId(userId);
    }

    @Transactional
    public UserSettings updateSettings(User user, String locale, String inputMode, Integer timeoutSec, boolean notifications) {
        var settings = userSettingsRepository.findByUserId(user.getId())
            .orElseGet(() -> userSettingsRepository.save(new UserSettings(user)));
        if (locale != null) {
            settings.applyLocale(locale);
        }
        if (inputMode != null) {
            settings.applyInputMode(inputMode);
        }
        if (timeoutSec != null) {
            settings.applyTimeout(timeoutSec);
        }
        settings.toggleNotifications(notifications);
        return userSettingsRepository.save(settings);
    }
}
