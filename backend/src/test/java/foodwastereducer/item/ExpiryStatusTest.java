package foodwastereducer.item;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class ExpiryStatusTest {

  private static final LocalDate TODAY = LocalDate.of(2026, 11, 12);

  // Edges of each rule: EXPIRED < 0, URGENT 0–2, SOON 3–7, FRESH > 7.
  @ParameterizedTest(name = "{0} days left → {1}")
  @CsvSource({
    "-1, EXPIRED",
    "0, URGENT",
    "2, URGENT",
    "3, SOON",
    "7, SOON",
    "8, FRESH",
  })
  void statusFollowsTheRulesTable(int daysLeft, ExpiryStatus expected) {
    LocalDate expiry = TODAY.plusDays(daysLeft);

    assertThat(ExpiryStatus.of(expiry, TODAY)).isEqualTo(expected);
    assertThat(ExpiryStatus.daysLeft(expiry, TODAY)).isEqualTo(daysLeft);
  }
}
