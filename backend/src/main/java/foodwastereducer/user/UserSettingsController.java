package foodwastereducer.user;

import foodwastereducer.auth.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me/settings")
public class UserSettingsController {

  private final UserSettingsService userSettingsService;

  public UserSettingsController(UserSettingsService userSettingsService) {
    this.userSettingsService = userSettingsService;
  }

  @GetMapping
  public UserSettings get(@AuthenticationPrincipal Jwt jwt) {
    return userSettingsService.get(CurrentUser.id(jwt));
  }

  @PatchMapping
  public UserSettings update(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UserSettings settings) {
    return userSettingsService.update(CurrentUser.id(jwt), settings);
  }
}
