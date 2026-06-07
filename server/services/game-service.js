import Game from "../models/game.js";

export default function GameService(networkService, eventDao, userDao) {

    const activeGames = new Map();

    const INITIAL_COINS = 20;

    let eventsCache = [];
    let adjacencyCache = new Map();

    // Planning phase duration (90 seconds) plus a small tolerance for network delays.
    const PLANNING_TIME_LIMIT_MS = 90_000;
    const PLANNING_TIME_TOLERANCE_MS = 5_000;
    
    // Builds the graph representation of the underground network.
    const buildAdjacency = (segments) => {
        const adjacency = new Map();

        for (const segment of segments) {
            if (!adjacency.has(segment.fromStationId))
                adjacency.set(segment.fromStationId, []);

            if (!adjacency.has(segment.toStationId))
                adjacency.set(segment.toStationId, []);

            adjacency.get(segment.fromStationId).push(segment.toStationId);
            adjacency.get(segment.toStationId).push(segment.fromStationId);
        }

        return adjacency;
    };

    this.init = async () => {
        eventsCache = await eventDao.getAllEvents();;
        adjacencyCache = buildAdjacency(networkService.getSegments());
    };

    // Computes the minimum number of stops between two stations using BFS.
    const shortestDistance = (startStationId, destinationStationId, adjacency) => {
        const queue = [
            {
                stationId: startStationId,
                distance: 0
            }
        ];

        const visited = new Set([startStationId]);
        
        while (queue.length > 0) {
            const current = queue.shift();

            if (current.stationId === destinationStationId)
                return current.distance;

            const neighbours = adjacency.get(current.stationId) || [];

            for (const nextStationId of neighbours) {
                if (!visited.has(nextStationId)) {
                    visited.add(nextStationId);

                    queue.push({
                        stationId: nextStationId,
                        distance: current.distance + 1
                    });
                }
            }
        }

        return Infinity;
    };

    // Finds a segment by its identifier.
    const findSegmentById = (segments, segmentId) => {
        return segments.find(segment => segment.segmentId === segmentId);
    };

    // Checks whether the submitted route is valid and reaches the destination.
    const validateRoute = (game, submittedSegmentIds, segments) => {
        if (!Array.isArray(submittedSegmentIds) || submittedSegmentIds.length === 0) {
            return {
                valid: false,
                route: []
            };
        }

        const route = [];
        const usedSegmentIds = new Set();

        let currentStationId = game.startStation.stationId;

        for (const segmentId of submittedSegmentIds) {
            if (usedSegmentIds.has(segmentId)) {
                return {
                    valid: false,
                    route
                };
            }
            
            usedSegmentIds.add(segmentId);

            const segment = findSegmentById(segments, segmentId);

            if (!segment) {
                return {
                    valid: false,
                    route: []
                };
            }

            if (segment.fromStationId === currentStationId) {
                currentStationId = segment.toStationId;
            } else if (segment.toStationId === currentStationId) {
                currentStationId = segment.fromStationId;
            } else {
                return {
                    valid: false,
                    route
                };
            }

            route.push(segment);
        }

        if (currentStationId !== game.destinationStation.stationId) {
            return {
                valid: false,
                route
            };
        }

        return {
            valid: true,
            route
        };
    };

    // Creates a new game and assigns random start and destination stations.
    this.startGame = async (userId) => {
        if (activeGames.has(userId)) {            
            activeGames.delete(userId);
        }

        const stations = networkService.getStations();
        const adjacency = adjacencyCache;

        let startStation;
        let destinationStation;

        do {
            startStation = stations[Math.floor(Math.random() * stations.length)];
            destinationStation = stations[Math.floor(Math.random() * stations.length)];
        } while (
            startStation.stationId === destinationStation.stationId ||
            shortestDistance(
                startStation.stationId,
                destinationStation.stationId,
                adjacency
            ) < 3
        );

        const game = new Game(
            startStation,
            destinationStation,
            INITIAL_COINS
        );

        game.startedAt = Date.now();

        activeGames.set(userId, game);
        
        return {
            startStation: game.startStation,
            destinationStation: game.destinationStation,
            coins: game.coins
        };
    };

    // Validates the route, generates events, computes the final score and updates the ranking.
    this.executeGame = async (userId, submittedSegmentIds) => {
        const game = activeGames.get(userId);

        if (!game)
            return { error: "not-found" };

        // Reject routes submitted after the planning time limit.
        const elapsedTime = Date.now() - game.startedAt;

        if (elapsedTime > PLANNING_TIME_LIMIT_MS + PLANNING_TIME_TOLERANCE_MS) {
            const bestScore = await userDao.getUserBestScore(userId);
        
            const result = {
                valid: false,
                reason: "timeout",
                finalScore: 0,
                bestScore
            };
        
            activeGames.delete(userId);
            
            return result;
        }

        const segments = networkService.getSegments();
        const events = eventsCache;

        const validation = validateRoute(game, submittedSegmentIds, segments);

        if (!validation.valid) {
            const bestScore = await userDao.getUserBestScore(userId);

            const result = {
                valid: false,
                reason: "invalid-route",
                finalScore: 0,
                bestScore
            };

            activeGames.delete(userId);
            
            return result;
        }

        let coins = game.coins;
        const steps = [];

        for (const segment of validation.route) {
            const event = events[Math.floor(Math.random() * events.length)];

            coins += event.effect;

            steps.push({
                fromStationId: segment.fromStationId,
                toStationId: segment.toStationId,
                event: {
                    description: event.description,
                    effect: event.effect
                },
                coins
            });
        }

        const finalScore = Math.max(0, coins);
        
        const newBestScore = await userDao.updateBestScoreIfHigher(userId, finalScore);

        const bestScore = newBestScore ? finalScore : await userDao.getUserBestScore(userId);

        const result = {
            valid: true,
            steps,
            finalScore,
            bestScore
        };

        activeGames.delete(userId);

        return result;
    };

}