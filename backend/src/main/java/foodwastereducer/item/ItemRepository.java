package foodwastereducer.item;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, UUID> {

  Optional<Item> findByIdAndOwnerId(UUID id, UUID ownerId);

  List<Item> findByOwnerIdAndStatusOrderByExpiryDateAsc(UUID ownerId, ItemStatus status);

  List<Item> findByOwnerIdAndStatusAndExpiryDateLessThanEqualOrderByExpiryDateAsc(
      UUID ownerId, ItemStatus status, LocalDate expiryDate);
}
