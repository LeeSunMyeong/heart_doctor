package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * PaymentRepository 테스트
 */
@DataJpaTest
@DisplayName("PaymentRepository 테스트")
@org.springframework.test.context.TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CostModelRepository costModelRepository;

    private User testUser;
    private CostModel testCostModel;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();
        testUser = userRepository.save(testUser);

        testCostModel = CostModel.builder()
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();
        testCostModel = costModelRepository.save(testCostModel);
    }

    @Test
    @DisplayName("트랜잭션 ID로 결제 조회")
    void findByTransactionId_Success() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .transactionId("TXN123")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // When
        Optional<Payment> result = paymentRepository.findByTransactionId("TXN123");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTransactionId()).isEqualTo("TXN123");
    }

    @Test
    @DisplayName("사용자별 결제 목록 조회 (페이징)")
    void findByUser_Success() {
        // Given
        for (int i = 0; i < 5; i++) {
            Payment payment = Payment.builder()
                    .user(testUser)
                    .costModel(testCostModel)
                    .status(Payment.PaymentStatus.SUCCESS)
                    .storeInfo("G")
                    .payTime(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);
        }

        // When
        Page<Payment> result = paymentRepository.findByUser(testUser, PageRequest.of(0, 3));

        // Then
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getTotalElements()).isEqualTo(5);
    }

    @Test
    @DisplayName("성공한 결제 목록 조회")
    void findSuccessfulPaymentsByUser_Success() {
        // Given
        Payment successPayment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(successPayment);

        Payment pendingPayment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(pendingPayment);

        // When
        List<Payment> result = paymentRepository.findSuccessfulPaymentsByUser(testUser);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Payment.PaymentStatus.SUCCESS);
    }

    @Test
    @DisplayName("최근 성공 결제 조회")
    void findLatestSuccessfulPaymentByUser_Success() {
        // Given
        for (int i = 0; i < 3; i++) {
            Payment payment = Payment.builder()
                    .user(testUser)
                    .costModel(testCostModel)
                    .status(Payment.PaymentStatus.SUCCESS)
                    .storeInfo("G")
                    .payTime(LocalDateTime.now().minusDays(i))
                    .build();
            paymentRepository.save(payment);
        }

        // When
        List<Payment> result = paymentRepository.findLatestSuccessfulPaymentByUser(
                testUser,
                PageRequest.of(0, 1)
        );

        // Then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("특정 기간 매출 계산")
    void calculateRevenueByDateRange_Success() {
        // Given
        LocalDateTime start = LocalDateTime.now().minusDays(30);
        LocalDateTime end = LocalDateTime.now();

        Payment payment1 = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(start.plusDays(5))
                .build();
        paymentRepository.save(payment1);

        Payment payment2 = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(start.plusDays(10))
                .build();
        paymentRepository.save(payment2);

        // When
        BigDecimal revenue = paymentRepository.calculateRevenueByDateRange(start, end);

        // Then
        assertThat(revenue).isNotNull();
        assertThat(revenue.intValue()).isEqualTo(20000); // 10000 * 2
    }

    @Test
    @DisplayName("요금제별 결제 통계")
    void countByPlanType_Success() {
        // Given
        Payment payment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // When
        List<Object[]> result = paymentRepository.countByPlanType();

        // Then
        assertThat(result).isNotEmpty();
    }

    @Test
    @DisplayName("결제 상태로 결제 목록 조회")
    void findByPaymentStatus_Success() {
        // Given
        Payment successPayment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(successPayment);

        Payment pendingPayment = Payment.builder()
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.PENDING)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
        paymentRepository.save(pendingPayment);

        // When
        List<Payment> result = paymentRepository.findByPaymentStatus(Payment.PaymentStatus.SUCCESS);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Payment.PaymentStatus.SUCCESS);
    }
}
