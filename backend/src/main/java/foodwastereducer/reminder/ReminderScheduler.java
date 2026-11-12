package foodwastereducer.reminder;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// Runs only while the server is awake. GitHub Actions also calls the trigger endpoint daily.
@Component
public class ReminderScheduler {

  private final ReminderService reminderService;

  public ReminderScheduler(ReminderService reminderService) {
    this.reminderService = reminderService;
  }

  @Scheduled(cron = "0 0 7 * * *", zone = "Asia/Colombo")
  public void sendDailyReminders() {
    reminderService.sendDailyReminders();
  }
}
