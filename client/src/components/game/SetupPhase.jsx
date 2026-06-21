import { Alert, Button, Spinner } from 'react-bootstrap';

import './SetupPhase.css';

function SetupPhase({ onStart, starting, networkReady, networkError }) {
    return (
        <section className="setup-phase game-phase-shell game-theme-setup">
            <div className="setup-card game-phase-card">
                <header className="game-phase-header setup-header">
                    <div>
                        <span className="game-phase-kicker">
                            <i className="bi bi-map" />
                            Setup Phase
                        </span>

                        <h1 className="game-phase-title">
                            Study the full network
                        </h1>

                        <p className="game-phase-description">
                            Review the complete metro map before the timed planning phase starts.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        className="setup-start-button"
                        onClick={onStart}
                        disabled={starting || !networkReady}
                    >
                        {starting ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                Starting...
                            </>
                        ) : !networkReady && !networkError ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                Loading network...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-play-fill" />
                                Start Planning
                            </>
                        )}
                    </Button>
                </header>

                {networkError && (
                    <Alert variant="danger" className="mb-3">
                        <i className="bi bi-exclamation-triangle" />
                        <span className="ms-2">{networkError}</span>
                    </Alert>
                )}

                <div className="setup-content">
                    <div className="setup-map-panel map-panel">
                        <img
                            src="/maps/full-map.png"
                            alt="Network map"
                            className="img-fluid setup-map"
                        />
                    </div>

                    <aside className="setup-summary control-panel">
                        <h2>Before you start</h2>

                        <p>
                            This is the only phase where the complete metro lines are visible.
                            Use it to memorize connections and possible interchange stations.
                        </p>

                        <p>
                            During planning, you will only see stations and selectable segments,
                            without the full colored map.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default SetupPhase;