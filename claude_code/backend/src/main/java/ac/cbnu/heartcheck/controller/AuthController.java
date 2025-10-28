package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.request.LoginRequest;
import ac.cbnu.heartcheck.dto.request.UserRegistrationRequest;
import ac.cbnu.heartcheck.dto.response.ApiResponse;
import ac.cbnu.heartcheck.dto.response.LoginResponse;
import ac.cbnu.heartcheck.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Login with phone and password")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register", description = "Create new user account")
    public ResponseEntity<ApiResponse<Long>> register(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            Long userId = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userId, "Registration successful"));
        } catch (IllegalArgumentException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Get new access token with refresh token")
    public ResponseEntity<LoginResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        try {
            if (refreshToken.startsWith("Bearer ")) {
                refreshToken = refreshToken.substring(7);
            }

            LoginResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "End current session")
    public ResponseEntity<ApiResponse<Void>> logout(Principal principal) {
        if (principal != null) {
            authService.logout(principal.getName());
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }

    @GetMapping("/check-phone/{phone}")
    @Operation(summary = "Check phone", description = "Check if phone number is already registered")
    public ResponseEntity<ApiResponse<Boolean>> checkPhone(@PathVariable String phone) {
        boolean exists = authService.existsByPhone(phone);
        String message = exists ? "Phone number already registered" : "Phone number available";
        return ResponseEntity.ok(ApiResponse.success(exists, message));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<String>> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponse.success(principal.getName(), "Authenticated"));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check authentication system status")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", "Authentication system is running"));
    }
}
