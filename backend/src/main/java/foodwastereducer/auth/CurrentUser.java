package foodwastereducer.auth;

import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;

public final class CurrentUser {

  private CurrentUser() {}

  // The token subject holds the user id.
  public static UUID id(Jwt jwt) {
    return UUID.fromString(jwt.getSubject());
  }
}
