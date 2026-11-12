package foodwastereducer.reminder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import foodwastereducer.item.Category;
import foodwastereducer.item.Item;
import foodwastereducer.item.ItemRepository;
import foodwastereducer.item.ItemStatus;
import foodwastereducer.user.User;
import foodwastereducer.user.UserRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

// The SQL filters are covered by ReminderQueryIntegrationTest.
@ExtendWith(MockitoExtension.class)
class ReminderServiceTest {

  private static final ZoneId COLOMBO = ZoneId.of("Asia/Colombo");
  // 07:00 on 12 Nov 2026 in Sri Lanka.
  private static final Instant NOW = Instant.parse("2026-11-12T01:30:00Z");
  private static final LocalDate TODAY = LocalDate.of(2026, 11, 12);
  private static final LocalDate WINDOW_END = TODAY.plusDays(2);

  @Mock private UserRepository userRepository;
  @Mock private ItemRepository itemRepository;
  @Mock private EmailSender emailSender;

  private ReminderService reminderService;

  @BeforeEach
  void setUp() {
    TransactionTemplate transactionTemplate =
        new TransactionTemplate(mock(PlatformTransactionManager.class));
    reminderService =
        new ReminderService(
            userRepository,
            itemRepository,
            emailSender,
            Clock.fixed(NOW, COLOMBO),
            transactionTemplate);
  }

  @Test
  void sendsOneEmailPerUserThenMarksTheItems() {
    User alice = user("alice@example.com");
    Item milk = item(alice, "Milk", TODAY.minusDays(1));
    Item yoghurt = item(alice, "Yoghurt", WINDOW_END);
    when(userRepository.findDueForReminder(TODAY)).thenReturn(List.of(alice));
    whenDueItems(alice, List.of(milk, yoghurt));

    ReminderRunResult result = reminderService.sendDailyReminders();

    ArgumentCaptor<String> html = ArgumentCaptor.forClass(String.class);
    verify(emailSender).send(eq("alice@example.com"), eq("2 items to use soon"), html.capture());
    assertThat(html.getValue())
        .contains("Milk", "11 Nov 2026", "Expired 1 day ago")
        .contains("Yoghurt", "14 Nov 2026", "2 days left");
    verify(itemRepository).markReminded(List.of(milk.getId(), yoghurt.getId()), TODAY);
    verify(userRepository).markReminded(alice.getId(), TODAY);
    assertThat(result).isEqualTo(new ReminderRunResult(1, 1));
  }

  @Test
  void skipsUserWithNothingNewToReport() {
    User alice = user("alice@example.com");
    when(userRepository.findDueForReminder(TODAY)).thenReturn(List.of(alice));
    whenDueItems(alice, List.of());

    ReminderRunResult result = reminderService.sendDailyReminders();

    verify(emailSender, never()).send(anyString(), anyString(), anyString());
    verify(userRepository, never()).markReminded(any(), any());
    assertThat(result).isEqualTo(new ReminderRunResult(1, 0));
  }

  @Test
  void continuesAfterOneEmailFailure() {
    User alice = user("alice@example.com");
    User bob = user("bob@example.com");
    Item aliceMilk = item(alice, "Milk", TODAY);
    Item bobBread = item(bob, "Bread", TODAY);
    when(userRepository.findDueForReminder(TODAY)).thenReturn(List.of(alice, bob));
    whenDueItems(alice, List.of(aliceMilk));
    whenDueItems(bob, List.of(bobBread));
    doThrow(new EmailDeliveryException("Brevo could not be reached", null))
        .when(emailSender)
        .send(eq("alice@example.com"), anyString(), anyString());

    ReminderRunResult result = reminderService.sendDailyReminders();

    verify(emailSender).send(eq("bob@example.com"), anyString(), contains("Bread"));
    verify(itemRepository, never()).markReminded(List.of(aliceMilk.getId()), TODAY);
    verify(userRepository, never()).markReminded(alice.getId(), TODAY);
    verify(userRepository).markReminded(bob.getId(), TODAY);
    assertThat(result).isEqualTo(new ReminderRunResult(2, 1));
  }

  @Test
  void escapesItemNamesInTheEmail() {
    User alice = user("alice@example.com");
    when(userRepository.findDueForReminder(TODAY)).thenReturn(List.of(alice));
    whenDueItems(alice, List.of(item(alice, "<b>Curd</b>", TODAY)));

    reminderService.sendDailyReminders();

    ArgumentCaptor<String> html = ArgumentCaptor.forClass(String.class);
    verify(emailSender).send(anyString(), anyString(), html.capture());
    assertThat(html.getValue()).contains("&lt;b&gt;Curd&lt;/b&gt;").doesNotContain("<b>Curd</b>");
  }

  private void whenDueItems(User owner, List<Item> items) {
    when(itemRepository
            .findByOwnerIdAndStatusAndExpiryDateLessThanEqualAndRemindedOnIsNullOrderByExpiryDateAsc(
                owner.getId(), ItemStatus.ACTIVE, WINDOW_END))
        .thenReturn(items);
  }

  private static User user(String email) {
    User user = new User(email, "hash", NOW);
    ReflectionTestUtils.setField(user, "id", UUID.randomUUID());
    return user;
  }

  private static Item item(User owner, String name, LocalDate expiryDate) {
    Item item = new Item(owner, name, Category.DAIRY, BigDecimal.ONE, "pcs", expiryDate, NOW);
    ReflectionTestUtils.setField(item, "id", UUID.randomUUID());
    return item;
  }
}
