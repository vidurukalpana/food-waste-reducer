package foodwastereducer.item;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public enum ExpiryStatus {
  EXPIRED,
  URGENT,
  SOON,
  FRESH;

  private static final int URGENT_MAX_DAYS = 2;
  private static final int SOON_MAX_DAYS = 7;

  public static ExpiryStatus of(LocalDate expiry, LocalDate today) {
    long days = daysLeft(expiry, today);
    if (days < 0) {
      return EXPIRED;
    }
    if (days <= URGENT_MAX_DAYS) {
      return URGENT;
    }
    if (days <= SOON_MAX_DAYS) {
      return SOON;
    }
    return FRESH;
  }

  // Negative once the expiry date has passed.
  public static long daysLeft(LocalDate expiry, LocalDate today) {
    return ChronoUnit.DAYS.between(today, expiry);
  }
}
