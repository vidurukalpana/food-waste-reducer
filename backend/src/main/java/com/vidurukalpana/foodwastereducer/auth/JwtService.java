package com.vidurukalpana.foodwastereducer.auth;

import com.vidurukalpana.foodwastereducer.user.User;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private static final Duration TOKEN_LIFETIME = Duration.ofHours(24);

  private final JwtEncoder jwtEncoder;
  private final Clock clock;

  public JwtService(JwtEncoder jwtEncoder, Clock clock) {
    this.jwtEncoder = jwtEncoder;
    this.clock = clock;
  }

  public String issueToken(User user) {
    Instant now = clock.instant();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .issuedAt(now)
            .expiresAt(now.plus(TOKEN_LIFETIME))
            .build();
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
  }
}
