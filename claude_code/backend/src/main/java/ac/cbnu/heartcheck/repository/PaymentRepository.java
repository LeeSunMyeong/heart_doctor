package ac.cbnu.heartcheck.repository;

import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Payment entity
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payments by user
     */
    Page<Payment> findByUser(User user, Pageable pageable);

    /**
     * Find payment by transaction ID
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * Find payments by payment status
     */
    List<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus);

    /**
     * Find successful payments by user
     */
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.paymentStatus = 'COMPLETED' ORDER BY p.createdAt DESC")
    List<Payment> findSuccessfulPaymentsByUser(@Param("user") User user);

    /**
     * Calculate total revenue within date range
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenueByDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    /**
     * Count payments by plan type
     */
    @Query("SELECT p.planType, COUNT(p) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' GROUP BY p.planType")
    List<Object[]> countByPlanType();

    /**
     * Find latest successful payment by user
     */
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.paymentStatus = 'COMPLETED' ORDER BY p.createdAt DESC")
    List<Payment> findLatestSuccessfulPaymentByUser(@Param("user") User user, Pageable pageable);
}