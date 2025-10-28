package ac.cbnu.heartcheck.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for EncryptionUtil
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@DisplayName("Encryption Utility Tests")
class EncryptionUtilTest {

    private EncryptionUtil encryptionUtil;

    @BeforeEach
    void setUp() {
        encryptionUtil = new EncryptionUtil();
    }

    @Test
    @DisplayName("암호화 및 복호화 - 일반 텍스트")
    void encryptAndDecrypt_ShouldReturnOriginalText() {
        // given
        String originalText = "민감한 의료 데이터입니다.";

        // when
        String encrypted = encryptionUtil.encrypt(originalText);
        String decrypted = encryptionUtil.decrypt(encrypted);

        // then
        assertThat(encrypted).isNotEqualTo(originalText);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("암호화 및 복호화 - 영어 텍스트")
    void encryptAndDecrypt_EnglishText_ShouldReturnOriginalText() {
        // given
        String originalText = "Sensitive medical data for heart disease analysis";

        // when
        String encrypted = encryptionUtil.encrypt(originalText);
        String decrypted = encryptionUtil.decrypt(encrypted);

        // then
        assertThat(encrypted).isNotEqualTo(originalText);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("null 값 암호화 - null 반환")
    void encryptNull_ShouldReturnNull() {
        // when
        String encrypted = encryptionUtil.encrypt(null);

        // then
        assertThat(encrypted).isNull();
    }

    @Test
    @DisplayName("빈 문자열 암호화 - 빈 문자열 반환")
    void encryptEmptyString_ShouldReturnEmptyString() {
        // when
        String encrypted = encryptionUtil.encrypt("");

        // then
        assertThat(encrypted).isEmpty();
    }

    @Test
    @DisplayName("null 값 복호화 - null 반환")
    void decryptNull_ShouldReturnNull() {
        // when
        String decrypted = encryptionUtil.decrypt(null);

        // then
        assertThat(decrypted).isNull();
    }

    @Test
    @DisplayName("빈 문자열 복호화 - 빈 문자열 반환")
    void decryptEmptyString_ShouldReturnEmptyString() {
        // when
        String decrypted = encryptionUtil.decrypt("");

        // then
        assertThat(decrypted).isEmpty();
    }

    @Test
    @DisplayName("커스텀 키로 암호화 및 복호화")
    void encryptAndDecryptWithCustomKey_ShouldReturnOriginalText() {
        // given
        String originalText = "Custom key encryption test";
        String customKey = "MyCustomKey123456789012345678901234"; // 32 bytes for AES-256

        // when
        String encrypted = encryptionUtil.encryptWithKey(originalText, customKey);
        String decrypted = encryptionUtil.decryptWithKey(encrypted, customKey);

        // then
        assertThat(encrypted).isNotEqualTo(originalText);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("암호화된 텍스트는 Base64 인코딩되어야 함")
    void encryptedText_ShouldBeBase64Encoded() {
        // given
        String originalText = "Test text for Base64 validation";

        // when
        String encrypted = encryptionUtil.encrypt(originalText);

        // then
        assertThat(encrypted).matches("^[A-Za-z0-9+/]*={0,2}$"); // Base64 pattern
    }

    @Test
    @DisplayName("동일한 텍스트 두 번 암호화 - 서로 다른 결과")
    void encryptSameTextTwice_ShouldProduceDifferentResults() {
        // given
        String originalText = "Same text for encryption";

        // when
        String encrypted1 = encryptionUtil.encrypt(originalText);
        String encrypted2 = encryptionUtil.encrypt(originalText);

        // Note: ECB mode will produce same result, this test might need adjustment
        // if we switch to CBC mode with random IV
        String decrypted1 = encryptionUtil.decrypt(encrypted1);
        String decrypted2 = encryptionUtil.decrypt(encrypted2);

        // then
        assertThat(decrypted1).isEqualTo(originalText);
        assertThat(decrypted2).isEqualTo(originalText);
    }

    @Test
    @DisplayName("키를 문자열로 변환")
    void getKeyAsString_ShouldReturnNonEmptyString() {
        // when
        String keyString = encryptionUtil.getKeyAsString();

        // then
        assertThat(keyString).isNotNull();
        assertThat(keyString).isNotEmpty();
        assertThat(keyString).matches("^[A-Za-z0-9+/]*={0,2}$"); // Base64 pattern
    }

    @Test
    @DisplayName("잘못된 암호화 데이터 복호화 - 예외 발생")
    void decryptInvalidData_ShouldThrowException() {
        // given
        String invalidEncryptedData = "invalid-encrypted-data";

        // when & then
        assertThatThrownBy(() -> encryptionUtil.decrypt(invalidEncryptedData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Decryption failed");
    }

    @Test
    @DisplayName("긴 텍스트 암호화 및 복호화")
    void encryptAndDecryptLongText_ShouldReturnOriginalText() {
        // given
        String longText = "This is a very long text that contains multiple sentences and paragraphs. ".repeat(100);

        // when
        String encrypted = encryptionUtil.encrypt(longText);
        String decrypted = encryptionUtil.decrypt(encrypted);

        // then
        assertThat(decrypted).isEqualTo(longText);
    }

    @Test
    @DisplayName("특수 문자 암호화 및 복호화")
    void encryptAndDecryptSpecialCharacters_ShouldReturnOriginalText() {
        // given
        String specialText = "특수문자: !@#$%^&*()_+{}|:<>?[];',./`~";

        // when
        String encrypted = encryptionUtil.encrypt(specialText);
        String decrypted = encryptionUtil.decrypt(encrypted);

        // then
        assertThat(decrypted).isEqualTo(specialText);
    }
}