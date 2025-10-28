package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.audio.AudioSession;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioSessionRepository extends JpaRepository<AudioSession, Long> {
    List<AudioSession> findByUserId(Long userId);
}
