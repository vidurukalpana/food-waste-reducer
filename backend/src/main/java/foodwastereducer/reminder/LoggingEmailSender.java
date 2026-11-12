package foodwastereducer.reminder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

// Dev profile only. Emails go to the log instead of Brevo.
@Component
@Profile("dev")
public class LoggingEmailSender implements EmailSender {

  private static final Logger log = LoggerFactory.getLogger(LoggingEmailSender.class);

  @Override
  public void send(String to, String subject, String htmlContent) {
    log.info("Email not sent (dev profile). To: {} Subject: {}\n{}", to, subject, htmlContent);
  }
}
