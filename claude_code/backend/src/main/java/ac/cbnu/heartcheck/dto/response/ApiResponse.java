package ac.cbnu.heartcheck.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 통합 API 응답 DTO
 * 모든 API 응답의 표준 형식을 제공
 *
 * @param <T> 응답 데이터의 타입
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Getter
@Builder
public class ApiResponse<T> {

    /**
     * 응답 성공 여부
     */
    private boolean success;

    /**
     * 응답 메시지
     */
    private String message;

    /**
     * 응답 데이터
     */
    private T data;

    /**
     * 응답 시간
     */
    private LocalDateTime timestamp;

    /**
     * 요청 ID (추적용)
     */
    private String requestId;

    /**
     * 에러 정보 (실패 시)
     */
    private ErrorInfo error;

    /**
     * 성공 응답 생성
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .message(message)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 성공 응답 생성 (메시지 없음)
     */
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "요청이 성공적으로 처리되었습니다");
    }

    /**
     * 실패 응답 생성
     */
    public static <T> ApiResponse<T> failure(String message, ErrorInfo error) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .error(error)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 실패 응답 생성 (간단한 메시지)
     */
    public static <T> ApiResponse<T> failure(String message) {
        return failure(message, null);
    }

    /**
     * 에러 응답 생성 (failure의 별칭)
     */
    public static <T> ApiResponse<T> error(String message) {
        return failure(message);
    }

    /**
     * 에러 응답 생성 (에러 정보 포함)
     */
    public static <T> ApiResponse<T> error(String message, ErrorInfo error) {
        return failure(message, error);
    }

    /**
     * 에러 정보 클래스
     */
    @Getter
    @Builder
    public static class ErrorInfo {
        private String code;
        private String description;
        private String field;
    }
}