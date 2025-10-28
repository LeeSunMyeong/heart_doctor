package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import ac.cbnu.heartcheck.repository.SubscriptionRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
 * SubscriptionService 유닛 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SubscriptionService 유닛 테스트")
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private CostModelRepository costModelRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User testUser;
    private CostModel testCostModel;
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
    }

    @Test
    @DisplayName("구독 생성 성공")
    void createSubscription_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(testCostModel));
        when(subscriptionRepository.findByUserIdAndStatus(anyLong(), any()))
                .thenReturn(Optional.empty());
        when(subscriptionRepository.save(any(Subscription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Subscription result = subscriptionService.createSubscription(1L, (short) 1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(testUser);
        assertThat(result.getCostModel()).isEqualTo(testCostModel);
        assertThat(result.getStatus()).isEqualTo(Subscription.SubscriptionStatus.PENDING);
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }

    @Test
    @DisplayName("구독 생성 실패 - 사용자 없음")
    void createSubscription_UserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> subscriptionService.createSubscription(1L, (short) 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("구독 생성 실패 - 요금제 없음")
    void createSubscription_CostModelNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> subscriptionService.createSubscription(1L, (short) 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("요금제를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("구독 생성 실패 - 이미 활성 구독 존재")
    void createSubscription_AlreadyExists() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(costModelRepository.findById((short) 1)).thenReturn(Optional.of(testCostModel));
        when(subscriptionRepository.findByUserIdAndStatus(1L, Subscription.SubscriptionStatus.ACTIVE))
                .thenReturn(Optional.of(testSubscription));

        // When & Then
        assertThatThrownBy(() -> subscriptionService.createSubscription(1L, (short) 1))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 활성 구독이 존재합니다");
    }

    @Test
    @DisplayName("구독 활성화 성공")
    void activateSubscription_Success() {
        // Given
        Subscription pendingSubscription = Subscription.builder()
                .id(1L)
                .user(testUser)
                .costModel(testCostModel)
                .fromDate(LocalDateTime.now())
                .toDate(LocalDateTime.now().plusDays(30))
                .status(Subscription.SubscriptionStatus.PENDING)
                .build();

        when(subscriptionRepository.findById(1L)).thenReturn(Optional.of(pendingSubscription));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(pendingSubscription);

        // When
        Subscription result = subscriptionService.activateSubscription(1L);

        // Then
        assertThat(result.getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }

    @Test
    @DisplayName("구독 취소 성공")
    void cancelSubscription_Success() {
        // Given
        when(subscriptionRepository.findById(1L)).thenReturn(Optional.of(testSubscription));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(testSubscription);

        // When
        Subscription result = subscriptionService.cancelSubscription(1L);

        // Then
        assertThat(result.isCanceled()).isTrue();
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }

    @Test
    @DisplayName("구독 취소 실패 - 이미 취소됨")
    void cancelSubscription_AlreadyCanceled() {
        // Given
        testSubscription.cancel();
        when(subscriptionRepository.findById(1L)).thenReturn(Optional.of(testSubscription));

        // When & Then
        assertThatThrownBy(() -> subscriptionService.cancelSubscription(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 취소된 구독입니다");
    }

    @Test
    @DisplayName("사용자 구독 목록 조회")
    void getUserSubscriptions_Success() {
        // Given
        List<Subscription> subscriptions = Arrays.asList(testSubscription);
        when(subscriptionRepository.findByUserId(1L)).thenReturn(subscriptions);

        // When
        List<Subscription> result = subscriptionService.getUserSubscriptions(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(testSubscription);
    }

    @Test
    @DisplayName("활성 구독 조회")
    void getActiveSubscription_Success() {
        // Given
        when(subscriptionRepository.findByUserIdAndStatus(1L, Subscription.SubscriptionStatus.ACTIVE))
                .thenReturn(Optional.of(testSubscription));

        // When
        Subscription result = subscriptionService.getActiveSubscription(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(Subscription.SubscriptionStatus.ACTIVE);
    }

    @Test
    @DisplayName("유효한 구독 조회")
    void getValidSubscription_Success() {
        // Given
        when(subscriptionRepository.findValidSubscriptionByUserId(eq(1L), any(LocalDateTime.class)))
                .thenReturn(Optional.of(testSubscription));

        // When
        Subscription result = subscriptionService.getValidSubscription(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isActive()).isTrue();
    }

    @Test
    @DisplayName("활성 구독 확인")
    void hasActiveSubscription_True() {
        // Given
        when(subscriptionRepository.hasActiveSubscription(eq(1L), any(LocalDateTime.class)))
                .thenReturn(true);

        // When
        boolean result = subscriptionService.hasActiveSubscription(1L);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("구독 연장 성공")
    void extendSubscription_Success() {
        // Given
        when(subscriptionRepository.findById(1L)).thenReturn(Optional.of(testSubscription));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(testSubscription);

        LocalDateTime originalEndDate = testSubscription.getToDate();

        // When
        Subscription result = subscriptionService.extendSubscription(1L, 30);

        // Then
        assertThat(result.getToDate()).isAfter(originalEndDate);
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }

    @Test
    @DisplayName("만료된 구독 처리")
    void processExpiredSubscriptions_Success() {
        // Given
        List<Subscription> expiredSubscriptions = Arrays.asList(testSubscription);
        when(subscriptionRepository.findExpiredSubscriptions(any(LocalDateTime.class)))
                .thenReturn(expiredSubscriptions);
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(testSubscription);

        // When
        subscriptionService.processExpiredSubscriptions();

        // Then
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
    }
}
