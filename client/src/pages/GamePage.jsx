import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { startGame } from '../api/gameAPI';

import SetupPhase from '../components/game/SetupPhase.jsx';
import PlanningPhase from '../components/game/PlanningPhase.jsx';
import ExecutionPhase from '../components/game/ExecutionPhase.jsx';
import ResultPhase from '../components/game/ResultPhase.jsx';

import './GamePage.css';

function GamePage({ stations, segments }) {
    const [phase, setPhase] = useState('setup');
    const [planningGame, setPlanningGame] = useState(null);
    const [executionResult, setExecutionResult] = useState(null);
    const [startingGame, setStartingGame] = useState(false);

    const navigate = useNavigate();

    async function startPlanning() {
        if (startingGame) {
            return;
        }

        setStartingGame(true);

        try {
            const gameData = await startGame();

            setPlanningGame(gameData);
            setExecutionResult(null);
            setPhase('planning');
        } catch (err) {
            console.error(err);
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