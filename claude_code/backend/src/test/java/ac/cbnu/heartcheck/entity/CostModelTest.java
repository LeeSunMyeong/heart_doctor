package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

/**
 * CostModel 엔티티 유닛 테스트
 */
@DisplayName("CostModel 엔티티 테스트")
class CostModelTest {

    @Test
    @DisplayName("CostModel 빌더 생성 테스트 - MONTHLY")
    void buildCostModel_Monthly_Success() {
        // When
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();

        // Then
        assertThat(costModel).isNotNull();
        assertThat(costModel.getType()).isEqualTo(CostModel.CostType.MONTHLY);
        assertThat(costModel.getCost()).isEqualTo(10000);
    }

    @Test
    @DisplayName("CostModel 빌더 생성 테스트 - YEARLY")
    void buildCostModel_Yearly_Success() {
        // When
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.YEARLY)
                .cost(100000)
                .build();

        // Then
        assertThat(costModel).isNotNull();
        assertThat(costModel.getType()).isEqualTo(CostModel.CostType.YEARLY);
        assertThat(costModel.getCost()).isEqualTo(100000);
    }

    @Test
    @DisplayName("CostModel 빌더 생성 테스트 - LIFETIME")
    void buildCostModel_Lifetime_Success() {
        // When
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.LIFETIME)
                .cost(300000)
                .build();

        // Then
        assertThat(costModel).isNotNull();
        assertThat(costModel.getType()).isEqualTo(CostModel.CostType.LIFETIME);
        assertThat(costModel.getCost()).isEqualTo(300000);
    }

    @Test
    @DisplayName("가격 업데이트 테스트")
    void updateCost_Success() {
        // Given
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();

        // When
        costModel.setCost(12000);

        // Then
        assertThat(costModel.getCost()).isEqualTo(12000);
    }

    @Test
    @DisplayName("CostType enum 값 테스트")
    void costTypeEnum_AllValues() {
        // When & Then
        assertThat(CostModel.CostType.values()).hasSize(3);
        assertThat(CostModel.CostType.values())
                .containsExactlyInAnyOrder(
                        CostModel.CostType.MONTHLY,
                        CostModel.CostType.YEARLY,
                        CostModel.CostType.LIFETIME
                );
    }

    @Test
    @DisplayName("CostType valueOf 테스트")
    void costTypeEnum_ValueOf() {
        // When & Then
        assertThat(CostModel.CostType.valueOf("MONTHLY")).isEqualTo(CostModel.CostType.MONTHLY);
        assertThat(CostModel.CostType.valueOf("YEARLY")).isEqualTo(CostModel.CostType.YEARLY);
        assertThat(CostModel.CostType.valueOf("LIFETIME")).isEqualTo(CostModel.CostType.LIFETIME);
    }
}
