import { Button } from 'react-bootstrap';
import {
    ArrowRepeat,
    BarChartFill,
    Coin,
    TrophyFill
} from 'react-bootstrap-icons';

import './ResultPhase.css';

function ResultPhase({ result, onPlayAgain, onViewRanking }) {
    if (!result) {
        return (
            <div className="result-phase game-theme-result game-state-page">
                <div className="game-state-card page-card">
                    <p>No result available.</p>
                </div>
            </div>
        );
    }

    const scoreItems = [
        {
            label: 'Final score',
            value: result.finalScore,
            icon: <Coin />
        },
        {
            label: 'Best score',
            value: result.bestScore,
            icon: <TrophyFill />
        }
    ];

    return (
        <section className="result-phase game-phase-shell game-theme-result">
            <div className="result-card game-phase-card">
                <div className="result-hero">
                    <span className="game-phase-kicker">
                        <i className="bi bi-trophy" />
                        Result Phase
                    </span>

                    <h1 className="game-phase-title">
                        Game over
                    </h1>

                    <p className="game-phase-description">
                        Your route has ended. Check the final score and decide your next move.
                    </p>
                </div>

                <div className="result-score-grid">
                    {scoreItems.map(item => (
                        <article className="result-score-card" key={item.label}>
                            <div className="result-score-icon">
                                {item.icon}
                            </div>

                            <strong>{item.value}</strong>
                            <span>{item.label}</span>
                        </article>
                    ))}
                </div>

                <div className="result-actions">
                    <Button
                        type="button"
                        variant="primary"
                        className="result-action primary"
                        onClick={onPlayAgain}
                    >
                        <ArrowRepeat />
                        Play Again
                    </Button>

                    <Button
                        type="button"
                        variant="outline-secondary"
                        className="result-action secondary"
                        onClick={onViewRanking}
                    >
                        <BarChartFill />
                        View Ranking
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default ResultPhase;
