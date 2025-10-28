package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.CostModel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * CostModelRepository 테스트
 */
@DataJpaTest
@DisplayName("CostModelRepository 테스트")
@org.springframework.test.context.TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CostModelRepositoryTest {

    @Autowired
    private CostModelRepository costModelRepository;

    @Test
    @DisplayName("타입으로 요금제 조회")
    void findByType_Success() {
        // Given
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
        costModelRepository.save(costModel);

        // When
        Optional<CostModel> result = costModelRepository.findByType(CostModel.CostType.MONTHLY);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getType()).isEqualTo(CostModel.CostType.MONTHLY);
    }

    @Test
    @DisplayName("모든 요금제 조회 (정렬)")
    void findAllByOrderByCostIdAsc_Success() {
        // Given
        CostModel monthly = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
        costModelRepository.save(monthly);

        CostModel yearly = CostModel.builder()
                .type(CostModel.CostType.YEARLY)
                .cost(100000)
                .build();
        costModelRepository.save(yearly);

        // When
        List<CostModel> result = costModelRepository.findAllByOrderByCostIdAsc();

        // Then
        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("타입 존재 여부 확인 - 존재함")
    void existsByType_True() {
        // Given
        CostModel costModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
        costModelRepository.save(costModel);

        // When
        boolean result = costModelRepository.existsByType(CostModel.CostType.MONTHLY);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("타입 존재 여부 확인 - 존재하지 않음")
    void existsByType_False() {
        // When
        boolean result = costModelRepository.existsByType(CostModel.CostType.LIFETIME);

        // Then
        assertThat(result).isFalse();
    }
}
