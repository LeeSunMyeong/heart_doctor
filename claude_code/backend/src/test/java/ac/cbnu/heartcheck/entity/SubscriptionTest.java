package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Subscription 엔티티 유닛 테스트
 */
@DisplayName("Subscription 엔티티 테스트")
class SubscriptionTest {

    private User testUser;
    private CostModel testCostModel;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();

        testCostModel = CostModel.builder()
                .costId((short) 1)
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
    }

    @Test
    @DisplayName("Subscription 빌더 생성 테스트")
    void buildSubscription_Success() {
        // Given
        LocalDateTime fromDate = LocalDateTime.now();
        LocalDateTime toDate = fromDate.plusDays(30);

        // When
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(fromDate)
                .toDate(toDate)
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // Then
        assertThat(subscription).isNotNull();
        assertThat(subscription.getUser()).isEqualTo(testUser);
        assertThat(subscription.getCostModel()).isEqualTo(testCostModel);
        assertThat(subscription.getFromDate()).isEqualTo(fromDate);
        assertThat(subscription.getToDate()).isEqualTo(toDate);
        assertThat(subscription.getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
    }

    @Test
    @DisplayName("구독 활성화 테스트")
    void activate_Success() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.PENDING)
                .build();

        // When
        subscription.activate();

        // Then
        assertThat(subscription.getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
        assertThat(subscription.isActive()).isTrue();
    }

    @Test
    @DisplayName("구독 취소 테스트")
    void cancel_Success() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // When
        subscription.cancel();

        // Then
        assertThat(subscription.getStatus()).isEqualTo(Subscription.SubscriptionStatus.CANCELED);
        assertThat(subscription.isCanceled()).isTrue();
    }

    @Test
    @DisplayName("구독 만료 상태 확인 테스트")
    void isExpired_True() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(40))
                .toDate(LocalDateTime.now().minusDays(10))
                .status(Subscription.SubscriptionStatus.EXPIRED)
                .build();

        // Then
        assertThat(subscription.getStatus()).isEqualTo(Subscription.SubscriptionStatus.EXPIRED);
        assertThat(subscription.isExpired()).isTrue();
    }

    @Test
    @DisplayName("구독 연장 테스트")
    void extend_Success() {
        // Given
        LocalDateTime originalToDate = LocalDateTime.now().plusDays(30);
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(originalToDate)
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // When
        subscription.extend(10);

        // Then
        assertThat(subscription.getToDate()).isAfter(originalToDate);
        assertThat(subscription.getToDate()).isEqualTo(originalToDate.plusDays(10));
    }

    @Test
    @DisplayName("구독 활성 상태 확인 - ACTIVE")
    void isActive_True_WhenActive() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // Then
        assertThat(subscription.isActive()).isTrue();
    }

    @Test
    @DisplayName("구독 활성 상태 확인 - PENDING")
    void isActive_False_WhenPending() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.PENDING)
                .build();

        // Then
        assertThat(subscription.isActive()).isFalse();
    }

    @Test
    @DisplayName("구독 유효성 확인 - ACTIVE 상태")
    void isValid_True_WhenActive() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(5))
                .toDate(LocalDateTime.now().plusDays(25))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // When
        boolean isValid = subscription.isValid();

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("구독 유효성 확인 - EXPIRED 상태")
    void isValid_False_WhenExpired() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(40))
                .toDate(LocalDateTime.now().minusDays(10))
                .status(Subscription.SubscriptionStatus.EXPIRED)
                .build();

        // When
        boolean isValid = subscription.isValid();

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("구독 유효성 확인 - CANCELED 상태")
    void isValid_False_WhenCanceled() {
        // Given
        Subscription subscription = Subscription.builder()
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now().minusDays(5))
                .toDate(LocalDateTime.now().plusDays(25))
                .status(Subscription.SubscriptionStatus.CANCELED)
                .build();

        // When
        boolean isValid = subscription.isValid();

        // Then
        assertThat(isValid).isFalse();
    }
}
