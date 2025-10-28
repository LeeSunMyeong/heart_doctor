package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Payment 엔티티 유닛 테스트
 */
@DisplayName("Payment 엔티티 테스트")
class PaymentTest {

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
    @DisplayName("Payment 빌더 생성 테스트")
    void buildPayment_Success() {
        // When
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();

        // Then
        assertThat(payment).isNotNull();
        assertThat(payment.getUser()).isEqualTo(testUser);
        assertThat(payment.getCostModel()).isEqualTo(testCostModel);
        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.PENDING);
        assertThat(payment.getStoreInfo()).isEqualTo("G");
    }

    @Test
    @DisplayName("결제 성공 처리 테스트")
    void markAsSuccess_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .build();

        // When
        payment.markAsSuccess("TXN123");

        // Then
        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.SUCCESS);
        assertThat(payment.getTransactionId()).isEqualTo("TXN123");
        assertThat(payment.isSuccess()).isTrue();
    }

    @Test
    @DisplayName("결제 취소 상태에서 isPending false")
    void isPending_False_WhenCanceled() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .build();

        // When
        payment.markAsCanceled();

        // Then
        assertThat(payment.isPending()).isFalse();
    }

    @Test
    @DisplayName("결제 취소 처리 테스트")
    void markAsCanceled_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .build();

        // When
        payment.markAsCanceled();

        // Then
        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.CANCELED);
        assertThat(payment.isCanceled()).isTrue();
    }

    @Test
    @DisplayName("결제 환불 처리 테스트")
    void markAsRefunded_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .build();

        // When
        payment.markAsRefunded();

        // Then
        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.REFUNDED);
        assertThat(payment.isRefunded()).isTrue();
    }

    @Test
    @DisplayName("Google Play 스토어 확인 테스트")
    void isGooglePlay_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .build();

        // Then
        assertThat(payment.isGooglePlay()).isTrue();
        assertThat(payment.isAppStore()).isFalse();
    }

    @Test
    @DisplayName("Apple App Store 확인 테스트")
    void isAppStore_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("A")
                .build();

        // Then
        assertThat(payment.isAppStore()).isTrue();
        assertThat(payment.isGooglePlay()).isFalse();
    }

    @Test
    @DisplayName("결제 대기 상태 확인 테스트")
    void isPending_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .build();

        // Then
        assertThat(payment.isPending()).isTrue();
    }

    @Test
    @DisplayName("구독 연결 테스트")
    void setSubscription_Test() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .build();

        Subscription subscription = Subscription.builder()
                .id(1L)
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // When
        payment.setSubscription(subscription);

        // Then
        assertThat(payment.getSubscription()).isEqualTo(subscription);
    }
}
