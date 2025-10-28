package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Prediction entity for Heart Doctor system
 * AI 추론 기반 진단 결과 저장
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "predictions", indexes = {
    @Index(name = "idx_prediction_user", columnList = "user_id"),
    @Index(name = "idx_prediction_assessment", columnList = "assessment_id"),
    @Index(name = "idx_prediction_time", columnList = "predict_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "검사 데이터는 필수입니다")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Check check;

    // AI 진단 결과 - 6개 질환 확률
    @NotNull(message = "협심증 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "angina", precision = 5, scale = 2, nullable = false)
    private BigDecimal angina; // 협심증 확률

    @NotNull(message = "심근경색 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "mi", precision = 5, scale = 2, nullable = false)
    private BigDecimal mi; // 심근경색 확률

    @NotNull(message = "심부전 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "hf", precision = 5, scale = 2, nullable = false)
    private BigDecimal hf; // 심부전 확률

    @NotNull(message = "심방세동 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "af", precision = 5, scale = 2, nullable = false)
    private BigDecimal af; // 심방세동 확률

    @NotNull(message = "기타 질환 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "other", precision = 5, scale = 2, nullable = false)
    private BigDecimal other; // 기타 질환 확률

    @NotNull(message = "정상 확률은 필수입니다")
    @DecimalMin(value = "0.00", message = "확률은 0.00 이상이어야 합니다")
    @DecimalMax(value = "100.00", message = "확률은 100.00 이하여야 합니다")
    @Column(name = "normal", precision = 5, scale = 2, nullable = false)
    private BigDecimal normal; // 정상 확률

    @NotBlank(message = "결과 코멘트는 필수입니다")
    @Column(name = "comment", length = 100, nullable = false)
    private String comment; // 결과 코멘트

    @CreationTimestamp
    @Column(name = "predict_time")
    private LocalDateTime predictTime; // 예측 시각

    /**
     * 가장 높은 확률을 가진 진단 결과 반환
     * @return 최고 확률 진단명
     */
    public String getHighestProbabilityDiagnosis() {
        BigDecimal maxProbability = angina;
        String diagnosis = "ANGINA";

        if (mi.compareTo(maxProbability) > 0) {
            maxProbability = mi;
            diagnosis = "MYOCARDIAL_INFARCTION";
        }

        if (hf.compareTo(maxProbability) > 0) {
            maxProbability = hf;
            diagnosis = "HEART_FAILURE";
        }

        if (af.compareTo(maxProbability) > 0) {
            maxProbability = af;
            diagnosis = "ATRIAL_FIBRILLATION";
        }

        if (other.compareTo(maxProbability) > 0) {
            maxProbability = other;
            diagnosis = "OTHER";
        }

        if (normal.compareTo(maxProbability) > 0) {
            maxProbability = normal;
            diagnosis = "NORMAL";
        }

        return diagnosis;
    }

    /**
     * 가장 높은 확률 값 반환
     * @return 최고 확률 값
     */
    public BigDecimal getHighestProbability() {
        BigDecimal[] probabilities = {angina, mi, hf, af, other, normal};
        BigDecimal max = probabilities[0];

        for (BigDecimal prob : probabilities) {
            if (prob.compareTo(max) > 0) {
                max = prob;
            }
        }

        return max;
    }

    /**
     * 위험도 레벨 판정
     * @return 위험도 (LOW, MEDIUM, HIGH, CRITICAL)
     */
    public String getRiskLevel() {
        String diagnosis = getHighestProbabilityDiagnosis();
        BigDecimal probability = getHighestProbability();

        // 정상인 경우
        if ("NORMAL".equals(diagnosis)) {
            return "LOW";
        }

        // 질환이 있는 경우 확률에 따라 위험도 결정
        if (probability.compareTo(BigDecimal.valueOf(80)) >= 0) {
            return "CRITICAL";
        } else if (probability.compareTo(BigDecimal.valueOf(60)) >= 0) {
            return "HIGH";
        } else if (probability.compareTo(BigDecimal.valueOf(40)) >= 0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    /**
     * 의료진 검토 권장 여부
     * @return 의료진 검토 권장 여부
     */
    public boolean isRecommendMedicalReview() {
        String riskLevel = getRiskLevel();
        return "HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel);
    }

    /**
     * 진단 결과 한글명 반환
     * @return 진단명 한글
     */
    public String getDiagnosisKoreanName() {
        String diagnosis = getHighestProbabilityDiagnosis();

        switch (diagnosis) {
            case "ANGINA":
                return "협심증";
            case "MYOCARDIAL_INFARCTION":
                return "심근경색";
            case "HEART_FAILURE":
                return "심부전";
            case "ATRIAL_FIBRILLATION":
                return "심방세동";
            case "OTHER":
                return "기타 심장질환";
            case "NORMAL":
                return "정상";
            default:
                return "알 수 없음";
        }
    }
}