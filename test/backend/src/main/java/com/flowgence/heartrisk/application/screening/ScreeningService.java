package com.flowgence.heartrisk.application.screening;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.screening.Screening;
import com.flowgence.heartrisk.infrastructure.repository.ScreeningRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;

    public ScreeningService(ScreeningRepository screeningRepository) {
        this.screeningRepository = screeningRepository;
    }

    @Transactional
    public Screening recordScreening(User user, String resultLabel, BigDecimal riskScore, String recommendation,
                                     String sdkVersion, List<ScreeningMetricInput> metrics) {
        var screening = new Screening(user);
        screening.markCompleted(resultLabel, riskScore, recommendation, sdkVersion);
        if (metrics != null) {
            metrics.forEach(metric -> screening.addMetric(metric.key(), metric.value(), metric.unit()));
        }
        return screeningRepository.save(screening);
    }

    public List<Screening> findByUser(Long userId) {
        return screeningRepository.findByUserId(userId);
    }

    public Optional<Screening> getById(Long id) {
        return screeningRepository.findById(id);
    }
}
