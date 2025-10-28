package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.entity.Payment.PaymentStatus;
import ac.cbnu.heartcheck.entity.Payment.StoreType;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import ac.cbnu.heartcheck.repository.PaymentRepository;
import ac.cbnu.heartcheck.repository.SubscriptionRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * PaymentService 유닛 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService 유닛 테스트")
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CostModelRepository costModelRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private PaymentService paymentService;

    private User testUser;
    private CostModel testCostModel;
    private Payment testPayment;
    private Subscription testSubscription;

    @BeforeEach
    void setUp() {
        // 테스트 사용자 생성
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("encoded_password")
                .userDob("19900101")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // 테스트 요금제 생성
        testCostModel = CostModel.builder()
                .costId((short) 1)
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();

        // 테스트 구독 생성
        testSubscription = Subscription.builder()
                .id(1L)
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .build();

        // 테스트 결제 생성
        testPayment = Payment.builder()
                .id(1L)
                .user(testUser)
                .costModel(testCostModel)
                .status(PaymentStatus.PENDING)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("결제 생성 성공")
    void createPayment_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(testCostModel));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // When
        Payment result = paymentService.createPayment(1L, (short) 1, "G");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(testUser);
        assertThat(result.getCostModel()).isEqualTo(testCostModel);
        assertThat(result.getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(result.getStoreInfo()).isEqualTo("G");
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("결제 생성 실패 - 사용자 없음")
    void createPayment_UserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> paymentService.createPayment(1L, (short) 1, "G"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("결제 생성 실패 - 요금제 없음")
    void createPayment_CostModelNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> paymentService.createPayment(1L, (short) 1, "G"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("결제 생성 실패 - 유효하지 않은 스토어 정보")
    void createPayment_InvalidStoreInfo() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(testCostModel));

        // When & Then
        assertThatThrownBy(() -> paymentService.createPayment(1L, (short) 1, "X"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("유효하지 않은 스토어 정보입니다");
    }

    @Test
    @DisplayName("결제 완료 성공 - 구독 생성됨")
    void completePayment_Success_WithSubscription() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.findByTransactionId("TXN123")).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(subscriptionService.createSubscription(1L, (short) 1)).thenReturn(testSubscription);
        when(subscriptionService.activateSubscription(1L)).thenReturn(testSubscription);

        // When
        Payment result = paymentService.completePayment(1L, "TXN123");

        // Then
        assertThat(result).isNotNull();
        verify(subscriptionService, times(1)).createSubscription(1L, (short) 1);
        verify(subscriptionService, times(1)).activateSubscription(1L);
        verify(paymentRepository, times(2)).save(any(Payment.class)); // 두 번 호출됨 (완료 처리 + 구독 연결)
    }

    @Test
    @DisplayName("결제 완료 실패 - 이미 완료된 결제")
    void completePayment_AlreadyCompleted() {
        // Given
        testPayment.markAsSuccess("OLD_TXN");
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.completePayment(1L, "TXN123"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 완료된 결제입니다");
    }

    @Test
    @DisplayName("결제 완료 실패 - 취소된 결제")
    void completePayment_CanceledPayment() {
        // Given
        testPayment.markAsCanceled();
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.completePayment(1L, "TXN123"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("취소 또는 환불된 결제는 완료할 수 없습니다");
    }

    @Test
    @DisplayName("결제 완료 실패 - 중복된 트랜잭션 ID")
    void completePayment_DuplicateTransactionId() {
        // Given
        Payment existingPayment = Payment.builder()
                .id(2L)
                .user(testUser)
                .costModel(testCostModel)
                .status(PaymentStatus.SUCCESS)
                .storeInfo("G")
                .payTime(LocalDateTime.now())
                .transactionId("TXN123")
                .build();

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.findByTransactionId("TXN123")).thenReturn(Optional.of(existingPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.completePayment(1L, "TXN123"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 사용된 트랜잭션 ID입니다");
    }

    @Test
    @DisplayName("결제 실패 처리 성공")
    void failPayment_Success() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // When
        Payment result = paymentService.failPayment(1L);

        // Then
        assertThat(result).isNotNull();
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("결제 실패 처리 실패 - 이미 성공한 결제")
    void failPayment_AlreadySuccess() {
        // Given
        testPayment.markAsSuccess("TXN123");
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.failPayment(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("완료된 결제는 실패 처리할 수 없습니다");
    }

    @Test
    @DisplayName("결제 취소 성공")
    void cancelPayment_Success() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // When
        Payment result = paymentService.cancelPayment(1L);

        // Then
        assertThat(result).isNotNull();
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("결제 취소 실패 - 이미 취소된 결제")
    void cancelPayment_AlreadyCanceled() {
        // Given
        testPayment.markAsCanceled();
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.cancelPayment(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 취소된 결제입니다");
    }

    @Test
    @DisplayName("결제 취소 실패 - 환불된 결제")
    void cancelPayment_RefundedPayment() {
        // Given
        testPayment.markAsSuccess("TXN123");
        testPayment.markAsRefunded();
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.cancelPayment(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("환불된 결제는 취소할 수 없습니다");
    }

    @Test
    @DisplayName("환불 처리 성공 - 구독 취소됨")
    void refundPayment_Success_WithSubscriptionCancel() {
        // Given
        testPayment.markAsSuccess("TXN123");
        testPayment.setSubscription(testSubscription);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(subscriptionService.cancelSubscription(1L)).thenReturn(testSubscription);

        // When
        Payment result = paymentService.refundPayment(1L);

        // Then
        assertThat(result).isNotNull();
        verify(subscriptionService, times(1)).cancelSubscription(1L);
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("환불 처리 실패 - 성공하지 않은 결제")
    void refundPayment_NotSuccessfulPayment() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        assertThatThrownBy(() -> paymentService.refundPayment(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("성공한 결제만 환불할 수 있습니다");
    }

    @Test
    @DisplayName("환불 처리 실패 - 이미 환불된 결제")
    void refundPayment_AlreadyRefunded() {
        // Given
        testPayment.markAsSuccess("TXN123");
        testPayment.markAsRefunded();
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When & Then
        // Note: 환불된 결제는 SUCCESS 상태가 아니므로 "성공한 결제만 환불할 수 있습니다" 메시지가 발생
        assertThatThrownBy(() -> paymentService.refundPayment(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("성공한 결제만 환불할 수 있습니다");
    }

    @Test
    @DisplayName("결제 ID로 조회")
    void getPaymentById_Success() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // When
        Payment result = paymentService.getPaymentById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("결제 ID로 조회 실패 - 없는 결제")
    void getPaymentById_NotFound() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> paymentService.getPaymentById(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("결제를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("트랜잭션 ID로 조회")
    void getPaymentByTransactionId_Success() {
        // Given
        testPayment.markAsSuccess("TXN123");
        when(paymentRepository.findByTransactionId("TXN123")).thenReturn(Optional.of(testPayment));

        // When
        Payment result = paymentService.getPaymentByTransactionId("TXN123");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTransactionId()).isEqualTo("TXN123");
    }

    @Test
    @DisplayName("사용자 결제 이력 조회")
    void getUserPaymentHistory_Success() {
        // Given
        List<Payment> payments = Arrays.asList(testPayment);
        Page<Payment> paymentPage = new PageImpl<>(payments);
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.findByUser(testUser, pageable)).thenReturn(paymentPage);

        // When
        Page<Payment> result = paymentService.getUserPaymentHistory(1L, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0)).isEqualTo(testPayment);
    }

    @Test
    @DisplayName("사용자 성공 결제 목록 조회")
    void getUserSuccessfulPayments_Success() {
        // Given
        testPayment.markAsSuccess("TXN123");
        List<Payment> payments = Arrays.asList(testPayment);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.findSuccessfulPaymentsByUser(testUser)).thenReturn(payments);

        // When
        List<Payment> result = paymentService.getUserSuccessfulPayments(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).isSuccess()).isTrue();
    }

    @Test
    @DisplayName("사용자 최근 결제 조회")
    void getUserLatestPayment_Success() {
        // Given
        testPayment.markAsSuccess("TXN123");
        List<Payment> payments = Arrays.asList(testPayment);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.findLatestSuccessfulPaymentByUser(eq(testUser), any(Pageable.class)))
                .thenReturn(payments);

        // When
        Payment result = paymentService.getUserLatestPayment(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(testPayment);
    }

    @Test
    @DisplayName("사용자 최근 결제 없음")
    void getUserLatestPayment_NoPayments() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.findLatestSuccessfulPaymentByUser(eq(testUser), any(Pageable.class)))
                .thenReturn(Arrays.asList());

        // When
        Payment result = paymentService.getUserLatestPayment(1L);

        // Then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("매출 계산 성공")
    void calculateRevenue_Success() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();
        BigDecimal revenue = new BigDecimal("100000");

        when(paymentRepository.calculateRevenueByDateRange(startDate, endDate))
                .thenReturn(revenue);

        // When
        BigDecimal result = paymentService.calculateRevenue(startDate, endDate);

        // Then
        assertThat(result).isEqualTo(revenue);
    }

    @Test
    @DisplayName("매출 계산 - 결과 없음")
    void calculateRevenue_NoResults() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();

        when(paymentRepository.calculateRevenueByDateRange(startDate, endDate))
                .thenReturn(null);

        // When
        BigDecimal result = paymentService.calculateRevenue(startDate, endDate);

        // Then
        assertThat(result).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("요금제별 결제 통계 조회")
    void getPaymentStatsByPlan_Success() {
        // Given
        List<Object[]> stats = Arrays.asList(
                new Object[]{"MONTHLY", 10L},
                new Object[]{"YEARLY", 5L}
        );

        when(paymentRepository.countByPlanType()).thenReturn(stats);

        // When
        List<Object[]> result = paymentService.getPaymentStatsByPlan();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).isEqualTo(stats);
    }
}
