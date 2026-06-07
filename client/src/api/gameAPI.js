import { fetchJson } from './API';

async function startGame() {
    return await fetchJson('/api/games', {
        method: 'POST'
    });
}

async function executeGame(segments) {
    return await fetchJson('/api/games/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ segments })
    });
}

export {
    startGame,
    executeGame
};