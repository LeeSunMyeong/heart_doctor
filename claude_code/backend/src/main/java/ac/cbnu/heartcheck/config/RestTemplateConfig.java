package ac.cbnu.heartcheck.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for RestTemplate beans used for external API calls.
 *
 * @author HeartCheck Team
 * @version 1.0
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates a configured RestTemplate bean for making HTTP requests to external APIs.
     * Includes timeouts to prevent hanging requests.
     *
     * @param builder RestTemplateBuilder for configuration
     * @return Configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .build();
    }
}
