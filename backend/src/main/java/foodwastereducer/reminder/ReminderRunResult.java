package foodwastereducer.reminder;

// checked: users due for a reminder. emailed: users whose email was accepted.
public record ReminderRunResult(int checked, int emailed) {}
