package foodwastereducer.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(name = "password_hash", nullable = false, length = 100)
  private String passwordHash;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  // Off until the user turns it on in Settings.
  @Column(name = "reminder_enabled", nullable = false)
  private boolean reminderEnabled = false;

  // Written by UserRepository.markReminded. Read by its reminder query.
  @Column(name = "last_reminder_date")
  private LocalDate lastReminderDate;

  protected User() {}

  public User(String email, String passwordHash, Instant createdAt) {
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public boolean isReminderEnabled() {
    return reminderEnabled;
  }

  public void changeReminderEnabled(boolean reminderEnabled) {
    this.reminderEnabled = reminderEnabled;
  }
}
