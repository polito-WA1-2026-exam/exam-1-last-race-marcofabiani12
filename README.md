# Exam #1: "Last Race"
## Student: s359125 FABIANI MARCO 

## React Client Application Routes

- Route `/`: public page containing the game instructions. Anonymous users can access this page but cannot see the network map.
- Route `/login`: login form for registered users.
- Route `/ranking`: protected page showing the general ranking based on users' best scores.
- Route `/game`: protected page containing the whole game workflow, internally divided into setup, planning, execution, and result phases.
- Route `*`: fallback page for unknown routes.

## API Server

### Authentication

#### `GET /api/sessions/current`

Returns the currently authenticated user.

- Request parameters and body: none

- Response body:

```json
{
  "userId": 1,
  "username": "marco",
  "bestScore": 31
}
```

- Status codes:

  - `200 OK`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### `POST /api/sessions`

Performs user login.

- Request body:

```json
{
  "username": "marco",
  "password": "password1"
}
```

- Response body:

```json
{
  "userId": 1,
  "username": "marco",
  "bestScore": 31
}
```

- Status codes:

  - `201 Created`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### `DELETE /api/sessions/current`

Performs user logout.

- Request parameters and body: none

- Response body: none

- Status codes:

  - `200 OK`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

### Network

#### `GET /api/network/full`

Returns the complete underground network used during the Setup phase.

- Request parameters and body: none

- Response body:

```json
{
  "stations": [
    {
      "stationId": 1,
      "name": "Centrale"
    }
  ],
  "lines": [
    {
      "lineId": 1,
      "name": "Red Line"
    }
  ],
  "lineStations": [
    {
      "lineId": 1,
      "stationId": 1,
      "position": 1
    }
  ]
}
```

- Status codes:

  - `200 OK`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### `GET /api/network/stations`

Returns all stations without line information. Used during the Planning phase.

- Request parameters and body: none

- Response body:

```json
[
  {
    "stationId": 1,
    "name": "Centrale"
  },
  {
    "stationId": 2,
    "name": "Porta Velaria"
  }
]
```

- Status codes:

  - `200 OK`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### `GET /api/network/segments`

Returns all direct station pairs derived from consecutive stations on the same line.

- Request parameters and body: none

- Response body:

```json
[
  {
    "segmentId": 1,
    "fromStationId": 1,
    "toStationId": 2
  },
  {
    "segmentId": 2,
    "fromStationId": 2,
    "toStationId": 3
  }
]
```

- Status codes:

  - `200 OK`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

### Game

#### `POST /api/games`

Starts a new game and randomly assigns the start station and destination station.

- Request parameters and body: none

- Response body:

```json
{
  "startStation": {
    "stationId": 2,
    "name": "Porta Velaria"
  },
  "destinationStation": {
    "stationId": 9,
    "name": "Campo dell'Eco"
  },
  "coins": 20
}
```

- Status codes:

  - `201 Created`
  - `401 Unauthorized`
  - `500 Internal Server Error`

---

#### `POST /api/games/execute`

Submits the route built during the Planning phase. The server retrieves the active game of the currently authenticated user, validates the submitted route against the assigned starting station and destination station, generates a random event for each travelled segment, computes the final score, and updates the user's best score if necessary.

- Request body:
```json
{
  "segments": [6, 7, 8]
}
```

- Response body (valid route)::

```json
{
  "valid": true,
  "steps": [
    {
      "fromStationId": 5,
      "toStationId": 6,
      "event": {
        "description": "Fast connection",
        "effect": 3
      },
      "coins": 23
    },
    {
      "fromStationId": 6,
      "toStationId": 7,
      "event": {
        "description": "Wrong platform",
        "effect": -2
      },
      "coins": 21
    },
    {
      "fromStationId": 7,
      "toStationId": 10,
      "event": {
        "description": "Kind passenger",
        "effect": 1
      },
      "coins": 22
    }
  ],
  "finalScore": 22,
  "bestScore": 31
}
```

- Response body (invalid or incomplete route):

```json
{
  "valid": false,
  "reason": "invalid-route",
  "finalScore": 0,
  "bestScore": 31
}
```

- Response body (timeout):

```json
{
  "valid": false,
  "reason": "timeout",
  "finalScore": 0,
  "bestScore": 31
}
```

- Status codes:

  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`
  - `500 Internal Server Error`

---

### Ranking

#### `GET /api/ranking`

Returns the ranking ordered by best score.

- Request parameters and body: none

- Response body:

```json
[
  {
    "username": "marco",
    "bestScore": 31
  },
  {
    "username": "alice",
    "bestScore": 24
  }
]
```

- Status codes:

  - `200 OK`
  - `500 Internal Server Error`

## Database Tables

- Table `users` - contains user_id, username, hashed_password, salt, best_score
- Table `stations` - contains station_id, name
- Table `lines` - contains line_id, name
- Table `line_stations` - contains line_id, station_id, position
- Table `events` - contains event_id, description, effect

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- marco, password1 (initilized with 31 points)
- alice, password2 (initilized with 24 points)
- giulio, password3 (initilized with 0 points)


## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
