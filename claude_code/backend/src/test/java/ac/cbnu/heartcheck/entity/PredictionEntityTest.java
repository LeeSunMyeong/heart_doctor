package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

/**
 * Prediction 엔티티 단위 테스트
 * Heart Doctor 명세서 기준 AI 진단 결과 엔티티 검증
 */
class PredictionEntityTest {

    @Test
    @DisplayName("Prediction 엔티티 빌더 패턴 생성 테스트")
    void testPredictionBuilder() {
        // Given
        User user = createTestUser();
        Check check = createTestCheck(user);

        // When
        Prediction prediction = Prediction.builder()
                .user(user)
                .check(check)
                .angina(new BigDecimal("75.50"))
                .mi(new BigDecimal("12.30"))
                .hf(new BigDecimal("5.20"))
                .af(new BigDecimal("3.10"))
                .other(new BigDecimal("2.90"))
                .normal(new BigDecimal("1.00"))
                .comment("협심증 가능성이 높습니다")
                .build();

        // Then
        assertNotNull(prediction);
        assertEquals(user, prediction.getUser());
        assertEquals(check, prediction.getCheck());
        assertEquals(0, prediction.getAngina().compareTo(new BigDecimal("75.50")));
        assertEquals(0, prediction.getMi().compareTo(new BigDecimal("12.30")));
        assertEquals(0, prediction.getHf().compareTo(new BigDecimal("5.20")));
        assertEquals(0, prediction.getAf().compareTo(new BigDecimal("3.10")));
        assertEquals(0, prediction.getOther().compareTo(new BigDecimal("2.90")));
        assertEquals(0, prediction.getNormal().compareTo(new BigDecimal("1.00")));
        assertEquals("협심증 가능성이 높습니다", prediction.getComment());
    }

    @Test
    @DisplayName("가장 높은 확률 진단 결과 테스트")
    void testHighestProbabilityDiagnosis() {
        // Given - 협심증이 가장 높은 경우
        Prediction anginaPrediction = createPrediction(
                new BigDecimal("75.50"), new BigDecimal("12.30"), new BigDecimal("5.20"),
                new BigDecimal("3.10"), new BigDecimal("2.90"), new BigDecimal("1.00")
        );

        // Given - 심근경색이 가장 높은 경우
        Prediction miPrediction = createPrediction(
                new BigDecimal("10.00"), new BigDecimal("80.50"), new BigDecimal("5.20"),
                new BigDecimal("2.10"), new BigDecimal("1.90"), new BigDecimal("0.30")
        );

        // Given - 정상이 가장 높은 경우
        Prediction normalPrediction = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("10.00"), new BigDecimal("8.00"),
                new BigDecimal("7.00"), new BigDecimal("5.00"), new BigDecimal("65.00")
        );

        // When & Then
        assertEquals("ANGINA", anginaPrediction.getHighestProbabilityDiagnosis());
        assertEquals("MYOCARDIAL_INFARCTION", miPrediction.getHighestProbabilityDiagnosis());
        assertEquals("NORMAL", normalPrediction.getHighestProbabilityDiagnosis());
    }

    @Test
    @DisplayName("가장 높은 확률 값 반환 테스트")
    void testHighestProbability() {
        // Given
        Prediction prediction = createPrediction(
                new BigDecimal("75.50"), new BigDecimal("12.30"), new BigDecimal("5.20"),
                new BigDecimal("3.10"), new BigDecimal("2.90"), new BigDecimal("1.00")
        );

        // When
        BigDecimal highestProbability = prediction.getHighestProbability();

        // Then
        assertEquals(0, highestProbability.compareTo(new BigDecimal("75.50")));
    }

    @Test
    @DisplayName("위험도 레벨 판정 테스트")
    void testRiskLevel() {
        // Given
        Prediction lowRisk = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("10.00"), new BigDecimal("8.00"),
                new BigDecimal("7.00"), new BigDecimal("5.00"), new BigDecimal("65.00") // 정상이 높음
        );

        Prediction mediumRisk = createPrediction(
                new BigDecimal("50.00"), new BigDecimal("30.00"), new BigDecimal("15.00"),
                new BigDecimal("3.00"), new BigDecimal("1.50"), new BigDecimal("0.50") // 협심증 50%
        );

        Prediction highRisk = createPrediction(
                new BigDecimal("70.00"), new BigDecimal("20.00"), new BigDecimal("7.00"),
                new BigDecimal("2.00"), new BigDecimal("0.80"), new BigDecimal("0.20") // 협심증 70%
        );

        Prediction criticalRisk = createPrediction(
                new BigDecimal("90.00"), new BigDecimal("5.00"), new BigDecimal("3.00"),
                new BigDecimal("1.50"), new BigDecimal("0.30"), new BigDecimal("0.20") // 협심증 90%
        );

        // When & Then
        assertEquals("LOW", lowRisk.getRiskLevel());
        assertEquals("MEDIUM", mediumRisk.getRiskLevel());
        assertEquals("HIGH", highRisk.getRiskLevel());
        assertEquals("CRITICAL", criticalRisk.getRiskLevel());
    }

    @Test
    @DisplayName("의료진 검토 권장 여부 테스트")
    void testMedicalReviewRecommendation() {
        // Given
        Prediction lowRisk = createPrediction(
                new BigDecimal("30.00"), new BigDecimal("20.00"), new BigDecimal("15.00"),
                new BigDecimal("10.00"), new BigDecimal("5.00"), new BigDecimal("20.00")
        );

        Prediction highRisk = createPrediction(
                new BigDecimal("75.00"), new BigDecimal("15.00"), new BigDecimal("5.00"),
                new BigDecimal("3.00"), new BigDecimal("1.50"), new BigDecimal("0.50")
        );

        Prediction criticalRisk = createPrediction(
                new BigDecimal("90.00"), new BigDecimal("5.00"), new BigDecimal("3.00"),
                new BigDecimal("1.50"), new BigDecimal("0.30"), new BigDecimal("0.20")
        );

        // When & Then
        assertFalse(lowRisk.isRecommendMedicalReview());
        assertTrue(highRisk.isRecommendMedicalReview());
        assertTrue(criticalRisk.isRecommendMedicalReview());
    }

    @Test
    @DisplayName("진단 결과 한글명 반환 테스트")
    void testDiagnosisKoreanName() {
        // Given
        Prediction anginaPrediction = createPrediction(
                new BigDecimal("80.00"), new BigDecimal("10.00"), new BigDecimal("5.00"),
                new BigDecimal("3.00"), new BigDecimal("1.50"), new BigDecimal("0.50")
        );

        Prediction miPrediction = createPrediction(
                new BigDecimal("10.00"), new BigDecimal("85.00"), new BigDecimal("3.00"),
                new BigDecimal("1.50"), new BigDecimal("0.30"), new BigDecimal("0.20")
        );

        Prediction hfPrediction = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("10.00"), new BigDecimal("80.00"),
                new BigDecimal("3.00"), new BigDecimal("1.50"), new BigDecimal("0.50")
        );

        Prediction afPrediction = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("10.00"), new BigDecimal("15.00"),
                new BigDecimal("65.00"), new BigDecimal("3.50"), new BigDecimal("1.50")
        );

        Prediction otherPrediction = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("10.00"), new BigDecimal("15.00"),
                new BigDecimal("20.00"), new BigDecimal("48.00"), new BigDecimal("2.00")
        );

        Prediction normalPrediction = createPrediction(
                new BigDecimal("5.00"), new BigDecimal("8.00"), new BigDecimal("10.00"),
                new BigDecimal("7.00"), new BigDecimal("5.00"), new BigDecimal("65.00")
        );

        // When & Then
        assertEquals("협심증", anginaPrediction.getDiagnosisKoreanName());
        assertEquals("심근경색", miPrediction.getDiagnosisKoreanName());
        assertEquals("심부전", hfPrediction.getDiagnosisKoreanName());
        assertEquals("심방세동", afPrediction.getDiagnosisKoreanName());
        assertEquals("기타 심장질환", otherPrediction.getDiagnosisKoreanName());
        assertEquals("정상", normalPrediction.getDiagnosisKoreanName());
    }

    @Test
    @DisplayName("확률 합계 검증 테스트 (100%에 가까운지)")
    void testProbabilitySum() {
        // Given
        Prediction prediction = createPrediction(
                new BigDecimal("45.00"), new BigDecimal("25.00"), new BigDecimal("15.00"),
                new BigDecimal("8.00"), new BigDecimal("5.00"), new BigDecimal("2.00")
        );

        // When
        BigDecimal sum = prediction.getAngina()
                .add(prediction.getMi())
                .add(prediction.getHf())
                .add(prediction.getAf())
                .add(prediction.getOther())
                .add(prediction.getNormal());

        // Then
        assertEquals(0, sum.compareTo(new BigDecimal("100.00")));
    }

    @Test
    @DisplayName("BigDecimal 정밀도 테스트")
    void testBigDecimalPrecision() {
        // Given
        Prediction prediction = createPrediction(
                new BigDecimal("33.33"), new BigDecimal("33.33"), new BigDecimal("33.34"),
                new BigDecimal("0.00"), new BigDecimal("0.00"), new BigDecimal("0.00")
        );

        // When & Then
        assertEquals(2, prediction.getAngina().scale());
        assertEquals(2, prediction.getMi().scale());
        assertEquals(2, prediction.getHf().scale());
    }

    @Test
    @DisplayName("극단값 테스트")
    void testExtremeValues() {
        // Given - 100% 확신
        Prediction certainPrediction = createPrediction(
                new BigDecimal("100.00"), new BigDecimal("0.00"), new BigDecimal("0.00"),
                new BigDecimal("0.00"), new BigDecimal("0.00"), new BigDecimal("0.00")
        );

        // Given - 0% 확률
        Prediction zeroPrediction = createPrediction(
                new BigDecimal("0.00"), new BigDecimal("0.00"), new BigDecimal("0.00"),
                new BigDecimal("0.00"), new BigDecimal("0.00"), new BigDecimal("100.00")
        );

        // When & Then
        assertEquals("ANGINA", certainPrediction.getHighestProbabilityDiagnosis());
        assertEquals("CRITICAL", certainPrediction.getRiskLevel());

        assertEquals("NORMAL", zeroPrediction.getHighestProbabilityDiagnosis());
        assertEquals("LOW", zeroPrediction.getRiskLevel());
    }

    // Helper methods
    private User createTestUser() {
        return User.builder()
                .userName("테스트사용자")
                .userDob("19900101")
                .phone("01012345678")
                .password("password")
                .role(User.Role.USER)
                .isActive(true)
                .build();
    }

    private Check createTestCheck(User user) {
        return Check.builder()
                .user(user)
                .age((short) 35)
                .height((short) 175)
                .weight((short) 70)
                .chestPain(true)
                .dyspnea(true)
                .build();
    }

    private Prediction createPrediction(BigDecimal angina, BigDecimal mi, BigDecimal hf,
                                        BigDecimal af, BigDecimal other, BigDecimal normal) {
        User user = createTestUser();
        Check check = createTestCheck(user);

        return Prediction.builder()
                .user(user)
                .check(check)
                .angina(angina)
                .mi(mi)
                .hf(hf)
                .af(af)
                .other(other)
                .normal(normal)
                .comment("AI 진단 결과")
                .build();
    }
}