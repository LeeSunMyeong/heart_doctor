package ac.cbnu.heartcheck.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256 encryption utility for medical data protection
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Component
@Slf4j
public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private static final int KEY_LENGTH = 256;

    private final SecretKey secretKey;

    public EncryptionUtil() {
        this.secretKey = generateSecretKey();
    }

    private SecretKey generateSecretKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(KEY_LENGTH, new SecureRandom());
            return keyGenerator.generateKey();
        } catch (Exception e) {
            log.error("Error generating secret key: {}", e.getMessage());
            throw new RuntimeException("Failed to generate encryption key", e);
        }
    }

    public String encrypt(String plainText) {
        try {
            if (plainText == null || plainText.isEmpty()) {
                return plainText;
            }

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.error("Error encrypting data: {}", e.getMessage());
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decrypt(String encryptedText) {
        try {
            if (encryptedText == null || encryptedText.isEmpty()) {
                return encryptedText;
            }

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error decrypting data: {}", e.getMessage());
            throw new RuntimeException("Decryption failed", e);
        }
    }

    public String encryptWithKey(String plainText, String keyString) {
        try {
            if (plainText == null || plainText.isEmpty()) {
                return plainText;
            }

            SecretKey key = new SecretKeySpec(keyString.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.error("Error encrypting data with custom key: {}", e.getMessage());
            throw new RuntimeException("Encryption with custom key failed", e);
        }
    }

    public String decryptWithKey(String encryptedText, String keyString) {
        try {
            if (encryptedText == null || encryptedText.isEmpty()) {
                return encryptedText;
            }

            SecretKey key = new SecretKeySpec(keyString.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error decrypting data with custom key: {}", e.getMessage());
            throw new RuntimeException("Decryption with custom key failed", e);
        }
    }

    public String getKeyAsString() {
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }
}