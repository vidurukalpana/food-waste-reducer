package foodwastereducer.item;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, UUID> {

  Optional<Item> findByIdAndOwnerId(UUID id, UUID ownerId);

  List<Item> findByOwnerIdAndStatusOrderByExpiryDateAsc(UUID ownerId, ItemStatus status);

  List<Item> findByOwnerIdAndStatusAndExpiryDateLessThanEqualOrderByExpiryDateAsc(
      UUID ownerId, ItemStatus status, LocalDate expiryDate);

  // Items not yet listed in any reminder email.
  List<Item>
      findByOwnerIdAndStatusAndExpiryDateLessThanEqualAndRemindedOnIsNullOrderByExpiryDateAsc(
          UUID ownerId, ItemStatus status, LocalDate expiryDate);

  // Used or wasted items closed in [start, end), grouped by category plus status.
  @Query(
      "select i.category as category, i.status as status, count(i) as total from Item i"
          + " where i.owner.id = :ownerId and i.status <> foodwastereducer.item.ItemStatus.ACTIVE"
          + " and i.closedAt >= :start and i.closedAt < :end"
          + " group by i.category, i.status")
  List<ClosedItemCount> countClosed(
      @Param("ownerId") UUID ownerId, @Param("start") Instant start, @Param("end") Instant end);

  @Modifying
  @Query("update Item i set i.remindedOn = :today where i.id in :ids")
  void markReminded(@Param("ids") Collection<UUID> ids, @Param("today") LocalDate today);
}
