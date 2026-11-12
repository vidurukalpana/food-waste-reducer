ALTER TABLE users
    ADD COLUMN reminder_enabled   boolean NOT NULL DEFAULT true,
    ADD COLUMN last_reminder_date date;
