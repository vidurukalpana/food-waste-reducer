package foodwastereducer.reminder;

import foodwastereducer.item.ExpiryStatus;
import foodwastereducer.item.Item;
import foodwastereducer.item.ItemRepository;
import foodwastereducer.item.ItemStatus;
import foodwastereducer.user.User;
import foodwastereducer.user.UserRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.util.HtmlUtils;

@Service
public class ReminderService {

  private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

  // Matches the URGENT rule: expires within 2 days. Expired items are included.
  private static final int REMINDER_DAYS = 2;

  private static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);

  private final UserRepository userRepository;
  private final ItemRepository itemRepository;
  private final EmailSender emailSender;
  private final Clock clock;
  private final TransactionTemplate transactionTemplate;

  public ReminderService(
      UserRepository userRepository,
      ItemRepository itemRepository,
      EmailSender emailSender,
      Clock clock,
      TransactionTemplate transactionTemplate) {
    this.userRepository = userRepository;
    this.itemRepository = itemRepository;
    this.emailSender = emailSender;
    this.clock = clock;
    this.transactionTemplate = transactionTemplate;
  }

  // At most one email per user per day. Each item is listed once only.
  // No surrounding transaction. Each user is handled on their own.
  // synchronized: the scheduled job plus the HTTP trigger never overlap on one server.
  public synchronized ReminderRunResult sendDailyReminders() {
    LocalDate today = LocalDate.now(clock);
    List<User> users = userRepository.findDueForReminder(today);
    int emailed = 0;
    for (User user : users) {
      try {
        if (remind(user, today)) {
          emailed++;
        }
      } catch (RuntimeException ex) {
        log.warn("Reminder failed for user {}", user.getId(), ex);
      }
    }
    log.info("Daily reminders: {} users checked, {} emailed", users.size(), emailed);
    return new ReminderRunResult(users.size(), emailed);
  }

  private boolean remind(User user, LocalDate today) {
    List<Item> items =
        itemRepository
            .findByOwnerIdAndStatusAndExpiryDateLessThanEqualAndRemindedOnIsNullOrderByExpiryDateAsc(
                user.getId(), ItemStatus.ACTIVE, today.plusDays(REMINDER_DAYS));
    if (items.isEmpty()) {
      return false;
    }
    emailSender.send(user.getEmail(), subject(items.size()), htmlBody(items, today));
    List<UUID> itemIds = items.stream().map(Item::getId).toList();
    transactionTemplate.executeWithoutResult(
        status -> {
          itemRepository.markReminded(itemIds, today);
          userRepository.markReminded(user.getId(), today);
        });
    return true;
  }

  private static String subject(int count) {
    return count == 1 ? "1 item to use soon" : count + " items to use soon";
  }

  // Item names are user input. They are HTML-escaped.
  private static String htmlBody(List<Item> items, LocalDate today) {
    StringBuilder html = new StringBuilder();
    html.append("<p>These items need your attention today:</p><ul>");
    for (Item item : items) {
      html.append("<li><strong>")
          .append(HtmlUtils.htmlEscape(item.getName()))
          .append("</strong> · ")
          .append(item.getExpiryDate().format(DATE_FORMAT))
          .append(" · ")
          .append(statusText(item.getExpiryDate(), today))
          .append("</li>");
    }
    html.append("</ul><p>Turn off these emails in the app settings.</p>");
    return html.toString();
  }

  // Same wording as the dashboard.
  private static String statusText(LocalDate expiryDate, LocalDate today) {
    long days = ExpiryStatus.daysLeft(expiryDate, today);
    if (days < 0) {
      return "Expired " + plural(-days) + " ago";
    }
    if (days == 0) {
      return "Expires today";
    }
    return plural(days) + " left";
  }

  private static String plural(long days) {
    return days == 1 ? "1 day" : days + " days";
  }
}
