package com.flowgence.heartrisk.domain.screening;

import com.flowgence.heartrisk.domain.auth.User;
import com.flowgence.heartrisk.domain.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screenings")
public class Screening extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ScreeningStatus status = ScreeningStatus.SUBMITTED;

    @Column(name = "result_label", length = 50)
    private String resultLabel;

    @Column(name = "risk_score")
    private BigDecimal riskScore;

    @Column(name = "recommendation", length = 500)
    private String recommendation;

    @Column(name = "sdk_version", length = 40)
    private String sdkVersion;

    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScreeningMetric> metrics = new ArrayList<>();

    protected Screening() {
    }

    public Screening(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public ScreeningStatus getStatus() {
        return status;
    }

    public String getResultLabel() {
        return resultLabel;
    }

    public BigDecimal getRiskScore() {
        return riskScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public String getSdkVersion() {
        return sdkVersion;
    }

    public List<ScreeningMetric> getMetrics() {
        return metrics;
    }

    public void addMetric(String key, String value, String unit) {
        var metric = new ScreeningMetric(this, key, value, unit);
        this.metrics.add(metric);
    }

    public void clearMetrics() {
        this.metrics.clear();
    }

    public void markCompleted(String resultLabel, BigDecimal riskScore, String recommendation, String sdkVersion) {
        this.status = ScreeningStatus.COMPLETED;
        this.resultLabel = resultLabel;
        this.riskScore = riskScore;
        this.recommendation = recommendation;
        this.sdkVersion = sdkVersion;
    }

    public void markFailed(String reason) {
        this.status = ScreeningStatus.FAILED;
        this.recommendation = reason;
    }
}
