package com.flowgence.heartrisk.domain.audio;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.common.BaseEntity;
import com.flowgence.heartrisk.domain.screening.Screening;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "audio_sessions")
public class AudioSession extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id")
    private Screening screening;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, length = 20)
    private AudioSessionState state = AudioSessionState.INITIALIZED;

    @Column(name = "duration_sec")
    private Integer durationSec;

    @Column(name = "error_code", length = 50)
    private String errorCode;

    protected AudioSession() {
    }

    public AudioSession(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public Screening getScreening() {
        return screening;
    }

    public AudioSessionState getState() {
        return state;
    }

    public Integer getDurationSec() {
        return durationSec;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void linkScreening(Screening screening) {
        this.screening = screening;
    }

    public void updateState(AudioSessionState state) {
        this.state = state;
    }

    public void complete(Integer durationSec) {
        this.state = AudioSessionState.COMPLETED;
        this.durationSec = durationSec;
    }

    public void fail(String errorCode) {
        this.state = AudioSessionState.ERROR;
        this.errorCode = errorCode;
    }
}
