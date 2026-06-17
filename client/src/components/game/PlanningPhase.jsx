import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { HourglassSplit } from 'react-bootstrap-icons';

import { executeGame } from '../../api/gameAPI';

import './PlanningPhase.css';

const PLANNING_TIME_LIMIT_MS = 90_000;
const TIMER_REFRESH_MS = 250;

function PlanningPhase({ game, stations, segments, onExecuted }) {
    const [planningStartedAt] = useState(() => Date.now());
    const [selectedSegments, setSelectedSegments] = useState([]);

    const [timeLeft, setTimeLeft] = useState(90);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!game || submitted || !planningStartedAt) {
            return;
        }
        
        const timer = setInterval(() => {
            const elapsedMs = Date.now() - planningStartedAt;
            const remainingMs = Math.max(0, PLANNING_TIME_LIMIT_MS - elapsedMs);
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            setTimeLeft(remainingSeconds);

            if (remainingMs === 0) {
                clearInterval(timer);
                submitJourney();
            }
        }, TIMER_REFRESH_MS);

        return () => clearInterval(timer);
    }, [game, planningStartedAt, submitted, selectedSegments]);

    function getStationName(stationId) {
        return stations.find(
            station => station.stationId === stationId
        )?.name;
    }

    function getSegmentLabel(segment) {
        return `${getStationName(segment.fromStationId)} ↔ ${getStationName(segment.toStationId)}`;
    }

    function addSegment(segmentId) {
        if (submitted) {
            return;
        }

        setSelectedSegments(oldSegments => [
            ...oldSegments,
            segmentId
        ]);
    }

    function removeSegment(indexToRemove) {
        if (submitted) {
            return;
        }

        setSelectedSegments(oldSegments =>
            oldSegments.filter(
                (_, index) => index !== indexToRemove
            )
        );
    }

    function clearJourney() {
        setSelectedSegments([]);
    }

    async function submitJourney() {
        if (submitted) {
            return;
        }

        setSubmitted(true);

        try {
            const result = await executeGame(selectedSegments);
            onExecuted(result);
        } catch (err) {
            console.error(err);
        }
    }

    if (!game) {
        return (
            <section className="planning-phase game-phase-shell game-theme-planning">
                <div className="planning-card game-phase-card planning-loading">
                    <Spinner animation="border" />
                    <p>Loading planning phase...</p>
                </div>
            </section>
        );
    }

    const timerText = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

    const availableSegments = segments.filter(
        segment => !selectedSegments.includes(segment.segmentId)
    );

    return (
        <section className="planning-phase game-phase-shell game-theme-planning">
            <div className="planning-card game-phase-card">
                <div className="planning-info">
                    <div className="planning-goal-inline">
                        <span>Goal</span>
                        <strong>{game.startStation.name}</strong>
                        <i className="bi bi-arrow-right" />
                        <strong>{game.destinationStation.name}</strong>
                    </div>

                    <div className="planning-phase-inline game-phase-kicker">
                        <i className="bi bi-signpost-split" />
                        <span>Planning Phase</span>
                    </div>

                    <div className="planning-timer-inline">
                        <HourglassSplit />
                        <strong className="timer-display">{timerText}</strong>
                    </div>
                </div>

                <Row className="planning-layout g-3 align-items-stretch">
                    <Col md={5} className="planning-col">
                        <section className="planning-map-panel map-panel">
                            <div className="planning-panel-title">
                                <i className="bi bi-map" />
                                <h2>Stations map</h2>
                            </div>

                            <div className="planning-map-body">
                                <img
                                    src="/maps/stations-only.png"
                                    alt="Stations map"
                                    className="img-fluid planning-map"
                                />
                            </div>
                        </section>
                    </Col>

                    <Col md={7} className="planning-col">
                        <Row className="g-3 h-100">
                            <Col md={6} className="planning-col">
                                <section className="planning-panel control-panel">
                                    <div className="planning-panel-title">
                                        <i className="bi bi-list-check" />
                                        <h2>Selected journey</h2>
                                        <span>{selectedSegments.length}</span>
                                    </div>

                                    <div className="journey-list">
                                        {selectedSegments.length === 0 ? (
                                            <div className="planning-empty-state">
                                                <i className="bi bi-cursor" />
                                                <p>No segments selected yet.</p>
                                            </div>
                                        ) : (
                                            selectedSegments.map((segmentId, index) => {
                                                const segment = segments.find(
                                                    s => s.segmentId === segmentId
                                                );

                                                return (
                                                    <Button
                                                        key={`${segmentId}-${index}`}
                                                        onClick={() => removeSegment(index)}
                                                        disabled={submitted}
                                                        variant="success"
                                                        size="sm"
                                                        className="journey-step-button"
                                                    >
                                                        <span>{index + 1}</span>
                                                        <strong>{getSegmentLabel(segment)}</strong>
                                                        <i className="bi bi-x-lg" />
                                                    </Button>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="planning-actions">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={clearJourney}
                                            disabled={
                                                selectedSegments.length === 0 ||
                                                submitted
                                            }
                                        >
                                            Clear
                                        </Button>

                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={submitJourney}
                                            disabled={submitted}
                                        >
                                            <i className="bi bi-check2-circle" />
                                            Submit
                                        </Button>
                                    </div>
                                </section>
                            </Col>

                            <Col md={6} className="planning-col">
                                <section className="planning-panel control-panel planning-segments-panel">
                                    <div className="planning-panel-title">
                                        <i className="bi bi-bezier2" />
                                        <h2>Available segments</h2>
                                        <span>{availableSegments.length}</span>
                                    </div>

                                    <div className="segments-list">
                                        {availableSegments.map(segment => (
                                            <Button
                                                key={segment.segmentId}
                                                onClick={() => addSegment(segment.segmentId)}
                                                disabled={submitted}
                                                variant="outline-success"
                                                size="sm"
                                                className="segment-option-button"
                                            >
                                                {getSegmentLabel(segment)}
                                            </Button>
                                        ))}
                                    </div>
                                </section>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </section>
    );
}

export default PlanningPhase;