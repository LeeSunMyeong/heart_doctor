package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.CostModel.CostType;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * CostModelService 유닛 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CostModelService 유닛 테스트")
class CostModelServiceTest {

    @Mock
    private CostModelRepository costModelRepository;

    @InjectMocks
    private CostModelService costModelService;

    private CostModel monthlyPlan;
    private CostModel yearlyPlan;
    private CostModel lifetimePlan;

    @BeforeEach
    void setUp() {
        // 월간 요금제
        monthlyPlan = CostModel.builder()
                .costId((short) 1)
                .type(CostType.MONTHLY)
                .cost(10000)
                .build();

        // 연간 요금제
        yearlyPlan = CostModel.builder()
                .costId((short) 2)
                .type(CostType.YEARLY)
                .cost(100000)
                .build();

        // 평생 요금제
        lifetimePlan = CostModel.builder()
                .costId((short) 3)
                .type(CostType.LIFETIME)
                .cost(300000)
                .build();
    }

    @Test
    @DisplayName("모든 요금제 조회")
    void getAllPlans_Success() {
        // Given
        List<CostModel> plans = Arrays.asList(monthlyPlan, yearlyPlan, lifetimePlan);
        when(costModelRepository.findAllByOrderByCostIdAsc()).thenReturn(plans);

        // When
        List<CostModel> result = costModelService.getAllPlans();

        // Then
        assertThat(result).hasSize(3);
        assertThat(result).containsExactly(monthlyPlan, yearlyPlan, lifetimePlan);
        verify(costModelRepository, times(1)).findAllByOrderByCostIdAsc();
    }

    @Test
    @DisplayName("요금제 ID로 조회 성공")
    void getPlanById_Success() {
        // Given
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(monthlyPlan));

        // When
        CostModel result = costModelService.getPlanById((short) 1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCostId()).isEqualTo((short) 1);
        assertThat(result.getType()).isEqualTo(CostType.MONTHLY);
        assertThat(result.getCost()).isEqualTo(10000);
    }

    @Test
    @DisplayName("요금제 ID로 조회 실패 - 없는 요금제")
    void getPlanById_NotFound() {
        // Given
        when(costModelRepository.findById((short) 99)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> costModelService.getPlanById((short) 99))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("요금제 타입으로 조회 성공")
    void getPlanByType_Success() {
        // Given
        when(costModelRepository.findByType(CostType.MONTHLY)).thenReturn(Optional.of(monthlyPlan));

        // When
        CostModel result = costModelService.getPlanByType(CostType.MONTHLY);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(CostType.MONTHLY);
    }

    @Test
    @DisplayName("요금제 타입으로 조회 실패 - 없는 타입")
    void getPlanByType_NotFound() {
        // Given
        when(costModelRepository.findByType(CostType.MONTHLY)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> costModelService.getPlanByType(CostType.MONTHLY))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("요금제 생성 성공")
    void createPlan_Success() {
        // Given
        CostModel newPlan = CostModel.builder()
                .type(CostType.MONTHLY)
                .cost(15000)
                .build();

        when(costModelRepository.existsByType(CostType.MONTHLY)).thenReturn(false);
        when(costModelRepository.save(any(CostModel.class))).thenReturn(newPlan);

        // When
        CostModel result = costModelService.createPlan(CostType.MONTHLY, 15000);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(CostType.MONTHLY);
        assertThat(result.getCost()).isEqualTo(15000);
        verify(costModelRepository, times(1)).save(any(CostModel.class));
    }

    @Test
    @DisplayName("요금제 생성 실패 - 이미 존재하는 타입")
    void createPlan_TypeAlreadyExists() {
        // Given
        when(costModelRepository.existsByType(CostType.MONTHLY)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> costModelService.createPlan(CostType.MONTHLY, 15000))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 존재하는 요금제 타입입니다");

        verify(costModelRepository, never()).save(any());
    }

    @Test
    @DisplayName("요금제 수정 성공")
    void updatePlan_Success() {
        // Given
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(monthlyPlan));
        when(costModelRepository.save(any(CostModel.class))).thenReturn(monthlyPlan);

        // When
        CostModel result = costModelService.updatePlan((short) 1, 12000);

        // Then
        assertThat(result).isNotNull();
        verify(costModelRepository, times(1)).save(any(CostModel.class));
    }

    @Test
    @DisplayName("요금제 수정 실패 - 없는 요금제")
    void updatePlan_NotFound() {
        // Given
        when(costModelRepository.findById((short) 99)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> costModelService.updatePlan((short) 99, 12000))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");

        verify(costModelRepository, never()).save(any());
    }


    @Test
    @DisplayName("요금제 삭제 성공")
    void deletePlan_Success() {
        // Given
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(monthlyPlan));
        doNothing().when(costModelRepository).delete(monthlyPlan);

        // When
        costModelService.deletePlan((short) 1);

        // Then
        verify(costModelRepository, times(1)).delete(monthlyPlan);
    }

    @Test
    @DisplayName("요금제 삭제 실패 - 없는 요금제")
    void deletePlan_NotFound() {
        // Given
        when(costModelRepository.findById((short) 99)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> costModelService.deletePlan((short) 99))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");

        verify(costModelRepository, never()).delete(any());
    }

}
