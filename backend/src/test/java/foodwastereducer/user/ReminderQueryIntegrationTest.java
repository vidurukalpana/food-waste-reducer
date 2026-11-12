package foodwastereducer.user;

import static org.assertj.core.api.Assertions.assertThat;

import foodwastereducer.IntegrationTest;
import foodwastereducer.item.Category;
import foodwastereducer.item.Item;
import foodwastereducer.item.ItemRepository;
import foodwastereducer.item.ItemRequest;
import foodwastereducer.item.ItemService;
import foodwastereducer.item.ItemStatus;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.support.TransactionTemplate;

@IntegrationTest
class ReminderQueryIntegrationTest {

  @Autowired private UserRepository userRepository;
  @Autowired private ItemRepository itemRepository;
  @Autowired private ItemService itemService;
  @Autowired private TransactionTemplate transactionTemplate;
  @Autowired private Clock clock;

  @Test
  void dueUsersExcludeDisabledUsersPlusUsersRemindedToday() {
    LocalDate today = LocalDate.now(clock);
    User neverReminded = saveUser(true);
    User remindedYesterday = saveUser(true);
    User remindedToday = saveUser(true);
    User disabled = saveUser(false);
    markReminded(remindedYesterday, today.minusDays(1));
    markReminded(remindedToday, today);

    List<UUID> due = userRepository.findDueForReminder(today).stream().map(User::getId).toList();

    assertThat(due).contains(neverReminded.getId(), remindedYesterday.getId());
    assertThat(due).doesNotContain(remindedToday.getId(), disabled.getId());
  }

  @Test
  void eachItemIsListedOnceUntilItsExpiryDateChanges() {
    LocalDate today = LocalDate.now(clock);
    User owner = saveUser(true);
    Item milk =
        itemRepository.save(
            new Item(
                owner,
                "Milk",
                Category.DAIRY,
                BigDecimal.ONE,
                "l",
                today.plusDays(1),
                clock.instant()));

    assertThat(dueItems(owner, today)).extracting(Item::getId).containsExactly(milk.getId());

    transactionTemplate.executeWithoutResult(
        status -> itemRepository.markReminded(List.of(milk.getId()), today));
    assertThat(dueItems(owner, today)).isEmpty();

    itemService.update(
        owner.getId(),
        milk.getId(),
        new ItemRequest("Milk", Category.DAIRY, BigDecimal.ONE, "l", today.plusDays(2)));
    assertThat(dueItems(owner, today)).extracting(Item::getId).containsExactly(milk.getId());
  }

  private List<Item> dueItems(User owner, LocalDate today) {
    return itemRepository
        .findByOwnerIdAndStatusAndExpiryDateLessThanEqualAndRemindedOnIsNullOrderByExpiryDateAsc(
            owner.getId(), ItemStatus.ACTIVE, today.plusDays(2));
  }

  private User saveUser(boolean reminderEnabled) {
    User user = new User(UUID.randomUUID() + "@example.com", "hash", clock.instant());
    user.changeReminderEnabled(reminderEnabled);
    return userRepository.save(user);
  }

  private void markReminded(User user, LocalDate date) {
    transactionTemplate.executeWithoutResult(
        status -> userRepository.markReminded(user.getId(), date));
  }
}
