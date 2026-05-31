// Modules imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

// DAO imports
import UserDao from './dao/user-dao.js';
import NetworkDao from './dao/network-dao.js';
import EventDao from './dao/event-dao.js';

// Services imports
import NetworkService from './services/network-service.js'
import GameService from './services/game-service.js';

const userDao = new UserDao();
const networkDao = new NetworkDao();
const eventDao = new EventDao();
const networkService = new NetworkService(networkDao);
const gameService = new GameService(networkService, eventDao, userDao);

// Passport configuration
passport.use(new LocalStrategy(
  async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password);

    if (!user)
      return callback(null, false, {
        message: 'Incorrect username or password'
      });

    return callback(null, user);
  }
));

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

// Init express
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// Session configuration
app.use(session({
  secret: 'last-race-secret-session-key',
  resave: false,
  saveUninitialized: false,
}));

// Passport session middleware
app.use(passport.authenticate('session'));

// Defining authentication verification middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

// --- Authentication APIs ---

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user)
            return res.status(401).json({ error: info });

        req.login(user, (err) => {
            if (err)
                return next(err);

            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(req.user);
    }

    return res.status(401).json({
        error: 'Not authenticated'
    });
});

// DELETE /api/sessions/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

// --- Network APIs ---

// GET /api/network/full
// Returns the complete underground network used during the Setup phase.
app.get('/api/network/full', isLoggedIn, async (req, res) => {
    try {
        const network = await networkService.getFullNetwork();
        return res.status(200).json(network);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// GET /api/network/stations
// Returns all stations. Used during the Planning phase.
app.get('/api/network/stations', isLoggedIn, async (req, res) => {
    try {
        const stations = await networkService.getStations();
        return res.status(200).json(stations);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// GET /api/network/segments
// Returns all direct segments between consecutive stations.
app.get('/api/network/segments', isLoggedIn, async (req, res) => {
    try {
        const segments = await networkService.getSegments();
        return res.status(200).json(segments);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// --- Game APIs ---

// POST /api/games
// Starts a new game.
app.post('/api/games', isLoggedIn, async (req, res) => {
    try {
        const game = await gameService.startGame(req.user.userId);
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /api/games/execute
// Submits the selected route, validates it, extracts events, computes final score.
app.post('/api/games/execute', isLoggedIn, async (req, res) => {
    const { segments } = req.body;

    if (!Array.isArray(segments) || !segments.every(Number.isInteger)) {
        return res.status(400).json({
            error: 'Invalid segments'
        });
    }

    try {
        const result = await gameService.executeGame(
            req.user.userId,
            segments
        );

        if (result.error === 'not-found') {
            return res.status(404).json({
                error: 'Active game not found'
            });
        }

        return res.json(result);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// --- Ranking APIs ---

// GET /api/ranking
// Returns the ranking ordered by best score.
app.get('/api/ranking', async (req, res) => {
    try {
        const ranking = await userDao.getRanking();
        return res.status(200).json(ranking);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// Activate the server
const PORT = 3001;

const startServer = async () => {
    try {
        await networkService.init();
        await gameService.init();

        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('Failed to initialize services:', err);
        process.exit(1);
    }
};

startServer();
