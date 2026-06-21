import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { startGame } from '../api/gameAPI';

import SetupPhase from '../components/game/SetupPhase.jsx';
import PlanningPhase from '../components/game/PlanningPhase.jsx';
import ExecutionPhase from '../components/game/ExecutionPhase.jsx';
import ResultPhase from '../components/game/ResultPhase.jsx';

import './GamePage.css';

function GamePage({ stations, segments, networkError }) {
    const [phase, setPhase] = useState('setup');
    const [planningGame, setPlanningGame] = useState(null);
    const [executionResult, setExecutionResult] = useState(null);
    const [startingGame, setStartingGame] = useState(false);
    const [startError, setStartError] = useState('');

    const navigate = useNavigate();
    const networkReady = !networkError && stations.length > 0 && segments.length > 0;

    async function startPlanning() {
        if (startingGame || !networkReady) {
            return;
        }

        setStartingGame(true);
        setStartError('');

        try {
            const gameData = await startGame();

            setPlanningGame(gameData);
            setExecutionResult(null);
            setPhase('planning');
        } catch (err) {
            console.error(err);
            setStartError('Unable to start a new game. Please try again.');
        } finally {
            setStartingGame(false);
        }
    }

    return (
        <div className={`game-page game-page-${phase}`}>
            {phase === 'setup' && (
                <SetupPhase
                    onStart={startPlanning}
                    starting={startingGame}
                    networkReady={networkReady}
                    networkError={networkError}
                    startError={startError}
                />
            )}

            {phase === 'planning' && planningGame && (
                <PlanningPhase
                    key={`${planningGame.startStation.stationId}-${planningGame.destinationStation.stationId}`}
                    game={planningGame}
                    stations={stations}
                    segments={segments}
                    onExecuted={(result) => {
                        setExecutionResult(result);
                        setPhase('execution');
                    }}
                />
            )}

            {phase === 'execution' && (
                <ExecutionPhase
                    result={executionResult}
                    stations={stations}
                    onFinished={() => setPhase('result')}
                />
            )}

            {phase === 'result' && (
                <ResultPhase
                    result={executionResult}
                    onPlayAgain={() => {
                        setPlanningGame(null);
                        setExecutionResult(null);
                        setPhase('setup');
                    }}
                    onViewRanking={() => navigate('/ranking')}
                />
            )}
        </div>
    );
}

export default GamePage;