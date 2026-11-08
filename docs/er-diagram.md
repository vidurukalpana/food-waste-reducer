# ER Diagram

Food Waste Reducer stores data in two PostgreSQL tables. One user owns many items; deleting a user deletes their items.

```text
┌────────────────────────────────────────────┐            ┌────────────────────────────────────────────┐
│ users                                      │            │ items                                      │
├────────────────────────────────────────────┤  1         ├────────────────────────────────────────────┤
│ id                 uuid             PK     │─────┐    * │ id                 uuid             PK     │
│ email              varchar(255)     UNIQUE │     └──────│ user_id            uuid             FK     │
│ password_hash      varchar(100)            │            │ name               varchar(120)            │
│ created_at         timestamptz             │            │ barcode            varchar(32) NULL        │
│ reminder_enabled   boolean          V2     │            │ category           varchar(20)             │
│ last_reminder_date date NULL        V2     │            │ quantity           numeric(10,2)           │
└────────────────────────────────────────────┘            │ unit               varchar(20)             │
                                                          │ expiry_date        date                    │
                                                          │ status             varchar(10)             │
                                                          │ created_at         timestamptz             │
                                                          │ updated_at         timestamptz             │
                                                          │ closed_at          timestamptz NULL        │
                                                          └────────────────────────────────────────────┘
```

**Legend:** `PK` primary key · `FK` foreign key · `UNIQUE` no duplicates · `NULL` value is optional (every other column is `NOT NULL`) · `V2` added by the V2 migration (step 9) · `1 ── *` one user owns many items

## users

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `email` | `varchar(255)` | Unique, stored in lowercase |
| `password_hash` | `varchar(100)` | BCrypt hash, never the plain password |
| `created_at` | `timestamptz` | When the account was created |
| `reminder_enabled` | `boolean` | Default `true`; daily email on or off (V2) |
| `last_reminder_date` | `date` NULL | Sri Lanka date of the last reminder email (V2) |

## items

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `users.id`, `ON DELETE CASCADE` |
| `name` | `varchar(120)` | Product name |
| `barcode` | `varchar(32)` NULL | Optional barcode |
| `category` | `varchar(20)` | One of the categories below |
| `quantity` | `numeric(10,2)` | Default `1`; must be greater than 0 (checked by the API) |
| `unit` | `varchar(20)` | Default `'pcs'` |
| `expiry_date` | `date` | Date only (no time) |
| `status` | `varchar(10)` | Default `'ACTIVE'`; one of the statuses below |
| `created_at` | `timestamptz` | When the item was added |
| `updated_at` | `timestamptz` | When the item was last changed |
| `closed_at` | `timestamptz` NULL | When the item was marked used or wasted |

## Allowed values

| Column | Values (`CHECK` constraint) |
| --- | --- |
| `items.category` | `DAIRY`, `MEAT`, `SEAFOOD`, `VEGETABLES`, `FRUITS`, `BAKERY`, `PANTRY`, `FROZEN`, `OTHER` |
| `items.status` | `ACTIVE`, `USED`, `WASTED` |

## Index

| Index | Columns | Used by |
| --- | --- | --- |
| `idx_items_user_status_expiry` | `items(user_id, status, expiry_date)` | Item list, use-soon list, daily reminders |

## Time zone

- `date` columns hold Sri Lanka dates (`Asia/Colombo`); in Java they are `LocalDate`.
- `timestamptz` columns hold exact moments; in Java they are `Instant`.
