package ac.cbnu.heartcheck.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Prediction Request DTO
 * AI 진단 결과 생성 요청
 * User data is extracted from JWT token on backend via @AuthenticationPrincipal
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
public class PredictionRequest {

    @NotNull(message = "검사 ID는 필수입니다")
    private Long checkId;
}
