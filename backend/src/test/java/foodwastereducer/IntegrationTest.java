package foodwastereducer;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

// Full app on a Testcontainers database. Dev profile: emails are logged, not sent.
// Test values replace the .env secrets.
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    properties = {
      "app.jwt.secret=integration-test-jwt-secret-of-32-plus-chars",
      "app.cron.secret=integration-test-cron-secret",
      "app.mail.from=noreply@example.com",
      "app.brevo.api-key=unused-in-dev-profile"
    })
@ActiveProfiles("dev")
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
public @interface IntegrationTest {}
