import { useState } from 'react';
import { Button } from 'react-bootstrap';

import './ExecutionPhase.css';

function ExecutionPhase({ result, stations, onFinished }) {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    
    if (!result) {
        return (
            <div className="execution-phase game-theme-execution game-state-page">
                <div className="game-state-card page-card">
                    <p>No execution result available.</p>
                </div>
            </div>
        );
    }

    const isTimeout = result.reason === 'timeout';

    const failureTitle = isTimeout
        ? 'Time expired'
        : 'Route failed';

    const failureMessage = isTimeout
        ? 'Request rejected. The journey was received by the server after the allowed time limit.'
        : 'Invalid or incomplete route. The journey cannot be executed. You lose all starting coins.';
    
    if (!result.valid) {
        return (
            <section className="execution-phase game-phase-shell game-theme-execution">
                <div className="execution-invalid-card game-phase-card">
                    <div className="execution-invalid-icon">
                        <i className="bi bi-exclamation-triangle" />
                    </div>

                    <span className="game-phase-kicker">
                        <i className="bi bi-train-front" />
                        Execution Phase
                    </span>

                    <h1 className="game-phase-title">
                        {failureTitle}
                    </h1>
                            
                    <p className="game-phase-description execution-invalid-message">
                        {failureMessage}
                    </p>

                    <div className="execution-invalid-score">
                        <span>Final score</span>
                        <strong>{result.finalScore ?? 0}</strong>
                    </div>

                    <Button
                        variant="primary"
                        className="execution-primary-action"
                        onClick={onFinished}
                    >
                        <i className="bi bi-flag-fill" />
                        Show Result
                    </Button>
                </div>
            </section>
        );
    }

    const getStationName = (stationId) => {
        const station = stations.find(s => s.stationId === stationId);
        return station ? station.name : stationId;
    };

    const currentStep = result.steps[currentStepIndex];

    const isFinalStep =
        currentStepIndex === result.steps.length - 1;

    const revealedSteps =
        result.steps.slice(0, currentStepIndex + 1);

    const visibleCoins = currentStep.coins;

    return (
        <section className="execution-phase game-phase-shell game-theme-execution">
            <div className="execution-card game-phase-card">
                <header className="game-phase-header execution-header">
                    <div>
                        <span className="game-phase-kicker">
                            <i className="bi bi-train-front" />
                            Execution Phase
                        </span>

                        <h1 className="game-phase-title">
                            Travel the selected route
                        </h1>

                        <p className="game-phase-description">
                            Reveal one segment at a time and watch how events affect your coins.
                        </p>
                    </div>

                    <div className="execution-score-card">
                        <span>Coins</span>
                        <strong>{visibleCoins}</strong>
                    </div>
                </header>

                <div className="execution-layout">
                    <section className="execution-animation-panel">
                        <div className="execution-step-meta">
                            <span>
                                Step {currentStepIndex + 1} of {result.steps.length}
                            </span>
                        </div>

                        <h2>Current segment</h2>

                        <div className="execution-segment">
                            <span>{getStationName(currentStep.fromStationId)}</span>

                            <div className="execution-track">
                                <i className="bi bi-train-front" />
                            </div>

                            <span>{getStationName(currentStep.toStationId)}</span>
                        </div>

                        <div className="execution-event">
                            <span>Unexpected event</span>
                            <h3>{currentStep.event.description}</h3>

                            <p
                                className={
                                    currentStep.event.effect >= 0
                                        ? 'positive'
                                        : 'negative'
                                }
                            >
                                {currentStep.event.effect >= 0 ? '+' : ''}
                                {currentStep.event.effect} coins
                            </p>
                        </div>
                    </section>

                    <aside className="execution-log-panel">
                        <div className="execution-log-header">
                            <div>
                                <span>Progress log</span>
                                <h2>Events revealed</h2>
                            </div>

                            <strong>{revealedSteps.length}/{result.steps.length}</strong>
                        </div>

                        <div className="execution-log">
                            {revealedSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className={
                                        `execution-log-item ${index === currentStepIndex ? 'current' : ''}`
                                    }
                                >
                                    <span>{index + 1}</span>

                                    <div>
                                        <strong>{step.event.description}</strong>
                                        <small>
                                            {getStationName(step.fromStationId)} → {getStationName(step.toStationId)}
                                        </small>
                                    </div>

                                    <em
                                        className={
                                            step.event.effect >= 0
                                                ? 'positive'
                                                : 'negative'
                                        }
                                    >
                                        {step.event.effect >= 0 ? '+' : ''}
                                        {step.event.effect}
                                    </em>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <div className="execution-controls">
                    <Button
                        variant="primary"
                        className="execution-primary-action"
                        onClick={() => {
                            if (isFinalStep) {
                                onFinished();
                            } else {
                                setCurrentStepIndex(i => i + 1);
                            }
                        }}
                    >
                        {isFinalStep ? (
                            <>
                                <i className="bi bi-flag-fill" />
                                Show Result
                            </>
                        ) : (
                            <>
                                Next Step
                                <i className="bi bi-arrow-right" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default ExecutionPhase;