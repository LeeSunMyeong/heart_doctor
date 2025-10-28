package com.flowgence.heartrisk.interfaces.dto.settings;

public record UserSettingsResponse(
    String locale,
    String inputMode,
    Integer timeoutSec,
    Boolean notificationsEnabled
) {}
