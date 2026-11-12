package foodwastereducer.user;

import foodwastereducer.common.UnauthorizedException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserSettingsService {

  private final UserRepository userRepository;

  public UserSettingsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public UserSettings get(UUID userId) {
    return toSettings(findUser(userId));
  }

  @Transactional
  public UserSettings update(UUID userId, UserSettings settings) {
    User user = findUser(userId);
    user.changeReminderEnabled(settings.reminderEnabled());
    return toSettings(user);
  }

  private static UserSettings toSettings(User user) {
    return new UserSettings(user.isReminderEnabled());
  }

  // A valid token for a deleted user is treated like a missing token.
  private User findUser(UUID userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(() -> new UnauthorizedException("Authentication required"));
  }
}
