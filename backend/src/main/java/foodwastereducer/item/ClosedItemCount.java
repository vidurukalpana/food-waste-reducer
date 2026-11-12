package foodwastereducer.item;

// Projection row of ItemRepository.countClosed.
public interface ClosedItemCount {

  Category getCategory();

  ItemStatus getStatus();

  long getTotal();
}
