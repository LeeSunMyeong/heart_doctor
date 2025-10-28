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
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by phone number
     */
    Optional<User> findByPhoneNumber(String phoneNumber);

    /**
     * Find user by phone (for authentication)
     */
    Optional<User> findByPhone(String phone);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if phone number exists
     */
    boolean existsByPhoneNumber(String phoneNumber);

    /**
     * Find enabled users by email
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.enabled = true")
    Optional<User> findByEmailAndEnabled(@Param("email") String email);

    /**
     * Count total active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.enabled = true")
    long countActiveUsers();

    /**
     * Find user by name and phone number for email finding
     */
    Optional<User> findByNameAndPhoneNumber(String name, String phoneNumber);

    /**
     * Check if name and phone number combination exists
     */
    boolean existsByNameAndPhoneNumber(String name, String phoneNumber);
}