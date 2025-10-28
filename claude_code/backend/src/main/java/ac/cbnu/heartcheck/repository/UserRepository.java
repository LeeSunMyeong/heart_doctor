package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by phone (for authentication)
     */
    Optional<User> findByPhone(String phone);

    /**
     * Check if phone exists
     */
    boolean existsByPhone(String phone);

    /**
     * Find active users by phone
     */
    @Query("SELECT u FROM User u WHERE u.phone = :phone AND u.isActive = true")
    Optional<User> findByPhoneAndActive(@Param("phone") String phone);

    /**
     * Count total active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    /**
     * Find user by userName and phone for verification
     */
    Optional<User> findByUserNameAndPhone(String userName, String phone);

    /**
     * Check if userName and phone combination exists
     */
    boolean existsByUserNameAndPhone(String userName, String phone);

    /**
     * Find user by provider and providerUid (SNS login)
     */
    Optional<User> findByProviderAndProviderUid(String provider, String providerUid);

    /**
     * Check if SNS user exists
     */
    boolean existsByProviderAndProviderUid(String provider, String providerUid);
}