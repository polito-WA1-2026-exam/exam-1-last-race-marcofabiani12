-- database: ./last-run.sqlite
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS line_stations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    salt TEXT NOT NULL,
    best_score INTEGER NOT NULL DEFAULT 0 CHECK(best_score >= 0)
);

CREATE TABLE stations (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE lines (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE line_stations (
    line_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    position INTEGER NOT NULL CHECK(position > 0),

    PRIMARY KEY (line_id, station_id),
    UNIQUE (line_id, position),

    FOREIGN KEY (line_id) REFERENCES lines(line_id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id)
);

CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL CHECK(effect BETWEEN -4 AND 4)
);

CREATE INDEX idx_line_stations_line
ON line_stations(line_id);

CREATE INDEX idx_line_stations_station
ON line_stations(station_id);

-- Users
-- Passwords:
-- marco  / password1
-- alice  / password2
-- giulio / password3
-- luca   / password4
-- sara   / password5
-- andrea / password6
-- chiara / password7
-- matteo / password8

INSERT INTO users (username, hashed_password, salt, best_score) VALUES
('marco',  'a6a15a08e20ca3999ddde8091d0b858430bcf688da5eb289266de55b279ffd7c', 'salt-marco-2026', 31),
('alice',  '69510b527a32b7067493108896100ccbe9b90e796f12bb4e5d25b410e69e2e87', 'salt-alice-2026', 24),
('giulio', '3318a8626aea97938bf9fbf59f35a153ee8ce1f509234414b1f1baaddac363a9', 'salt-giulio-2026', 0),
('luca',   '4c2a698372c09e137a30a83e9e55e63b6449eed68489dd0ce3149a922432b00f', 'salt-luca-2026', 28),
('sara',   '902f28c029c6c5ad8cb1976504fff1f3a1fa999a776b1a4abe44e9961b61bfdb', 'salt-sara-2026', 21),
('andrea', '0012279c33c6efbddecbd26f7ec2d1727c3efbbd94943130e1ca359091f49104', 'salt-andrea-2026', 17),
('chiara', '86a60b92ee87c0f338918950a4e020d6bcba9918cca0c71fc0f2208d0c17f64c', 'salt-chiara-2026', 14),
('matteo', '1789f2316f5006e1d93d22f70241dcd40f0d6857da8de9faefa2206b1afbf464', 'salt-matteo-2026', 0);

-- Stations

INSERT INTO stations (name) VALUES
('Centrale'),                -- Central Station
('Porta Velaria'),           -- Velaria Gate
('Crocevia del Falco'),      -- Falcon Junction
('Piazza delle Lanterne'),   -- Lantern Square
('Fontana Oscura'),          -- Dark Fountain
('Borgo Sereno'),            -- Serene Borough
('Viale dei Mosaici'),       -- Mosaic Avenue
('Torre Cinerea'),           -- Ash Tower
('Campo dell''Eco'),         -- Echo Field
('Giardino Sommerso'),       -- Sunken Garden
('Mercato d''Argento'),      -- Silver Market
('Arco del Tramonto'),       -- Sunset Arch
('Riva delle Nebbie'),       -- Mistshore
('Bastione Aurora');         -- Aurora Bastion

-- Lines

INSERT INTO lines (name) VALUES
('Red Line'),
('Blue Line'),
('Green Line'),
('Yellow Line');

-- Red Line: 1 - 2 - 3 - 4
INSERT INTO line_stations (line_id, station_id, position) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4);

-- Blue Line: 11 - 10 - 9 - 12 - 13
INSERT INTO line_stations (line_id, station_id, position) VALUES
(2, 11, 1),
(2, 10, 2),
(2, 9, 3),
(2, 12, 4),
(2, 13, 5);

-- Green Line: 5 - 2 - 6 - 9
INSERT INTO line_stations (line_id, station_id, position) VALUES
(3, 5, 1),
(3, 2, 2),
(3, 6, 3),
(3, 9, 4);

-- Yellow Line: 7 - 6 - 8 - 12 - 14
INSERT INTO line_stations (line_id, station_id, position) VALUES
(4, 7, 1),
(4, 6, 2),
(4, 8, 3),
(4, 12, 4),
(4, 14, 5);

-- Events

INSERT INTO events (description, effect) VALUES
('Quiet journey', 0),
('Wrong platform', -2),
('Kind passenger', 1),
('Ticket inspection delay', -1),
('Found a lost coin', 2),
('Broken escalator', -3),
('Fast connection', 3),
('Strike warning', -4),
('Lucky shortcut', 4);