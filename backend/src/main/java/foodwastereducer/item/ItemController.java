package foodwastereducer.item;

import foodwastereducer.auth.CurrentUser;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
public class ItemController {

  private final ItemService itemService;

  public ItemController(ItemService itemService) {
    this.itemService = itemService;
  }

  @GetMapping
  public List<ItemResponse> list(
      @AuthenticationPrincipal Jwt jwt, @RequestParam(defaultValue = "ACTIVE") ItemStatus status) {
    return itemService.list(CurrentUser.id(jwt), status);
  }

  @GetMapping("/{id}")
  public ItemResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
    return itemService.get(CurrentUser.id(jwt), id);
  }

  @PostMapping
  public ResponseEntity<ItemResponse> create(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ItemRequest request) {
    ItemResponse created = itemService.create(CurrentUser.id(jwt), request);
    return ResponseEntity.created(URI.create("/api/items/" + created.id())).body(created);
  }

  @PutMapping("/{id}")
  public ItemResponse update(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable UUID id,
      @Valid @RequestBody ItemRequest request) {
    return itemService.update(CurrentUser.id(jwt), id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
    itemService.delete(CurrentUser.id(jwt), id);
  }
}
