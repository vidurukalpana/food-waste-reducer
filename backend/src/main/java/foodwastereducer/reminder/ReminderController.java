package foodwastereducer.reminder;

import foodwastereducer.common.UnauthorizedException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReminderController {

  private static final String INVALID_SECRET = "Invalid cron secret";

  private final ReminderService reminderService;
  private final byte[] cronSecret;

  public ReminderController(
      ReminderService reminderService, @Value("${app.cron.secret}") String cronSecret) {
    this.reminderService = reminderService;
    this.cronSecret = cronSecret.getBytes(StandardCharsets.UTF_8);
  }

  // No JWT here. The caller is the GitHub Actions schedule.
  @PostMapping("/api/internal/reminders/run")
  public ReminderRunResult run(
      @RequestHeader(name = "X-Cron-Secret", required = false) String secret) {
    if (!isValid(secret)) {
      throw new UnauthorizedException(INVALID_SECRET);
    }
    return reminderService.sendDailyReminders();
  }

  // Constant-time comparison. An empty configured secret rejects every call.
  private boolean isValid(String secret) {
    if (secret == null || cronSecret.length == 0) {
      return false;
    }
    return MessageDigest.isEqual(cronSecret, secret.getBytes(StandardCharsets.UTF_8));
  }
}
