package foodwastereducer.user;

import jakarta.validation.constraints.NotNull;

// Request and response body of /api/users/me/settings.
public record UserSettings(
    @NotNull(message = "Reminder setting is required") Boolean reminderEnabled) {}
