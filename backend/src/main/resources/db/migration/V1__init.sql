CREATE TABLE users (
    id            uuid         NOT NULL,
    email         varchar(255) NOT NULL,
    password_hash varchar(100) NOT NULL,
    created_at    timestamptz  NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE items (
    id          uuid          NOT NULL,
    user_id     uuid          NOT NULL,
    name        varchar(120)  NOT NULL,
    barcode     varchar(32),
    category    varchar(20)   NOT NULL,
    quantity    numeric(10,2) NOT NULL DEFAULT 1,
    unit        varchar(20)   NOT NULL DEFAULT 'pcs',
    expiry_date date          NOT NULL,
    status      varchar(10)   NOT NULL DEFAULT 'ACTIVE',
    created_at  timestamptz   NOT NULL,
    updated_at  timestamptz   NOT NULL,
    closed_at   timestamptz,
    CONSTRAINT pk_items PRIMARY KEY (id),
    CONSTRAINT fk_items_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT ck_items_category CHECK (category IN (
        'DAIRY', 'MEAT', 'SEAFOOD', 'VEGETABLES', 'FRUITS', 'BAKERY', 'PANTRY', 'FROZEN', 'OTHER'
    )),
    CONSTRAINT ck_items_status CHECK (status IN ('ACTIVE', 'USED', 'WASTED'))
);

CREATE INDEX idx_items_user_status_expiry ON items (user_id, status, expiry_date);
