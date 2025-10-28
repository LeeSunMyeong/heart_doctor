package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.CostModel.CostType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CostModelRepository for Heart Doctor system
 * 요금제 데이터 접근 레이어
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Repository
public interface CostModelRepository extends JpaRepository<CostModel, Short> {

    /**
     * 구독 타입으로 요금제 조회
     * @param type 구독 타입
     * @return 요금제
     */
    Optional<CostModel> findByType(CostType type);

    /**
     * 모든 요금제를 ID 순으로 조회
     * @return 요금제 목록
     */
    List<CostModel> findAllByOrderByCostIdAsc();

    /**
     * 특정 타입의 요금제 존재 여부 확인
     * @param type 구독 타입
     * @return 존재 여부
     */
    boolean existsByType(CostType type);
}
