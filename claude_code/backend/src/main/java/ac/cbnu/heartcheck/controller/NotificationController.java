package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.response.ApiResponse;
import ac.cbnu.heartcheck.entity.Notification;
import ac.cbnu.heartcheck.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * NotificationController for Heart Doctor system
 * 알림 관리 REST API 엔드포인트
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 사용자 알림 목록 조회 (페이징)
     * GET /api/v1/notifications/user/{userId}
     *
     * @param userId 사용자 ID
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 20)
     * @return 알림 목록
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<Notification>>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("사용자 알림 목록 조회 요청: userId={}, page={}, size={}", userId, page, size);

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getUserNotifications(userId, pageable);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("알림 목록 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 목록 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 읽지 않은 알림 목록 조회
     * GET /api/v1/notifications/user/{userId}/unread
     *
     * @param userId 사용자 ID
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 읽지 않은 알림 목록
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<ApiResponse<Page<Notification>>> getUnreadNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("읽지 않은 알림 조회 요청: userId={}", userId);

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getUnreadNotifications(userId, pageable);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("읽지 않은 알림 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("읽지 않은 알림 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 읽지 않은 알림 개수 조회
     * GET /api/v1/notifications/user/{userId}/unread-count
     *
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 개수
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        log.info("읽지 않은 알림 개수 조회 요청: userId={}", userId);

        try {
            long count = notificationService.getUnreadNotificationCount(userId);
            Map<String, Long> result = new HashMap<>();
            result.put("count", count);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            log.error("읽지 않은 알림 개수 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 개수 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 특정 알림 조회
     * GET /api/v1/notifications/{notificationId}
     *
     * @param notificationId 알림 ID
     * @return 알림 상세 정보
     */
    @GetMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Notification>> getNotification(@PathVariable Long notificationId) {
        log.info("알림 조회 요청: notificationId={}", notificationId);

        try {
            Notification notification = notificationService.getNotificationById(notificationId);
            return ResponseEntity.ok(ApiResponse.success(notification));
        } catch (Exception e) {
            log.error("알림 조회 실패: notificationId={}", notificationId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("알림을 찾을 수 없습니다"));
        }
    }

    /**
     * 알림 타입별 조회
     * GET /api/v1/notifications/user/{userId}/type/{type}
     *
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 타입별 알림 목록
     */
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable Notification.NotificationType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("타입별 알림 조회 요청: userId={}, type={}", userId, type);

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getNotificationsByType(userId, type, pageable);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("타입별 알림 조회 실패: userId={}, type={}", userId, type, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 긴급 알림 조회
     * GET /api/v1/notifications/user/{userId}/urgent
     *
     * @param userId 사용자 ID
     * @return 긴급 알림 목록
     */
    @GetMapping("/user/{userId}/urgent")
    public ResponseEntity<ApiResponse<List<Notification>>> getUrgentNotifications(@PathVariable Long userId) {
        log.info("긴급 알림 조회 요청: userId={}", userId);

        try {
            List<Notification> notifications = notificationService.getUrgentNotifications(userId);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("긴급 알림 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("긴급 알림 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 특정 기간의 알림 조회
     * GET /api/v1/notifications/user/{userId}/period
     *
     * @param userId 사용자 ID
     * @param startTime 시작 시간
     * @param endTime 종료 시간
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 기간별 알림 목록
     */
    @GetMapping("/user/{userId}/period")
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotificationsByPeriod(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("기간별 알림 조회 요청: userId={}, start={}, end={}", userId, startTime, endTime);

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getNotificationsByPeriod(
                    userId, startTime, endTime, pageable);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("기간별 알림 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 알림 생성
     * POST /api/v1/notifications
     *
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @param title 제목
     * @param message 메시지
     * @return 생성된 알림
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(
            @RequestParam Long userId,
            @RequestParam Notification.NotificationType type,
            @RequestParam String title,
            @RequestParam String message) {
        log.info("알림 생성 요청: userId={}, type={}, title={}", userId, type, title);

        try {
            Notification notification = notificationService.createNotification(userId, type, title, message);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(notification));
        } catch (Exception e) {
            log.error("알림 생성 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 생성 실패: " + e.getMessage()));
        }
    }

    /**
     * 알림 읽음 처리
     * PUT /api/v1/notifications/{notificationId}/read
     *
     * @param notificationId 알림 ID
     * @return 업데이트된 알림
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long notificationId) {
        log.info("알림 읽음 처리 요청: notificationId={}", notificationId);

        try {
            Notification notification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(ApiResponse.success(notification));
        } catch (Exception e) {
            log.error("알림 읽음 처리 실패: notificationId={}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 알림 미읽음 처리
     * PUT /api/v1/notifications/{notificationId}/unread
     *
     * @param notificationId 알림 ID
     * @return 업데이트된 알림
     */
    @PutMapping("/{notificationId}/unread")
    public ResponseEntity<ApiResponse<Notification>> markAsUnread(@PathVariable Long notificationId) {
        log.info("알림 미읽음 처리 요청: notificationId={}", notificationId);

        try {
            Notification notification = notificationService.markAsUnread(notificationId);
            return ResponseEntity.ok(ApiResponse.success(notification));
        } catch (Exception e) {
            log.error("알림 미읽음 처리 실패: notificationId={}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 모든 알림 읽음 처리
     * PUT /api/v1/notifications/user/{userId}/read-all
     *
     * @param userId 사용자 ID
     * @return 성공 메시지
     */
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(@PathVariable Long userId) {
        log.info("모든 알림 읽음 처리 요청: userId={}", userId);

        try {
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(ApiResponse.success("모든 알림이 읽음 처리되었습니다"));
        } catch (Exception e) {
            log.error("모든 알림 읽음 처리 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 특정 타입의 알림 모두 읽음 처리
     * PUT /api/v1/notifications/user/{userId}/type/{type}/read-all
     *
     * @param userId 사용자 ID
     * @param type 알림 타입
     * @return 성공 메시지
     */
    @PutMapping("/user/{userId}/type/{type}/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsReadByType(
            @PathVariable Long userId,
            @PathVariable Notification.NotificationType type) {
        log.info("타입별 알림 읽음 처리 요청: userId={}, type={}", userId, type);

        try {
            notificationService.markAllAsReadByType(userId, type);
            return ResponseEntity.ok(ApiResponse.success("선택한 타입의 알림이 모두 읽음 처리되었습니다"));
        } catch (Exception e) {
            log.error("타입별 알림 읽음 처리 실패: userId={}, type={}", userId, type, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 처리 실패: " + e.getMessage()));
        }
    }

    /**
     * 알림 삭제
     * DELETE /api/v1/notifications/{notificationId}
     *
     * @param notificationId 알림 ID
     * @return 성공 메시지
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long notificationId) {
        log.info("알림 삭제 요청: notificationId={}", notificationId);

        try {
            notificationService.deleteNotification(notificationId);
            return ResponseEntity.ok(ApiResponse.success("알림이 삭제되었습니다"));
        } catch (Exception e) {
            log.error("알림 삭제 실패: notificationId={}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 삭제 실패: " + e.getMessage()));
        }
    }

    /**
     * 오래된 읽은 알림 삭제
     * DELETE /api/v1/notifications/user/{userId}/old
     *
     * @param userId 사용자 ID
     * @return 성공 메시지
     */
    @DeleteMapping("/user/{userId}/old")
    public ResponseEntity<ApiResponse<String>> deleteOldReadNotifications(@PathVariable Long userId) {
        log.info("오래된 읽은 알림 삭제 요청: userId={}", userId);

        try {
            notificationService.deleteOldReadNotifications(userId);
            return ResponseEntity.ok(ApiResponse.success("오래된 읽은 알림이 삭제되었습니다"));
        } catch (Exception e) {
            log.error("오래된 알림 삭제 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("알림 삭제 실패: " + e.getMessage()));
        }
    }

    /**
     * 알림 타입별 통계 조회
     * GET /api/v1/notifications/user/{userId}/stats
     *
     * @param userId 사용자 ID
     * @return 타입별 알림 통계
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<ApiResponse<List<Object[]>>> getNotificationStats(@PathVariable Long userId) {
        log.info("알림 통계 조회 요청: userId={}", userId);

        try {
            List<Object[]> stats = notificationService.getNotificationStatsByType(userId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("알림 통계 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("통계 조회 실패: " + e.getMessage()));
        }
    }
}
