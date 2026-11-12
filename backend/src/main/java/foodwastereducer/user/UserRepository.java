package foodwastereducer.user;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByEmailIgnoreCase(String email);

  boolean existsByEmailIgnoreCase(String email);

  @Query(
      "select u from User u where u.reminderEnabled = true"
          + " and (u.lastReminderDate is null or u.lastReminderDate <> :today)")
  List<User> findDueForReminder(@Param("today") LocalDate today);

  // Updates one column only. A settings change made meanwhile is kept.
  @Modifying
  @Query("update User u set u.lastReminderDate = :today where u.id = :id")
  void markReminded(@Param("id") UUID id, @Param("today") LocalDate today);
}
