package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.CostModel.CostType;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CostModelService for Heart Doctor system
 * 요금제 관리 비즈니스 로직
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CostModelService {

    private final CostModelRepository costModelRepository;

    /**
     * 모든 요금제 조회
     * @return 요금제 목록
     */
    public List<CostModel> getAllPlans() {
        log.debug("Fetching all cost models");
        return costModelRepository.findAllByOrderByCostIdAsc();
    }

    /**
     * 요금제 ID로 조회
     * @param costId 요금제 ID
     * @return 요금제
     */
    public CostModel getPlanById(Short costId) {
        log.debug("Fetching cost model by ID: {}", costId);
        return costModelRepository.findById(costId)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + costId));
    }

    /**
     * 구독 타입으로 요금제 조회
     * @param type 구독 타입
     * @return 요금제
     */
    public CostModel getPlanByType(CostType type) {
        log.debug("Fetching cost model by type: {}", type);
        return costModelRepository.findByType(type)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + type));
    }

    /**
     * 요금제 생성 (관리자)
     * @param type 구독 타입
     * @param cost 가격
     * @return 생성된 요금제
     */
    @Transactional
    public CostModel createPlan(CostType type, Integer cost) {
        log.info("Creating cost model: type={}, cost={}", type, cost);

        // 중복 확인
        if (costModelRepository.existsByType(type)) {
            throw new IllegalStateException("이미 존재하는 요금제 타입입니다: " + type);
        }

        CostModel costModel = CostModel.builder()
                .type(type)
                .cost(cost)
                .build();

        CostModel saved = costModelRepository.save(costModel);
        log.info("Created cost model ID: {}", saved.getCostId());

        return saved;
    }

    /**
     * 요금제 수정 (관리자)
     * @param costId 요금제 ID
     * @param cost 새로운 가격
     * @return 수정된 요금제
     */
    @Transactional
    public CostModel updatePlan(Short costId, Integer cost) {
        log.info("Updating cost model ID: {} with new cost: {}", costId, cost);

        CostModel costModel = costModelRepository.findById(costId)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + costId));

        costModel.setCost(cost);
        CostModel updated = costModelRepository.save(costModel);

        log.info("Updated cost model ID: {}", costId);
        return updated;
    }

    /**
     * 요금제 삭제 (관리자)
     * @param costId 요금제 ID
     */
    @Transactional
    public void deletePlan(Short costId) {
        log.info("Deleting cost model ID: {}", costId);

        CostModel costModel = costModelRepository.findById(costId)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + costId));

        // 연결된 구독이 있는지 확인
        if (!costModel.getSubscriptions().isEmpty()) {
            throw new IllegalStateException("구독이 연결된 요금제는 삭제할 수 없습니다");
        }

        costModelRepository.delete(costModel);
        log.info("Deleted cost model ID: {}", costId);
    }

    /**
     * 기본 요금제 초기화 (애플리케이션 시작 시)
     */
    @Transactional
    public void initializeDefaultPlans() {
        log.info("Initializing default cost models...");

        // 월간 구독
        if (!costModelRepository.existsByType(CostType.MONTHLY)) {
            CostModel monthly = CostModel.builder()
                    .type(CostType.MONTHLY)
                    .cost(10000)
                    .build();
            costModelRepository.save(monthly);
            log.info("Created default MONTHLY plan");
        }

        // 연간 구독
        if (!costModelRepository.existsByType(CostType.YEARLY)) {
            CostModel yearly = CostModel.builder()
                    .type(CostType.YEARLY)
                    .cost(100000)
                    .build();
            costModelRepository.save(yearly);
            log.info("Created default YEARLY plan");
        }

        // 평생 구독
        if (!costModelRepository.existsByType(CostType.LIFETIME)) {
            CostModel lifetime = CostModel.builder()
                    .type(CostType.LIFETIME)
                    .cost(300000)
                    .build();
            costModelRepository.save(lifetime);
            log.info("Created default LIFETIME plan");
        }

        log.info("Default cost models initialized");
    }
}
