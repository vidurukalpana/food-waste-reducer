package foodwastereducer.summary;

import foodwastereducer.item.Category;
import foodwastereducer.item.ClosedItemCount;
import foodwastereducer.item.ItemRepository;
import foodwastereducer.item.ItemStatus;
import java.time.Clock;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SummaryService {

  private final ItemRepository itemRepository;
  private final Clock clock;

  public SummaryService(ItemRepository itemRepository, Clock clock) {
    this.itemRepository = itemRepository;
    this.clock = clock;
  }

  public YearMonth currentMonth() {
    return YearMonth.now(clock);
  }

  // Month boundaries use the app time zone (Asia/Colombo).
  @Transactional(readOnly = true)
  public MonthlySummary monthly(UUID ownerId, YearMonth month) {
    ZoneId zone = clock.getZone();
    Instant start = month.atDay(1).atStartOfDay(zone).toInstant();
    Instant end = month.plusMonths(1).atDay(1).atStartOfDay(zone).toInstant();

    Map<Category, long[]> byCategory = new EnumMap<>(Category.class);
    long used = 0;
    long wasted = 0;
    for (ClosedItemCount row : itemRepository.countClosed(ownerId, start, end)) {
      long[] counts = byCategory.computeIfAbsent(row.getCategory(), c -> new long[2]);
      if (row.getStatus() == ItemStatus.USED) {
        counts[0] += row.getTotal();
        used += row.getTotal();
      } else {
        counts[1] += row.getTotal();
        wasted += row.getTotal();
      }
    }

    // Busiest categories first.
    List<CategorySummary> categories =
        byCategory.entrySet().stream()
            .map(e -> new CategorySummary(e.getKey(), e.getValue()[0], e.getValue()[1]))
            .sorted(
                Comparator.comparingLong((CategorySummary c) -> c.used() + c.wasted())
                    .reversed()
                    .thenComparing(CategorySummary::category))
            .toList();
    return new MonthlySummary(month.toString(), used, wasted, wasteRate(used, wasted), categories);
  }

  private static double wasteRate(long used, long wasted) {
    long total = used + wasted;
    if (total == 0) {
      return 0;
    }
    return Math.round(wasted * 1000.0 / total) / 10.0;
  }
}
