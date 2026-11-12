package foodwastereducer.summary;

import foodwastereducer.item.Category;

public record CategorySummary(Category category, long used, long wasted) {}
