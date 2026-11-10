package com.vidurukalpana.foodwastereducer.auth;

import com.vidurukalpana.foodwastereducer.common.ConflictException;
import com.vidurukalpana.foodwastereducer.user.User;
import com.vidurukalpana.foodwastereducer.user.UserRepository;
import java.time.Clock;
import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private static final String EMAIL_TAKEN = "Email is already registered";

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final Clock clock;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, Clock clock) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.clock = clock;
  }

  @Transactional
  public UserResponse register(RegisterRequest request) {
    String email = request.email().trim().toLowerCase(Locale.ROOT);
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
}
