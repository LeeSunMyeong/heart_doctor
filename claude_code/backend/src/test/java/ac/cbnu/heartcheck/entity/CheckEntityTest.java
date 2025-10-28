package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Check 엔티티 단위 테스트
 * Heart Doctor 명세서 기준 16개 증상 검사 엔티티 검증
 */
class CheckEntityTest {

    @Test
    @DisplayName("Check 엔티티 빌더 패턴 생성 테스트")
    void testCheckBuilder() {
        // Given
        User user = createTestUser();

        // When
        Check check = Check.builder()
                .user(user)
                .gender(false) // 남성
                .age((short) 35)
                .height((short) 175)
                .weight((short) 70)
                .temperature("1") // 낮음
                .breathing("0") // 보통
                .pulse((short) 72)
                .chestPain(true)
                .dyspnea(true)
                .palpitation(false)
                .build();

        // Then
        assertNotNull(check);
        assertEquals(user, check.getUser());
        assertEquals(false, check.getGender());
        assertEquals((short) 35, check.getAge());
        assertEquals((short) 175, check.getHeight());
        assertEquals((short) 70, check.getWeight());
        assertEquals("1", check.getTemperature());
        assertEquals("0", check.getBreathing());
        assertEquals((short) 72, check.getPulse());
        assertTrue(check.getChestPain());
        assertTrue(check.getDyspnea());
        assertFalse(check.getPalpitation());
    }

    @Test
    @DisplayName("BMI 자동 계산 테스트")
    void testBmiCalculation() {
        // Given
        Check check = Check.builder()
                .user(createTestUser())
                .height((short) 175) // 1.75m
                .weight((short) 70)   // 70kg
                .build();

        // When
        check.calculateBmi();

        // Then
        assertNotNull(check.getBmi());
        // BMI = 70 / (1.75 * 1.75) = 22.86
        assertEquals(0, check.getBmi().compareTo(new BigDecimal("22.86")));
    }

    @Test
    @DisplayName("16개 증상 필드 기본값 테스트")
    void testSymptomDefaultValues() {
        // Given & When
        Check check = Check.builder()
                .user(createTestUser())
                .build();

        // Then - 모든 증상이 기본적으로 false여야 함
        assertFalse(check.getChestPain());        // Q1
        assertFalse(check.getFlankPain());        // Q2
        assertFalse(check.getFootPain());         // Q3
        assertFalse(check.getFootEdema());        // Q4
        assertFalse(check.getDyspnea());          // Q5
        assertFalse(check.getSyncope());          // Q6
        assertFalse(check.getWeakness());         // Q7
        assertFalse(check.getVomitting());        // Q8
        assertFalse(check.getPalpitation());      // Q9
        assertFalse(check.getDizziness());        // Q10
        assertFalse(check.getChestTightness());   // Q11
        assertFalse(check.getSweating());         // Q12
        assertFalse(check.getHeadache());         // Q13
        assertFalse(check.getNausea());           // Q14
        assertFalse(check.getEdema());            // Q15
        assertFalse(check.getInsomnia());         // Q16
    }

    @Test
    @DisplayName("증상 개수 카운트 테스트")
    void testSymptomCount() {
        // Given
        Check check = Check.builder()
                .user(createTestUser())
                .chestPain(true)      // +1
                .dyspnea(true)        // +1
                .palpitation(true)    // +1
                .dizziness(false)     // +0
                .headache(true)       // +1
                .build();

        // When
        int symptomCount = check.getSymptomCount();

        // Then
        assertEquals(4, symptomCount);
    }

    @Test
    @DisplayName("위험도 평가 테스트")
    void testRiskLevelAssessment() {
        // Given
        Check lowRiskCheck = Check.builder()
                .user(createTestUser())
                .chestPain(true)
                .dyspnea(true)
                .build(); // 2개 증상

        Check mediumRiskCheck = Check.builder()
                .user(createTestUser())
                .chestPain(true)
                .dyspnea(true)
                .palpitation(true)
                .dizziness(true)
                .headache(true)
                .build(); // 5개 증상

        Check highRiskCheck = Check.builder()
                .user(createTestUser())
                .chestPain(true)
                .flankPain(true)
                .footPain(true)
                .footEdema(true)
                .dyspnea(true)
                .syncope(true)
                .weakness(true)
                .vomitting(true)
                .palpitation(true)
                .build(); // 9개 증상

        // When & Then
        assertEquals("LOW", lowRiskCheck.getRiskLevel());
        assertEquals("MEDIUM", mediumRiskCheck.getRiskLevel());
        assertEquals("HIGH", highRiskCheck.getRiskLevel());
    }

    @Test
    @DisplayName("생체 정보 기본값 테스트")
    void testVitalSignsDefaults() {
        // Given & When
        Check check = Check.builder()
                .user(createTestUser())
                .build();

        // Then
        assertEquals(false, check.getGender());       // 기본값: 남성(false)
        assertEquals("0", check.getTemperature());    // 기본값: 보통
        assertEquals("0", check.getBreathing());      // 기본값: 보통
    }

    @Test
    @DisplayName("맥박수 범위 테스트")
    void testPulseRange() {
        // Given
        Check check = Check.builder()
                .user(createTestUser())
                .pulse((short) 72)
                .build();

        // When & Then
        assertEquals((short) 72, check.getPulse());

        // 정상 범위 맥박수 (일반적으로 60-100)
        assertTrue(check.getPulse() >= 30);  // 최소값
        assertTrue(check.getPulse() <= 220); // 최대값
    }

    @Test
    @DisplayName("성별 설정 테스트")
    void testGenderSetting() {
        // Given
        Check maleCheck = Check.builder()
                .user(createTestUser())
                .gender(false) // 남성
                .build();

        Check femaleCheck = Check.builder()
                .user(createTestUser())
                .gender(true)  // 여성
                .build();

        // When & Then
        assertEquals(false, maleCheck.getGender());
        assertEquals(true, femaleCheck.getGender());
    }

    @Test
    @DisplayName("모든 증상 양성 시 최대 카운트 테스트")
    void testMaxSymptomCount() {
        // Given
        Check check = Check.builder()
                .user(createTestUser())
                // 16개 증상 모두 true
                .chestPain(true)        // Q1
                .flankPain(true)        // Q2
                .footPain(true)         // Q3
                .footEdema(true)        // Q4
                .dyspnea(true)          // Q5
                .syncope(true)          // Q6
                .weakness(true)         // Q7
                .vomitting(true)        // Q8
                .palpitation(true)      // Q9
                .dizziness(true)        // Q10
                .chestTightness(true)   // Q11
                .sweating(true)         // Q12
                .headache(true)         // Q13
                .nausea(true)           // Q14
                .edema(true)            // Q15
                .insomnia(true)         // Q16
                .build();

        // When
        int symptomCount = check.getSymptomCount();

        // Then
        assertEquals(16, symptomCount);
        assertEquals("HIGH", check.getRiskLevel());
    }

    @Test
    @DisplayName("BMI 계산 edge case 테스트")
    void testBmiCalculationEdgeCases() {
        // Given
        Check checkWithNullHeight = Check.builder()
                .user(createTestUser())
                .height(null)
                .weight((short) 70)
                .build();

        Check checkWithZeroHeight = Check.builder()
                .user(createTestUser())
                .height((short) 0)
                .weight((short) 70)
                .build();

        // When
        checkWithNullHeight.calculateBmi();
        checkWithZeroHeight.calculateBmi();

        // Then
        assertNull(checkWithNullHeight.getBmi());
        assertNull(checkWithZeroHeight.getBmi());
    }

    @Test
    @DisplayName("체온과 호흡 상태 코드 테스트")
    void testTemperatureAndBreathingCodes() {
        // Given
        Check check = Check.builder()
                .user(createTestUser())
                .temperature("2") // 높음
                .breathing("1")   // 낮음
                .build();

        // When & Then
        assertEquals("2", check.getTemperature()); // 높음
        assertEquals("1", check.getBreathing());   // 낮음

        // 코드 유효성 확인
        assertTrue(check.getTemperature().matches("[012]"));
        assertTrue(check.getBreathing().matches("[012]"));
    }

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
}