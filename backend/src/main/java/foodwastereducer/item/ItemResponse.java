package foodwastereducer.item;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ItemResponse(
    UUID id,
    String name,
    String barcode,
    Category category,
    BigDecimal quantity,
    String unit,
    LocalDate expiryDate,
    ExpiryStatus expiryStatus,
    long daysLeft,
    ItemStatus status,
    Instant createdAt,
    Instant updatedAt,
    Instant closedAt) {

  public static ItemResponse from(Item item, LocalDate today) {
    return new ItemResponse(
        item.getId(),
        item.getName(),
        item.getBarcode(),
        item.getCategory(),
        item.getQuantity(),
        item.getUnit(),
        item.getExpiryDate(),
        ExpiryStatus.of(item.getExpiryDate(), today),
        ExpiryStatus.daysLeft(item.getExpiryDate(), today),
        item.getStatus(),
        item.getCreatedAt(),
        item.getUpdatedAt(),
        item.getClosedAt());
  }
}
