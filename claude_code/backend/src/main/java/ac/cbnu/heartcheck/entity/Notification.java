package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Notification entity for Heart Doctor system
 * 사용자 알림 관리
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user", columnList = "user_id"),
    @Index(name = "idx_notification_type", columnList = "type"),
    @Index(name = "idx_notification_read", columnList = "is_read"),
    @Index(name = "idx_notification_sent_time", columnList = "sent_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "알림 타입은 필수입니다")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    @NotBlank(message = "알림 제목은 필수입니다")
    @Size(max = 100, message = "알림 제목은 100자를 초과할 수 없습니다")
    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @NotBlank(message = "알림 메시지는 필수입니다")
    @Size(max = 500, message = "알림 메시지는 500자를 초과할 수 없습니다")
    @Column(name = "message", length = 500, nullable = false)
    private String message;

    @Size(max = 200, message = "URL은 200자를 초과할 수 없습니다")
    @Column(name = "url", length = 200)
    private String url; // 클릭 시 이동할 URL

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false; // 읽음 여부

    @Column(name = "read_time")
    private LocalDateTime readTime; // 읽은 시간

    @CreationTimestamp
    @Column(name = "sent_time")
    private LocalDateTime sentTime; // 발송 시간

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime; // 예약 발송 시간

    @Builder.Default
    @Column(name = "priority", nullable = false)
    private Integer priority = 1; // 우선순위 (1: 낮음, 2: 보통, 3: 높음, 4: 긴급)

    /**
     * 알림 타입 ENUM
     */
    public enum NotificationType {
        SYSTEM("시스템", "시스템 관련 알림"),
        HEALTH("건강", "건강 검사 관련 알림"),
        PAYMENT("결제", "결제 관련 알림"),
        SUBSCRIPTION("구독", "구독 관련 알림"),
        PROMOTION("프로모션", "마케팅/프로모션 알림"),
        SECURITY("보안", "보안 관련 알림"),
        UPDATE("업데이트", "앱 업데이트 알림"),
        REMINDER("리마인더", "일정 및 리마인더 알림");

        private final String koreanName;
        private final String description;

        NotificationType(String koreanName, String description) {
            this.koreanName = koreanName;
            this.description = description;
        }

        public String getKoreanName() {
            return koreanName;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 우선순위 ENUM
     */
    public enum Priority {
        LOW(1, "낮음"),
        NORMAL(2, "보통"),
        HIGH(3, "높음"),
        URGENT(4, "긴급");

        private final int level;
        private final String description;

        Priority(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() {
            return level;
        }

        public String getDescription() {
            return description;
        }

        public static Priority fromLevel(int level) {
            for (Priority priority : values()) {
                if (priority.level == level) {
                    return priority;
                }
            }
            return NORMAL; // 기본값
        }
    }

    /**
     * 알림을 읽음으로 표시
     */
    public void markAsRead() {
        this.isRead = true;
        this.readTime = LocalDateTime.now();
    }

    /**
     * 알림을 미읽음으로 표시
     */
    public void markAsUnread() {
        this.isRead = false;
        this.readTime = null;
    }

    /**
     * 읽지 않은 알림인지 확인
     * @return 미읽음 여부
     */
    public boolean isUnread() {
        return !isRead;
    }

    /**
     * 긴급 알림인지 확인
     * @return 긴급 여부
     */
    public boolean isUrgent() {
        return priority >= Priority.URGENT.getLevel();
    }

    /**
     * 중요 알림인지 확인 (높음 이상)
     * @return 중요 여부
     */
    public boolean isImportant() {
        return priority >= Priority.HIGH.getLevel();
    }

    /**
     * 예약 알림인지 확인
     * @return 예약 여부
     */
    public boolean isScheduled() {
        return scheduledTime != null && scheduledTime.isAfter(LocalDateTime.now());
    }

    /**
     * 발송 가능한 알림인지 확인
     * @return 발송 가능 여부
     */
    public boolean canBeSent() {
        return scheduledTime == null || !scheduledTime.isAfter(LocalDateTime.now());
    }

    /**
     * 오래된 알림인지 확인 (7일 이상)
     * @return 오래된 알림 여부
     */
    public boolean isOld() {
        return sentTime != null && sentTime.isBefore(LocalDateTime.now().minusDays(7));
    }

    /**
     * 오늘 발송된 알림인지 확인
     * @return 오늘 발송 여부
     */
    public boolean isSentToday() {
        if (sentTime == null) {
            return false;
        }
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        return sentTime.isAfter(today);
    }

    /**
     * 마케팅 알림인지 확인
     * @return 마케팅 알림 여부
     */
    public boolean isMarketing() {
        return NotificationType.PROMOTION.equals(type);
    }

    /**
     * 시스템 알림인지 확인
     * @return 시스템 알림 여부
     */
    public boolean isSystem() {
        return NotificationType.SYSTEM.equals(type) ||
               NotificationType.SECURITY.equals(type) ||
               NotificationType.UPDATE.equals(type);
    }

    /**
     * 건강 관련 알림인지 확인
     * @return 건강 알림 여부
     */
    public boolean isHealth() {
        return NotificationType.HEALTH.equals(type) ||
               NotificationType.REMINDER.equals(type);
    }

    /**
     * 결제 관련 알림인지 확인
     * @return 결제 알림 여부
     */
    public boolean isFinancial() {
        return NotificationType.PAYMENT.equals(type) ||
               NotificationType.SUBSCRIPTION.equals(type);
    }

    /**
     * 우선순위 ENUM 반환
     * @return 우선순위 ENUM
     */
    public Priority getPriorityEnum() {
        return Priority.fromLevel(priority);
    }

    /**
     * 알림 타입 한글명 반환
     * @return 타입 한글명
     */
    public String getTypeKoreanName() {
        return type != null ? type.getKoreanName() : "";
    }

    /**
     * 우선순위 설정
     * @param priority 우선순위 ENUM
     */
    public void setPriority(Priority priority) {
        this.priority = priority.getLevel();
    }

    /**
     * 예약 발송 설정
     * @param scheduledTime 예약 시간
     */
    public void scheduleFor(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    /**
     * 예약 취소
     */
    public void cancelSchedule() {
        this.scheduledTime = null;
    }

    /**
     * URL 설정 (클릭 액션)
     * @param url 이동할 URL
     */
    public void setActionUrl(String url) {
        this.url = url;
    }

    /**
     * 클릭 가능한 알림인지 확인
     * @return 클릭 가능 여부
     */
    public boolean isClickable() {
        return url != null && !url.trim().isEmpty();
    }
}