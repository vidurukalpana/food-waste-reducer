package foodwastereducer.item;

import foodwastereducer.common.ConflictException;
import foodwastereducer.common.NotFoundException;
import foodwastereducer.user.User;
import foodwastereducer.user.UserRepository;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemService {

  private final ItemRepository itemRepository;
  private final UserRepository userRepository;
  private final Clock clock;

  public ItemService(ItemRepository itemRepository, UserRepository userRepository, Clock clock) {
    this.itemRepository = itemRepository;
    this.userRepository = userRepository;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public List<ItemResponse> list(UUID ownerId, ItemStatus status) {
    return itemRepository.findByOwnerIdAndStatusOrderByExpiryDateAsc(ownerId, status).stream()
        .map(ItemResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public ItemResponse get(UUID ownerId, UUID itemId) {
    return ItemResponse.from(findOwnedItem(ownerId, itemId));
  }

  @Transactional
  public ItemResponse create(UUID ownerId, ItemRequest request) {
    // Reference only: the owner row is not loaded.
    User owner = userRepository.getReferenceById(ownerId);
    Item item =
        new Item(
            owner,
            request.name().strip(),
            request.barcode(),
            request.category(),
            request.quantity(),
            request.unit().strip(),
            request.expiryDate(),
            clock.instant());
    return ItemResponse.from(itemRepository.save(item));
  }

  @Transactional
  public ItemResponse update(UUID ownerId, UUID itemId, ItemRequest request) {
    Item item = findOwnedItem(ownerId, itemId);
    item.update(
        request.name().strip(),
        request.barcode(),
        request.category(),
        request.quantity(),
        request.unit().strip(),
        request.expiryDate(),
        clock.instant());
    return ItemResponse.from(item);
  }

  @Transactional
  public void delete(UUID ownerId, UUID itemId) {
    itemRepository.delete(findOwnedItem(ownerId, itemId));
  }

  @Transactional
  public ItemResponse markUsed(UUID ownerId, UUID itemId) {
    return close(ownerId, itemId, ItemStatus.USED);
  }

  @Transactional
  public ItemResponse markWasted(UUID ownerId, UUID itemId) {
    return close(ownerId, itemId, ItemStatus.WASTED);
  }

  private ItemResponse close(UUID ownerId, UUID itemId, ItemStatus finalStatus) {
    Item item = findOwnedItem(ownerId, itemId);
    if (!item.isActive()) {
      throw new ConflictException("Item is already closed");
    }
    item.close(finalStatus, clock.instant());
    return ItemResponse.from(item);
  }

  // Another user's item looks the same as a missing one: 404.
  private Item findOwnedItem(UUID ownerId, UUID itemId) {
    return itemRepository
        .findByIdAndOwnerId(itemId, ownerId)
        .orElseThrow(() -> new NotFoundException("Item not found"));
  }
}
