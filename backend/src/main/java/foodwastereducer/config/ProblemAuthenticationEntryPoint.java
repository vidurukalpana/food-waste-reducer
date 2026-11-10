package foodwastereducer.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;

// Missing or invalid token: 401 with a ProblemDetail body, like every other API error.
public class ProblemAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private static final String BODY =
      """
      {"type":"about:blank","title":"Unauthorized","status":401,"detail":"Authentication required"}""";

  // Sets the 401 status. Adds the standard WWW-Authenticate header.
  private final AuthenticationEntryPoint bearerEntryPoint =
      new BearerTokenAuthenticationEntryPoint();

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    bearerEntryPoint.commence(request, response, authException);
    response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
    response.getWriter().write(BODY);
  }
}
