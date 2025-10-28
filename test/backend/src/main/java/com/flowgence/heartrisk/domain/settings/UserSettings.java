package com.flowgence.heartrisk.domain.settings;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_settings")
public class UserSettings extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "locale", length = 10)
    private String locale = "ko";

    @Column(name = "input_mode", length = 20)
    private String inputMode = "TEXT";

    @Column(name = "timeout_sec")
    private Integer timeoutSec = 60;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = Boolean.TRUE;

    protected UserSettings() {
    }

    public UserSettings(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public String getLocale() {
        return locale;
    }

    public String getInputMode() {
        return inputMode;
    }

    public Integer getTimeoutSec() {
        return timeoutSec;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void applyLocale(String locale) {
        this.locale = locale;
    }

    public void applyInputMode(String inputMode) {
        this.inputMode = inputMode;
    }

    public void applyTimeout(Integer timeoutSec) {
        this.timeoutSec = timeoutSec;
    }

    public void toggleNotifications(boolean enabled) {
        this.notificationsEnabled = enabled;
    }
}
