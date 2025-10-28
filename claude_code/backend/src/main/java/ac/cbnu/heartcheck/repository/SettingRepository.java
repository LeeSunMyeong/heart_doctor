package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Setting;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Setting Repository
 * 사용자 설정 데이터 접근 레이어
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {

    /**
     * 사용자 ID로 설정 조회
     * @param userId 사용자 ID
     * @return 사용자 설정
     */
    Optional<Setting> findByUserId(Long userId);

    /**
     * 사용자로 설정 조회
     * @param user 사용자
     * @return 사용자 설정
     */
    Optional<Setting> findByUser(User user);

    /**
     * 사용자 설정 존재 여부 확인
     * @param userId 사용자 ID
     * @return 존재 여부
     */
    boolean existsByUserId(Long userId);

    /**
     * 푸시 알림 활성화된 사용자 설정 목록 조회
     * @return 푸시 알림 활성화 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.pushNotification = true")
    List<Setting> findByPushNotificationEnabled();

    /**
     * 이메일 알림 활성화된 사용자 설정 목록 조회
     * @return 이메일 알림 활성화 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.emailNotification = true")
    List<Setting> findByEmailNotificationEnabled();

    /**
     * 마케팅 수신 동의한 사용자 설정 목록 조회
     * @return 마케팅 수신 동의 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.marketingNotification = true")
    List<Setting> findByMarketingEnabled();

    /**
     * 다크모드 사용자 설정 목록 조회
     * @return 다크모드 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.darkMode = true")
    List<Setting> findByDarkModeEnabled();

    /**
     * 특정 언어 사용자 설정 목록 조회
     * @param language 언어
     * @return 특정 언어 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.language = :language")
    List<Setting> findByLanguage(@Param("language") Setting.Language language);

    /**
     * 생체인증 활성화된 사용자 설정 목록 조회
     * @return 생체인증 활성화 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.biometricAuth = true")
    List<Setting> findByBiometricAuthEnabled();

    /**
     * 특정 개인정보 보호 수준 사용자 설정 목록 조회
     * @param privacyLevel 개인정보 보호 수준
     * @return 특정 보호 수준 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.privacyLevel = :privacyLevel")
    List<Setting> findByPrivacyLevel(@Param("privacyLevel") Setting.PrivacyLevel privacyLevel);

    /**
     * 자동 백업 활성화된 사용자 설정 목록 조회
     * @return 자동 백업 활성화 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.autoBackup = true")
    List<Setting> findByAutoBackupEnabled();

    /**
     * 데이터 절약 모드 사용자 설정 목록 조회
     * @return 데이터 절약 모드 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.dataSaveMode = true")
    List<Setting> findByDataSaveModeEnabled();

    /**
     * 세션 타임아웃이 특정 값 이하인 사용자 설정 조회
     * @param timeout 타임아웃 분
     * @return 타임아웃 이하 설정 목록
     */
    @Query("SELECT s FROM Setting s WHERE s.sessionTimeout <= :timeout")
    List<Setting> findBySessionTimeoutLessThanOrEqual(@Param("timeout") Integer timeout);

    /**
     * 사용자 설정 삭제
     * @param userId 사용자 ID
     */
    void deleteByUserId(Long userId);
}
