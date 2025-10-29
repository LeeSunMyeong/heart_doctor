package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * CheckRequest DTO
 * 건강 검사 생성 요청 데이터
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckRequest {

    // Basic Information
    @NotNull(message = "성별은 필수입니다")
    private Boolean gender; // false:남, true:여

    @NotNull(message = "나이는 필수입니다")
    @Min(value = 0, message = "나이는 0 이상이어야 합니다")
    @Max(value = 150, message = "나이는 150 이하여야 합니다")
    private Short age;

    @NotNull(message = "키는 필수입니다")
    @Min(value = 50, message = "키는 50cm 이상이어야 합니다")
    @Max(value = 250, message = "키는 250cm 이하여야 합니다")
    private Short height; // cm

    @NotNull(message = "몸무게는 필수입니다")
    @Min(value = 10, message = "몸무게는 10kg 이상이어야 합니다")
    @Max(value = 300, message = "몸무게는 300kg 이하여야 합니다")
    private Short weight; // kg

    // Vital Signs
    @NotNull(message = "체온은 필수입니다")
    @Pattern(regexp = "^[0-2]$", message = "체온은 0, 1, 2 중 하나여야 합니다")
    private String temperature; // "0":보통, "1":낮음, "2":높음

    @NotNull(message = "호흡은 필수입니다")
    @Pattern(regexp = "^[0-2]$", message = "호흡은 0, 1, 2 중 하나여야 합니다")
    private String breathing; // "0":보통, "1":낮음, "2":빠름

    @NotNull(message = "맥박은 필수입니다")
    @Min(value = 30, message = "맥박수는 30bpm 이상이어야 합니다")
    @Max(value = 220, message = "맥박수는 220bpm 이하여야 합니다")
    private Short pulse; // 30~220 bpm

    // 16 Symptoms (boolean, nullable - default false)
    private Boolean chestPain; // Q1. 가슴 통증
    private Boolean flankPain; // Q2. 옆구리 통증
    private Boolean footPain; // Q3. 발 통증
    private Boolean footEdema; // Q4. 발 부종
    private Boolean dyspnea; // Q5. 호흡곤란
    private Boolean syncope; // Q6. 실신
    private Boolean weakness; // Q7. 피로감
    private Boolean vomitting; // Q8. 구토
    private Boolean palpitation; // Q9. 심장 두근거림
    private Boolean dizziness; // Q10. 어지러움
    private Boolean chestTightness; // Q11. 흉부 답답함
    private Boolean sweating; // Q12. 식은땀
    private Boolean headache; // Q13. 두통
    private Boolean nausea; // Q14. 메스꺼움
    private Boolean edema; // Q15. 부종
    private Boolean insomnia; // Q16. 수면장애
}
