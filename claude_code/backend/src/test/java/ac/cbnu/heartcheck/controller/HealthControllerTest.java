package ac.cbnu.heartcheck.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for HealthController
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@WebMvcTest(controllers = HealthController.class,
    excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class
    })
@ActiveProfiles("test")
@DisplayName("Health Controller Tests")
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("헬스체크 API - 정상 응답")
    void healthCheck_ShouldReturnOkStatus() throws Exception {
        // when & then
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("heart-disease-api"))
                .andExpect(jsonPath("$.version").value("1.0.0"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("준비상태 체크 API - 정상 응답")
    void readinessCheck_ShouldReturnReadyStatus() throws Exception {
        // when & then
        mockMvc.perform(get("/api/health/ready"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.status").value("READY"))
                .andExpect(jsonPath("$.database").value("connected"))
                .andExpect(jsonPath("$.redis").value("connected"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("헬스체크 API - 인증 없이 접근 가능")
    void healthCheck_ShouldBeAccessibleWithoutAuthentication() throws Exception {
        // when & then
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("준비상태 체크 API - 인증 없이 접근 가능")
    void readinessCheck_ShouldBeAccessibleWithoutAuthentication() throws Exception {
        // when & then
        mockMvc.perform(get("/api/health/ready"))
                .andExpect(status().isOk());
    }
}