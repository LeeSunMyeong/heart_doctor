package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Check entity for Heart Doctor system
 * 사용자의 건강 검사 데이터 (16개 증상 포함)
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "checks", indexes = {
    @Index(name = "idx_check_user", columnList = "user_id"),
    @Index(name = "idx_check_assessment_time", columnList = "assessment_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Check {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "assessment_time", nullable = false)
    private LocalDateTime assessmentTime;

    // 기본 생체 정보
    @Builder.Default
    @Column(name = "gender")
    private Boolean gender = false; // 0:남, 1:여

    @Min(value = 0, message = "나이는 0 이상이어야 합니다")
    @Max(value = 150, message = "나이는 150 이하여야 합니다")
    @Column(name = "age")
    private Short age;

    @Min(value = 50, message = "키는 50cm 이상이어야 합니다")
    @Max(value = 250, message = "키는 250cm 이하여야 합니다")
    @Column(name = "height")
    private Short height; // cm

    @Min(value = 10, message = "몸무게는 10kg 이상이어야 합니다")
    @Max(value = 300, message = "몸무게는 300kg 이하여야 합니다")
    @Column(name = "weight")
    private Short weight; // kg

    @DecimalMin(value = "10.0", message = "BMI는 10.0 이상이어야 합니다")
    @DecimalMax(value = "50.0", message = "BMI는 50.0 이하여야 합니다")
    @Column(name = "bmi", precision = 4, scale = 2)
    private BigDecimal bmi; // 자동 계산

    @Builder.Default
    @Column(name = "temperature", length = 1)
    private String temperature = "0"; // 0:보통, 1:낮음, 2:높음

    @Builder.Default
    @Column(name = "breathing", length = 1)
    private String breathing = "0"; // 0:보통, 1:낮음, 2:높음

    @Min(value = 30, message = "맥박수는 30bpm 이상이어야 합니다")
    @Max(value = 220, message = "맥박수는 220bpm 이하여야 합니다")
    @Column(name = "pulse")
    private Short pulse; // 30~220 bpm

    // Q1-Q16: 16개 증상 관련 boolean 필드들
    @Builder.Default
    @Column(name = "chest_pain")
    private Boolean chestPain = false; // Q1. 가슴 통증 여부

    @Builder.Default
    @Column(name = "flank_pain")
    private Boolean flankPain = false; // Q2. 옆구리 통증 여부

    @Builder.Default
    @Column(name = "foot_pain")
    private Boolean footPain = false; // Q3. 발 통증 여부

    @Builder.Default
    @Column(name = "foot_edema")
    private Boolean footEdema = false; // Q4. 발 부종 여부

    @Builder.Default
    @Column(name = "dyspnea")
    private Boolean dyspnea = false; // Q5. 호흡곤란 여부

    @Builder.Default
    @Column(name = "syncope")
    private Boolean syncope = false; // Q6. 실신 여부

    @Builder.Default
    @Column(name = "weakness")
    private Boolean weakness = false; // Q7. 피로감 여부

    @Builder.Default
    @Column(name = "vomitting")
    private Boolean vomitting = false; // Q8. 구토 여부

    @Builder.Default
    @Column(name = "palpitation")
    private Boolean palpitation = false; // Q9. 심장 두근거림 여부

    @Builder.Default
    @Column(name = "dizziness")
    private Boolean dizziness = false; // Q10. 어지러움 여부

    @Builder.Default
    @Column(name = "chest_tightness")
    private Boolean chestTightness = false; // Q11. 흉부 답답함 여부

    @Builder.Default
    @Column(name = "sweating")
    private Boolean sweating = false; // Q12. 식은땀 발생 여부

    @Builder.Default
    @Column(name = "headache")
    private Boolean headache = false; // Q13. 두통 여부

    @Builder.Default
    @Column(name = "nausea")
    private Boolean nausea = false; // Q14. 메스꺼움 여부

    @Builder.Default
    @Column(name = "edema")
    private Boolean edema = false; // Q15. 부종 여부

    @Builder.Default
    @Column(name = "insomnia")
    private Boolean insomnia = false; // Q16. 수면장애 여부

    // 관계 매핑
    @OneToOne(mappedBy = "check", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Prediction prediction;

    /**
     * BMI 자동 계산 메서드
     */
    public void calculateBmi() {
        if (height != null && weight != null && height > 0) {
            double heightInMeters = height / 100.0;
            double bmiValue = weight / (heightInMeters * heightInMeters);
            this.bmi = BigDecimal.valueOf(bmiValue).setScale(2, java.math.RoundingMode.HALF_UP);
        }
    }

    /**
     * 검사 전 BMI 자동 계산 수행
     */
    @PrePersist
    @PreUpdate
    public void prePersist() {
        calculateBmi();
    }

    /**
     * 증상 개수 카운트
     * @return 양성 증상의 개수
     */
    public int getSymptomCount() {
        int count = 0;

        if (Boolean.TRUE.equals(chestPain)) count++;
        if (Boolean.TRUE.equals(flankPain)) count++;
        if (Boolean.TRUE.equals(footPain)) count++;
        if (Boolean.TRUE.equals(footEdema)) count++;
        if (Boolean.TRUE.equals(dyspnea)) count++;
        if (Boolean.TRUE.equals(syncope)) count++;
        if (Boolean.TRUE.equals(weakness)) count++;
        if (Boolean.TRUE.equals(vomitting)) count++;
        if (Boolean.TRUE.equals(palpitation)) count++;
        if (Boolean.TRUE.equals(dizziness)) count++;
        if (Boolean.TRUE.equals(chestTightness)) count++;
        if (Boolean.TRUE.equals(sweating)) count++;
        if (Boolean.TRUE.equals(headache)) count++;
        if (Boolean.TRUE.equals(nausea)) count++;
        if (Boolean.TRUE.equals(edema)) count++;
        if (Boolean.TRUE.equals(insomnia)) count++;

        return count;
    }

    /**
     * 위험도 평가 (증상 개수 기반)
     * @return 위험도 레벨 (LOW, MEDIUM, HIGH)
     */
    public String getRiskLevel() {
        int symptomCount = getSymptomCount();

        if (symptomCount <= 3) {
            return "LOW";
        } else if (symptomCount <= 8) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }
}