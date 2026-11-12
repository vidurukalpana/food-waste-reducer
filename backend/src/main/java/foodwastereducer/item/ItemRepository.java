package foodwastereducer.item;

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

  @Modifying
  @Query("update Item i set i.remindedOn = :today where i.id in :ids")
  void markReminded(@Param("ids") Collection<UUID> ids, @Param("today") LocalDate today);
}
