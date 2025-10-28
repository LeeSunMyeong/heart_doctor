package com.flowgence.heartrisk.infrastructure.repository;

import com.flowgence.heartrisk.domain.screening.Screening;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {
    List<Screening> findByUserId(Long userId);
}
