package foodwastereducer.summary;

import java.util.List;

// wasteRate: wasted ÷ (used + wasted) × 100, one decimal. 0 when nothing was closed.
public record MonthlySummary(
    String month, long used, long wasted, double wasteRate, List<CategorySummary> categories) {}
