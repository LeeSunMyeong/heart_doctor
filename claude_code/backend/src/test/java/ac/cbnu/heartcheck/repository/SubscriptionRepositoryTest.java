package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * SubscriptionRepository 테스트
 */
@DataJpaTest
@DisplayName("SubscriptionRepository 테스트")
@org.springframework.test.context.TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class SubscriptionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CostModelRepository costModelRepository;

    private User testUser;
    private CostModel testCostModel;

    @BeforeEach
    void setUp() {
        // 사용자 생성
        testUser = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();
        testUser = userRepository.save(testUser);

        // 요금제 생성
        testCostModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
        testCostModel = costModelRepository.save(testCostModel);
    }

    @Test
    @DisplayName("사용자 ID로 구독 목록 조회")
    void findByUserId_Success() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(subscription);

        // When
        List<Subscription> result = subscriptionRepository.findByUserId(testUser.getUserId());

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUser().getUserId()).isEqualTo(testUser.getUserId());
    }

    @Test
    @DisplayName("사용자 ID와 상태로 구독 조회")
    void findByUserIdAndStatus_Success() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(subscription);

        // When
        Optional<Subscription> result = subscriptionRepository.findByUserIdAndStatus(
                testUser.getUserId(),
                Subscription.SubscriptionStatus.ACTIVE
        );

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
    }

    @Test
    @DisplayName("유효한 구독 조회")
    void findValidSubscriptionByUserId_Success() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(now.minusDays(5))
                .toDate(now.plusDays(25))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(subscription);

        // When
        Optional<Subscription> result = subscriptionRepository.findValidSubscriptionByUserId(
                testUser.getUserId(),
                now
        );

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
    }

    @Test
    @DisplayName("만료된 구독 조회")
    void findExpiredSubscriptions_Success() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        Subscription expiredSubscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(now.minusDays(40))
                .toDate(now.minusDays(10))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(expiredSubscription);

        // When
        List<Subscription> result = subscriptionRepository.findExpiredSubscriptions(now);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getToDate()).isBefore(now);
    }

    @Test
    @DisplayName("활성 구독 존재 여부 확인 - 존재함")
    void hasActiveSubscription_True() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(now.minusDays(5))
                .toDate(now.plusDays(25))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(subscription);

        // When
        boolean result = subscriptionRepository.hasActiveSubscription(testUser.getUserId(), now);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("활성 구독 존재 여부 확인 - 존재하지 않음")
    void hasActiveSubscription_False() {
        // Given
        LocalDateTime now = LocalDateTime.now();

        // When
        boolean result = subscriptionRepository.hasActiveSubscription(testUser.getUserId(), now);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("특정 기간의 신규 구독 수 조회")
    void countNewSubscriptions_Success() {
        // Given
        LocalDateTime start = LocalDateTime.now().minusDays(10);
        LocalDateTime end = LocalDateTime.now();

        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(start.plusDays(5))
                .toDate(end.plusDays(25))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(subscription);

        // When
        long count = subscriptionRepository.countNewSubscriptions(start, end);

        // Then
        assertThat(count).isEqualTo(1);
    }

    @Test
    @DisplayName("사용자의 최근 구독 조회")
    void findLatestByUserId_Success() {
        // Given
        Subscription oldSubscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(60))
                .toDate(LocalDateTime.now().minusDays(30))
                .status(Subscription.SubscriptionStatus.EXPIRED)
                .build();
        subscriptionRepository.save(oldSubscription);

        Subscription newSubscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(5))
                .toDate(LocalDateTime.now().plusDays(25))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(newSubscription);

        // When
        Optional<Subscription> result = subscriptionRepository.findLatestByUserId(testUser.getUserId());

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
    }
}
