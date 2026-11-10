package foodwastereducer.auth;

import foodwastereducer.common.ConflictException;
import foodwastereducer.common.UnauthorizedException;
import foodwastereducer.user.User;
import foodwastereducer.user.UserRepository;
import java.time.Clock;
import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private static final String EMAIL_TAKEN = "Email is already registered";
  private static final String INVALID_CREDENTIALS = "Invalid email or password";

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final Clock clock;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      Clock clock) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.clock = clock;
  }

  @Transactional
  public UserResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.email());
    if (userRepository.existsByEmailIgnoreCase(email)) {
      throw new ConflictException(EMAIL_TAKEN);
    }

    User user = new User(email, passwordEncoder.encode(request.password()), clock.instant());
    try {
      // Flush now so a parallel duplicate hits the unique constraint inside this method.
      User saved = userRepository.saveAndFlush(user);
      return new UserResponse(saved.getId(), saved.getEmail());
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException(EMAIL_TAKEN);
    }
  }

  // Same message for an unknown email or a wrong password. Attackers cannot tell which one failed.
  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request) {
    User user =
        userRepository
            .findByEmailIgnoreCase(normalizeEmail(request.email()))
            .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
            .orElseThrow(() -> new UnauthorizedException(INVALID_CREDENTIALS));
    return new LoginResponse(jwtService.issueToken(user));
  }

  private static String normalizeEmail(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }
}
