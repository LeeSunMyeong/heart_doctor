package com.flowgence.heartrisk.domain.screening;

import com.flowgence.heartrisk.domain.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "screening_metrics")
public class ScreeningMetric extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    @Column(name = "metric_key", nullable = false, length = 100)
    private String metricKey;

    @Column(name = "metric_value", nullable = false, length = 100)
    private String metricValue;

    @Column(name = "unit", length = 30)
    private String unit;

    protected ScreeningMetric() {
    }

    public ScreeningMetric(Screening screening, String metricKey, String metricValue, String unit) {
        this.screening = screening;
        this.metricKey = metricKey;
        this.metricValue = metricValue;
        this.unit = unit;
    }

    public Screening getScreening() {
        return screening;
    }

    public String getMetricKey() {
        return metricKey;
    }

    public String getMetricValue() {
        return metricValue;
    }

    public String getUnit() {
        return unit;
    }
}
