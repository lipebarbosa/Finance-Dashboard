CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    current_price DECIMAL(19,4) NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    CONSTRAINT fk_asset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_asset_user_symbol UNIQUE (user_id, symbol)
);

CREATE TABLE price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    price DECIMAL(19,4) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_price_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);
