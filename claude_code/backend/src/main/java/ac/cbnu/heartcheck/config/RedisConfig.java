package ac.cbnu.heartcheck.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 설정 클래스
 * 계층화된 인가 시스템을 위한 캐시 설정
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Configuration
@Slf4j
public class RedisConfig {

    /**
     * Redis Template 설정
     * 사용량 추적 및 세션 관리를 위한 템플릿
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 키 직렬화 설정
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // 값 직렬화 설정 (JSON)
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());

        template.afterPropertiesSet();

        log.info("Redis Template configured for layered authorization system");
        return template;
    }
}