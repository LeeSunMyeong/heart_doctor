package ac.cbnu.heartcheck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

/**
 * CBNU Heart Disease Check System - Main Application
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 3600)
public class HeartDiseaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(HeartDiseaseApplication.class, args);
    }
}
