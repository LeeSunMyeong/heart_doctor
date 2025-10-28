package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PaymentController 테스트
 */
@WebMvcTest(PaymentController.class)
@DisplayName("PaymentController 테스트")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    private User testUser;
    private CostModel testCostModel;
    private Payment testPayment;

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

        testPayment = Payment.builder()
                .id(1L)
                .user(testUser)
                .costModel(testCostModel)
                .status(Payment.PaymentStatus.SUCCESS)
                .storeInfo("G")
                .transactionId("TXN123")
                .payTime(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("결제 생성")
    @WithMockUser
    void createPayment_Success() throws Exception {
        // Given
        when(paymentService.createPayment(anyLong(), anyShort(), anyString()))
                .thenReturn(testPayment);

        // When & Then
        mockMvc.perform(post("/api/v1/payments")
                        .with(csrf())
                        .param("userId", "1")
                        .param("costModelId", "1")
                        .param("storeInfo", "G")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(paymentService, times(1)).createPayment(1L, (short) 1, "G");
    }

    @Test
    @DisplayName("결제 완료 처리")
    @WithMockUser
    void completePayment_Success() throws Exception {
        // Given
        when(paymentService.completePayment(anyLong(), anyString()))
                .thenReturn(testPayment);

        // When & Then
        mockMvc.perform(put("/api/v1/payments/1/complete")
                        .with(csrf())
                        .param("transactionId", "TXN123")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        verify(paymentService, times(1)).completePayment(1L, "TXN123");
    }

    @Test
    @DisplayName("결제 ID로 조회")
    @WithMockUser
    void getPaymentById_Success() throws Exception {
        // Given
        when(paymentService.getPaymentById(1L)).thenReturn(testPayment);

        // When & Then
        mockMvc.perform(get("/api/v1/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.transactionId").value("TXN123"));

        verify(paymentService, times(1)).getPaymentById(1L);
    }

    @Test
    @DisplayName("트랜잭션 ID로 조회")
    @WithMockUser
    void getPaymentByTransactionId_Success() throws Exception {
        // Given
        when(paymentService.getPaymentByTransactionId("TXN123")).thenReturn(testPayment);

        // When & Then
        mockMvc.perform(get("/api/v1/payments/transaction/TXN123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.transactionId").value("TXN123"));

        verify(paymentService, times(1)).getPaymentByTransactionId("TXN123");
    }

    @Test
    @DisplayName("사용자 결제 이력 조회")
    @WithMockUser
    void getUserPaymentHistory_Success() throws Exception {
        // Given
        Page<Payment> paymentPage = new PageImpl<>(Arrays.asList(testPayment));
        when(paymentService.getUserPaymentHistory(eq(1L), any(PageRequest.class)))
                .thenReturn(paymentPage);

        // When & Then
        mockMvc.perform(get("/api/v1/payments/history/1")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());

        verify(paymentService, times(1)).getUserPaymentHistory(eq(1L), any(PageRequest.class));
    }

    @Test
    @DisplayName("환불 처리")
    @WithMockUser(roles = "ADMIN")
    void refundPayment_Success() throws Exception {
        // Given
        testPayment.markAsRefunded();
        when(paymentService.refundPayment(1L)).thenReturn(testPayment);

        // When & Then
        mockMvc.perform(post("/api/v1/payments/1/refund")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("REFUNDED"));

        verify(paymentService, times(1)).refundPayment(1L);
    }
}
