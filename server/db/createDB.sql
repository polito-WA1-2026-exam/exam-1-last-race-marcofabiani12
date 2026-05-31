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

INSERT INTO users (username, hashed_password, salt, best_score) VALUES
('marco',  'a6a15a08e20ca3999ddde8091d0b858430bcf688da5eb289266de55b279ffd7c', 'salt-marco-2026', 31),
('alice',  '69510b527a32b7067493108896100ccbe9b90e796f12bb4e5d25b410e69e2e87', 'salt-alice-2026', 24),
('giulio', '3318a8626aea97938bf9fbf59f35a153ee8ce1f509234414b1f1baaddac363a9', 'salt-giulio-2026', 0);

-- Stations

INSERT INTO stations (name) VALUES
('Centrale'),                         -- ('Central Station'),
('Porta Velaria'),                        -- ('Velaria Gate'),
('Crocevia del Falco'),                         -- ('Falcon Junction'),
('Piazza delle Lanterne'),                        -- ('Lantern Square'),
('Fontana Oscura'),                         -- ('Dark Fountain'),
('Borgo Sereno'),                         -- ('Serene Borough'),
('Viale dei Mosaici'),                        -- ('Mosaic Avenue'),
('Torre Cinerea'),                        -- ('Ash Tower'),
('Campo dell''Eco'),                        -- ('Echo Field'),
('Giardino Sommerso'),                        -- ('Sunken Garden'),
('Mercato d''Argento'),                         -- ('Silver Market'),
('Arco del Tramonto');                        -- ('Sunset Arch');

-- Lines

INSERT INTO lines (name) VALUES
('Red Line'),
('Blue Line'),
('Green Line'),
('Yellow Line');

-- Red Line

INSERT INTO line_stations (line_id, station_id, position) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 12, 5);

-- Blue Line

INSERT INTO line_stations (line_id, station_id, position) VALUES
(2, 1, 1),
(2, 5, 2),
(2, 6, 3),
(2, 7, 4),
(2, 10, 5);

-- Green Line

INSERT INTO line_stations (line_id, station_id, position) VALUES
(3, 2, 1),
(3, 5, 2),
(3, 8, 3),
(3, 9, 4),
(3, 11, 5);

-- Yellow Line

INSERT INTO line_stations (line_id, station_id, position) VALUES
(4, 4, 1),
(4, 8, 2),
(4, 7, 3),
(4, 9, 4),
(4, 12, 5);

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