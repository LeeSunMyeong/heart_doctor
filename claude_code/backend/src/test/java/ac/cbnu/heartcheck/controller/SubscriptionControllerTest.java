package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.service.SubscriptionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * SubscriptionController 테스트
 */
@WebMvcTest(SubscriptionController.class)
@DisplayName("SubscriptionController 테스트")
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubscriptionService subscriptionService;

    private User testUser;
    private CostModel testCostModel;
    private Subscription testSubscription;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();

        testCostModel = CostModel.builder()
                .costId((short) 1)
                .type(CostModel.CostType.MONTHLY)
                .cost(10000)
                .build();

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
    @DisplayName("사용자 구독 목록 조회")
    @WithMockUser
    void getUserSubscriptions_Success() throws Exception {
        // Given
        List<Subscription> subscriptions = Arrays.asList(testSubscription);
        when(subscriptionService.getUserSubscriptions(1L)).thenReturn(subscriptions);

        // When & Then
        mockMvc.perform(get("/api/v1/subscriptions/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].id").value(1));

        verify(subscriptionService, times(1)).getUserSubscriptions(1L);
    }

    @Test
    @DisplayName("활성 구독 조회")
    @WithMockUser
    void getActiveSubscription_Success() throws Exception {
        // Given
        when(subscriptionService.getActiveSubscription(1L)).thenReturn(testSubscription);

        // When & Then
        mockMvc.perform(get("/api/v1/subscriptions/user/1/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        verify(subscriptionService, times(1)).getActiveSubscription(1L);
    }

    @Test
    @DisplayName("구독 생성")
    @WithMockUser
    void createSubscription_Success() throws Exception {
        // Given
        when(subscriptionService.createSubscription(anyLong(), anyShort()))
                .thenReturn(testSubscription);

        // When & Then
        mockMvc.perform(post("/api/v1/subscriptions")
                        .with(csrf())
                        .param("userId", "1")
                        .param("costModelId", "1")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(subscriptionService, times(1)).createSubscription(1L, (short) 1);
    }

    @Test
    @DisplayName("구독 취소")
    @WithMockUser
    void cancelSubscription_Success() throws Exception {
        // Given
        testSubscription.cancel();
        when(subscriptionService.cancelSubscription(1L)).thenReturn(testSubscription);

        // When & Then
        mockMvc.perform(put("/api/v1/subscriptions/1/cancel")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CANCELED"));

        verify(subscriptionService, times(1)).cancelSubscription(1L);
    }

    @Test
    @DisplayName("구독 ID로 조회")
    @WithMockUser
    void getSubscriptionById_Success() throws Exception {
        // Given
        when(subscriptionService.getSubscriptionById(1L)).thenReturn(testSubscription);

        // When & Then
        mockMvc.perform(get("/api/v1/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(subscriptionService, times(1)).getSubscriptionById(1L);
    }
}
