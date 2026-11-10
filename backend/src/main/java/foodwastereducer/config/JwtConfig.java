package foodwastereducer.config;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

  // HS256 needs a key of at least 256 bits.
  private static final int MIN_SECRET_BYTES = 32;

  @Bean
  public SecretKey jwtSecretKey(@Value("${app.jwt.secret}") String secret) {
    byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
    if (bytes.length < MIN_SECRET_BYTES) {
      throw new IllegalStateException("JWT_SECRET must be at least 32 characters long");
    }
    return new SecretKeySpec(bytes, "HmacSHA256");
  }

  @Bean
  public JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
    return NimbusJwtEncoder.withSecretKey(jwtSecretKey).algorithm(MacAlgorithm.HS256).build();
  }

  @Bean
  public JwtDecoder jwtDecoder(SecretKey jwtSecretKey, Clock clock) {
    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withSecretKey(jwtSecretKey).macAlgorithm(MacAlgorithm.HS256).build();
    // Expiry check uses the app Clock, not the system time.
    JwtTimestampValidator timestampValidator = new JwtTimestampValidator();
    timestampValidator.setClock(clock);
    decoder.setJwtValidator(timestampValidator);
    return decoder;
  }
}
